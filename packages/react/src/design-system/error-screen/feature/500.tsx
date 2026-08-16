import { ErrorScreen, type ErrorScreenProps } from '../ui/error-screen';

export type InternalErrorProps = Partial<Omit<ErrorScreenProps, 'code'>>;

export function InternalError({
  href,
  action = 'Go home',
  message = "We couldn't load this page",
  onAction,
}: InternalErrorProps) {
  return (
    <ErrorScreen code={500} href={href} message={message} action={action} onAction={onAction} />
  );
}
