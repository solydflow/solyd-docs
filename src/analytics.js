import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export function onRouteDidUpdate({ location, previousLocation }) {
  // Only run this in the browser (not during server-side static rendering)
  if (ExecutionEnvironment.canUseDOM) {
    
    // Don't log if they just clicked an anchor link on the same page (e.g. #setup)
    if (location.pathname !== previousLocation?.pathname) {
      try {
        fetch('https://api.solydflow.com/api/v1/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Prefix the path with the domain so we know it's the docs!
            path: window.location.hostname + location.pathname,
            referrer: document.referrer || 'direct'
          })
        });
      } catch (e) {
        // Fail silently so we don't break the docs
      }
    }
  }
}