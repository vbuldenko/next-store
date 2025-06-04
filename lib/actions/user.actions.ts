"use server";

import { ShippingAddress } from "@/types";
import prisma from "../db/prisma";
import { auth } from "@/auth";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  updateUserSchema,
} from "../validators";
import { formatError } from "../utils";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@/generated/client";
import { revalidatePath } from "next/cache";

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}
export async function getFullUserInfoById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      accounts: true,
      sessions: true,
      cart: true,
    },
  });
  if (!user) throw new Error("User not found");
  return JSON.parse(JSON.stringify(user));
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User ID is missing from session");
    }
    const currentUser = await getUserById(session.user.id);

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User ID is missing from session");
    }
    const currentUser = await getUserById(session.user.id);

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("User ID is missing from session");
    }
    const currentUser = await getUserById(session.user.id);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
