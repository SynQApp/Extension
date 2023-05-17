const playSong = () => {
    const musicPlayerRoot = document.querySelector('amp-chrome-player').shadowRoot;
    const appleMusicControlRoot = musicPlayerRoot.querySelector('apple-music-playback-controls').shadowRoot;
    const playButton = appleMusicControlRoot.querySelector('.playback-play__play') as HTMLButtonElement;
    playButton.click();
}

const stopSong = () => {
    const musicPlayerRoot = document.querySelector('amp-chrome-player').shadowRoot;
    const appleMusicControlRoot = musicPlayerRoot.querySelector('apple-music-playback-controls').shadowRoot;
    const playButton = appleMusicControlRoot.querySelector('.playback-play__pause') as HTMLButtonElement;
    playButton.click();
}

const previousSong = () => {
    const musicPlayerRoot = document.querySelector('amp-chrome-player').shadowRoot;
    const appleMusicControlRoot = musicPlayerRoot.querySelector('apple-music-playback-controls').shadowRoot;
    const previousButtonRoot = appleMusicControlRoot.querySelector('.previous').shadowRoot;
    const previousButton = previousButtonRoot.querySelector('.button--previous') as HTMLButtonElement;
    previousButton.click();
}

const nextSong = () => {
    const musicPlayerRoot = document.querySelector('amp-chrome-player').shadowRoot;
    const appleMusicControlRoot = musicPlayerRoot.querySelector('apple-music-playback-controls').shadowRoot;
    const previousButtonRoot = appleMusicControlRoot.querySelector('.next').shadowRoot;
    const previousButton = previousButtonRoot.querySelector('.button--next') as HTMLButtonElement;
    previousButton.click();
}

const setTrackProgress = (trackProgress: number) => {
    const lcdRoot = document.querySelector('amp-lcd').shadowRoot;
    const playbackProgressInput = lcdRoot.querySelector('#playback-progress') as HTMLInputElement;
    const maxLength = Number.parseInt(playbackProgressInput.max);
    if (trackProgress <= maxLength) {
        playbackProgressInput.value = trackProgress.toString();
        playbackProgressInput.dispatchEvent(new Event('change'));
    }
}

const setVolume = (volume: number) => {
    const musicPlayerRoot = document.querySelector('amp-chrome-player').shadowRoot;
    const volumeControlInputRoot = musicPlayerRoot.querySelector('amp-volume-control').shadowRoot;
    const volumeControlInput = volumeControlInputRoot.querySelector('input') as HTMLInputElement;
    const maxVolume = Number.parseInt(volumeControlInput.max);
    if (volume <= maxVolume) {
        volumeControlInput.value = volume.toString();
        volumeControlInput.dispatchEvent(new Event('change'));
    }
}

const docReady = (fn: any) => {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

const selectedSongContainerObserver = new MutationObserver(() => {
    const selectedSongContainer = document.querySelector('.songs-list-row--selected');
    if (selectedSongContainer) {
        const playButton = selectedSongContainer.querySelector('.play-button') as HTMLButtonElement;
        playButton.click();
        selectedSongContainerObserver.disconnect();
        history.back();
    }
});

const playNextSong = (albumId: number, songId: number) => {
    const url = new URL(`https://music.apple.com/us/album/album/${albumId}?i=${songId}`);
    history.pushState({}, "", url);
    window.dispatchEvent(
        new PopStateEvent("popstate", {
          state: history.state
        }
    ));
    docReady(() => {
        selectedSongContainerObserver.observe(document.body, {
            childList: true,
            subtree: true
        })
    });
}
