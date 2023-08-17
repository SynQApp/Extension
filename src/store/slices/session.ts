import { createSlice } from '@reduxjs/toolkit';

import { MusicService, RepeatMode, type Session } from '~types';

const mockActiveSession: Session = {
  hostId: '',
  locked: false,
  repeatMode: RepeatMode.NO_REPEAT,
  listeners: [
    {
      avatarUrl:
        'https://www.billboard.com/wp-content/uploads/media/DMB-1995-billboard-1240.jpg?w=1024',
      id: '1',
      musicService: MusicService.YOUTUBE_MUSIC,
      name: 'Mitchell',
      trackCount: 5
    },
    {
      avatarUrl:
        'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg',
      id: '2',
      musicService: MusicService.AMAZON_MUSIC,
      name: 'Steven',
      trackCount: 13
    },
    {
      avatarUrl:
        'https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png',
      id: '3',
      musicService: MusicService.APPLE_MUSIC,
      name: 'Rachael',
      trackCount: 1
    },
    {
      avatarUrl:
        'https://media.pitchfork.com/photos/608839f84c67840074db8afb/1:1/w_3000,h_3000,c_limit/Billie-Eilish-Happier-Than-Ever.jpeg',
      id: '4',
      musicService: MusicService.SPOTIFY,
      name: 'Aren',
      trackCount: 4
    }
  ],
  tabId: 0,
  queue: [
    {
      id: '1',
      isPlaying: true,
      addedBy: 'Mitchell',
      musicService: MusicService.YOUTUBE_MUSIC,
      track: {
        id: '1',
        name: 'Crash Into Me',
        artistName: 'Dave Matthews Band',
        albumName: 'Crash',
        albumCoverUrl:
          'https://www.billboard.com/wp-content/uploads/media/DMB-1995-billboard-1240.jpg?w=1024',
        duration: 203
      }
    },
    {
      id: '2',
      isPlaying: false,
      addedBy: 'Rachael',
      musicService: MusicService.YOUTUBE_MUSIC,
      track: {
        id: '2',
        name: '22',
        artistName: 'Taylor Swift',
        albumName: 'Red',
        albumCoverUrl:
          'https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png',
        duration: 198
      }
    }
  ]
};

const initialState: Session | null = mockActiveSession;

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setSession: (_, action) => action.payload,
    clearSession: () => null
  }
});

export const { setSession, clearSession } = sessionSlice.actions;

export default sessionSlice.reducer;
