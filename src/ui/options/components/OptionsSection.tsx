import { Text, token } from '@synqapp/ui';
import { styled } from 'styled-components';

interface OptionsSectionProps {
  children: React.ReactNode;
  title: string;
}

export const OptionsSection = ({ title, children }: OptionsSectionProps) => {
  return (
    <Container>
      <Title type="subtitle" size="lg">
        {title}
      </Title>
      {children}
    </Container>
  );
};

const Container = styled.section`
  margin-bottom: ${token('spacing.2xl')};
`;

const Title = styled(Text)`
  font-weight: ${token('typography.fontWeights.semibold')};
`;
