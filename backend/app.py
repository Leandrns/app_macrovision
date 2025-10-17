from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

from camera_service import get_available_cameras, test_camera_connection
from measurement_service import MeasurementService

app = Flask(__name__)
CORS(app)  # Permite requisições do React

# Configurações
STATIC_FOLDER = 'static/images'
os.makedirs(STATIC_FOLDER, exist_ok=True)

@app.route('/api/status', methods=['GET'])
def status():
    """Health check do servidor."""
    return jsonify({
        'status': 'online',
        'message': 'Backend MacroVision está funcionando'
    })

@app.route('/api/cameras', methods=['GET'])
def list_cameras():
    """Lista todas as câmeras disponíveis no sistema."""
    try:
        cameras = get_available_cameras()
        return jsonify({
            'success': True,
            'cameras': cameras,
            'count': len(cameras)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar câmeras: {str(e)}',
            'cameras': []
        }), 500

@app.route('/api/cameras/<int:camera_id>/test', methods=['GET'])
def test_camera(camera_id):
    """Testa conexão com uma câmera específica."""
    try:
        result = test_camera_connection(camera_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao testar câmera: {str(e)}'
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Executa análise dimensional."""
    try:
        data = request.get_json()
        camera_id = data.get('camera_id')
        
        if camera_id is None:
            return jsonify({
                'success': False,
                'message': 'ID da câmera não fornecido'
            }), 400
        
        # Parâmetros opcionais
        reference_width = data.get('reference_width', 10.0)
        num_captures = data.get('num_captures', 8)
        
        # Cria serviço de medição e executa análise
        service = MeasurementService(
            camera_id=camera_id,
            reference_width_cm=reference_width,
            num_captures=num_captures
        )
        
        result = service.perform_analysis(save_dir=STATIC_FOLDER)
        
        # Adiciona URLs completas para as imagens
        if result['success'] and result['images']:
            result['image_urls'] = [
                f'/api/images/{img}' for img in result['images']
            ]
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro durante análise: {str(e)}',
            'measurements': None,
            'images': []
        }), 500

@app.route('/api/images/<filename>', methods=['GET'])
def serve_image(filename):
    """Serve imagens capturadas."""
    return send_from_directory(STATIC_FOLDER, filename)

@app.route('/api/images', methods=['DELETE'])
def clear_images():
    """Remove todas as imagens salvas (limpeza)."""
    try:
        files = os.listdir(STATIC_FOLDER)
        for file in files:
            if file.endswith(('.jpg', '.png', '.jpeg')):
                os.remove(os.path.join(STATIC_FOLDER, file))
        
        return jsonify({
            'success': True,
            'message': f'{len(files)} imagens removidas'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao limpar imagens: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("Backend MacroVision iniciado!")
    print("Servidor rodando em: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')