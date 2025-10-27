import React, { useState } from 'react';
import '../styles/UserLogin.css';
import LogoAzul from '../assets/logo_macrovision_p.svg'

function UserLogin({ onBack, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="user-login-container">
      <img src={LogoAzul} alt="Macrovision Logo" className="login-logo" />
      <div className="user-login-box">
        <div className="login-header">
            <button className="back-button" onClick={onBack}>
              <i className="fa-solid fa-arrow-left"></i> Voltar
            </button>
        </div>
        
        <h2>Login</h2>

        <form className="login-form" onSubmit={(e) => {
            e.preventDefault();
            onLogin();
        }}>
          <div className="input-group">
            <input type="text" id="crm" placeholder="CRM" required />
          </div>
          <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="Senha" 
              required 
            />
            <i 
              className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'} password-icon`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          <a href="#" className="forgot-password">Trocar senha...</a>
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;