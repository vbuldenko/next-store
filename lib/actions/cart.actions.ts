"use server";

import { cookies } from "next/headers";
import { Cart, CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/client";

// ========================================
// Types & Constants
// ========================================

type CartContext = {
  sessionCartId: string | undefined;
  userId: string | undefined;
};

type CartResult = {
  success: boolean;
  message: string;
};

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;
const TAX_RATE = 0.15;

// ========================================
// Utility Functions
// ========================================

/**
 * Calculates cart pricing based on items
 */
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(
    itemsPrice > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  );
  const taxPrice = round2(TAX_RATE * itemsPrice);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

/**
 * Gets cart context (session & user) without throwing
 */
async function getCartContext(): Promise<CartContext> {
  try {
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get("sessionCartId")?.value;
    const session = await auth();
    const userId = session?.user?.id;

    return { sessionCartId, userId };
  } catch (error) {
    console.error("Failed to get cart context:", error);
    return { sessionCartId: undefined, userId: undefined };
  }
}

/**
 * Gets product by ID with proper error handling
 */
async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  return product;
}

/**
 * Updates cart in database with proper error handling
 */
async function updateCartInDb(
  cartId: string,
  items: CartItem[],
  productSlug: string
): Promise<void> {
  await prisma.cart.update({
    where: { id: cartId },
    data: {
      items: items as Prisma.CartUpdateitemsInput[],
      ...calcPrice(items),
    },
  });

  // Revalidate relevant paths
  revalidatePath(`/product/${productSlug}`);
  revalidatePath("/cart");
}

/**
 * Creates a new cart in database
 */
async function createNewCart(
  item: CartItem,
  context: CartContext
): Promise<Cart> {
  const newCartData = insertCartSchema.parse({
    userId: context.userId,
    sessionCartId: context.sessionCartId,
    items: [item],
    ...calcPrice([item]),
  });

  const cart = await prisma.cart.create({
    data: newCartData,
  });

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

// ========================================
// Public API Functions
// ========================================

/**
 * Gets the current user's cart
 */
export async function getMyCart(): Promise<Cart | undefined> {
  try {
    const { sessionCartId, userId } = await getCartContext();

    // Return early if no valid context
    if (!sessionCartId && !userId) {
      return undefined;
    }

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
    console.error("Failed to get cart:", error);
    return undefined;
  }
}

/**
 * Gets the current cart item count
 */
export async function getCartCount(): Promise<number> {
  try {
    const { sessionCartId, userId } = await getCartContext();

    if (!sessionCartId) return 0;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
      select: { items: true },
    });

    if (!cart?.items) return 0;

    const items = convertToPlainObject(cart.items as CartItem[]);
    return items.reduce((total, item) => total + (item?.qty || 0), 0);
  } catch (error) {
    console.error("Failed to get cart count:", error);
    return 0;
  }
}

/**
 * Adds an item to the cart
 */
export async function addItemToCart(data: CartItem): Promise<CartResult> {
  try {
    const context = await getCartContext();

    if (!context.sessionCartId) {
      return {
        success: false,
        message: "No valid session found. Please refresh the page.",
      };
    }

    const item = cartItemSchema.parse(data);
    const product = await getProductById(item.productId);

    // Check initial stock
    if (product.stock < 1) {
      return {
        success: false,
        message: `${product.name} is out of stock`,
      };
    }

    const cart = await getMyCart();

    // Create new cart if none exists
    if (!cart) {
      await createNewCart(item, context);
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    }

    // Handle existing cart
    const existingItem = (cart.items as CartItem[]).find(
      (x) => x.productId === item.productId
    );

    if (existingItem) {
      // Check stock for quantity increase
      if (product.stock < existingItem.qty + 1) {
        return {
          success: false,
          message: `Only ${product.stock} ${product.name}(s) available`,
        };
      }
      existingItem.qty += 1;
    } else {
      // Add new item to existing cart
      cart.items.push(item);
    }

    await updateCartInDb(cart.id, cart.items as CartItem[], product.slug);

    return {
      success: true,
      message: `${product.name} ${
        existingItem ? "updated in" : "added to"
      } cart`,
    };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Removes an item from the cart
 */
export async function removeItemFromCart(
  productId: string
): Promise<CartResult> {
  try {
    const context = await getCartContext();

    if (!context.sessionCartId) {
      return {
        success: false,
        message: "No valid session found",
      };
    }

    const product = await getProductById(productId);
    const cart = await getMyCart();

    if (!cart) {
      return {
        success: false,
        message: "Cart not found",
      };
    }

    const existingItem = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );

    if (!existingItem) {
      return {
        success: false,
        message: "Item not found in cart",
      };
    }

    let updatedItems: CartItem[];

    if (existingItem.qty === 1) {
      // Remove item completely
      updatedItems = (cart.items as CartItem[]).filter(
        (x) => x.productId !== productId
      );
    } else {
      // Decrease quantity
      existingItem.qty -= 1;
      updatedItems = cart.items as CartItem[];
    }

    await updateCartInDb(cart.id, updatedItems, product.slug);

    return {
      success: true,
      message: `${product.name} ${
        existingItem.qty === 1 ? "removed from" : "updated in"
      } cart`,
    };
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/**
 * Clears the entire cart
 */
export async function clearCart(): Promise<CartResult> {
  try {
    const context = await getCartContext();

    if (!context.sessionCartId) {
      return { success: false, message: "No valid session found" };
    }

    await prisma.cart.deleteMany({
      where: context.userId
        ? { userId: context.userId }
        : { sessionCartId: context.sessionCartId },
    });

    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart cleared successfully",
    };
  } catch (error) {
    console.error("Failed to clear cart:", error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}
