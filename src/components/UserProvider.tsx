"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import useUserStore from "@/lib/store";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address } = useAccount();
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    if (address) {
      const user = localStorage.getItem(`test_spot_trader.user_${address}`);
      const userData = user ? JSON.parse(user) : null;

      login({
        address,
        persistTradingConnection: userData?.persistTradingConnection
          ? userData?.persistTradingConnection === "true"
          : false,
        builderFee: userData?.builderFee ? Number(userData?.builderFee) : 0,
        agent: userData?.agent ? userData?.agent : null,
      });
    } else {
      logout();
    }
  }, [address]);

  useEffect(() => {
    console.log({ user });
  }, [user]);

  return <>{children}</>;
}
