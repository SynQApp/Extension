import { token } from '@synqapp/ui';
import Slider, { type Settings } from 'react-slick';
import { createGlobalStyle, styled, useTheme } from 'styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useRef } from 'react';

import Logo from '~ui/shared/components/Logo';
import { useAnalytic } from '~ui/shared/hooks/useAnalytic';

import { NextArrow } from './components/NextArrow';
import { PreviousArrow } from './components/PreviousArrow';
import { AcceptPermissions } from './screens/AcceptPermissions';
import { Complete } from './screens/Complete';
import { SelectPreferredService } from './screens/SelectPreferredService';
import { YtmPlusIntro } from './screens/YtmPlusIntro';

export const Onboard = () => {
  useAnalytic({
    name: 'onboarding_screen'
  });
  const url = new URL(window.location.href);
  const isUpdate = url.searchParams.get('update') === 'true';

  const theme = useTheme();
  const sliderRef = useRef<Slider>(null);

  const goToNextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const settings: Settings = {
    dots: true,
    dotsClass: 'slick-dots slick-dots-light',
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />
  };

  return (
    <>
      <GlobalStyle theme={theme} />
      <Container>
        <LogoContainer>
          <Logo size="page" />
        </LogoContainer>
        <Slider {...settings} ref={sliderRef}>
          {isUpdate && <YtmPlusIntro goToNextSlide={goToNextSlide} />}
          <AcceptPermissions goToNextSlide={goToNextSlide} />
          <SelectPreferredService goToNextSlide={goToNextSlide} />
          <Complete />
        </Slider>
        <BackgroundGlow />
        <BackgroundGlow2 />
      </Container>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${token('colors.background')};
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .slick-dots {
    position: fixed;
    bottom: 30px;
  }

  .slick-dots-light li button:before {
    color: ${token('colors.onBackgroundLow')};
  }

  .slick-dots-light li.slick-active button:before {
    color: ${token('colors.onBackground')};
  }

  .slick-slider {
    z-index: 1000;
  }
`;

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  padding: 0 ${token('spacing.md')};
`;

const BackgroundGlow = styled.div`
  background: radial-gradient(
    450px circle,
    ${token('colors.base.orange.3')}55 0%,
    transparent 100%
  );
  width: 900px;
  height: 900px;
  filter: blur(80px);
  position: absolute;
  top: 150px;
  z-index: 0;
`;

const BackgroundGlow2 = styled.div`
  background: radial-gradient(
    450px circle,
    ${token('colors.base.pink.3')}55 0%,
    transparent 100%
  );
  width: 900px;
  height: 900px;
  filter: blur(80px);
  position: absolute;
  top: 550px;
  right: 200px;
  z-index: 0;
`;
