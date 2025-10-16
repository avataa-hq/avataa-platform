import { useEffect } from 'react';
import { useConfig } from '6_shared/models';

declare global {
  interface Window {
    _paq: any[];
  }
}

/**
 * This hook initializes Matomo tracking. To be used only once in the application (on the application's start).
 */
export const useMatomo = () => {
  const { config } = useConfig();

  useEffect(() => {
    if (!config._matomoBaseUrl && !config._matomoSiteId) {
      console.warn('Matomo base url and site id are not set, skipping Matomo initialization');
      return;
    }

    if (!config._matomoBaseUrl) {
      console.warn('Matomo base url is not set, skipping Matomo initialization');
      return;
    }

    if (!config._matomoSiteId) {
      console.warn('Matomo site id is not set, skipping Matomo initialization');
      return;
    }

    window._paq = window._paq || [];
    const { _paq } = window;
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function initializeMatomo() {
      const u = `//${config._matomoBaseUrl}/`;
      _paq.push(['setTrackerUrl', `${u}matomo.php`]);
      _paq.push(['setSiteId', config._matomoSiteId]);
      const d = document;
      const g = d.createElement('script');
      const s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = `${u}matomo.js`;
      s.parentNode?.insertBefore(g, s);
    })();
  }, []);
};
