import styled from "styled-components";

const ButtonStyled = styled.button<{ bg: string }>`
  background-color: ${(props) => props.bg};
  border: none;
  color: white;
  padding: 0.5rem 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  width: 10rem;
  cursor: pointer;
  border-radius: 0.2rem;
  margin-inline: 0.5rem;
`;

interface IButtonProp {
  bg: string;
  label: string;
  onClick?: () => void;
}

const BaseButton: React.FC<IButtonProp> = ({ bg, label, onClick }) => {
  return (
    <ButtonStyled bg={bg} onClick={onClick}>
      {label}
    </ButtonStyled>
  );
};

export default BaseButton;
