import fs from "fs";
import path from "path";

import { TCoin } from "../../../components/BaseInput";
import { coinConverter, ICoins } from "./data/coins";
import { IProduct } from "./data/products";

const productJsonPath = path.join(
  process.cwd(),
  "pages",
  "api",
  "utils",
  "data",
  "products.json"
);

const coinJsonPath = path.join(
  process.cwd(),
  "pages",
  "api",
  "utils",
  "data",
  "coins.json"
);

console.log(productJsonPath, coinJsonPath);

const jsonProducts = fs.readFileSync(productJsonPath, "utf-8");
const products = JSON.parse(jsonProducts) as IProduct[];

const jsonCoins = fs.readFileSync(coinJsonPath, "utf-8");
const coins = JSON.parse(jsonCoins) as ICoins;

export default class VendingMachine {
  products: IProduct[];
  coins: ICoins;
  constructor() {
    this.products = products;
    this.coins = coins;
  }

  displayProducts() {
    return this.products;
  }

  displayCoins() {
    return this.coins;
  }

  maintainerUpdateProduct(prod: IProduct) {
    const productIndex = this.products.findIndex((p) => p.id == prod.id);
    this.products[productIndex].quantity = prod.quantity;
    this.products[productIndex].price = prod.price;
  }

  calculateAmountGiven(coins: ICoins) {
    let amount = 0;
    const coinKeys = Object.keys(coins);
    for (let key of coinKeys) {
      amount += coins[key as TCoin] * coinConverter[key as TCoin];
    }
    return amount;
  }

  updateAddCoins(coins: ICoins) {
    const coinKeys = Object.keys(coins);
    for (let key of coinKeys) {
      this.coins[key as TCoin] += coins[key as TCoin];
      fs.writeFileSync(coinJsonPath, JSON.stringify(this.coins));
    }
  }

  updateRemoveCoins(coins: ICoins) {
    const coinKeys = Object.keys(coins);
    for (let key of coinKeys) {
      this.coins[key as TCoin] -= coins[key as TCoin];
      fs.writeFileSync(coinJsonPath, JSON.stringify(this.coins));
    }
  }

  getCoinNameFromNumber(num: number): string {
    if (num === 1) return "cent";
    if (num === 5) return "nickel";
    if (num === 10) return "dime";
    if (num === 25) return "quarter";
    if (num === 50) return "half";
    if (num === 100) return "dollar";
    return "";
  }

  calculateChangeAvailabilityInCoins(
    coinsAvailable: number[],
    change: number,
    memo: { [key: string]: number[] | null } = {}
  ): number[] | null {
    if (change in memo) return memo[change];
    if (change === 0) return [];
    if (change < 0) return null;

    const coinsDeducted: number[] = [];

    for (let coin of coinsAvailable) {
      const coinName = this.getCoinNameFromNumber(coin);
      if (this.coins[coinName as TCoin] > 0) {
        const updatedChange = change - coin;
        const changeResult = this.calculateChangeAvailabilityInCoins(
          coinsAvailable,
          updatedChange,
          memo
        );
        if (changeResult !== null) {
          memo[change] = [...changeResult, coin];
          this.coins[coinName as TCoin]--;
          coinsDeducted.push(this.coins[coinName as TCoin]);
          return memo[change];
        }
      }
    }

    memo[change] = null;
    return null;
  }

  updateDeductCoins(coins: ICoins) {
    const coinKeys = Object.keys(coins);
    for (let key of coinKeys) {
      this.coins[key as TCoin] -= coins[key as TCoin];
    }
  }

  updateAddProductQuantity(productId: number, qty: number) {
    const productIndex = this.products.findIndex(
      (prod) => prod.id === productId
    );

    this.products[productIndex].quantity += qty;
  }

  updateRemoveProductQuantity(productId: number, qty: number) {
    const productIndex = this.products.findIndex(
      (prod) => prod.id === productId
    );

    this.products[productIndex].quantity -= qty;

    fs.writeFileSync(productJsonPath, JSON.stringify(this.products));
  }

  updateProduct(productId: number, qty: number, price: number) {
    const productIndex = this.products.findIndex(
      (prod) => prod.id === productId
    );

    this.products[productIndex].quantity = qty;
    this.products[productIndex].price = price;

    fs.writeFileSync(productJsonPath, JSON.stringify(this.products));

    return {
      message: `Successfully updated ${this.products[productIndex].name}`,
      status: "001",
    };
  }

  updateCoins(coins: ICoins) {
    this.coins = coins;
    fs.writeFileSync(coinJsonPath, JSON.stringify(this.coins));
    return {
      message: "Successfully updated available coins",
      status: "001",
    };
  }

  buyProduct(productId: number, coins: ICoins) {
    this.updateAddCoins(coins);
    const product = this.products.find((prod) => prod.id === productId);
    const amountGiven = this.calculateAmountGiven(coins);
    if (!product) {
      this.updateRemoveCoins(coins);
      return {
        message: "No product is selected or product selected is not available.",
        status: "000",
      };
    } else if (product.quantity <= 0) {
      this.updateRemoveCoins(coins);
      return { message: "Product selected is out of stock.", status: "000" };
    } else if (product.price > amountGiven) {
      const shortprice = product.price - amountGiven;
      this.updateRemoveCoins(coins);
      return {
        message: `Amount given is not sufficient to buy ${
          product.name
        }. You are ${shortprice.toFixed(2)} short.`,
        status: "000",
      };
    }

    const coinsAvailable = Object.values(coinConverter).map((val) => val * 100);
    const change = amountGiven - product.price;
    const coinsChange = this.calculateChangeAvailabilityInCoins(
      coinsAvailable,
      Math.round(change * 100)
    );

    if (coinsChange === null) {
      this.updateRemoveCoins(coins);
      return {
        message:
          "Our machine does not have the change right now. We will have to refund you. Try again later!",
        status: "000",
      };
    }

    this.updateRemoveProductQuantity(productId, 1);

    const coinObj: ICoins = {
      cent: 0,
      nickel: 0,
      dime: 0,
      quarter: 0,
      half: 0,
      dollar: 0,
    };
    for (let coin of coinsChange) {
      const coinName = this.getCoinNameFromNumber(coin);
      if (coinName in coinObj) coinObj[coinName as TCoin]++;
      else coinObj[coinName as TCoin] = 1;
    }

    // this.updateRemoveCoins(coinObj);

    let changeInString = "";
    for (let key of Object.keys(coinObj)) {
      if (coinObj[key as TCoin] > 0) {
        changeInString += `${coinObj[key as TCoin]} ${key} `;
      }
    }

    return {
      message: `You have successfully purchased ${product.name}. You change is ${changeInString}`,
      status: "001",
    };
  }
}
