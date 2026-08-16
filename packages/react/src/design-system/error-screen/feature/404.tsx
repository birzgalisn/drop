import { ErrorScreen, type ErrorScreenProps } from '../ui/error-screen';

export type NotFoundProps = Partial<Omit<ErrorScreenProps, 'code'>>;

export function NotFound({
  href,
  action = 'Go home',
  message = "We couldn't find this page",
  onAction,
}: NotFoundProps) {
  return (
    <ErrorScreen code={404} href={href} message={message} action={action} onAction={onAction} />
  );
}
