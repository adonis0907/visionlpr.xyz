import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import Context from './Context';


ReactDOM.render(
    <Context.AuthProvider>
        <App/>
    </Context.AuthProvider>,
    document.getElementById('root'));