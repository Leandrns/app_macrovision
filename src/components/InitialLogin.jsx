import React from 'react';
import '../styles/InitialLogin.css';
import LogoAzul from '../assets/logo_macrovision_p.svg'

function InitialLogin({ onSelectUser }) {
  return (
    <div className="login-container">
      <img src={LogoAzul} alt="Macrovision Logo" className="login-logo" />
      <div className="login-box">
        <span className="login-brand-name">Login</span>
        <div className="login-buttons">
          <button className="login-btn" onClick={onSelectUser}>
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