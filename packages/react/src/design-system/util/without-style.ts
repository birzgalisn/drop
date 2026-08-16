export type WithoutStyle<T> = Omit<T, 'className' | 'classNames' | 'style' | 'styles'>;
