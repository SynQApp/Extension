import { Button, Flex, Scrollable, Text, token } from '@synq/ui';
import styled, { css } from 'styled-components';

interface SearchScreenTemplateProps {
  title: string;
  subtitle?: string;
  onSubtitleClick?: () => void;
  children: React.ReactNode;
}

export const SearchScreenTemplate = ({
  title,
  subtitle,
  onSubtitleClick,
  children
}: SearchScreenTemplateProps) => {
  return (
    <Scrollable height="calc(100% - 30px)">
      <HeaderFlex justify="space-between" align="center">
        <Title type="display" size="lg">
          {title}
        </Title>
        {subtitle &&
          (onSubtitleClick ? (
            <SubtitleButton onMouseDown={onSubtitleClick} variant="tertiary">
              <Subtitle type="body" size="sm" gradient>
                {subtitle}
              </Subtitle>
            </SubtitleButton>
          ) : (
            <Subtitle type="body" size="sm">
              {subtitle}
            </Subtitle>
          ))}
      </HeaderFlex>
      {children}
    </Scrollable>
  );
};

const HeaderFlex = styled(Flex)`
  height: unset;
  width: unset;
  margin: ${token('spacing.xs')} ${token('spacing.md')};
  border-bottom: 1px solid ${token('colors.onBackgroundLow')}50;
  padding-bottom: ${token('spacing.sm')};
`;

const Title = styled(Text)`
  font-weight: ${token('typography.fontWeights.semibold')};
  margin: 0;
`;

const SubtitleButton = styled(Button)`
  padding: 0;
`;

interface SubtitleProps {
  $highlighted?: boolean;
}

const Subtitle = styled(Text)<SubtitleProps>`
  color: ${token('colors.onBackgroundLow')};
  font-weight: ${token('typography.fontWeights.semibold')};
  margin: 0;
`;
