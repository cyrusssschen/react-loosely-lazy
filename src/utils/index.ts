/* eslint-disable @typescript-eslint/camelcase */
declare const __webpack_require__: (id: string) => any;
declare const __webpack_modules__: { [key: string]: any };

export { default as hash } from './hash';

export const getExport = (m: any) => ('default' in m ? m.default : m);

export const tryRequire = (id: string) => {
  if (
    typeof __webpack_require__ === 'function' &&
    typeof __webpack_modules__ === 'object' &&
    __webpack_modules__[id]
  ) {
    try {
      return getExport(__webpack_require__(id));
      // eslint-disable-next-line no-empty
    } catch {}
  }

  return null;
};

export const displayNameFromId = (id: string) => {
  const fName = id.split('/').slice(-3).join('/');

  return fName || 'Component';
};

/**
 * Checks to see if we are running inside a node environment or not.
 * Covers jsdom environments.
 *
 * @see https://github.com/jsdom/jsdom/issues/1537
 */
export const isNodeEnvironment = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  if (window.name === 'nodejs') {
    return true;
  }

  return false;
};
