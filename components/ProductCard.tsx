import styled from "styled-components";
import { IProduct } from "../pages/api/utils/data/products";

const ProductContainer = styled.li<{ isSelected?: boolean }>`
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 0.6rem;
  border: 1px solid ${(props) => (props.isSelected ? "blue" : "lightgray")};
  cursor: pointer;
  border-radius: 0.2rem;

  & p {
    color: gray;
    margin-top: 0.2rem;
  }

  display: flex;
  justify-content: space-between;

  & span {
    color: gray;
  }
`;

const ProductInfo = styled.div``;

interface IProductCardProps {
  product: IProduct;
  handleProductClick: (id: number) => void;
  selectedProduct?: number;
}

const ProductCard: React.FC<IProductCardProps> = ({
  product: { name, price, id, quantity },
  handleProductClick,
  selectedProduct,
}) => {
  const isSelected = id === selectedProduct;
  return (
    <ProductContainer
      onClick={() => handleProductClick(id)}
      isSelected={isSelected}
    >
      <ProductInfo>
        <h3>{name}</h3>
        <p>${price}</p>
      </ProductInfo>
      <span>{quantity}</span>
    </ProductContainer>
  );
};

export default ProductCard;
