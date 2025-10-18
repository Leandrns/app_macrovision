import boto3
import os
from datetime import datetime
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

class S3Service:
    def __init__(self):
        """Inicializa o cliente S3 com as credenciais do ambiente."""
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.bucket_name = os.getenv('AWS_BUCKET_NAME')
        
    def upload_image(self, file_path, object_name=None):
        """
        Faz upload de uma imagem para o S3.
        
        Args:
            file_path: Caminho local do arquivo
            object_name: Nome do objeto no S3 (opcional)
            
        Returns:
            dict com sucesso e URL da imagem
        """
        if object_name is None:
            object_name = os.path.basename(file_path)
        
        # Adiciona prefixo com data para organização
        timestamp = datetime.now().strftime('%Y/%m/%d')
        s3_key = f'macrovision/{timestamp}/{object_name}'
        
        try:
            # Upload do arquivo
            self.s3_client.upload_file(
                file_path,
                self.bucket_name,
                s3_key,
                ExtraArgs={'ContentType': 'image/jpeg'}
            )
            
            # Gera URL da imagem
            url = f"https://{self.bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{s3_key}"
            
            return {
                'success': True,
                'url': url,
                's3_key': s3_key,
                'message': 'Upload realizado com sucesso'
            }
            
        except ClientError as e:
            return {
                'success': False,
                'message': f'Erro ao fazer upload: {str(e)}'
            }
        except FileNotFoundError:
            return {
                'success': False,
                'message': f'Arquivo não encontrado: {file_path}'
            }
    
    def upload_image_data(self, image_data, filename):
        """
        Faz upload de dados de imagem diretamente (sem salvar localmente).
        
        Args:
            image_data: Dados da imagem em bytes
            filename: Nome do arquivo
            
        Returns:
            dict com sucesso e URL da imagem
        """
        timestamp = datetime.now().strftime('%Y/%m/%d')
        s3_key = f'macrovision/{timestamp}/{filename}'
        
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=image_data,
                ContentType='image/jpeg'
            )
            
            url = f"https://{self.bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{s3_key}"
            
            return {
                'success': True,
                'url': url,
                's3_key': s3_key,
                'message': 'Upload realizado com sucesso'
            }
            
        except ClientError as e:
            return {
                'success': False,
                'message': f'Erro ao fazer upload: {str(e)}'
            }
    
    def delete_image(self, s3_key):
        """
        Remove uma imagem do S3.
        
        Args:
            s3_key: Chave do objeto no S3
            
        Returns:
            dict com status da operação
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )
            
            return {
                'success': True,
                'message': 'Imagem removida com sucesso'
            }
            
        except ClientError as e:
            return {
                'success': False,
                'message': f'Erro ao remover imagem: {str(e)}'
            }
    
    def list_images(self, prefix='macrovision/'):
        """
        Lista todas as imagens em um prefixo específico.
        
        Args:
            prefix: Prefixo para filtrar objetos
            
        Returns:
            Lista de chaves de objetos
        """
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            if 'Contents' not in response:
                return []
            
            return [obj['Key'] for obj in response['Contents']]
            
        except ClientError as e:
            print(f'Erro ao listar imagens: {str(e)}')
            return []
    
    def generate_presigned_url(self, s3_key, expiration=3600):
        """
        Gera uma URL assinada temporária para acesso à imagem.
        
        Args:
            s3_key: Chave do objeto no S3
            expiration: Tempo de expiração em segundos (padrão: 1 hora)
            
        Returns:
            URL assinada ou None em caso de erro
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=expiration
            )
            return url
            
        except ClientError as e:
            print(f'Erro ao gerar URL assinada: {str(e)}')
            return None
    
    def clear_old_images(self, days=30):
        """
        Remove imagens antigas do bucket.
        
        Args:
            days: Número de dias para considerar imagem como antiga
            
        Returns:
            dict com status da operação
        """
        try:
            images = self.list_images()
            deleted_count = 0
            
            cutoff_date = datetime.now().timestamp() - (days * 86400)
            
            for s3_key in images:
                response = self.s3_client.head_object(
                    Bucket=self.bucket_name,
                    Key=s3_key
                )
                
                last_modified = response['LastModified'].timestamp()
                
                if last_modified < cutoff_date:
                    self.delete_image(s3_key)
                    deleted_count += 1
            
            return {
                'success': True,
                'message': f'{deleted_count} imagens antigas removidas'
            }
            
        except ClientError as e:
            return {
                'success': False,
                'message': f'Erro ao limpar imagens antigas: {str(e)}'
            }
        