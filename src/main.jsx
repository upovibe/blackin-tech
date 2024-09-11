import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthContextProvider from './contexts/AuthContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
);

