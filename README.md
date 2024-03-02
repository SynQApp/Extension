This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## Remaining Work Before Open-Sourcing

- [x] Implement each of the four starting services with browser-only logic.
- [x] Centralize browser-based matching logic like it's done in TranslationService.
- [x] Refactor into modular service classes. This includes merging Playback and Link controllers into one class or configuration, removing each of the content script entries - instead create on content script for all music services with \* matching and dynamically set each one up based on configurations.
- [x] Clean up observer pattern as it's too coupled.
- [x] Create messaging utils that abstract the
- [x] Add SDK-like functions for controlling the mini player from observers and elsewhere.
- [x] Move all background message handlers into the background/messages directory
- [x] Re-enable notifications using abstracted methods provided by core rather than subscribing to the observers.
- [x] Try consolidating the adapter content scripts
- [x] Create better separations in contexts.
- [x] Reorganize types to where they belong.
- [x] Consolidate the autoplay/interaction requirement - if the user opens the popup, check if they have clicked on the page at all. Don't require each service to implement this logic.
- [x] Use adapter configurations throughout application.
- [ ] Update Spotify and Amazon Music observers to properly show current track state in music player. If nothing has been played yet, then it should show nothing playing in the mini player.
