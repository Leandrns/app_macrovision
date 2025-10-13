import React from 'react';
import '../styles/UserLogin.css';

function UserLogin() {
  return (
    <div className="user-login-container">
      <div className="user-login-box">
        <div className="login-header">
            <button className="back-button"><i className="fa-solid fa-arrow-left"></i> Voltar</button>
        </div>
        <img src="" alt="Macrovision Logo" className="login-logo" />
        <span className="login-brand-name">MACRO VISION</span>
        
        <h2>Login</h2>

        <form className="login-form">
          <div className="input-group">
            <input type="text" id="crm" placeholder="CRM" required />
          </div>
          <div className="input-group">
            <input type="password" id="password" placeholder="Senha" required />
            <i className="fa-solid fa-eye-slash password-icon"></i>
          </div>
          <a href="#" className="forgot-password">Trocar senha...</a>
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;