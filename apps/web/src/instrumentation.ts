// instrumentation.ts
import type { Instrumentation } from 'next';

export function register() {
  // No-op for initialization
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPostHogServer } = await import('./lib/posthog');
    const posthog = await getPostHogServer();

    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie || '';
      const postHogCookieMatch = (cookieString as string).match(/ph_phc_.*?_posthog=([^;]+)/);

      if (postHogCookieMatch && postHogCookieMatch[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (e) {
          console.error('Error parsing PostHog cookie:', e);
        }
      }
    }

    await posthog.captureException(err, distinctId || undefined);
  }
};
