import { Flex, Text, token } from '@synqapp/ui';
import type { TextProps } from '@synqapp/ui';
import { useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { styled } from 'styled-components';

interface MarqueeTextProps extends TextProps {
  children: string | string[];
  className?: string;
  documentContainer?: Document;
}

export const MarqueeText = ({
  children,
  as,
  className,
  documentContainer = document,
  ...textProps
}: MarqueeTextProps) => {
  const [play, setPlay] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const hasOverflow = () => {
    if (!textRef.current) {
      return false;
    }

    return textRef.current.offsetWidth < textRef.current.scrollWidth;
  };

  // The mouseleave event is not always reliable, so we also check the mouse position
  useEffect(() => {
    if (!divRef.current || !play) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = divRef.current?.getBoundingClientRect();

      if (
        rect &&
        (e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom)
      ) {
        setPlay(false);
      }
    };

    documentContainer.addEventListener('mousemove', handleMouseMove);

    return () => {
      documentContainer.removeEventListener('mousemove', handleMouseMove);
    };
  }, [divRef.current, play]);

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
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseLeave}
      ref={divRef}
    >
      {play ? (
        <Marquee>
          <Text className="text" {...textProps}>
            {children}
          </Text>
          <Space />
        </Marquee>
      ) : (
        <StaticTextFlex align="center">
          <StaticText
            className="text"
            ref={textRef}
            forwardedAs={as}
            {...textProps}
          >
            {children}
          </StaticText>
        </StaticTextFlex>
      )}
    </div>
  );
};

const Space = styled.span`
  display: block;
  width: ${token('spacing.md')};
`;

const StaticTextFlex = styled(Flex)`
  overflow: hidden;
`;

const StaticText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;
