import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ListItem, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

export interface RecentSearchListItemProps {
  searchText: string;
  onClick: () => void;
  onRemove: () => void;
}

export const RecentSearchListItem = ({
  searchText,
  onClick,
  onRemove
}: RecentSearchListItemProps) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <RecentSearchListItemContainer
      rightNode={
        <RemoveButton variant="tertiary" onClick={handleRemoveClick}>
          <RemoveIcon icon={faClose} height="18px" className="icon" />
        </RemoveButton>
      }
      onClick={onClick}
    >
      <RecentSearchText type="body" size="md">
        {searchText}
      </RecentSearchText>
    </RecentSearchListItemContainer>
  );
};

const RecentSearchListItemContainer = styled(ListItem)`
  background-color: transparent;
  padding: ${token('spacing.xs')} ${token('spacing.md')};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${token('colors.surface01')};
  }
`;

const RecentSearchText = styled(Text)`
  color: ${token('colors.onBackgroundLow')};
  font-weight: ${token('typography.fontWeights.medium')};
  margin: 0;
`;

const RemoveButton = styled(Button)`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 5px;

  &:hover {
    & > .icon {
      color: ${token('colors.onBackground')};
    }
  }
`;

const RemoveIcon = styled(FontAwesomeIcon)`
  color: ${token('colors.onBackgroundLow')};
`;
