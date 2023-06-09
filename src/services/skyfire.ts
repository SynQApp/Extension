// import type { Store } from 'redux';

// import { backgroundFetch } from '~util/backgroundFetch';

// declare let window: Window & {
//   __REDUX_STORES__: (Store & { name: string })[];
//   amznMusic: any;
// };

// const SKYFIRE_STORE_NAME = 'DMWebPlayerSkyfire';

// const MARKETPLACE_TO_LOCALE = {
//   ATVPDKIKX0DER: 'en_US',
//   A1AM78C64UM0Y8: 'es_MX',
//   A2EUQ1WTGCTBG2: 'en_CA',
//   A2Q3Y263D00KWC: 'pt_BR',
//   ART4WZ8MWBX2Y: 'en_US',
//   A1F83G8C2ARO7P: 'en_GB',
//   A1PA6795UKMFR9: 'de_DE',
//   A13V1IB3VIYZZH: 'fr_FR',
//   A1RKKUPIHCS9HS: 'es_ES',
//   APJ6JRA9NG5V4: 'it_IT',
//   A21TJRUUN4KGV: 'en_IN',
//   A3K6Y4MI8GDYMT: 'en_US',
//   A1VC38T7YXB528: 'ja_JP',
//   A39IBJ37TRP1C6: 'en_AU',
//   A15PK738MTQHSO: 'en_US'
// };

// const USER_AGENT =
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

// export const getSkyfireStore = (): Store =>
//   window.__REDUX_STORES__.find((store) => store.name === SKYFIRE_STORE_NAME);

// /**
//  * From Amazon Music source code found in browser dev tools.
//  */
// const convertToAscii = (str: string) => {
//   return str.replace(/[^\x00-\x7F]/g, (c) => unescape(encodeURIComponent(c)));
// };

// /**
//  * From Amazon Music source code found in browser dev tools.
//  */
// const generateRequestId = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// };

// /**
//  * From Amazon Music source code found in browser dev tools.
//  */
// const getSkyfireEndpoint = (): string => {
//   const region = window.amznMusic.appConfig.siteRegion ?? 'na';

//   return `https://${region}.mesk.skill.music.a2z.com`;
// };

// const getDeviceLanguage = (authentication: any): string =>
//   authentication.displayLanguageId ??
//   MARKETPLACE_TO_LOCALE[authentication.marketplaceId] ??
//   'en_US';

// const getSkyfireRequestHeaders = (): string => {
//   const state = getSkyfireStore().getState();
//   const authentication = state.Authentication;

//   const headers = {
//     'x-amzn-affiliate-tags': '',
//     'x-amzn-application-version': `${window.amznMusic.appConfig.version}`,
//     'x-amzn-currency-of-preference': 'USD',
//     'x-amzn-device-family': 'WebPlayer',
//     'x-amzn-device-height': '1080',
//     'x-amzn-device-model': 'WEBPLAYER',
//     'x-amzn-device-width': '1920',
//     'x-amzn-device-id': authentication.deviceId,
//     'x-amzn-user-agent': convertToAscii(window.navigator.userAgent),
//     'x-amzn-session-id': authentication.sessionId,
//     'x-amzn-request-id': `${generateRequestId()}`,
//     'x-amzn-device-language': getDeviceLanguage(authentication),
//     'x-amzn-os-version': '1.0',
//     'x-amzn-device-time-zone': 'America/Los_Angeles',
//     'x-amzn-timestamp': `${Date.now()}`,
//     'x-amzn-music-domain': window.location.hostname,
//     'x-amzn-referer': '',
//     'x-amzn-ref-marker': '',
//     'x-amzn-page-url': 'https://music.amazon.com/',
//     'x-amzn-weblab-id-overrides': '',
//     'x-amzn-video-player-token': JSON.stringify(
//       authentication.videoPlayerToken
//     ),
//     'x-amzn-feature-flags': 'hd-supported'
//   } as any;

//   const authenticationHeader = {} as any;
//   authenticationHeader.interface =
//     'ClientAuthenticationInterface.v1_0.ClientTokenElement';
//   authenticationHeader.accessToken = authentication.accessToken;

//   const authenticationHeaderValue = JSON.stringify(authenticationHeader);

//   headers['x-amzn-authentication'] = authenticationHeaderValue;

//   const csrfHeader = {} as any;
//   csrfHeader.interface = 'CSRFInterface.v1_0.CSRFHeaderElement';
//   csrfHeader.rndNonce = authentication.csrf.rnd;
//   csrfHeader.timestamp = authentication.csrf.ts;
//   csrfHeader.token = authentication.csrf.token;

//   headers['x-amzn-csrf'] = JSON.stringify(csrfHeader);

//   return JSON.stringify(headers);
// };

// export const fetchSkyfire = async (path: string, body: any) => {
//   console.log('fetchSkyfire', path, body);
//   try {
//     const res = await backgroundFetch(`${getSkyfireEndpoint()}${path}`, {
//       headers: {
//         accept: '*/*',
//         'accept-language': 'en-US,en;q=0.9',
//         'content-type': 'text/plain;charset=UTF-8',
//         'sec-ch-ua':
//           '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"macOS"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'cross-site'
//       },
//       body: JSON.stringify({
//         headers: getSkyfireRequestHeaders(),
//         userHash: '{"level":"HD_MEMBER"}',
//         ...body
//       }),
//       method: 'POST',
//       referrer: 'https://music.amazon.com/',
//       referrerPolicy: 'strict-origin-when-cross-origin',
//       credentials: 'omit'
//     });

//     return JSON.parse(res);
//   } catch (e) {
//     console.error(e);
//   }
// };
