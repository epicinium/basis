// React modules.
import React, { Component as Lifecycle } from 'react';

// Third-party modules.
import Promise from 'bluebird';

// Components.
import Subscriber from './subscriber';

class Shared extends Lifecycle {
	/**
	 * Promisified version of `setState` method.
	 *
	 * @param {Partial<infer S> | ((state: Readonly<infer S>, props: Readonly<infer P>) => Partial<infer S>)} changes
	 * @returns {Promise<void>}
	 */
	async updateState(changes) {
		await new Promise(resolve => {
			this.setState(changes, resolve);
		});
	}
}

/**
 * @template P, S
 * @param {{ isPure?: boolean }} [options]
 * @returns {React.ComponentClass<P, S>}
 */
function createCore(options) {
	/** @type {React.ComponentClass} */
	const ComponentClass = options?.isPure === true ? React.PureComponent : React.Component;

	class Core extends ComponentClass {
		constructor(...args) {
			super(...args);

			if (Array.isArray(new.target?.subscriptions)) {
				const render = Reflect.get(this, 'render');
				const overridden = (...contexts) => Reflect.apply(render, this, contexts);

				this.render = () => <Subscriber subscriptions={new.target.subscriptions}>{overridden}</Subscriber>;
			}
		}
	}

	for (const propertyKey of Reflect.ownKeys(Shared.prototype)) {
		const propertyDescriptor = Reflect.getOwnPropertyDescriptor(Shared.prototype, propertyKey);

		Reflect.defineProperty(Core.prototype, propertyKey, propertyDescriptor);
	}

	return Core;
}

/**
 * @template P, S
 * @type {React.ComponentClass<P, S>}
 */
export const Component = createCore();

/**
 * @template P, S
 * @type {React.ComponentClass<P, S>}
 */
export const PureComponent = createCore({ isPure: true });
