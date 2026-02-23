import { Cart, ICart } from "../models/cart.model";

// Get Cart by user
export const getCartService = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// Add product to cart
export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart> => {
  const cart = await getCartService(userId);

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId as any, quantity });
  }

  await cart.save();
  return cart;
};

// Update quantity
export const updateCartItemService = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart> => {
  const cart = await getCartService(userId);

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) throw new Error("Product not in cart");

  item.quantity = quantity;

  await cart.save();
  return cart;
};

// Remove item
export const removeCartItemService = async (
  userId: string,
  productId: string
): Promise<ICart> => {
  const cart = await getCartService(userId);

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  ) as any;

  await cart.save();
  return cart;
};
