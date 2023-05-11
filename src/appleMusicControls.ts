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
    if(trackProgress <= maxLength){
        playbackProgressInput.value = trackProgress.toString();
        playbackProgressInput.dispatchEvent(new Event('change'));
    }
}

const setVolume = (volume: number) => {
    const musicPlayerRoot = document.querySelector('amp-chrome-player').shadowRoot;
    const volumeControlInputRoot = musicPlayerRoot.querySelector('amp-volume-control').shadowRoot;
    const volumeControlInput = volumeControlInputRoot.querySelector('input') as HTMLInputElement;
    const maxVolume = Number.parseInt(volumeControlInput.max);
    if(volume <= maxVolume){
        volumeControlInput.value = volume.toString();
        volumeControlInput.dispatchEvent(new Event('change'));
    }
}

const queueSong = (albumId:number, songId: number ) => {
    const url = new URL(`https://music.apple.com/us/album/album/${albumId}?i=${songId}`);
    history.pushState({}, "", url);
    history.back();
}


const playnextSong = () => {
    history.forward();
    const selectedSongContainer = document.querySelector('.songs-list-row--selected');
    const playButton = selectedSongContainer.querySelector('.play-button') as HTMLButtonElement;
    playButton.click();
}
