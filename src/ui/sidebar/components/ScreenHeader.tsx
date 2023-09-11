import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Stack, Text, token } from '@synq/ui';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from 'styled-components';

interface ScreenHeaderProps {
  children?: React.ReactNode;
}

export const ScreenHeader = ({ children }: ScreenHeaderProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <HeaderStack spacing="sm" justify="flex-start">
      <BackButton onClick={handleBackButtonClick}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          color={theme.colors.onBackground}
          height="22px"
          width="22px"
        />
      </BackButton>
      {children}
    </HeaderStack>
  );
};

const HeaderStack = styled(Stack)`
  height: initial;
  padding: ${token('spacing.sm')};
  width: initial;
`;

const BackButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  outline: none;
`;
