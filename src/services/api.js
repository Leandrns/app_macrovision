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
 * Limpa todas as imagens salvas no servidor
 */
export const clearImages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/images`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao limpar imagens:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Retorna URL completa de uma imagem
 */
export const getImageUrl = (filename) => {
  return `${API_BASE_URL}/images/${filename}`;
};
