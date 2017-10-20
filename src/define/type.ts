import { EnterElement, Selection, ValueFn } from 'd3-selection';

export type MultiParameter<T> = T | T[] | any;

export type Weight = 'lighter' | 'normal' | 'bold' | 'bolder' | 'inherit' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ScaleType = 'linear' | 'logarithmic' | 'band' | 'power' | 'pow' | 'time' | 'quantize' | 'quantile' | 'threshold' | 'ordinal' | 'point' | 'continuousNumeric';

export type MySelection = Selection<Element | EnterElement | Document | Window, {}, Element | EnterElement | Document | Window, {}>;
