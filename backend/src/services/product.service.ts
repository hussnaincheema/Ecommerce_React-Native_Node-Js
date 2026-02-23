import { IProduct } from "../types/product.types";

let products: IProduct[] = [];
let currentId = 0;

export const createProductService = (
  name: string,
  price: number,
  stock: number
): IProduct => {
  const newProduct: IProduct = {
    id: currentId++,
    name,
    price,
    stock,
  };

  products.push(newProduct);
  return newProduct;
};

export const getAllProductsService = (): IProduct[] => {
  return products;
};

export const getProductByIdService = (id: number): IProduct => {
  const product = products.find((p) => p.id === id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProductService = (
  id: number,
  data: Partial<IProduct>
): IProduct => {
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  products[index] = { ...products[index], ...data };

  return products[index];
};

export const deleteProductService = (id: number): void => {
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error("Product not found");
  }

  products.splice(index, 1);
};
