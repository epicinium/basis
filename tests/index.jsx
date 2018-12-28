// React modules.
import React from 'react';
import PropTypes from 'prop-types';

// Test frameworks.
import { describe, it } from 'mocha';
import { expect, use } from 'chai';

// Enzyme modules.
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Chai integrations.
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';

// This module.
import BaseComponent from '..';

// Module integrations.
configure({ adapter: new Adapter() });
use(chaiEnzyme());
use(chaiAsPromised);

// Constants.
const AnimalPropTypes = {
	species: PropTypes.string.isRequired,
	isLive: [ PropTypes.bool, true ]
};

describe('BaseComponent', () => {
	it('has to take a definition as an argument', () => {
		expect(() => BaseComponent(AnimalPropTypes)).to.not.throw();
	});

	it('has to take an options in order to use `React.PureComponent`', () => {
		expect(() => BaseComponent(AnimalPropTypes, { isPure: true })).to.not.throw();
	});

	it('has to map both `propTypes` and `defaultProps` as static properties', () => {
		const AnimalComponent = BaseComponent(AnimalPropTypes);

		expect(AnimalComponent).to.haveOwnProperty('propTypes');
		expect(AnimalComponent).to.haveOwnProperty('defaultProps');
	});

	it('has to map static property `propTypes` as correctly', () => {
		const { propTypes } = BaseComponent(AnimalPropTypes); // eslint-disable-line react/forbid-foreign-prop-types

		expect(propTypes)
			.to.haveOwnProperty('species')
			.that.equals(PropTypes.string.isRequired);

		expect(propTypes)
			.to.haveOwnProperty('isLive')
			.that.equals(PropTypes.bool);
	});

	it('has to map static property `defaultProps` as correctly', () => {
		const { defaultProps } = BaseComponent(AnimalPropTypes);

		expect(defaultProps).to.not.haveOwnProperty('species');

		expect(defaultProps)
			.to.haveOwnProperty('isLive')
			.that.equals(true);
	});

	it('has to inherit mapped static properties to a child', () => {
		class Animal extends BaseComponent(AnimalPropTypes) {
			render() {
				const { species, isLive } = this.props;

				return `${isLive ? 'Living' : 'Dead'} ${species}`;
			}
		}

		const wrapper = shallow(<Animal species="Panthera leo" isLive={false} />);

		expect(wrapper).to.have.text('Dead Panthera leo');
	});

	it('has to inherit `updateState` method to a child', async () => {
		class Animal extends BaseComponent(AnimalPropTypes) {
			state = { age: 5 };

			render() {
				const { species, isLive } = this.props;

				return `${isLive ? 'Living' : 'Dead'} ${species}`;
			}
		}

		expect(Animal).to.respondTo('updateState');

		const wrapper = shallow(<Animal species="Panthera tigris" isLive={false} />);

		expect(wrapper).to.have.state('age', 5);

		await expect(wrapper.instance().updateState({ age: 10 })).to.be.eventually.fulfilled;

		expect(wrapper).to.have.state('age', 10);
	});

	it('has to correspond to the static property `subscriptions` of a child into `render` method to the child', () => {
		const SubspeciesContext = React.createContext();
		const GenderContext = React.createContext();

		class Animal extends BaseComponent(AnimalPropTypes) {
			render() {
				const { species, isLive } = this.props;

				return `${isLive ? 'Living' : 'Dead'} ${species}`;
			}
		}

		class Tiger extends BaseComponent() {
			static subscriptions = [ SubspeciesContext, GenderContext ];

			render(subspecies, gender) {
				return (
					<span>
						<Animal species={`Panthera tigris${typeof subspecies === 'string' ? ` ${subspecies}` : ''}`} />
						{typeof gender === 'string' && ` (${gender})`}
					</span>
				);
			}
		}

		let wrapper = render(<Tiger />);

		expect(wrapper).to.have.text('Living Panthera tigris');

		wrapper = render(
			<SubspeciesContext.Provider value="sondaica">
				<GenderContext.Provider value="Male">
					<Tiger />
				</GenderContext.Provider>
			</SubspeciesContext.Provider>
		);

		expect(wrapper).to.have.text('Living Panthera tigris sondaica (Male)');
	});
});
