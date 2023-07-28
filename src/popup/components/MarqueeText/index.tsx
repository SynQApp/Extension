import { Text, token } from '@synq/ui';
import type { TextProps } from '@synq/ui';
import { useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { styled } from 'styled-components';

interface MarqueeTextProps extends TextProps {
  children: string | string[];
  className?: string;
}

export const MarqueeText = ({
  children,
  as,
  className,
  ...textProps
}: MarqueeTextProps) => {
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
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {play ? (
        <Marquee>
          <Text className="text" {...textProps}>
            {children}
          </Text>
          <Space />
        </Marquee>
      ) : (
        <StaticTextContainer>
          <StaticText
            className="text"
            ref={textRef}
            forwardedAs={as}
            {...textProps}
          >
            {children}
          </StaticText>
        </StaticTextContainer>
      )}
    </div>
  );
};

const Space = styled.span`
  display: inline-block;
  width: ${token('spacing.md')};
`;

const StaticTextContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const StaticText = styled(Text)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
