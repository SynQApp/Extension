
<p align="center">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/SynQApp/Extension/blob/main/assets/icon.png?raw=true">
  <img src="https://github.com/SynQApp/Extension/blob/main/assets/icon.png?raw=true" width="130" alt="Logo for SynQ">
</picture>
</p>

<h1 align="center">
  SynQ Browser Extension
</h1>

<p align="center">
  Your music companion for the web.
</p>

<p align="center">
  SynQ provides a mini player and link translations between all of our supported music services, including Spotify, Apple Music, YouTube Music, and Amazon Music!
</p>

<div align="center">

[![PRs-Welcome][contribute-image]][contribute-url]
[![Download][download-image]][download-url]

</div>

## Table of contents

- <a href="#about">About</a>
- <a href="#getting-started">Getting Started</a>
- <a href="#bugs">Bugs and Requests</a>
- <a href="#contributors">Contributors</a>

<h2 id="about">About</h2>

SynQ is a browser extension for Google Chrome and Microsoft Edge that aims to make your music listening experience on the web better. The features of SynQ include:

🎵 **Multi-Platform Integration**: SynQ supports Apple Music, Amazon Music, and YouTube Music, with more to come!

🔗 **Cross-Platform Link Redirects**: When you receive a link to a track, album, or artist on a music service that's not your preferred one, SynQ ensures you can quickly redirect to your favorite service without missing a beat.

⚙️ **Comprehensive Controls**: Easily control your music with a full set of playback options including play/pause, next, previous, volume adjustment, repeat options, and like/dislike buttons – all conveniently accessible in a compact mini player.

🔄 **Queue Playback**: View your upcoming tracks and play anything currently in your queue without having to go to your music service UI.

🔊 **Floating Mode**: Take your music anywhere on the web with the floating/always-on-top mode. Enjoy the freedom to keep your mini player on top of other windows for an uninterrupted music journey.

🎉 **Notifications**: Stay in the know! SynQ notifies you instantly when the song changes, ensuring you're always aware of the music playing in the background.

⌨️ **Key Controls**: Effortlessly control your music with added keyboard shortcuts integrated directly into the mini player.

### [Install SynQ Here](https://www.synqapp.io)

<h2 id="getting-started">Getting Started</h2>

*Note: This section is **ONLY** for anyone interested in playing around with the code on their machines. If you just want to download SynQ, please do so [here](https://www.synqapp.io).*

**Step 1: Clone Repository**
```
git clone https://github.com/SynQApp/Extension.git
```
**Step 2: Install Dependencies**
```
pnpm i
```
*Note that the extension framework we use, Plasmo, specifically expects you to use pnpm. We cannot guarantee that npm, yarn, bun, or any other package manager will work properly.*

**Step 3: Build**
*Chrome*
```
pnpm build
```
*Edge*
```
pnpm build --target=edge-mv3
```
*See more on building at [Plasmo's docs](https://docs.plasmo.com/framework/workflows/build)*

**Step 4: Add to Chrome/Edge**
1. Go to `chrome://extensions` or `edge://extensions/`
2. Enable Developer Mode (top right for Chrome, left sidebar for Edge)
3. Select "Load Unpacked"
4. Navigate to `/build` and select either the `chrome-mv3-prod` or `edge-mv3-prod` folder

<h2 id="bugs">Bugs and Requests</h2>

Find a bug? Think of an awesome new feature? Your music service isn't supported yet? Please submit an issue here:

[Submit an Issue](https://github.com/SynQApp/Extension/issues)

<h2 id="contributors">Contributors</h2>

We ❤️ contributors! Feel free to contribute to this project but **please read the [Contributing Guidelines](CONTRIBUTING.md) before opening an issue or PR** so you understand the branching strategy and local development environment.

<a href="https://github.com/SynQApp/Extension/graphs/contributors">
  <p align="center">
    <img width="160" src="https://contrib.rocks/image?repo=SynQApp/Extension" alt="A table of avatars from the project's contributors" />
  </p>
</a>

<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

[download-image]: https://img.shields.io/badge/download-40k_users-blue
[download-url]: https://www.synqapp.io/
[contribute-url]: https://github.com/SynQApp/Extension/blob/main/CONTRIBUTING.md
[contribute-image]: https://img.shields.io/badge/PRs-welcome-blue.svg
