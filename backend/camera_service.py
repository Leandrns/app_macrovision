import cv2

def get_available_cameras(max_test=10):
    """
    Detecta todas as câmeras disponíveis no sistema.
    
    Args:
        max_test: Número máximo de índices para testar
        
    Returns:
        Lista de dicionários com informações das câmeras disponíveis
    """
    available_cameras = []
    
    for i in range(max_test):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            # Tenta ler um frame para confirmar que funciona
            ret, _ = cap.read()
            if ret:
                # Obtém informações da câmera
                width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                
                available_cameras.append({
                    'id': i,
                    'name': f'Camera {i}',
                    'resolution': f'{width}x{height}'
                })
            cap.release()
    
    return available_cameras

def test_camera_connection(camera_id):
    """
    Testa se uma câmera específica está acessível.
    
    Args:
        camera_id: Índice da câmera
        
    Returns:
        dict com status de sucesso e mensagem
    """
    cap = cv2.VideoCapture(camera_id)
    
    if not cap.isOpened():
        return {
            'success': False,
            'message': f'Não foi possível acessar a câmera {camera_id}'
        }
    
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        return {
            'success': False,
            'message': f'Câmera {camera_id} está acessível mas não consegue capturar frames'
        }
    
    return {
        'success': True,
        'message': f'Câmera {camera_id} conectada e funcionando corretamente'
    }