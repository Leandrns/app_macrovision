import React, { useState } from 'react';
import '../styles/NovaAnalise.css';

function NovaAnalise() {
  const [doctorName, setDoctorName] = useState('');
  const [crm, setCrm] = useState('');
  const [patientName, setPatientName] = useState('');
  const [cpf, setCpf] = useState('');
  const [analysisDate, setAnalysisDate] = useState('');
  const [analysisTime, setAnalysisTime] = useState('');

  const handleCrmChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
    setCrm(value);
  };

  const handleCpfChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setCpf(value);
  };

  const handleSubmit = () => {
    const now = new Date();
    setAnalysisTime(now.toLocaleTimeString());
    // Aqui você pode adicionar lógica para enviar a análise, como uma chamada para uma API
  };

  return (
    <main className="new-analysis-main">
      <div className="form-section">
        <div className="form-row">
            <div className="form-group half-width">
                <label htmlFor="doctor-name">Nome do médico*</label>
                <input type="text" id="doctor-name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            </div>
            <div className="form-group half-width">
                <label htmlFor="doctor-crm">CRM*</label>
                <input type="text" id="doctor-crm" value={crm} onChange={handleCrmChange} placeholder="1234567" />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group half-width">
                <label htmlFor="patient-name">Nome do paciente*</label>
                <input type="text" id="patient-name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            </div>
            <div className="form-group half-width">
                <label htmlFor="patient-cpf">CPF*</label>
                <input type="text" id="patient-cpf" value={cpf} onChange={handleCpfChange} placeholder="12345678901" />
            </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Relatório</h3>
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="analysis-date">Data da análise</label>
                <input type="date" id="analysis-date" value={analysisDate} onChange={(e) => setAnalysisDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="analysis-time">Hora da análise</label>
                <input type="text" id="analysis-time" value={analysisTime} readOnly />
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
                <img src="" alt="Foto 1 Análise" />
                <span>Foto1</span>
            </div>
            <div className="image-placeholder">
                <img src="" alt="Foto 2 Análise" />
                <span>Foto2</span>
            </div>
            <div className="camera-connect">
                <label htmlFor="camera-select">Conectar câmera</label>
                <select id="camera-select">
                    <option>Câmera_A</option>
                </select>
                <p className="camera-status"><i className="fa-solid fa-check"></i> Câmera Conectada com sucesso! Clique em 'Fazer análise dimensional'</p>
            </div>
          </div>
      </div>

      <div className="form-section">
        <div className="form-row">
            <div className="form-group full-width">
                <label>Anotações</label>
                <textarea rows="4" defaultValue="Órgão apresenta morfologia preservada, com cavidades cardíacas bem definidas e proporcionalmente desenvolvidas."></textarea>
                <div className="voice-command">
                    <span>Modo Comando de voz</span>
                    <i className="fa-solid fa-microphone"></i>
                    <i className="fa-solid fa-headset"></i>
                </div>
            </div>
            <div className="dimensions-group">
                <label>Dimensões(cm)</label>
                <div className="dimensions-inputs">
                    <input type="text" placeholder="Largura: 8.5" />
                    <input type="text" placeholder="Comprimento: 12.3" />
                    <input type="text" placeholder="Altura: 6.7" />
                </div>
            </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button className="btn-dimensional">Fazer análise dimensional</button>
        <button className="btn-submit" onClick={handleSubmit}>Enviar análise</button>
      </div>

    </main>
  );
}

export default NovaAnalise;
