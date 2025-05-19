"use server";

import { cookies } from "next/headers";
import { Cart, CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/client";

/**
 * Calculates cart pricing based on items
 */
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

/**
 * Gets the cart session ID and user ID
 */
async function getCartContext() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  return { sessionCartId, userId };
}

/**
 * Gets product by ID with validation
 */
async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({ where: { id: productId } });
  if (!product) throw new Error("Product not found");
  return product;
}

/**
 * Updates cart in database and revalidates paths
 */
async function updateCart(cart: Cart, items: CartItem[], productSlug: string) {
  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      items: items as Prisma.CartUpdateitemsInput[],
      ...calcPrice(items),
    },
  });

  revalidatePath(`/product/${productSlug}`);
  // revalidatePath('/cart');
}

/**
 * Gets the current user's cart
 */
export async function getMyCart() {
  try {
    const { sessionCartId, userId } = await getCartContext();

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) return undefined;

    return convertToPlainObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString(),
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    return undefined;
  }
}

/**
 * Gets the current cart count
 */

export async function getCartCount() {
  try {
    // Use a different approach that doesn't cause revalidation
    const { cookies } = await import("next/headers");
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    // Return early if no session
    if (!sessionCartId) return 0;
    // Query directly without causing revalidation
    const cart = await prisma.cart.findFirst({
      where: { sessionCartId },
      select: { items: true },
    });

    const items = convertToPlainObject(cart?.items as CartItem[]) || [];
    return items.reduce((acc, item) => acc + (item?.qty || 0), 0);
  } catch (error) {
    console.error("Failed to get cart count:", error);
    return 0;
  }
}

/**
 * Adds an item to the cart
 */
export async function addItemToCart(data: CartItem) {
  try {
    const { sessionCartId, userId } = await getCartContext();
    const item = cartItemSchema.parse(data);
    const product = await getProductById(item.productId);
    const cart = await getMyCart();

    // Case: New cart needed
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [item],
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });
      revalidatePath(`/product/${product.slug}`);
      // revalidatePath("/cart");

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    }

    // Case: Existing cart
    const existItem = (cart.items as CartItem[]).find(
      (x) => x.productId === item.productId
    );

    if (existItem) {
      // Check stock before increasing quantity
      if (product.stock < existItem.qty + 1) {
        throw new Error("Not enough stock");
      }
      existItem.qty += 1;
    } else {
      // Add new item
      if (product.stock < 1) throw new Error("Not enough stock");
      cart.items.push(item);
    }

    await updateCart(cart, cart.items as CartItem[], product.slug);

    return {
      success: true,
      message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/**
 * Removes an item from the cart
 */
export async function removeItemFromCart(productId: string) {
  try {
    await getCartContext();
    const product = await getProductById(productId);
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    const existItem = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );

    if (!existItem) throw new Error("Item not found");

    let updatedItems: CartItem[];

    if (existItem.qty === 1) {
      // Remove item completely
      updatedItems = (cart.items as CartItem[]).filter(
        (x) => x.productId !== existItem.productId
      );
    } else {
      // Decrease quantity
      existItem.qty -= 1;
      updatedItems = cart.items as CartItem[];
    }

    await updateCart(cart, updatedItems, product.slug);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
