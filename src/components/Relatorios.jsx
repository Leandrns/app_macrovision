import React from 'react';
import '../styles/Relatorios.css';

function Relatorios() {
  return (
    <main className="reports-main">
      <h1>Relatórios</h1>

      <div className="filters">
        <span>Filtrar por:</span><br></br>
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
            {/* --- Item Expandido --- */}
            <React.Fragment>
              <tr className="report-item-row">
                <td className="col-data">09/06/2025</td>
                <td className="col-paciente">Rafael M. Maniezo</td>
                <td className="col-analise">Biópsia</td>
                <td className="col-acoes">
                  <div className="report-actions">
                    <i className="fa-solid fa-eye action-icon"></i>
                    
                    <i className="fa-solid fa-file-pdf action-icon"></i>
                  </div>
                </td>
              </tr>
              <tr className="details-row">
                <td colSpan="4">
                  <div className="report-details">
                    <strong>Anotações:</strong>
                    <p>Recebo, em frasco contendo formalina, quatro fragmentos irregulares de tecido de aspecto mucoso, coloração branco-acinzentada e consistência firme. Não se observam áreas evidentes de necrose ou hemorragia. Todos os fragmentos são incluídos inteiros para processamento histológico.</p>
                  </div>
                </td>
              </tr>
            </React.Fragment>

            {/* --- Itens Simples --- */}
            <tr className="report-item-row">
              <td className="col-data">31/05/2025</td>
              <td className="col-paciente">Caio A. dos Santos</td>
              <td className="col-analise">Peça Cirúrgica</td>
              <td className="col-acoes">
                <div className="report-actions">
                  <i className="fa-solid fa-eye action-icon"></i>
                  <i className="fa-solid fa-pencil action-icon"></i>
                  <i className="fa-solid fa-file-pdf action-icon"></i>
                </div>
              </td>
            </tr>

            <tr className="report-item-row">
              <td className="col-data">01/05/2025</td>
              <td className="col-paciente">Vinicius R. Cont</td>
              <td className="col-analise">Imuno-histoquímica</td>
              <td className="col-acoes">
                 <div className="report-actions">
                    <i className="fa-solid fa-eye action-icon"></i>
                    <i className="fa-solid fa-pencil action-icon"></i>
                    <i className="fa-solid fa-file-pdf action-icon"></i>
                </div>
              </td>
            </tr>
            
            {/* Adicione mais linhas <tr> conforme necessário */}

          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Relatorios;