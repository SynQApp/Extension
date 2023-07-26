import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, token } from '@synq/ui';
import styled, { css } from 'styled-components';

import { AlbumArt } from '~popup/components/AlbumArt';
import { PlayerControls } from '~popup/components/PlayerControls';
import type { Expandable } from '~popup/types';
import { expandedStyle } from '~popup/util/expandedStyle';

import useControllerScreen from './useControllerScreen';

const EXAMPLE_IMG =
  'https://lh3.googleusercontent.com/cYEaqMFK85Z64kIe_0eB5nh-rvMH7FFdkKc0P9-9kvm0zHMqnawY7bK8cwlG8ffJiTd_RrEtmlFpDPsv=w544-h544-l90-rj';

const ControllerScreen = () => {
  const { currentSongInfo, expanded, setExpanded } = useControllerScreen();

  const handleExpandButtonClick = () => {
    setExpanded(!expanded);
  };

  return (
    <PlayerSection>
      <div>
        <Flex
          direction={expanded ? 'column' : 'row'}
          justify={expanded ? 'flex-start' : 'space-between'}
          align="center"
        >
          <AlbumArtContainer $expanded={expanded}>
            <AlbumArt src={currentSongInfo?.albumCoverUrl} />
          </AlbumArtContainer>
          <PlayerControlsContainer $expanded={expanded}>
            <PlayerControls />
          </PlayerControlsContainer>
        </Flex>
      </div>
      <ExpandButton onClick={handleExpandButtonClick}>
        <ExpandIcon
          icon={expanded ? faChevronUp : faChevronDown}
          $expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        />
      </ExpandButton>
    </PlayerSection>
  );
};

const PlayerSection = styled.section`
  background: ${token('colors.background')};
  padding: ${token('spacing.xs')} ${token('spacing.md')} 0;
  height: 100%;
`;

const AlbumArtContainer = styled.div<Expandable>`
  height: 105px;
  max-height: 105px;
  max-width: 105px;
  min-height: 105px;
  min-width: 105px;
  width: 105px;

  ${expandedStyle(
    css`
      height: 170px;
      max-height: initial;
      max-width: initial;
      min-height: initial;
      min-width: initial;
      width: 170px;
    `
  )}

  margin: 0 auto;
`;

const PlayerControlsContainer = styled.div<Expandable>`
  margin-left: ${token('spacing.sm')};
  margin-top: ${token('spacing.none')};
  width: calc(100% - 105px - ${token('spacing.sm')});

  ${expandedStyle(
    css`
      margin-left: ${token('spacing.none')};
      margin-top: ${token('spacing.md')};
      width: 100%;
    `
  )}
`;

const ExpandButton = styled.button`
  background: ${token('colors.surface')};
  border-top-left-radius: ${token('radii.md')};
  border-top-right-radius: ${token('radii.md')};
  border: none;
  bottom: 0;
  cursor: pointer;
  height: 20px;
  left: calc(50% - 25px);
  outline: none;
  position: absolute;
  width: 50px;
`;

const ExpandIcon = styled(FontAwesomeIcon)<Expandable>`
  color: ${token('colors.onBackground')};
  margin-top: ${token('spacing.2xs')};
`;

export default ControllerScreen;
