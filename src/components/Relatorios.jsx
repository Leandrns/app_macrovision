import React from 'react';
import '../styles/Relatorios.css';

function Relatorios() {
  return (
    <main className="reports-main">
      <h1>Relatórios</h1>

      <div className="filters">
        <span>Filtrar por:</span><br></br>
        <div className="spacer">
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
            {/* Item expandido */}
            <React.Fragment>
              <tr className="report-item-row">
                <td className="col-data">09/06/2025</td>
                <td className="col-paciente">Rafael M. Maniezo</td>
                <td className="col-analise">Biópsia</td>
                <td className="col-acoes">
                  <div className="report-actions">
                    <i className="fa-solid fa-eye action-icon"></i>
                    <button className="edit-btn">Editar</button>
                    <i className="fa-solid fa-file-pdf action-icon"></i>
                  </div>
                </td>
              </tr>
              <tr className="details-row">
                <td colSpan="4">
                  <div className="report-details">
                    <strong>Anotações:</strong>
                    <p>
                      Recebo, em frasco contendo formalina, quatro fragmentos irregulares de tecido de aspecto mucoso,
                      coloração branco-acinzentada e consistência firme. Não se observam áreas evidentes de necrose ou
                      hemorragia. Todos os fragmentos são incluídos inteiros para processamento histológico.
                    </p>
                  </div>
                </td>
              </tr>
            </React.Fragment>

            {/* Outros itens */}
            <tr className="report-item-row">
              <td>31/05/2025</td>
              <td>Caio A. dos Santos</td>
              <td>Peça Cirúrgica</td>
              <td>
                <div className="report-actions">
                  <i className="fa-solid fa-eye action-icon"></i>
                  <button className="edit-btn">Editar</button>
                  <i className="fa-solid fa-file-pdf action-icon"></i>
                </div>
              </td>
            </tr>

            <tr className="report-item-row">
              <td>01/05/2025</td>
              <td>Vinicius R. Cont</td>
              <td>Imuno-histoquímica</td>
              <td>
                <div className="report-actions">
                  <i className="fa-solid fa-eye action-icon"></i>
                  <button className="edit-btn">Editar</button>
                  <i className="fa-solid fa-file-pdf action-icon"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Relatorios;