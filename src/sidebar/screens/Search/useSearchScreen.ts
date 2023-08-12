import { useCallback, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useMusicServiceTab } from '~player-ui/contexts/MusicServiceTab';
import { useSidebarRoot } from '~sidebar/contexts/SidebarRoot';
import { useAppDispatch, useAppSelector } from '~store';
import { clearSearchResults } from '~store/slices/search';
import { MusicControllerMessage } from '~types';
import { sendMessage } from '~util/sendMessage';

export const useSearchScreen = () => {
  const [query, setQuery] = useState('');
  const loading = useAppSelector((state) => state.search?.loading);
  const tracks = useAppSelector((state) => state.search?.results);
  const [addedTracks, setAddedTracks] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage(
    'recentSearches',
    [] as string[]
  );
  const { musicServiceTab } = useMusicServiceTab();
  const sidebarRoot = useSidebarRoot();
  const dispatch = useAppDispatch();

  const search = useCallback(async (searchQuery: string) => {
    setShowRecentSearches(false);

    setRecentSearches((prevRecentSearches) => {
      if (prevRecentSearches.includes(searchQuery)) {
        return prevRecentSearches;
      }

      return [searchQuery, ...prevRecentSearches].slice(0, 10);
    });

    sendMessage(
      {
        name: MusicControllerMessage.SEARCH_TRACKS,
        body: {
          query: searchQuery
        }
      },
      musicServiceTab?.tabId
    );
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
    dispatch(clearSearchResults());
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
