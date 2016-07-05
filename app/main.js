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
import { add } from './something-else';
import './app.scss';

import 'webcomponentsjs';

import _ from 'lodash';
const jQuery = require('jquery');

const last = _.last([2, 4, 5]);
console.log(jQuery);
ReactDOM.render(
    <h1>Hello World { add(1, 2) } { last }</h1>,
    document.getElementById('app')
);
