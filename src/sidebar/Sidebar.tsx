import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, token } from '@synq/ui';
import SynQIcon from 'data-base64:~assets/images/icon-filled.svg';
import { useState } from 'react';
import { css, styled, useTheme } from 'styled-components';

import { sendToBackground } from '@plasmohq/messaging';

import { useAppSelector } from '~store';
import { UiStateMessage } from '~types';
import { TabsMessage } from '~types/TabsMessage';
import { sendMessage } from '~util/sendMessage';

import SidebarRoutes from './Routes';

export const Sidebar = () => {
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const sessionDetails = useAppSelector((state) => state.session);

  const handleToggleButtonClick = async () => {
    const newShow = !show;

    setShow(newShow);

    sendMessage({
      name: newShow
        ? UiStateMessage.SIDEBAR_OPENED
        : UiStateMessage.SIDEBAR_CLOSED
    });

    // TODO: Remove this as it is only needed for testing purposes
    const tab = await sendToBackground({
      name: 'GET_SELF_TAB'
    });

    sendMessage({
      name: TabsMessage.SET_SELECTED_TAB,
      body: tab.id
    });
  };

  return (
    <>
      {sessionDetails && (
        <SidebarContainer $show={show}>
          <SidebarRoutes />
          <ToggleButton onClick={handleToggleButtonClick} $show={show}>
            <ToggleButtonContent $show={show}>
              {show ? (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  color={theme.colors.onBackgroundMedium}
                  height="18px"
                />
              ) : (
                <ToggleButtonImage src={SynQIcon} alt="SynQ Icon" />
              )}
            </ToggleButtonContent>
          </ToggleButton>
        </SidebarContainer>
      )}
    </>
  );
};

export default Sidebar;

interface Showable {
  $show: boolean;
}

const SidebarContainer = styled.div<Showable>`
  background: ${token('colors.background')};
  box-shadow: none;
  height: 100vh;
  position: fixed;
  right: -350px;
  top: 0;
  transition: right 0.2s ease-in-out;
  width: 350px;

  ${({ $show }) =>
    $show &&
    css`
      right: 0;
      box-shadow: 0 0 12px 0 black;
    `}

  * {
    // YouTube Music uses anti-aliasing that messes with our font rendering. This resets it for the full sidebar.
    -webkit-font-smoothing: initial;
  }
`;

const ToggleButton = styled.button<Showable>`
  background: linear-gradient(
    to bottom,
    ${token('colors.base.orange.4')} 0%,
    ${token('colors.base.pink.4')} 100%
  );
  border-bottom-left-radius: calc(${token('radii.md')});
  border-top-left-radius: calc(${token('radii.md')});
  border: none;
  box-shadow: none;
  cursor: pointer;
  height: 80px;
  left: -35px;
  outline: none;
  position: absolute;
  top: 120px;
  width: 35px;
  z-index: 999;

  ${({ $show }) =>
    $show &&
    css`
      background: ${token('colors.surface')};
      box-shadow: 0 0 12px 0 black;
      left: -30px;
      width: 30px;
    `}
`;

const ToggleButtonContent = styled.div<Showable>`
  align-items: center;
  background: ${token('colors.surface')};
  border-bottom-left-radius: calc(${token('radii.md')} - 1px);
  border-top-left-radius: calc(${token('radii.md')} - 1px);
  display: flex;
  height: 76px;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 2px;
  width: 33px;

  ${({ $show }) =>
    $show &&
    css`
      background: transparent;
      width: 28px;
    `}
`;

const ToggleButtonImage = styled(Image)`
  height: 25px;
  width: 25px;
`;
