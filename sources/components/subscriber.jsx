// React modules.
import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line no-unused-vars

// Predefined `prop-types`.
import { SubscriberPropTypes } from '../prop-types';

/**
 * A consumer for multiple contexts without deeply nesting.
 *
 * @param {PropTypes.InferProps<typeof SubscriberPropTypes>} param0
 * @returns {React.ReactElement}
 */
export default function Subscriber({ subscriptions, children: render }) {
	const contexts = [];

	/**
	 * @template P, T
	 * @param {(...contexts: T[]) => React.ReactElement<P>} callingChain
	 * @param {React.Context<T>} param1
	 * @param {number} index
	 */
	const reducer = (callingChain, { Consumer }, index) => {
		const consumer = <Consumer>{callingChain}</Consumer>;

		if (index === 0) {
			return consumer;
		}

		return context => {
			contexts.push(context);

			return consumer;
		};
	};

	const consumer = lastContext => render(...contexts, lastContext);
	const subscriber = subscriptions.reduceRight(reducer, consumer);

	return subscriber;
}

Subscriber.propTypes = SubscriberPropTypes;
