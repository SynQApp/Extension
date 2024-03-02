import { v4 as uuid } from 'uuid';

import { sendToBackground } from '~core/messaging';

import { debounce as debounceFn } from './debounce';

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

const SESSION_EXPIRATION_IN_MIN = 30;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

async function getOrCreateSessionId() {
  // Store session in memory storage
  let sessionTimestamp = (await chrome.storage.local.get('sessionTimestamp'))
    .sessionTimestamp;

  // Check if session exists and is still valid
  const currentTimeInMs = Date.now();
  if (sessionTimestamp) {
    // Calculate how long ago the session was last updated
    const durationInMin = (currentTimeInMs - sessionTimestamp) / 60000;
    // Check if last update lays past the session expiration threshold
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      // Delete old session id to start a new session
      sessionTimestamp = null;
    } else {
      // Update timestamp to keep session alive
      sessionTimestamp = currentTimeInMs;
      await chrome.storage.local.set({ sessionData: sessionTimestamp });
    }
  }

  if (!sessionTimestamp) {
    // Create and store a new session
    sessionTimestamp = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs.toString()
    };
    await chrome.storage.local.set({ sessionData: sessionTimestamp });
  }
  return sessionTimestamp.session_id;
}

const getOrCreateClientId = async () => {
  let clientId = (await chrome.storage.local.get('clientId')).clientId;
  if (!clientId) {
    // Generate a unique client ID, the actual value is not relevant
    clientId = uuid();
    await chrome.storage.local.set({ clientId });
  }
  return clientId;
};

export interface Event {
  name: string;
  params?: any;
}

export const sendEvent = async (event: Event) => {
  await sendEvents([event]);
};

export const sendEvents = async (events: Event[]) => {
  const clientId = await getOrCreateClientId();
  const sessionId = await getOrCreateSessionId();

  events.forEach((event) => {
    if (!event.params) {
      event.params = {};
    }

    event.params.session_id = sessionId;
    event.params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_IN_MSEC;
  });

  const queryParams = new URLSearchParams({
    measurement_id: process.env.PLASMO_PUBLIC_GA_MEASUREMENT_ID!,
    api_secret: process.env.PLASMO_PUBLIC_GA_SECRET!
  });

  fetch(`${GA_ENDPOINT}?${queryParams.toString()}`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      events
    })
  });
};

const sendEventWithBackground = (event: Event) => {
  sendToBackground({
    name: 'SEND_ANALYTICS_EVENT',
    body: {
      name: event.name,
      params: event.params
    }
  });
};

export const sendAnalytic = (event: Event, debounce?: number) => {
  if (debounce) {
    debounceFn(
      () => {
        sendEventWithBackground(event);
      },
      event.name,
      debounce
    );
  } else {
    sendEventWithBackground(event);
  }
};
