// React modules.
import { Context, Component, ComponentClass } from 'react';
import { Requireable, Validator } from 'prop-types';

// Third-party modules.
import Promise from 'bluebird';

/**
 * Make a component that has the pre-defined shared extension and interoperability of both `prop-types` and TypeScript.
 */
export default function BaseComponent<S = {}, D = {}>(
	definition?: D,
	options?: BaseComponentOptions
): P extends never ? never : BaseComponentClass<InferDefinition<D>, S>;

// The core component.
abstract class Core<P, S> extends Component<P, S> {
	static subscriptions?: Context<infer C>[];

	updateState(changes: Partial<S> | ((state: Readonly<S>, props: Readonly<P>) => Partial<S>)): Promise<void>;
}

// Type definitions.
type BaseComponentClass<P, S> = CoreConstructor<P, S> & ComponentClass<P, S>;
type BaseComponentOptions = { isPure?: boolean };
type CoreConstructor<P, S> = { new (props: P, context?: any): Core<P, S> };

type InferDefinition<D> = D extends { [K in keyof D]: Validator<infer T> | (infer T | Requireable<infer T>)[] }
	? { [K in keyof D]: InferProperty<D[K]> }
	: never;

type InferProperty
<Target,
InferredAndInitialized = InferInitalizedProperty<Target>,
InferredAndRequired = InferRequiredProperty<Target>
> = InferredAndRequired extends never ? InferredAndInitialized : InferredAndRequired;

type Unpack<T> = T extends (infer U)[] ? U : T;
type InferRequiredProperty<T, U = Unpack<T>> = U extends Validator<infer V> ? V : never;
type InferInitalizedProperty<T, U = Unpack<T>> = U extends (infer V | Requireable<infer V>) ? V : never;
