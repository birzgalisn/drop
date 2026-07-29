import { FloatyBackground, NotFound } from '@repo/react/design-system';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

/** Dedicated / unmatched 404 surface. */
export function NotFoundPage() {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const handleLeave = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }

    // Replace so a cold-loaded unknown URL isn't sitting behind home.
    void router.navigate({ to: '/', replace: true });
  };

  return (
    <>
      <FloatyBackground />
      <NotFound>
        <NotFound.Stage>
          <NotFound.Strays />
          <NotFound.Mosaic />
        </NotFound.Stage>
        <NotFound.Footer>
          <NotFound.Message />
          <NotFound.Home onHome={handleLeave}>{canGoBack ? 'Go back' : 'Go Home'}</NotFound.Home>
        </NotFound.Footer>
      </NotFound>
    </>
  );
}
