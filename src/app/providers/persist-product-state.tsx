"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@app/store";
import {
  hydrateCart,
  hydrateFavorites,
  selectCartItems,
  selectFavoriteIds,
} from "@entities/product";

const STORAGE_KEY = "ohota:product-state";

type ProductId = number;

interface PersistedProductState {
  cartItems: Record<ProductId, number>;
  favoriteIds: ProductId[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeProductId(value: unknown) {
  const productId = Number(value);

  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

function normalizeCartItems(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<ProductId, number>>(
    (items, [rawProductId, rawQuantity]) => {
      const productId = normalizeProductId(rawProductId);
      const quantity = Number(rawQuantity);

      if (productId !== null && Number.isInteger(quantity) && quantity > 0) {
        items[productId] = quantity;
      }

      return items;
    },
    {},
  );
}

function normalizeFavoriteIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map(normalizeProductId)
        .filter((productId): productId is ProductId => productId !== null),
    ),
  );
}

function readPersistedProductState(): PersistedProductState {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (rawValue === null) {
      return {
        cartItems: {},
        favoriteIds: [],
      };
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isRecord(parsedValue)) {
      return {
        cartItems: {},
        favoriteIds: [],
      };
    }

    return {
      cartItems: normalizeCartItems(parsedValue.cartItems),
      favoriteIds: normalizeFavoriteIds(parsedValue.favoriteIds),
    };
  } catch {
    return {
      cartItems: {},
      favoriteIds: [],
    };
  }
}

function writePersistedProductState(state: PersistedProductState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

export function PersistProductState() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    const persistedState = readPersistedProductState();

    dispatch(hydrateCart(persistedState.cartItems));
    dispatch(hydrateFavorites(persistedState.favoriteIds));
    setIsRestored(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isRestored) {
      return;
    }

    writePersistedProductState({
      cartItems,
      favoriteIds,
    });
  }, [cartItems, favoriteIds, isRestored]);

  return null;
}