import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { NotificationContainer } from "../pages";
import { IProduct } from "../pages/api/utils/data/products";

const ProductTableContainer = styled.div`
  & table {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    & td,
    & th {
      border: 1px solid #ddd;
      font-size: 0.85rem;
      padding: 0.4rem;

      & span {
        color: blue;
        cursor: pointer;
        padding-inline: 0.4rem;
      }
    }

    & tr:hover {
      background-color: #ddd;
    }

    & th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: gray;
      color: white;
    }
  }
`;

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const [successProduct, setSuccessProduct] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChangeProduct = (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedProducts = [...products];
    const { name, value } = e.currentTarget;
    const productIndex = products.findIndex((p) => p.id === id);
    updatedProducts[productIndex][name as "quantity" | "price"] = +value;
    setProducts(updatedProducts);
  };

  const handleUpdateProduct = (product: IProduct) => {
    const options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        productId: product.id,
        qty: product.quantity,
        price: product.price,
      }),
    };

    fetch("/api/products", options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "000") {
          setSuccessProduct("");
        } else if (data.status === "001") {
          setSuccessProduct(data.message);
        }
      })
      .catch((err) => {});
  };

  return (
    <ProductTableContainer>
      <NotificationContainer>
        {successProduct && <span className="success">{successProduct}</span>}
      </NotificationContainer>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price ($)</th>
            <th>Quantity</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, i) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>
                <input
                  type="number"
                  value={products[i].price || ""}
                  name="price"
                  onChange={(e) => handleChangeProduct(e, prod.id)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={products[i].quantity || ""}
                  name="quantity"
                  onChange={(e) => handleChangeProduct(e, prod.id)}
                />
              </td>
              <td>
                <span onClick={() => handleUpdateProduct(prod)}>Update</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ProductTableContainer>
  );
};

export default ProductTable;
