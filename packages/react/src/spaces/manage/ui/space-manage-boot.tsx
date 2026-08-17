import { GraphqlErrors } from '../../../common/util/graphql-errors.util';
import { ErrorScreen } from '../../../design-system/error-screen/ui/error-screen';

export function SpaceManageBootError({ error, onHome }: { error?: Error; onHome: () => void }) {
  const code = error ? (GraphqlErrors.httpStatus(error) ?? 500) : 404;
  const message = error
    ? GraphqlErrors.message(error)
    : 'Space not found or you are not the author.';

  return <ErrorScreen code={code} message={message} action="Go home" onAction={onHome} />;
}
