import React from 'react';
import '../styles/InitialLogin.css';

function InitialLogin() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src="" alt="Macrovision Logo" className="login-logo" />
        <span className="login-brand-name">MACRO VISION</span>
        <div className="login-buttons">
          <button className="login-btn">
            <i className="fa-solid fa-user"></i>
            <span>Usuário</span>
          </button>
          <button className="login-btn">
            <i className="fa-solid fa-user-gear"></i>
            <span>Administrador</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InitialLogin;