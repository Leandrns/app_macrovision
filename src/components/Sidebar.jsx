import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ activeScreen }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <img src="" alt="Macrovision Logo" className="sidebar-logo" />
        <span>MACRO VISION</span>
      </div>
      <ul className="sidebar-menu">
        <li className={activeScreen === 'dashboard' ? 'active' : ''}>
          <a href="#"><i className="fa-solid fa-chart-pie"></i> Dashboard</a>
        </li>
        <li className={activeScreen === 'new-analysis' ? 'active' : ''}>
          <a href="#"><i className="fa-solid fa-microscope"></i> Nova Análise</a>
        </li>
        <li className={activeScreen === 'reports' ? 'active' : ''}>
          <a href="#"><i className="fa-solid fa-file-lines"></i> Relatórios</a>
        </li>
      </ul>
      <div className="sidebar-footer">
        <a href="#"><i className="fa-solid fa-circle-user"></i> Usuário</a>
      </div>
    </nav>
  );
}

export default Sidebar;