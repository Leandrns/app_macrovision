import { useState } from 'react';
import './App.css';

// Importando todos os componentes criados
import InitialLogin from './components/InitialLogin';
import UserLogin from './components/UserLogin';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewAnalysis from './components/NovaAnalise';
import Reports from './components/Relatorios';

function App() {
  // --- ESTADOS DA APLICAÇÃO ---
  // Controla se o usuário está logado ou não.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Controla qual tela de login é exibida: 'initial' ou 'user'
  const [loginScreen, setLoginScreen] = useState('initial'); 
  
  // Controla qual tela principal é exibida após o login
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  // --- FUNÇÕES DE NAVEGAÇÃO ---
  // Navega para uma tela específica do painel principal
  const navigateTo = (screen) => {
    if (screen === 'UserLogin') {
      setIsLoggedIn(false);
      setLoginScreen('user');
    } else {
      setCurrentScreen(screen);
    }
  };

  // Simula o processo de login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard'); // Redireciona para o dashboard após o login
  };
  
  // Navega para a tela de login do usuário
  const showUserLogin = () => {
    setLoginScreen('user');
  }

  // Volta para a tela inicial de login
  const showInitialLogin = () => {
    setLoginScreen('initial');
  }

  // --- RENDERIZAÇÃO CONDICIONAL ---
  // Função para renderizar o conteúdo principal (Dashboard, Nova Análise, etc.)
  const renderMainContent = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'new-analysis':
        return <NewAnalysis navigateTo={navigateTo} />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  // Se o usuário NÃO estiver logado, renderiza uma das telas de login
  if (!isLoggedIn) {
    switch(loginScreen) {
        case 'initial':
            return <InitialLogin onSelectUser={showUserLogin} />;
        case 'user':
            return <UserLogin onBack={showInitialLogin} onLogin={handleLogin} />;
        default:
            return <InitialLogin onSelectUser={showUserLogin} />;
    }
  }

  // Se o usuário ESTIVER logado, renderiza o layout principal da aplicação
  return (
    <div className="app-layout">
      <Sidebar activeScreen={currentScreen} navigateTo={navigateTo} />
      <main className="main-content">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;