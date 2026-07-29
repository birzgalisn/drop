import type { DrizzleClient } from '../../drizzle';

/**
 * Args for {@link UseCase.execute}.
 * - No input: optional positional `db` (usually a transaction).
 * - With input: `(input, db?)` — bare `db` is intentional (not an options bag).
 */
export type UseCaseExecuteArgs<Input> = [Input] extends [void]
  ? [db?: DrizzleClient]
  : [input: Input, db?: DrizzleClient];

export interface UseCase<Input = void, Output = void> {
  execute(...args: UseCaseExecuteArgs<Input>): Output | Promise<Output>;
}
