// React modules.
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

// Constants.
const hasSymbol = typeof Symbol?.for === 'function';

// React internal symbols.
const symbolOfProvider = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
const symbolOfContext = hasSymbol ? Symbol.for('react.context') : 0xeace;

/**
 * @template T
 * @type {PropTypes.Validator<React.Context<T>>}
 */
export const ContextPropType = (props, propName) => {
	const maybeContext = props[propName];

	switch (true) {
	case maybeContext?.$$typeof !== symbolOfContext:
	case maybeContext?.Provider?.$$typeof !== symbolOfProvider:
	case maybeContext?.Consumer?.$$typeof !== symbolOfContext: {
		return new Error(`Invalid prop \`${propName}\` is not a context.`);
	}

	default: {
		return undefined;
	}
	}
};

/** @template P, T */
export const SubscriberPropTypes = {
	/** @type {PropTypes.Validator<React.Context<T>[]>} */
	subscriptions: PropTypes.arrayOf(ContextPropType).isRequired,

	/** @type {PropTypes.Validator<(...contexts: T[]) => React.ReactElement<P>>} */
	children: PropTypes.func.isRequired
};
