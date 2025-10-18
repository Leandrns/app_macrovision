// Configuração da URL base da API
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Verifica se o backend está online
 */
export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar status do servidor:', error);
    return { status: 'offline', message: 'Servidor não disponível' };
  }
};

/**
 * Lista todas as câmeras disponíveis
 */
export const getCameras = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar câmeras:', error);
    return { success: false, cameras: [], message: error.message };
  }
};

/**
 * Testa conexão com uma câmera específica
 */
export const testCamera = async (cameraId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/test`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao testar câmera:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Executa análise dimensional
 * As imagens agora são salvas no S3
 */
export const performAnalysis = async (cameraId, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        camera_id: cameraId,
        reference_width: options.referenceWidth || 10.0,
        num_captures: options.numCaptures || 8,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao executar análise:', error);
    return { 
      success: false, 
      message: error.message,
      measurements: null,
      images: []
    };
  }
};

/**
 * Lista todas as imagens armazenadas no S3
 */
export const listImages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/images`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    return { success: false, images: [], message: error.message };
  }
};

/**
 * Remove uma imagem específica do S3
 */
export const deleteImage = async (s3Key) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${s3Key}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Limpa todas as imagens do S3
 */
export const clearImages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/clear`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao limpar imagens:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Remove imagens antigas do S3
 */
export const cleanupOldImages = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ days }),
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao limpar imagens antigas:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Gera URL assinada temporária para uma imagem
 */
export const getPresignedUrl = async (s3Key) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/presigned/${s3Key}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Retorna URL direta de uma imagem no S3
 * Nota: As imagens agora vêm com URL completa do S3
 */
export const getImageUrl = (imageData) => {
  // Se imageData é um objeto com URL, retorna a URL
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url;
  }
  // Se é uma string (URL), retorna diretamente
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  // Fallback
  return null;
};