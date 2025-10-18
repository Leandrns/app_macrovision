import cv2
import numpy as np
import os
from datetime import datetime

class MeasurementService:
    def __init__(self, camera_id, reference_width_cm=10.0, num_captures=8):
        """
        Inicializa o serviço de medição.
        
        Args:
            camera_id: Índice da câmera a ser utilizada
            reference_width_cm: Largura real do objeto de referência em cm
            num_captures: Número de capturas para calcular média
        """
        self.camera_id = camera_id
        self.reference_width_cm = reference_width_cm
        self.num_captures = num_captures
        self.measurements = []
        
    def perform_analysis(self, save_dir='static/images'):
        """
        Executa a análise dimensional completa.
        
        Args:
            save_dir: Diretório onde salvar as imagens capturadas
            
        Returns:
            dict com resultados da análise
        """
        # Cria diretório se não existir
        os.makedirs(save_dir, exist_ok=True)
        
        # Abre câmera
        cap = cv2.VideoCapture(self.camera_id)
        if not cap.isOpened():
            return {
                'success': False,
                'message': 'Não foi possível acessar a câmera',
                'measurements': None,
                'images': []
            }
        
        measurements = []
        saved_images = []
        
        try:
            for i in range(self.num_captures):
                ret, img = cap.read()
                if not ret:
                    continue
                
                # Processamento da imagem
                result = self._process_frame(img)
                
                if result['success']:
                    measurements.append(result['dimensions'])
                    
                    # Salva imagem com anotações (primeira e última captura)
                    if i == 0 or i == self.num_captures - 1:
                        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                        filename = f'analysis_{timestamp}_{i}.jpg'
                        filepath = os.path.join(save_dir, filename)
                        cv2.imwrite(filepath, result['annotated_image'])
                        saved_images.append(filename)
        
        finally:
            cap.release()
        
        # Calcula médias
        if measurements:
            avg_width = np.mean([m['width'] for m in measurements])
            avg_length = np.mean([m['length'] for m in measurements])
            
            return {
                'success': True,
                'message': f'Análise concluída com {len(measurements)} medições válidas',
                'measurements': {
                    'width': round(float(avg_width), 2),
                    'length': round(float(avg_length), 2),
                    'height': round(float(avg_length), 2)
                },
                'images': saved_images,
                'num_valid_captures': len(measurements)
            }
        else:
            return {
                'success': False,
                'message': 'Nenhuma medição válida foi obtida',
                'measurements': None,
                'images': []
            }
    
    def _process_frame(self, img):
        """
        Processa um frame individual e extrai medidas.
        
        Args:
            img: Imagem capturada
            
        Returns:
            dict com sucesso, dimensões e imagem anotada
        """
        # Pré-processamento
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (7, 7), 0)
        edges = cv2.Canny(blur, 50, 150)
        
        # Encontrar contornos com hierarquia
        contornos, hierarquia = cv2.findContours(
            edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
        )
        
        if not contornos or hierarquia is None:
            return {'success': False}
        
        hierarquia = hierarquia[0]
        
        # Selecionar contorno de referência (maior contorno)
        contornos_area = [
            (cv2.contourArea(c), i, c) 
            for i, c in enumerate(contornos) 
            if cv2.contourArea(c) > 100
        ]
        
        if not contornos_area:
            return {'success': False}
        
        contornos_area.sort(reverse=True, key=lambda x: x[0])
        area_ref, idx_ref, objeto_referencia = contornos_area[0]
        
        # Bounding box do objeto de referência
        x_ref, y_ref, w_ref, h_ref = cv2.boundingRect(objeto_referencia)
        pixels_por_cm = w_ref / self.reference_width_cm
        
        objetos_medidos = []
        
        # Usar hierarquia (filhos do objeto de referência)
        filho_idx = hierarquia[idx_ref][2]
        while filho_idx != -1:
            if filho_idx != idx_ref:
                c = contornos[filho_idx]
                if cv2.contourArea(c) > 100:
                    x, y, w, h = cv2.boundingRect(c)
                    if w < 0.95 * w_ref and h < 0.95 * h_ref:
                        objetos_medidos.append(c)
            filho_idx = hierarquia[filho_idx][0]
        
        # Se não encontrou filhos, usar bounding box
        if not objetos_medidos:
            for area, idx, c in contornos_area[1:]:
                if idx == idx_ref:
                    continue
                x, y, w, h = cv2.boundingRect(c)
                if (x >= x_ref and y >= y_ref and 
                    x + w <= x_ref + w_ref and y + h <= y_ref + h_ref):
                    if w < 0.95 * w_ref and h < 0.95 * h_ref:
                        objetos_medidos.append(c)
        
        if not objetos_medidos:
            return {'success': False}
        
        # Criar imagem anotada
        img_resultado = img.copy()
        cv2.rectangle(
            img_resultado, 
            (x_ref, y_ref), 
            (x_ref + w_ref, y_ref + h_ref), 
            (0, 255, 0), 2
        )
        cv2.putText(
            img_resultado, 
            "Referencia", 
            (x_ref, y_ref - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2
        )
        
        # Medir primeiro objeto
        obj = objetos_medidos[0]
        x_obj, y_obj, w_obj, h_obj = cv2.boundingRect(obj)
        largura_objeto_cm = w_obj / pixels_por_cm
        comprimento_objeto_cm = h_obj / pixels_por_cm
        
        cv2.rectangle(
            img_resultado,
            (x_obj, y_obj),
            (x_obj + w_obj, y_obj + h_obj),
            (255, 0, 0), 2
        )
        cv2.putText(
            img_resultado,
            f"{largura_objeto_cm:.2f}x{comprimento_objeto_cm:.2f} cm",
            (x_obj, y_obj - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2
        )
        
        return {
            'success': True,
            'dimensions': {
                'width': largura_objeto_cm,
                'length': comprimento_objeto_cm
            },
            'annotated_image': img_resultado
        }