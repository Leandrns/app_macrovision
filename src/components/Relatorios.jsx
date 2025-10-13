import React from 'react';
import '../styles/Relatorios.css';

function Relatorios() {
  return (
    <main className="reports-main">
      <h1>Relatórios</h1>
      <div className="filters">
        <span>Filtrar por:</span>
        <select>
          <option>Data</option>
        </select>
        <select>
          <option>Paciente</option>
        </select>
        <select>
          <option>Tipo de Análise</option>
        </select>
      </div>

      <div className="report-list">
        <div className="report-item">
          <div className="report-header">
            <span>09/06/2025</span>
            <span>Rafael M. Maniezo</span>
            <span>Biópsia</span>
            <div className="report-actions">
              <i className="fa-solid fa-eye"></i>
              <button className="edit-btn">Editar</button>
              <i className="fa-solid fa-file-pdf"></i>
            </div>
          </div>
          <div className="report-details">
            <strong>Anotações:</strong>
            <p>Recebo, em frasco contendo formalina, quatro fragmentos irregulares de tecido de aspecto mucoso, coloração branco-acinzentada e consistência firme. Não se observam áreas evidentes de necrose ou hemorragia. Todos os fragmentos são incluídos inteiros para processamento histológico.</p>
          </div>
        </div>
        
        {/* Adicione mais report-item conforme necessário */}
        <div className="report-item simple">
          <div className="report-header">
            <span>31/05/2025</span>
            <span>Caio A. dos Santos</span>
            <span>Peça Cirúrgica</span>
            <div className="report-actions">
              <i className="fa-solid fa-eye"></i>
              <i className="fa-solid fa-pencil"></i>
              <i className="fa-solid fa-file-pdf"></i>
            </div>
          </div>
        </div>
        <div className="report-item simple">
          <div className="report-header">
            <span>01/05/2025</span>
            <span>Vinicius R. Cont</span>
            <span>Imuno-histoquímica</span>
            <div className="report-actions">
              <i className="fa-solid fa-eye"></i>
              <i className="fa-solid fa-pencil"></i>
              <i className="fa-solid fa-file-pdf"></i>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Relatorios;