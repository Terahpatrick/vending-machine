import type { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import styled from "styled-components";
import BaseButton from "../components/BaseButton";
import BaseInput, { TCoin } from "../components/BaseInput";
import ProductCard from "../components/ProductCard";
import { IProduct } from "./api/utils/data/products";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;

export const ContainerInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 60rem;

  border: 1px solid lightgray;
  padding: 1rem;
  border-radius: 0.2rem;

  & h3 {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  & p {
    margin-block: 0.5rem;
  }
`;

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  justify-items: stretch;
  align-items: stretch;
`;

export const ProductContainer = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  justify-items: stretch;
  align-items: stretch;
  margin-top: 1rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: center;
`;

export const NotificationContainer = styled.div`
  margin-block: 0.4rem;
  text-align: center;
  font-size: 0.8rem;

  & .error {
    color: tomato;
  }

  & .success {
    color: green;
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-block: 1rem;

  & > * {
    display: inline-block;
    color: blue;
    margin-inline: 1rem;
  }
`;

const Home: NextPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [coins, setCoins] = useState({
    cent: 0,
    nickel: 0,
    dime: 0,
    quarter: 0,
    half: 0,
    dollar: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [success]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const updatedCoins = { ...coins };
    updatedCoins[name as TCoin] = +value;
    setCoins(updatedCoins);
  };

  const handleProductClick = (id: number) => {
    setSelectedProduct(id);
  };

  const handleBuy = () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        productId: selectedProduct,
        coins,
      }),
    };

    fetch("/api/products", options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "000") {
          setSuccess("");
          setError(data.message);
        } else if (data.status === "001") {
          setError("");
          setSuccess(data.message);
        }
      })
      .catch((err) => {
        setError(err?.message);
      });
  };

  const handleReset = () => {
    setSelectedProduct(0);
    setCoins({
      cent: 0,
      nickel: 0,
      dime: 0,
      quarter: 0,
      half: 0,
      dollar: 0,
    });
    setError("");
    setSuccess("");
  };
  return (
    <Container>
      <LinkContainer>
        <Link href="/">Regular User</Link>
        <Link href="/maintainer">Maintainer User</Link>
      </LinkContainer>
      <ContainerInner>
        <h3>Vending Machine</h3>
        <p>Buy Product</p>
        <InputContainer>
          <BaseInput
            placeholder="Enter number of 1¢"
            name="cent"
            label="Cent"
            value={coins.cent}
            onChange={handleChange}
            type="number"
          />
          <BaseInput
            placeholder="Enter number of 5¢"
            name="nickel"
            label="Nickel"
            value={coins.nickel}
            onChange={handleChange}
            type="number"
          />
          <BaseInput
            placeholder="Enter number of 10¢"
            name="dime"
            label="Dime"
            value={coins.dime}
            onChange={handleChange}
            type="number"
          />
          <BaseInput
            placeholder="Enter number of 25¢"
            name="quarter"
            label="Quarter"
            value={coins.quarter}
            onChange={handleChange}
            type="number"
          />
          <BaseInput
            placeholder="Enter numbe of 50¢"
            name="half"
            label="Half"
            value={coins.half}
            onChange={handleChange}
            type="number"
          />
          <BaseInput
            placeholder="Enter number of $1"
            name="dollar"
            label="Dollar"
            onChange={handleChange}
            value={coins.dollar}
            type="number"
          />
        </InputContainer>

        <ProductContainer>
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              selectedProduct={selectedProduct}
              handleProductClick={handleProductClick}
            />
          ))}
        </ProductContainer>

        <ButtonContainer>
          <BaseButton bg="green" label="Buy" onClick={handleBuy} />
          <BaseButton bg="tomato" label="Reset" onClick={handleReset} />
        </ButtonContainer>

        <NotificationContainer>
          {error && <span className="error">{error}</span>}
          {success && <span className="success">{success}</span>}
        </NotificationContainer>
      </ContainerInner>
    </Container>
  );
};

export default Home;
