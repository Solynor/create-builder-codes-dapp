import { create } from "zustand";

interface User {
  address: string;
  persistTradingConnection: boolean;
  builderFee: number;
  agent: Agent | null;
}

interface Agent {
  privateKey: `0x${string}`;
  address: `0x${string}`;
}

interface UserStoreState {
  user: User | null;
  login: (user: User) => void;
  updateBuilderFee: (builderFee: number) => void;
  updatePersistTradingConnection: (persistTradingConnection: boolean) => void;
  updateAgent: (agent: Agent) => void;
  // reset state
  logout: () => void;
}

const useUserStore = create<UserStoreState>()((set) => ({
  user: null,
  login: (user) => {
    localStorage.setItem(
      `test_spot_trader.user_${user.address}`,
      JSON.stringify(user)
    );
    set({ user });
  },
  updateBuilderFee: (builderFee) =>
    set((state) => {
      if (!state.user) return { user: null };
      const updatedUser = {
        ...state.user,
        builderFee,
      };
      localStorage.setItem(
        `test_spot_trader.user_${state.user.address}`,
        JSON.stringify(updatedUser)
      );
      return { user: updatedUser };
    }),
  updatePersistTradingConnection: (persistTradingConnection) =>
    set((state) => {
      if (!state.user) return { user: null };
      const updatedUser = {
        ...state.user,
        persistTradingConnection,
      };
      localStorage.setItem(
        `test_spot_trader.user_${state.user.address}`,
        JSON.stringify(updatedUser)
      );
      return { user: updatedUser };
    }),
  updateAgent: (agent) =>
    set((state) => {
      if (!state.user) return { user: null };
      const updatedUser = {
        ...state.user,
        agent,
      };
      localStorage.setItem(
        `test_spot_trader.user_${state.user.address}`,
        JSON.stringify(updatedUser)
      );
      return { user: updatedUser };
    }),
  logout: () => {
    set({ user: null });
  },
}));

export default useUserStore;
