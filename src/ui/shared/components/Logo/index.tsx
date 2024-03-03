import { Image, Text, type TextProps, token } from '@synqapp/ui';
import Icon from 'data-base64:~assets/images/icon-filled.svg';
import styled from 'styled-components';

type LogoSize = 'controller' | 'page';

const TextSizeMap: Record<LogoSize, TextProps['size']> = {
  controller: 'xl',
  page: '3xl'
};

const ImageSizeMap: Record<LogoSize, number> = {
  controller: 35,
  page: 60
};

interface LogoProps {
  size: LogoSize;
}

const Logo = ({ size = 'controller' }: LogoProps) => {
  return (
    <Container>
      <LogoImage src={Icon} alt="SynQ Logo" $size={ImageSizeMap[size]} />
      <LogoText type="display" size={TextSizeMap[size]} forwardedAs="h1">
        SynQ
      </LogoText>
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  display: inline-flex;
`;

interface LogoImageProps {
  $size: number;
}

const LogoImage = styled(Image)<LogoImageProps>`
  height: ${({ $size }) => $size}px;
  width: ${({ $size }) => $size}px;
`;

const LogoText = styled(Text)`
  font-weight: ${token('typography.fontWeights.medium')};
`;

export default Logo;
