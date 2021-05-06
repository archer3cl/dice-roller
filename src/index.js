import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { inspect } from '@xstate/inspect';

if (process.env.NODE_ENV === 'development') {
  inspect({
    url: 'https://statecharts.io/inspect',
    iframe: false,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
