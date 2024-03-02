import { Image, Stack, Text, token } from '@synq/ui';
import WaveGraphicDark from 'data-base64:~assets/images/wave-graphic-dark.svg';
import WaveGraphicLight from 'data-base64:~assets/images/wave-graphic-light.svg';
import styled, { useTheme } from 'styled-components';

import adapters from '~adapters';
import Layout from '~ui/popup/Layout';
import MusicServiceButton from '~ui/popup/components/MusicServiceButton';

const SelectPlatformScreen = () => {
  const theme = useTheme();

  return (
    <Layout hideButton>
      <Container>
        <div>
          <Heading type="display" size="xl" gradient>
            Choose Platform
          </Heading>
          <Description type="body" size="sm">
            Select your platform to start listening
          </Description>
          <MusicServiceButtons spacing="md" direction="column">
            {adapters.map((adapter) => (
              <MusicServiceButton
                key={adapter.id}
                name={`Continue with ${adapter.displayName}`}
                urlMatch={adapter.urlMatches[0]}
                url={adapter.baseUrl}
                logoSrc={adapter.icon}
              />
            ))}
          </MusicServiceButtons>
        </div>
        <WaveGraphicImage
          src={theme.name === 'light' ? WaveGraphicLight : WaveGraphicDark}
          alt="Wave Graphic"
        />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  background-color: ${token('colors.background')};
  padding-top: ${token('spacing.sm')};
  padding-bottom: ${token('spacing.3xl')};
  height: 100%;
  width: 100%;
`;

const Heading = styled(Text)`
  font-weight: ${token('typography.fontWeights.bold')};
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center;
  display: block;
`;

const Description = styled(Text)`
  color: ${token('colors.onBackground')};
  margin: ${token('spacing.md')} auto ${token('spacing.xs')};
  text-align: center;
  width: 250px;
  font-weight: ${token('typography.fontWeights.thin')};
`;

const MusicServiceButtons = styled(Stack)`
  margin: ${token('spacing.lg')} auto 0;
  width: 90%;
`;

const WaveGraphicImage = styled(Image)`
  bottom: -5px;
  height: auto;
  left: 0;
  position: fixed;
  transform: scale(1.2) translateX(20px);
  width: 100%;
`;

export default SelectPlatformScreen;
