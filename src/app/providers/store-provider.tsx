"use client";

import { useRef } from "react";
import { Provider } from "react-redux";

import { createAppStore } from "../store";
import type { AppStore } from "../store";
import { PersistProductState } from "./persist-product-state";

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createAppStore();
  }

  return (
    <Provider store={storeRef.current}>
      <PersistProductState />
      {children}
    </Provider>
  );
}