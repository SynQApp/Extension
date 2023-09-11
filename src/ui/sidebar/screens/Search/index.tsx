import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Flex, List, TextField, token } from '@synq/ui';
import { styled } from 'styled-components';

import Layout from '~ui/sidebar/Layout';
import { EmptyText } from '~ui/sidebar/components/EmptyText';
import { RecentSearchListItem } from '~ui/sidebar/components/RecentSearchListItem';
import { ScreenHeader } from '~ui/sidebar/components/ScreenHeader';
import { SearchResultListItem } from '~ui/sidebar/components/SearchResultListItem';
import { Spinner } from '~ui/sidebar/components/Spinner';

import { SearchScreenTemplate } from './SearchScreenTemplate';
import { useSearchScreen } from './useSearchScreen';

export const SearchScreen = () => {
  const {
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
  } = useSearchScreen();

  return (
    <Layout
      header={
        <ScreenHeader>
          <TextFieldStyled
            placeholder="Search"
            size="small"
            onChange={handleOnChange}
            value={query}
            startAdornment={<TextFieldAdornmentStyled icon={faSearch} />}
            endAdornment={
              query !== '' && (
                <TextFieldAdornmentStyled
                  icon={faClose}
                  onClick={handleClearClick}
                />
              )
            }
            onKeyDown={handleKeyEvent}
            onKeyUp={handleKeyUp}
            onKeyPress={handleKeyEvent}
            onFocus={handleOnFocus}
          />
        </ScreenHeader>
      }
    >
      {showRecentSearches ? (
        <SearchScreenTemplate
          title="Recent Searches"
          subtitle="Clear All"
          onSubtitleClick={handleClearRecentSearches}
        >
          <ListStyled>
            {recentSearches.map((recentSearch, index) => (
              <RecentSearchListItem
                searchText={recentSearch}
                onClick={() => handleRecentSearchClick(recentSearch)}
                onRemove={() => handleRemoveRecentSearch(recentSearch)}
                key={index}
              />
            ))}
          </ListStyled>
        </SearchScreenTemplate>
      ) : (
        <SearchScreenTemplate
          title="Search"
          subtitle={`Results (${tracks.length})`}
        >
          {loading ? (
            <SpinnerFlex justify="center">
              <Spinner />
            </SpinnerFlex>
          ) : tracks.length === 0 ? (
            <>
              <br />
              <EmptyText size="sm" type="body">
                {query === ''
                  ? 'What are you in the mood for?'
                  : 'You have peculiar taste! Maybe try searching for something else?'}
              </EmptyText>
            </>
          ) : (
            <ListStyled>
              {tracks.map((track, index) => (
                <SearchResultListItem
                  added={addedTracks.includes(track?.id)}
                  albumCoverUrl={track?.albumCoverUrl}
                  artistName={track?.artistName}
                  key={index}
                  menuPortalContainer={sidebarRoot}
                  onAddClick={() => handleOnAddClick(track?.id)}
                  // TODO: Implement play now handler
                  onPlayNowClick={() => console.info('Play now')}
                  // TODO: Implement play next handler
                  onPlayNextClick={() => console.info('Play next')}
                  trackName={track?.name}
                />
              ))}
            </ListStyled>
          )}
        </SearchScreenTemplate>
      )}
    </Layout>
  );
};

export default SearchScreen;

const TextFieldStyled = styled(TextField)`
  flex: 1;
  margin-right: ${token('spacing.xs')};
`;

const TextFieldAdornmentStyled = styled(TextField.Adornment)`
  & > svg {
    height: 16px;
  }
`;

const SpinnerFlex = styled(Flex)`
  height: calc(100% - 200px);
  margin-top: ${token('spacing.2xl')};
`;

const ListStyled = styled(List)`
  background: none;
`;
