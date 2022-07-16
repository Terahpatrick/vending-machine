import type { NextApiRequest, NextApiResponse } from "next";

import { IProduct } from "./utils/data/products";
import { ICoins } from "./utils/data/coins";
import VendingMachine from "./utils/vendingMachine";

const vendingMachine = new VendingMachine();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  switch (method) {
    case "GET":
      return res
        .status(200)
        .json((vendingMachine.displayProducts() as IProduct[]) ?? []);
    case "POST": {
      let { productId, coins } = req.body;
      productId = productId as number;
      coins = coins as ICoins;
      const result = vendingMachine.buyProduct(productId, coins);
      if (result?.status === "000") {
        return res.status(400).json(result);
      } else if (result?.status === "001") {
        return res.status(200).json(result);
      }
      return;
    }
    case "PUT": {
      let { productId, qty, price } = req.body;
      productId = productId as number;
      qty = qty as number;
      price = price as number;
      const result = vendingMachine.updateProduct(productId, qty, price);
      if (result?.status === "000") {
        return res.status(400).json(result);
      } else if (result?.status === "001") {
        return res.status(200).json(result);
      }
    }
  }
}
