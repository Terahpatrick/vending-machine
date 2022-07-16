import { ChangeEvent } from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > label {
    margin-bottom: 5px;

    & span {
      font-size: 0.8rem;
      color: darkblue;
    }
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid gray;
  border-radius: 0.1rem;

  &::placeholder {
    font-family: "Varela Round", sans-serif;
  }
`;

export type TCoin = "cent" | "dime" | "nickel" | "quarter" | "half" | "dollar";

interface IInputProps {
  placeholder?: string;
  label?: string;
  name: TCoin;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value?: number;
  helper?: string;
}

const BaseInput: React.FC<IInputProps> = ({
  placeholder,
  name,
  label,
  onChange,
  type,
  value,
  helper,
}) => {
  return (
    <InputWrapper>
      <label htmlFor={name}>
        {label ?? placeholder ?? ""}{" "}
        {helper && (
          <span>
            <i>{helper}</i>
          </span>
        )}
      </label>
      <Input
        placeholder={` ${placeholder ?? label ?? ""}`}
        name={name}
        onChange={onChange}
        type={type ?? "text"}
        value={value === 0 ? "" : value}
      />
    </InputWrapper>
  );
};

export default BaseInput;
