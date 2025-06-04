"use client";

import { getFullUserInfoById } from "@/lib/actions/user.actions";
import { User } from "@/types";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

function Row({
  desc,
  value,
  children,
}: {
  desc: string;
  value: string;
  children?: React.ReactNode;
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

// function PointerC({ label }: { label: string }) {
//   return (
//     <div className="absolute w-fit flex items-center gap-5 top-1/2 -translate-y-1/2 left-full">
//       <div className="relative">
//         <div className="h-px bg-[#BFBFC4] w-[6.5rem]" />
//         <div className="size-1 bg-[#BFBFC4] rotate-45 absolute right-0 top-1/2 -translate-y-1/2" />
//       </div>
//       <div className="font-mono text-xs bg-black px-1.5 py-1 rounded-md text-white">
//         {label}
//       </div>
//     </div>
//   );
// }

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
    // <div className="p-8 rounded-lg border border-[#EDEDED] bg-[#F1F1F2] relative flex-center">
    <div className="p-8 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-full relative flex justify-center">
          <Image
            src={user?.image || "/next.svg"}
            alt={user?.name || "User"}
            className="size-20 rounded-full"
            width={80}
            height={80}
          />
        </div>

        {user?.name ? (
          <h1 className="text-[1.0625rem] font-semibold relative w-full text-center">
            {user.name}
            {/* <PointerC label="user.name" /> */}
          </h1>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {user && (
        <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
          <Row desc="User ID" value={user.id}></Row>
          <Row desc="Email" value={user.email}></Row>
          <Row desc="Joined on" value={formatDate(user.createdAt)}></Row>
        </div>
      )}

      <h2 className="mt-6 mb-4 text-[0.9375rem] font-semibold">
        Session details
      </h2>
      <div className="px-2.5 bg-[#FAFAFB] rounded-lg divide-y divide-[#EEEEF0]">
        <Row desc="Status" value={session.status}></Row>
        <Row
          desc="Session expiration"
          value={formatDateWithNumbers(session.data.expires)}
        ></Row>
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
            ></Row>
            <Row
              desc="Cart session ID"
              value={user.cart?.[0]?.sessionCartId || ""}
            ></Row>
          </div>
        </>
      )}

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full mt-6 flex items-center justify-center gap-2 h-10 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 font-medium text-sm"
      >
        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
        Sign Out
      </button>
    </div>
    // </div>
  );
}
