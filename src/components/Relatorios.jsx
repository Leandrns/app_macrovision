import React, { useState, useEffect } from 'react';
import '../styles/Relatorios.css';
import { analysisService } from '../services/supabaseClient';

function Relatorios() {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados dos filtros
  const [filters, setFilters] = useState({
    date: '',
    patient: '',
    analysisType: ''
  });

  // Carregar análises ao montar o componente
  useEffect(() => {
    loadAnalyses();
  }, []);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    applyFilters();
  }, [filters, analyses]);

  const loadAnalyses = async () => {
    setLoading(true);
    const result = await analysisService.getAllAnalyses();
    
    if (result.success) {
      setAnalyses(result.data);
      setFilteredAnalyses(result.data);
    } else {
      setError('Erro ao carregar análises: ' + result.error);
    }
    
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...analyses];

    if (filters.date) {
      filtered = filtered.filter(analysis => 
        analysis.analysis_date === filters.date
      );
    }

    if (filters.patient) {
      filtered = filtered.filter(analysis => 
        analysis.patient_name.toLowerCase().includes(filters.patient.toLowerCase())
      );
    }

    if (filters.analysisType) {
      filtered = filtered.filter(analysis => 
        analysis.analysis_type === filters.analysisType
      );
    }

    setFilteredAnalyses(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta análise?')) {
      return;
    }

    const result = await analysisService.deleteAnalysis(id);
    
    if (result.success) {
      alert('Análise excluída com sucesso!');
      loadAnalyses();
    } else {
      alert('Erro ao excluir análise: ' + result.error);
    }
  };

  const formatDate = (dateString) => {
    // Corrige o problema do fuso horário
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString) => {
    // Se o horário vier no formato HH:MM:SS, retorna apenas HH:MM
    if (timeString && timeString.includes(':')) {
      const parts = timeString.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    // Se vier como 00:00:00 ou vazio, retorna apenas o horário
    return timeString || '00:00';
  };

  const exportToPDF = (analysis) => {
    // Implementar exportação para PDF
    alert('Exportação para PDF em desenvolvimento');
  };

  // Obter tipos de análise únicos para o filtro
  const analysisTypes = [...new Set(analyses.map(a => a.analysis_type))];

  if (loading) {
    return (
      <main className="reports-main">
        <h1>Relatórios</h1>
        <p>Carregando análises...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="reports-main">
        <h1>Relatórios</h1>
        <p className="error">{error}</p>
        <button onClick={loadAnalyses}>Tentar novamente</button>
      </main>
    );
  }

  return (
    <main className="reports-main">
      <h1>Relatórios</h1>

      <div className="filters">
        <span>Filtrar por:</span><br />
        <div className="spacer">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
          <input
            type="text"
            placeholder="Nome do Paciente"
            value={filters.patient}
            onChange={(e) => handleFilterChange('patient', e.target.value)}
          />
          <select
            value={filters.analysisType}
            onChange={(e) => handleFilterChange('analysisType', e.target.value)}
          >
            <option value="">Todos os Tipos</option>
            {analysisTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredAnalyses.length === 0 ? (
        <p>Nenhuma análise encontrada.</p>
      ) : (
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th className="col-data">Data</th>
                <th className="col-paciente">Paciente</th>
                <th className="col-analise">Tipo de Análise</th>
                <th className="col-acoes">Visualizar/Editar/Exportar</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnalyses.map((analysis) => (
                <React.Fragment key={analysis.id}>
                  <tr className="report-item-row">
                    <td className="col-data">{formatDate(analysis.analysis_date)}</td>
                    <td className="col-paciente">{analysis.patient_name}</td>
                    <td className="col-analise">{analysis.analysis_type}</td>
                    <td className="col-acoes">
                      <div className="report-actions">
                        <i 
                          className="fa-solid fa-eye action-icon"
                          onClick={() => toggleRow(analysis.id)}
                          title="Visualizar"
                        ></i>
                        <button 
                          className="edit-btn"
                          onClick={() => alert('Edição em desenvolvimento')}
                        >
                          Editar
                        </button>
                        <i 
                          className="fa-solid fa-file-pdf action-icon"
                          onClick={() => exportToPDF(analysis)}
                          title="Exportar PDF"
                        ></i>
                        <i 
                          className="fa-solid fa-trash action-icon"
                          onClick={() => handleDelete(analysis.id)}
                          title="Excluir"
                          style={{ color: '#e74c3c' }}
                        ></i>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === analysis.id && (
                    <tr className="details-row">
                      <td colSpan="4">
                        <div className="report-details">
                          <div className="detail-section">
                            <strong>Médico:</strong> {analysis.doctor_name} (CRM: {analysis.doctor_crm})
                          </div>
                          <div className="detail-section">
                            <strong>Paciente:</strong> {analysis.patient_name} (CPF: {analysis.patient_cpf})
                          </div>
                          <div className="detail-section">
                            <strong>Data e Hora:</strong> {formatDate(analysis.analysis_date)} às {formatTime(analysis.analysis_time)}
                          </div>
                          <div className="detail-section">
                            <strong>Peça Analisada:</strong> {analysis.analyzed_part}
                          </div>
                          <div className="detail-section">
                            <strong>Tipo de Análise:</strong> {analysis.analysis_type}
                          </div>
                          <div className="detail-section">
                            <strong>Dimensões:</strong> Largura: {analysis.width}cm | Comprimento: {analysis.length}cm
                          </div>
                          <div className="detail-section">
                            <strong>Anotações:</strong>
                            <p>{analysis.annotations}</p>
                          </div>
                          {analysis.image_urls && analysis.image_urls.length > 0 && (
                            <div className="detail-section">
                              <strong>Imagens:</strong>
                              <div className="analysis-images">
                                {analysis.image_urls.map((url, idx) => (
                                  <img 
                                    key={idx} 
                                    src={url} 
                                    alt={`Análise ${idx + 1}`}
                                    style={{ width: '200px', margin: '10px', borderRadius: '8px' }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Relatorios;