// Node.js built-in APIs.
const {
	env: { NODE_ENV: environment = 'development' }
} = require('process');

// Babel configuration.
const presets = Object.entries({
	'@babel/preset-env': { targets: '>= 0.5%, not dead' },
	'@babel/preset-react': { useBuiltIns: true, development: environment !== 'production' }
});

const plugins = Object.entries({
	'@babel/plugin-transform-async-to-generator': { module: 'bluebird', method: 'coroutine' },
	'babel-plugin-closure-elimination': {},
	'@babel/plugin-proposal-optional-chaining': {},
	'@babel/plugin-proposal-class-properties': {},
	'@babel/plugin-transform-react-inline-elements': {},
	'@babel/plugin-transform-react-constant-elements': {},
	'module:faster.js': {},
	'@babel/plugin-transform-runtime': { corejs: 2 }
});

module.exports = { presets, plugins };
