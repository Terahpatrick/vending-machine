import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Container,
  ContainerInner,
  LinkContainer,
  NotificationContainer,
  InputContainer,
  ButtonContainer,
} from "..";
import BaseButton from "../../components/BaseButton";
import BaseInput, { TCoin } from "../../components/BaseInput";
import ProductTable from "../../components/ProductTable";

const MaintainerUser: React.FC = () => {
  const [coins, setCoins] = useState({
    cent: 0,
    nickel: 0,
    dime: 0,
    quarter: 0,
    half: 0,
    dollar: 0,
  });

  const handleChangeCoin = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const updatedCoins = { ...coins };
    updatedCoins[name as TCoin] = +value;
    setCoins(updatedCoins);
  };

  const [successCoin, setSuccessCoin] = useState("");

  const handleUpdateCoins = () => {
    const options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        coins,
      }),
    };

    fetch("/api/maintainer", options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "000") {
          setSuccessCoin("");
        } else if (data.status === "001") {
          setSuccessCoin(data.message);
        }
      })
      .catch((_err) => {});
  };

  useEffect(() => {
    fetch("/api/maintainer")
      .then((response) => response.json())
      .then((data) => setCoins(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      <LinkContainer>
        <Link href="/">Regular User</Link>
        <Link href="/maintainer">Maintainer User</Link>
      </LinkContainer>
      <ContainerInner>
        <h3>Vending Machine</h3>
        <p>Update the coins available</p>
        <InputContainer>
          <BaseInput
            placeholder="1¢"
            name="cent"
            label="Cent"
            helper="(Coins available)"
            value={coins.cent}
            onChange={handleChangeCoin}
            type="number"
          />
          <BaseInput
            placeholder="5¢"
            name="nickel"
            label="Nickel"
            helper="(Coins available)"
            value={coins.nickel}
            onChange={handleChangeCoin}
            type="number"
          />
          <BaseInput
            placeholder="10¢"
            name="dime"
            label="Dime"
            helper="(Coins available)"
            value={coins.dime}
            onChange={handleChangeCoin}
            type="number"
          />
          <BaseInput
            placeholder="25¢"
            name="quarter"
            label="Quarter"
            helper="(Coins available)"
            value={coins.quarter}
            onChange={handleChangeCoin}
            type="number"
          />
          <BaseInput
            placeholder="50¢"
            name="half"
            label="Half"
            helper="(Coins available)"
            value={coins.half}
            onChange={handleChangeCoin}
            type="number"
          />
          <BaseInput
            placeholder="$1"
            name="dollar"
            label="Dollar"
            helper="(Coins available)"
            onChange={handleChangeCoin}
            value={coins.dollar}
            type="number"
          />
        </InputContainer>

        <ButtonContainer>
          <BaseButton bg="orange" label="Update" onClick={handleUpdateCoins} />
        </ButtonContainer>
        <NotificationContainer>
          {successCoin && <span className="success">{successCoin}</span>}
        </NotificationContainer>
        <p>Update the coins available</p>
        <ProductTable />
      </ContainerInner>
    </Container>
  );
};

export default MaintainerUser;
