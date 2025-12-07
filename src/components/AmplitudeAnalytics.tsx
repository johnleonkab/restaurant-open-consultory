'use client';

import Script from 'next/script';

export function AmplitudeAnalytics() {
  return (
    <Script 
        src="https://cdn.eu.amplitude.com/script/ab4d3ac8156273dc3bd00227b635d92.js" 
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-ignore
        if (window.amplitude && window.sessionReplay) {
          // @ts-ignore
          window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
          // @ts-ignore
          window.amplitude.init('ab4d3ac8156273dc3bd00227b635d92', {
            "fetchRemoteConfig": true,
            "serverZone": "EU",
            "autocapture": {
              "attribution": true,
              "fileDownloads": true,
              "formInteractions": true,
              "pageViews": true,
              "sessions": true,
              "elementInteractions": true,
              "networkTracking": true,
              "webVitals": true,
              "frustrationInteractions": true
            }
          });
        }
      }}
    />
  );
}
