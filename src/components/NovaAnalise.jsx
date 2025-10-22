import React, { useState, useEffect } from 'react';
import '../styles/NovaAnalise.css';
import { getCameras, testCamera, performAnalysis, getImageUrl } from '../services/api';

function NovaAnalise() {
  // Estados
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraStatus, setCameraStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Dimensões (preenchidas após análise dimensional)
  const [dimensions, setDimensions] = useState({
    width: '',
    length: '',
    height: ''
  });

  // Busca câmeras disponíveis ao montar o componente
  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    const result = await getCameras();
    if (result.success) {
      setCameras(result.cameras);
      if (result.cameras.length > 0) {
        // Seleciona primeira câmera por padrão
        setSelectedCamera(result.cameras[0].id);
      }
    } else {
      setError('Não foi possível carregar as câmeras');
    }
  };

  const handleCameraChange = async (e) => {
    const cameraId = parseInt(e.target.value);
    setSelectedCamera(cameraId);
    setCameraStatus('Testando conexão...');
    
    const result = await testCamera(cameraId);
    if (result.success) {
      setCameraStatus('OK: Câmera conectada com sucesso! Clique em "Fazer análise dimensional"');
    } else {
      setCameraStatus('ERRO: ' + result.message);
    }
  };

  const handleAnalyze = async () => {
    if (selectedCamera === null) {
      setError('Por favor, selecione uma câmera');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setCameraStatus('Analisando... Por favor aguarde.');

    const result = await performAnalysis(selectedCamera);

    setIsAnalyzing(false);

    if (result.success) {
      setAnalysisResult(result);
      // Preenche os campos de dimensões
      setDimensions({
        width: result.measurements.width,
        length: result.measurements.length,
        height: result.measurements.height
      });
      setCameraStatus(`OK: Análise concluída! ${result.num_valid_captures} capturas válidas.`);
    } else {
      setError(result.message);
      setCameraStatus('ERRO: Falha na análise');
    }
  };

  return (
    <main className="new-analysis-main">
      <div className="form-section">
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="doctor-name">Nome do médico*</label>
            <input type="text" id="doctor-name" />
          </div>
          <div className="form-group half-width">
            <label htmlFor="doctor-crm">CRM*</label>
            <input type="text" id="doctor-crm" placeholder="123456" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="patient-name">Nome do paciente*</label>
            <input type="text" id="patient-name" />
          </div>
          <div className="form-group half-width">
            <label htmlFor="patient-cpf">CPF*</label>
            <input type="text" id="patient-cpf" placeholder="12345678910" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Relatório</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="analysis-date">Data da análise</label>
            <input type="date" id="analysis-date" />
          </div>
          <div className="form-group">
            <label htmlFor="analysis-time">Hora da análise</label>
            <input type="time" id="analysis-time" defaultValue="00:00" />
          </div>
          <div className="form-group">
            <label htmlFor="analyzed-part">Peça analisada*</label>
            <select id="analyzed-part">
              <option>Coração</option>
              <option>Pulmão</option>
              <option>Pâncreas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Análise dimensional</h3>
        <div className="image-analysis-container">
          <div className="image-placeholder">
            {analysisResult && analysisResult.images && analysisResult.images[0] ? (
              <img 
                src={getImageUrl(analysisResult.images[0])} 
                alt="Foto 1 Análise" 
                onError={(e) => {
                  console.error('Erro ao carregar imagem 1:', analysisResult.images[0]);
                  console.error('URL tentada:', getImageUrl(analysisResult.images[0]));
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Imagem 1 carregada com sucesso')}
              />
            ) : (
              <span>Foto1</span>
            )}
          </div>
          <div className="camera-connect">
            <label htmlFor="camera-select">Conectar câmera</label>
            <select 
              id="camera-select" 
              value={selectedCamera || ''} 
              onChange={handleCameraChange}
              disabled={isAnalyzing}
            >
              {cameras.length === 0 ? (
                <option>Nenhuma câmera disponível</option>
              ) : (
                cameras.map(cam => (
                  <option key={cam.id} value={cam.id}>
                    {cam.name} ({cam.resolution})
                  </option>
                ))
              )}
            </select>
            {cameraStatus && (
              <p className={`camera-status ${cameraStatus.includes('OK') ? 'success' : cameraStatus.includes('ERRO') ? 'error' : ''}`}>
                {cameraStatus}
              </p>
            )}
            {error && (
              <p className="camera-status error">{error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group full-width">
            <label>Anotações</label>
            <textarea 
              rows="4" 
              defaultValue="Órgão apresenta morfologia preservada, com cavidades cardíacas bem definidas e proporcionalmente desenvolvidas."
            />
            <div className="voice-command">
              <span>Modo Comando de voz</span>
              <i className="fa-solid fa-microphone"></i>
              <i className="fa-solid fa-headset"></i>
            </div>
          </div>
          <div className="dimensions-group">
            <label>Dimensões (cm)</label>
            <div className="dimensions-inputs">
              <input 
                type="text" 
                placeholder="Largura" 
                value={dimensions.width ? `Largura: ${dimensions.width}` : 'Largura: -'} 
                readOnly 
              />
              <input 
                type="text" 
                placeholder="Comprimento" 
                value={dimensions.length ? `Comprimento: ${dimensions.length}` : 'Comprimento: -'} 
                readOnly 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn-dimensional" 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !selectedCamera}
        >
          {isAnalyzing ? 'Analisando...' : 'Fazer análise dimensional'}
        </button>
        <button className="btn-submit">Enviar análise</button>
      </div>
    </main>
  );
}

export default NovaAnalise;