import { Decimal } from "@prisma/client/runtime/library";

// Raw database types (before transformation)
type RawProduct = {
  price: Decimal;
  rating: Decimal;
  [key: string]: any;
};

type RawCart = {
  itemsPrice: Decimal;
  shippingPrice: Decimal;
  taxPrice: Decimal;
  totalPrice: Decimal;
  [key: string]: any;
};

type RawOrder = {
  itemsPrice: Decimal;
  shippingPrice: Decimal;
  taxPrice: Decimal;
  totalPrice: Decimal;
  [key: string]: any;
};

type RawOrderItem = {
  price: Decimal;
  [key: string]: any;
};

export const resultTransformer = {
  result: {
    product: {
      price: {
        compute(product: RawProduct) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: RawProduct) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart: RawCart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart: RawCart) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart: RawCart) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart: RawCart) {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(order: RawOrder) {
          return order.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(order: RawOrder) {
          return order.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(order: RawOrder) {
          return order.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(order: RawOrder) {
          return order.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(orderItem: RawOrderItem) {
          return orderItem.price.toString();
        },
      },
    },
  },
};
