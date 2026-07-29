const SHARE_VIEWER_PIN_PREFIX = 'drop:share-viewer-pin:';

/** Author/manage handoff: PIN for `/s/$token` when the hash is missing (SPA nav). */
export function stashShareViewerPin(options: { token: string; pin: string }): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(`${SHARE_VIEWER_PIN_PREFIX}${options.token}`, options.pin);
}

export function getShareViewerPin(token: string): string {
  if (typeof localStorage === 'undefined') {
    return '';
  }

  return localStorage.getItem(`${SHARE_VIEWER_PIN_PREFIX}${token}`) ?? '';
}

export function clearShareViewerPin(token: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(`${SHARE_VIEWER_PIN_PREFIX}${token}`);
}
