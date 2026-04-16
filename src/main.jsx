import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import React from 'react';
import { TransactionProvider } from './context/TransactionContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx' 
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. ChatProvider EN DIŞTA olmalı ki içeridekiler ona ulaşabilsin */}
    <ChatProvider> 
      {/* 2. TransactionProvider onun İÇİNDE yer almalı */}
      <TransactionProvider> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TransactionProvider>
    </ChatProvider>
  </React.StrictMode>,
)