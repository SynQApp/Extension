import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CustomArrowProps } from 'react-slick';
import { styled } from 'styled-components';

export const PreviousArrow = ({
  onClick,
  slideCount,
  currentSlide
}: CustomArrowProps) => {
  const isFirstSlide = slideCount && currentSlide === 0;

  return !isFirstSlide ? (
    <Container onClick={onClick}>
      <FontAwesomeIcon
        icon={faChevronLeft}
        width="50px"
        height="50px"
        color="white"
      />
    </Container>
  ) : null;
};

const Container = styled.div`
  background: none;
  border: none;
  color: #0000;
  cursor: pointer;
  display: block;
  font-size: 25px;
  height: 20px;
  line-height: 0;
  outline: none;
  padding: 0;
  position: fixed;
  top: 50%;
  transform: translate(0, -50%);
  width: 20px;
  z-index: 1000;
`;
