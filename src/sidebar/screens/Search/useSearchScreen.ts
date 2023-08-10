import { useCallback, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useMusicService } from '~player-ui/contexts/MusicService';
import { useSidebarRoot } from '~sidebar/contexts/SidebarRoot';
import { MusicControllerMessage } from '~types';

export const useSearchScreen = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedTracks, setAddedTracks] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage(
    'recentSearches',
    [] as string[]
  );
  const sidebarRoot = useSidebarRoot();
  const { sendMessage } = useMusicService();

  const search = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setShowRecentSearches(false);

    setRecentSearches((prevRecentSearches) => {
      if (prevRecentSearches.includes(searchQuery)) {
        return prevRecentSearches;
      }

      return [searchQuery, ...prevRecentSearches].slice(0, 10);
    });

    const tracks = await sendMessage({
      name: MusicControllerMessage.SEARCH_TRACKS,
      body: {
        query: searchQuery,
        awaitResponse: true
      }
    });

    setLoading(false);
    setTracks(tracks);
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value ?? '');
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      if (query.length === 0) {
        return;
      }

      await search(query);
    } else {
      setShowRecentSearches(true);
    }
  };

  const handleKeyEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  const handleOnFocus = () => {
    setShowRecentSearches(true);
  };

  const handleClearClick = () => {
    setQuery('');
    setTracks([]);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleRecentSearchClick = async (searchQuery: string) => {
    setQuery(searchQuery);
    await search(searchQuery);
  };

  const handleRemoveRecentSearch = (searchQuery: string) => {
    setRecentSearches((prevRecentSearches) => {
      return prevRecentSearches.filter(
        (prevRecentSearch) => prevRecentSearch !== searchQuery
      );
    });
  };

  const handleOnAddClick = async (trackId: string) => {
    // TODO: Implement this function
    setAddedTracks([...addedTracks, trackId]);
  };

  return {
    addedTracks,
    handleClearClick,
    handleClearRecentSearches,
    handleKeyEvent,
    handleKeyUp,
    handleOnAddClick,
    handleOnChange,
    handleOnFocus,
    handleRecentSearchClick,
    handleRemoveRecentSearch,
    loading,
    query,
    recentSearches,
    showRecentSearches,
    sidebarRoot,
    tracks
  };
};
