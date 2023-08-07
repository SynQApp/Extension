import { styled } from 'styled-components';

interface GradientAddButtonProps {
  className?: string;
  onClick?: () => void;
}

export const GradientAddButton = ({
  className,
  onClick
}: GradientAddButtonProps) => {
  return (
    <GradientAddButtonStyled className={className} onClick={onClick}>
      <GradientAddIconSvg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.77366 0.666992H20.2137C24.747 0.666992 27.3337 3.22699 27.3337 7.77366V20.227C27.3337 24.747 24.7603 27.3337 20.227 27.3337H7.77366C3.22699 27.3337 0.666992 24.747 0.666992 20.227V7.77366C0.666992 3.22699 3.22699 0.666992 7.77366 0.666992ZM15.0937 15.107H18.8803C19.4937 15.0937 19.987 14.6003 19.987 13.987C19.987 13.3737 19.4937 12.8803 18.8803 12.8803H15.0937V9.12033C15.0937 8.50699 14.6003 8.01366 13.987 8.01366C13.3737 8.01366 12.8803 8.50699 12.8803 9.12033V12.8803H9.10699C8.81366 12.8803 8.53366 13.0003 8.32033 13.2003C8.12033 13.4137 8.00033 13.6923 8.00033 13.987C8.00033 14.6003 8.49366 15.0937 9.10699 15.107H12.8803V18.8803C12.8803 19.4937 13.3737 19.987 13.987 19.987C14.6003 19.987 15.0937 19.4937 15.0937 18.8803V15.107Z"
          fill="url(#paint0_linear_2055_1391)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2055_1391"
            x1="27.3337"
            y1="27.3337"
            x2="-4.39728"
            y2="18.1336"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#ED711E" />
            <stop offset="1" stop-color="#E9295C" />
          </linearGradient>
        </defs>
      </GradientAddIconSvg>
    </GradientAddButtonStyled>
  );
};

const GradientAddIconSvg = styled.svg`
  height: 24px;
  width: 24px;
`;

const GradientAddButtonStyled = styled.button`
  align-items: center;
  background: transparent;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  outline: none;
  padding: 0;
`;
