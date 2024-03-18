import { AmazonAdapter } from './amazon-music/AmazonAdapter';
import { AppleAdapter } from './apple-music/AppleAdapter';
import { SpotifyAdapter } from './spotify/SpotifyAdapter';
import { YouTubeMusicAdapter } from './youtube-music/YouTubeMusicAdapter';
import { YouTubeAdapter } from './youtube/YouTubeAdapter';

// Ordered by popularity
export default [
  SpotifyAdapter,
  AppleAdapter,
  YouTubeAdapter,
  YouTubeMusicAdapter,
  AmazonAdapter
];
