"use client";

import { Heart } from "lucide-react";
import { useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@app/store";
import { Button } from "@shared/ui";

import {
  addToCart,
  addToFavorites,
  selectIsProductFavorite,
  selectIsProductInCart,
  type ProductDto,
} from "../../model";
import styles from "./product-actions.module.scss";

interface ProductActionsProps {
  className?: string;
  product: ProductDto;
}

export function ProductActions({ className, product }: ProductActionsProps) {
  const dispatch = useAppDispatch();
  const selectInCart = useMemo(
    () => selectIsProductInCart(product.id),
    [product.id],
  );
  const selectFavorite = useMemo(
    () => selectIsProductFavorite(product.id),
    [product.id],
  );
  const isInCart = useAppSelector(selectInCart);
  const isFavorite = useAppSelector(selectFavorite);
  const cartText = product.available
    ? isInCart
      ? "В корзине"
      : "В корзину"
    : "Отсутствует";
  const classes = [styles.actions, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <Button
        fullWidth
        disabled={!product.available || isInCart}
        onClick={() => dispatch(addToCart(product.id))}
      >
        {cartText}
      </Button>
      <Button
        className={styles.favorite}
        variant={isFavorite ? "primary" : "outline"}
        disabled={isFavorite}
        aria-label={isFavorite ? "В избранном" : "В избранное"}
        onClick={() => dispatch(addToFavorites(product.id))}
      >
        <Heart aria-hidden="true" size={20} />
      </Button>
    </div>
  );
}