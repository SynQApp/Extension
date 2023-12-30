import { Button, Flex, Stack, Text, token } from '@synq/ui';
import { styled } from 'styled-components';

import { Screen } from '../components/Screen';

interface YtmPlusIntroProps {
  goToNextSlide: () => void;
}

export const YtmPlusIntro = ({ goToNextSlide }: YtmPlusIntroProps) => {
  return (
    <Screen>
      <Container direction="column" justify="center">
        <Stack direction="column" spacing="xl">
          <Stack direction="column" spacing="2xs">
            <TitleText type="display" size="5xl" weight="semibold">
              <Text
                type="display"
                size="5xl"
                weight="semibold"
                as="span"
                gradient
              >
                YTM+ is now SynQ
              </Text>
            </TitleText>
            <DescriptionText type="subtitle" size="lg" weight="regular">
              From the developers of YTM+, SynQ upgrades your YTM+ experience
              with all new features and a fresh look.
            </DescriptionText>
          </Stack>
          <ContinueButton size="large" rounded onClick={goToNextSlide}>
            Get Started
          </ContinueButton>
        </Stack>
      </Container>
    </Screen>
  );
};

const Container = styled(Flex)`
  height: calc(100vh - 100px);
  overflow: hidden;
`;

const TitleText = styled(Text)`
  text-align: center;
  margin: 0 auto;
  display: block;
`;

const DescriptionText = styled(Text)`
  text-align: center;
  margin: 0 auto;
  display: block;
  max-width: 750px;
`;

const ContinueButton = styled(Button)`
  margin: 0 auto;
  display: block;
`;
