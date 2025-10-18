from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

from camera_service import get_available_cameras, test_camera_connection
from measurement_service import MeasurementService
from s3_service import S3Service

# Carrega variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite requisições do React

# Inicializa serviço S3
s3_service = S3Service()

@app.route('/api/status', methods=['GET'])
def status():
    """Health check do servidor."""
    return jsonify({
        'status': 'online',
        'message': 'Backend MacroVision está funcionando',
        's3_configured': bool(os.getenv('AWS_BUCKET_NAME'))
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
    """Executa análise dimensional e salva imagens no S3."""
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
        
        # Executa análise com upload para S3
        result = service.perform_analysis(save_to_s3=True)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro durante análise: {str(e)}',
            'measurements': None,
            'images': []
        }), 500

@app.route('/api/images', methods=['GET'])
def list_images():
    """Lista todas as imagens armazenadas no S3."""
    try:
        images = s3_service.list_images()
        return jsonify({
            'success': True,
            'images': images,
            'count': len(images)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar imagens: {str(e)}',
            'images': []
        }), 500

@app.route('/api/images/<path:s3_key>', methods=['DELETE'])
def delete_image(s3_key):
    """Remove uma imagem específica do S3."""
    try:
        result = s3_service.delete_image(s3_key)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao remover imagem: {str(e)}'
        }), 500

@app.route('/api/images/clear', methods=['DELETE'])
def clear_images():
    """Remove todas as imagens do S3 (usar com cuidado)."""
    try:
        images = s3_service.list_images()
        deleted_count = 0
        
        for s3_key in images:
            result = s3_service.delete_image(s3_key)
            if result['success']:
                deleted_count += 1
        
        return jsonify({
            'success': True,
            'message': f'{deleted_count} imagens removidas'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao limpar imagens: {str(e)}'
        }), 500

@app.route('/api/images/cleanup', methods=['POST'])
def cleanup_old_images():
    """Remove imagens antigas do S3."""
    try:
        data = request.get_json()
        days = data.get('days', 30)
        
        result = s3_service.clear_old_images(days=days)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao limpar imagens antigas: {str(e)}'
        }), 500

@app.route('/api/images/presigned/<path:s3_key>', methods=['GET'])
def get_presigned_url(s3_key):
    """Gera URL assinada temporária para uma imagem."""
    try:
        url = s3_service.generate_presigned_url(s3_key)
        if url:
            return jsonify({
                'success': True,
                'url': url
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Erro ao gerar URL assinada'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("=" * 50)
    print("Backend MacroVision iniciado!")
    print("Servidor rodando em: http://localhost:5000")
    print(f"S3 Bucket: {os.getenv('AWS_BUCKET_NAME', 'NÃO CONFIGURADO')}")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')
    