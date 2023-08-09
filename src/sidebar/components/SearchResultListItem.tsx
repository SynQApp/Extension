import { Flex, token } from '@synq/ui';
import { styled } from 'styled-components';

import { TrackListItem } from '~player-ui/components/TrackListItem';
import { TrackListItemMenu } from '~player-ui/components/TrackListItemMenu';

import { GradientAddButton } from './GradientAddButton';

interface QueueItemProps {
  added?: boolean;
  albumCoverUrl: string;
  artistName: string;
  menuPortalContainer?: HTMLElement | ShadowRoot;
  onAddClick: () => void;
  onPlayNowClick: () => void;
  onPlayNextClick: () => void;
  trackName: string;
}

export const SearchResultListItem = ({
  added,
  albumCoverUrl,
  artistName,
  menuPortalContainer,
  onAddClick,
  onPlayNextClick,
  onPlayNowClick,
  trackName
}: QueueItemProps) => {
  return (
    <TrackListItem
      imageIconOverlay="play"
      imageUrl={albumCoverUrl}
      imageAlt={`Album cover for ${trackName}`}
      primaryText={trackName}
      secondaryText={artistName}
      onClick={onPlayNowClick}
      rightNode={
        <ActionsFlex justify="center" align="center">
          <GradientAddButton added={added} onClick={onAddClick} />
          <TrackListItemMenu
            portalContainer={menuPortalContainer}
            menuItems={[
              {
                icon: 'next',
                text: 'Play Next',
                // TODO: Implement music service click handler
                onClick: onPlayNextClick
              },
              {
                icon: 'play',
                text: 'Play Now',
                // TODO: Implement music service click handler
                onClick: onPlayNowClick
              },
              {
                icon: 'share',
                text: 'Share',
                // TODO: Implement share click handler
                onClick: () => console.info('Share')
              }
            ]}
          />
        </ActionsFlex>
      }
    />
  );
};

const ActionsFlex = styled(Flex)`
  gap: ${token('spacing.3xs')};
`;
