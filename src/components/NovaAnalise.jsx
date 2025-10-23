import React, { useState, useEffect } from 'react';
import '../styles/NovaAnalise.css';
import { getCameras, testCamera, performAnalysis, getImageUrl } from '../services/api';
import { analysisService } from '../services/supabaseClient';

function NovaAnalise({ navigateTo }) {
  // Estados
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraStatus, setCameraStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const agora = new Date();
  const horaAtual = agora.getHours().toString().padStart(2, '0');
  const minutosAtuais = agora.getMinutes().toString().padStart(2, '0');
  const horaFormatada = `${horaAtual}:${minutosAtuais}`;
  const [horaSelecionada, setHoraSelecionada] = useState(horaFormatada);

  // Dados do formulário
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorCrm: '',
    patientName: '',
    patientCpf: '',
    analysisDate: new Date().toISOString().split('T')[0],
    analysisTime: '00:00',
    analyzedPart: 'Coração',
    analysisType: 'Biópsia',
    annotations: 'Órgão apresenta morfologia preservada, com cavidades cardíacas bem definidas e proporcionalmente desenvolvidas.'
  });

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
        setSelectedCamera(result.cameras[0].id);
      }
    } else {
      setError('Não foi possível carregar as câmeras');
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
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

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.doctorName || !formData.doctorCrm || !formData.patientName || !formData.patientCpf) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!analysisResult) {
      setError('Por favor, realize a análise dimensional antes de enviar');
      return;
    }

    setIsSaving(true);
    setError(null);

    // Extrair URLs das imagens
    const imageUrls = analysisResult.images.map(img => 
      typeof img === 'object' ? img.url : img
    );

    // Preparar dados para salvar
    const analysisData = {
      doctor_name: formData.doctorName,
      doctor_crm: formData.doctorCrm,
      patient_name: formData.patientName,
      patient_cpf: formData.patientCpf,
      analysis_date: formData.analysisDate,
      analysis_time: formData.analysisTime,
      analyzed_part: formData.analyzedPart,
      analysis_type: formData.analysisType,
      annotations: formData.annotations,
      width: dimensions.width,
      length: dimensions.length,
      height: dimensions.height,
      image_urls: imageUrls
    };

    const result = await analysisService.createAnalysis(analysisData);

    setIsSaving(false);

    if (result.success) {
      alert('Análise salva com sucesso!');
      // Limpar formulário
      setFormData({
        doctorName: '',
        doctorCrm: '',
        patientName: '',
        patientCpf: '',
        analysisDate: new Date().toISOString().split('T')[0],
        analysisTime: '00:00',
        analyzedPart: 'Coração',
        analysisType: 'Biópsia',
        annotations: 'Órgão apresenta morfologia preservada, com cavidades cardíacas bem definidas e proporcionalmente desenvolvidas.'
      });
      setDimensions({ width: '', length: '', height: '' });
      setAnalysisResult(null);
      setCameraStatus(null);
    } else {
      setError('Erro ao salvar análise: ' + result.error);
    }
  };

  return (
    <main className="new-analysis-main">
      <div className="form-section">
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="doctor-name">Nome do médico*</label>
            <input 
              type="text" 
              id="doctor-name" 
              value={formData.doctorName}
              onChange={handleInputChange}
              placeholder='Digite o nome do médico'
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="doctor-crm">CRM*</label>
            <input 
              type="text" 
              id="doctor-crm" 
              placeholder="123456" 
              value={formData.doctorCrm}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="patient-name">Nome do paciente*</label>
            <input 
              type="text" 
              id="patient-name" 
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder='Digite o nome do paciente'
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="patient-cpf">CPF*</label>
            <input 
              type="text" 
              id="patient-cpf" 
              placeholder="12345678910" 
              value={formData.patientCpf}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Relatório</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="analysis-date">Data da análise</label>
            <input 
              type="date" 
              id="analysis-date" 
              value={formData.analysisDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="analysis-time">Hora da análise</label>
            <input 
              type="time" 
              id="analysis-time" 
              onChange={handleInputChange}
              // value={formData.analysisTime}
              value={horaSelecionada}
            />
          </div>
          <div className="form-group">
            <label htmlFor="analyzed-part">Peça analisada*</label>
            <select 
              id="analyzed-part" 
              value={formData.analyzedPart}
              onChange={handleInputChange}
            >
              <option>Coração</option>
              <option>Pulmão</option>
              <option>Pâncreas</option>
              <option>Estômago</option>
              <option>Fígado</option>
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
                  e.target.style.display = 'none';
                }}
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
              id="annotations"
              rows="4" 
              value={formData.annotations}
              onChange={handleInputChange}
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
        <button className='btn-cancel' onClick={() => navigateTo('dashboard')}>Cancelar análise</button>
        <button 
          className="btn-dimensional" 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !selectedCamera}
        >
          {isAnalyzing ? 'Analisando...' : 'Fazer análise dimensional'}
        </button>
        <button 
          className="btn-submit" 
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Enviar análise'}
        </button>
      </div>
    </main>
  );
}

export default NovaAnalise;