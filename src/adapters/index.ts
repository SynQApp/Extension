import { AmazonAdapter } from './amazon-music/AmazonAdapter';
import { AppleAdapter } from './apple-music/AppleAdapter';
import { SpotifyAdapter } from './spotify/SpotifyAdapter';
import { YouTubeMusicAdapter } from './youtube-music/YouTubeMusicAdapter';

// Ordered by popularity
export default [
  SpotifyAdapter,
  AppleAdapter,
  YouTubeMusicAdapter,
  AmazonAdapter
];
