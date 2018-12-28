# @epicinium/basis

Make a component that has the pre-defined shared extension and interoperability of both `prop-types` and TypeScript.

[![Build Status][travis ci badge]][travis ci][![Test coverage][coveralls badge]][coveralls][![License][license badge]](LICENSE)[![Package Version][npm package version badge]][npm package]

## Table of Contents

- [@epicinium/basis](#epiciniumbasis)
	- [Table of Contents](#table-of-contents)
	- [Installation](#installation)
	- [Usage](#usage)
		- [Integration of `prop-types` and TypeScript](#integration-of-prop-types-and-typescript)
		- [Subscriptions for multiple contexts](#subscriptions-for-multiple-contexts)
		- [`updateState` method instead of `setState` method](#updatestate-method-instead-of-setstate-method)
	- [Contributing](#contributing)
		- [Requisites](#requisites)
	- [Trivia](#trivia)
	- [License](#license)

## Installation

```sh
$ npx install-peerdeps @epicinium/basis
$ npm install --save @epicinium/basis
```

## Usage

### Integration of `prop-types` and TypeScript

```jsx
// React modules.
import React from 'react';
import PropTypes from 'prop-types';

// This module.
import BaseComponent from '@epicinium/basis';

export default class Animal extends BaseComponent({
	species: PropTypes.string.isRequired,
	isLive: [PropTypes.bool, true]
}) {
	/**
	 * Below two static properties will be
	 * mapped by super constructor.
	 *
	 * static propTypes = ✨;
	 * static defaultProps = ✨;
	 */

	render() {
		const { species, isLive } = this.props;

		return <span>{`${isLive ? 'Living' : 'Dead'} ${species}`}</span>;
	}
}
```

### Subscriptions for multiple contexts

```tsx
// React modules.
import React, { Context, createContext } from 'react';
import PropTypes from 'prop-types';

// This module.
import BaseComponent from '@epicinium/basis';

// Type definitions.
type Subspecies = string;
type Gender = 'Unknown' | 'Male' | 'Female';

// Contexts.
const SubspeciesContext: Context<Subspecies> = createContext('incognita');
const GenderContext: Context<Gender> = createContext('Unknown');

export default class Animal extends BaseComponent({
	species: PropTypes.string.isRequired,
	isLive: [PropTypes.bool, true]
}) {
	static subscriptions = [SubspeciesContext, GenderContext];

	render(subspecies: Subspecies, gender: Gender) {
		const { species, isLive } = this.props;

		return <span>{`${isLive ? 'Living' : 'Dead'} ${species} ${subspecies} (${gender})`}</span>;
	}
}
```

### `updateState` method instead of `setState` method

```tsx
// React modules.
import React from 'react';
import PropTypes from 'prop-types';

// This module.
import BaseComponent from '@epicinium/basis';

// Type definitions.
type FluidControllerState = {
	isFlow: boolean;
};

export default class FluidController extends BaseComponent<FluidControllerState>({
	type: PropTypes.string.isRequired
}) {
	state = {
		isFlow: false
	};

	handleButtonClick = async () => {
		await this.updateState({ isFlow: !this.state.isFlow });
	};

	render() {
		const {
			props: { type },
			state: { isFlow }
		} = this;

		return (
			<>
				<button onClick={this.handleButtonClick}>On/Off</button>
				<hr />
				<span>{`${type} ${isFlow ? 'Flowing' : 'Stopped'}`}</span>
			</>
		);
	}
}
```

## Contributing

### Requisites

-   [Node.js](https://nodejs.org/) LTS Dubnium v10.15.0+

## Trivia

**basis** means **base** in the Latin Language

## License

[MIT Licensed](LICENSE).

[travis ci badge]: https://img.shields.io/travis/com/epicinium/basis/develop.svg?style=flat-square
[travis ci]: https://travis-ci.com/epicinium/basis
[coveralls badge]: https://img.shields.io/coveralls/github/epicinium/basis.svg?style=flat-square
[coveralls]: https://coveralls.io/github/epicinium/basis
[license badge]: https://img.shields.io/github/license/epicinium/basis.svg?style=flat-square
[npm package version badge]: https://img.shields.io/npm/v/@epicinium/basis.svg?style=flat-square
[npm package]: https://www.npmjs.com/package/@epicinium/basis
