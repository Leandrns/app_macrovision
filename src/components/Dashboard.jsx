import React from 'react';
import '../styles/Dashboard.css';

function Dashboard({ navigateTo }) {
  return (
    <main className="dashboard-main">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card-action" onClick={() => navigateTo('new-analysis')}>
          <i className="fa-solid fa-microscope"></i>
          <span>Nova Análise</span>
        </div>
        <div className="card-action" onClick={() => navigateTo('reports')}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Relatórios</span>
        </div>
      </div>

      <div className="recent-analyses">
        <h2>Análises Recentes</h2>
        <table>
          <thead>
            <tr>
              <th>Médico</th>
              <th>Data</th>
              <th>Paciente</th>
              <th>Órgão</th>
              <th>Dimensões</th>
              <th>Tipo Análise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João</td>
              <td>09/06/2025</td>
              <td>Rafael M. Maniezo</td>
              <td>Pulmão</td>
              <td>L: 20cm C:25cm A: 30cm</td>
              <td>Biópsia</td>
            </tr>
            <tr>
              <td>Pedro</td>
              <td>31/05/2025</td>
              <td>Caio A. dos Santos</td>
              <td>Pâncreas</td>
              <td>L: 1,5cm C:15cm A: 6,1cm</td>
              <td>Peça Cirúrgica</td>
            </tr>
            <tr>
              <td>Bruno</td>
              <td>01/05/2025</td>
              <td>Vinicius R. Cont</td>
              <td>Estômago</td>
              <td>L: 15cm C:30cm A: 17cm</td>
              <td>Imuno-histoquímica</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;