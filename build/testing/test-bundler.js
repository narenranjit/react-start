// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';

// If we need to use Chai, we'll have already chaiEnzyme loaded
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';
// import chaiAsPromised from 'chai-as-promised';

// chai.use(sinonChai);
// chai.use(chaiAsPromised);
chai.use(chaiEnzyme());

// global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();

// require all `tests/**/*.spec.js`
const testsContext = require.context('../../tests', true, /-test\.js$/);
testsContext.keys().forEach(testsContext);

// require all `src/**/*.js` except for `main.js` (for isparta coverage reporting)
// const componentsContext = require.context('../../app/', true, /^((?!main).)*\.js$/);
// componentsContext.keys().forEach(componentsContext);
