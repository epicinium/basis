// React modules.
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'; // eslint-disable-line no-unused-vars

// Components.
import { Component, PureComponent } from './components/core';

// Constants.
const defaultDefintion = {};
const cachedComponentMap = new WeakMap();
const ReallyUndefined = Symbol.for('basis.undefined');

/**
 * Make a component that has the pre-defined shared extension and interoperability of both `prop-types` and TypeScript.
 *
 * @template P, S, T
 * @param {PropTypes.ValidationMap<T>} [definition]
 * @param {{ isPure?: boolean }} [options]
 * @returns {typeof SharedExtension & React.ComponentClass<P, S>}
 */
export default function BaseComponent(definition = defaultDefintion, options) {
	const isPure = options?.isPure === true;

	if (cachedComponentMap.has(definition)) {
		const cachedComponent = cachedComponentMap.get(definition)[isPure ? 1 : 0];

		if (cachedComponent !== null) {
			return cachedComponent;
		}
	}

	/** @type {React.ComponentClass<P, S>} */
	const ComponentClass = isPure ? PureComponent : Component;

	/** @type {PropTypes.ValidationMap<T>} */
	const propTypes = {};

	/** @type {PropTypes.InferProps<T>} */
	const defaultProps = {};

	for (const propertyKey of Reflect.ownKeys(definition)) {
		/**
		 * @template K
		 * @type {PropTypes.Validator<K> | [PropTypes.Validator<K>, K]}
		 */
		const rawDefinition = definition[propertyKey];

		/** @type {PropTypes.Validator<K>}  */
		let propertyType;

		/** @type {symbol | K} */
		let defaultValue;

		if (Array.isArray(rawDefinition)) {
			[ propertyType, defaultValue ] = rawDefinition;
		} else {
			[ propertyType, defaultValue ] = [ rawDefinition, ReallyUndefined ];
		}

		propTypes[propertyKey] = propertyType;

		if (defaultValue !== ReallyUndefined) {
			defaultProps[propertyKey] = defaultValue;
		}
	}

	class BaseComponent extends ComponentClass {
		static propTypes = propTypes;

		static defaultProps = defaultProps;
	}

	cachedComponentMap.set(definition, [ isPure ? null : BaseComponent, isPure ? BaseComponent : null ]);

	return BaseComponent;
}
