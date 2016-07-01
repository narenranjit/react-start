/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import s from './something-else';
import './app.scss';

s();

ReactDOM.render(
    <h1>Hello World</h1>,
    document.getElementById('app')
);
