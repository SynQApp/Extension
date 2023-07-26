import { Text, token } from '@synq/ui';
import type { TextProps } from '@synq/ui';
import { useMemo, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { styled } from 'styled-components';

interface TextShortenedMarqueeProps extends TextProps {
  children: string;
}

export const TextShortenedMarquee = ({
  children,
  as,
  ...textProps
}: TextShortenedMarqueeProps) => {
  const [play, setPlay] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const hasOverflow = () => {
    if (!textRef.current) {
      return false;
    }

    return textRef.current.offsetWidth < textRef.current.scrollWidth;
  };

  const handleMouseEnter = () => {
    if (hasOverflow()) {
      setPlay(true);
    }
  };

  const handleMouseLeave = () => {
    setPlay(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {play ? (
        <Marquee>
          <Text {...textProps}>{children}</Text>
          <Space />
        </Marquee>
      ) : (
        <StaticText ref={textRef} forwardedAs={as} {...textProps}>
          {children}
        </StaticText>
      )}
    </div>
  );
};

const Space = styled.span`
  display: inline-block;
  width: ${token('spacing.md')};
`;

const StaticText = styled(Text)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
