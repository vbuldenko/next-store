"use client";

import { getFullUserInfoById } from "@/lib/actions/user.actions";
import { User } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function Row({
  desc,
  value,
  children,
}: {
  desc: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-[2.125rem] grid grid-cols-2 items-center relative">
      <span className="text-xs font-semibold block flex-shrink-0">{desc}</span>
      <span className="text-xs text-[#7D7D7E] font-mono block relative">
        <span className="block truncate w-full">{value}</span>
        {children}
      </span>
    </div>
  );
}

function PointerC({ label }: { label: string }) {
  return (
    <div className="absolute w-fit flex items-center gap-5 top-1/2 -translate-y-1/2 left-full">
      <div className="relative">
        <div className="h-px bg-[#BFBFC4] w-[6.5rem]" />
        <div className="size-1 bg-[#BFBFC4] rotate-45 absolute right-0 top-1/2 -translate-y-1/2" />
      </div>
      <div className="font-mono text-xs bg-black px-1.5 py-1 rounded-md text-white">
        {label}
      </div>
    </div>
  );
}

function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateWithNumbers(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("uk-UA", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      getFullUserInfoById(session.data.user.id).then(setUser);
    }
  }, [session.status, session.data?.user.id]);

  if (session.status !== "authenticated") return null;

  return (
    <div className="p-16 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] relative">
      <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5 max-w-[25rem]">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-full relative flex justify-center">
            <Image
              src={user?.image || "/default-user.png"}
              alt={user?.name || "User"}
              className="size-20 rounded-full"
              width={80}
              height={80}
            />
            <PointerC label="user.image" />
          </div>

          {user?.name ? (
            <h1 className="text-[1.0625rem] font-semibold relative w-full text-center">
              {user.name}
              <div className="absolute w-fit flex items-center gap-5 top-1/2 -translate-x-2.5 -translate-y-1/2 left-full">
                <div className="relative">
                  <div className="h-px bg-[#BFBFC4] w-[6.5rem]" />
                  <div className="size-1 bg-[#BFBFC4] rotate-45 absolute right-0 top-1/2 -translate-y-1/2" />
                </div>
                <div className="font-mono text-xs bg-black px-1.5 py-1 rounded-md text-white">
                  user.firstName
                </div>
                <div className="font-mono text-xs bg-black px-1.5 py-1 rounded-md text-white -translate-x-3">
                  user.lastName
                </div>
              </div>
            </h1>
          ) : (
            <div className="h-4" />
          )}
        </div>

        {user && (
          <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
            <Row desc="User ID" value={user.id}>
              <PointerC label="user.id" />
            </Row>
            <Row desc="Email" value={user.email}>
              <PointerC label="user.email" />
            </Row>
            <Row desc="Joined on" value={formatDate(user.createdAt)}>
              <PointerC label="user.createdAt" />
            </Row>
          </div>
        )}

        <h2 className="mt-6 mb-4 text-[0.9375rem] font-semibold">
          Session details
        </h2>
        <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
          <Row desc="Status" value={session.status}>
            <PointerC label="session.status" />
          </Row>
          <Row
            desc="Session expiration"
            value={formatDateWithNumbers(session.data.expires)}
          >
            <PointerC label="session.data.expires" />
          </Row>
        </div>

        {user?.cart && (
          <>
            <h2 className="mt-6 mb-4 text-[0.9375rem] font-semibold">
              User cart details
            </h2>
            <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
              <Row
                desc="Cart State"
                value={user.cart.length > 0 ? "Active" : "Empty"}
              >
                <PointerC label="user.cart.length" />
              </Row>
              <Row
                desc="Cart session ID"
                value={user.cart?.[0]?.sessionCartId || ""}
              >
                <PointerC label="cart.[0].sessionCartId" />
              </Row>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
