"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@app/store";
import {
  addToCart,
  decreaseCartItem,
  getProductPrice,
  removeFromCart,
  selectCartItems,
  useGetProductsQuery,
} from "@entities/product";
import {
  Button,
  Card,
  EmptyState,
  Price,
  ProductImage,
  Skeleton,
} from "@shared/ui";

import styles from "./cart-page.module.scss";

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function CartSkeleton() {
  return (
    <div
      className={styles.content}
      aria-label="Загрузка корзины"
      aria-busy="true"
    >
      <div className={styles.list}>
        {Array.from({ length: 3 }, (_, index) => (
          <Card className={styles.skeleton} key={index} as="div">
            <Skeleton className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <Skeleton width="72%" height={20} />
              <Skeleton width="40%" height={24} />
            </div>
          </Card>
        ))}
      </div>
      <Card className={styles.summary} as="div">
        <Skeleton width="60%" height={20} />
        <Skeleton width="80%" height={28} />
      </Card>
    </div>
  );
}

export function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const { data, isError, isLoading, refetch } = useGetProductsQuery();
  const cartIds = useMemo(
    () => Object.keys(cartItems).map(Number),
    [cartItems],
  );

  if (cartIds.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавленные товары появятся на этой странице."
      />
    );
  }

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить корзину"
        description="Проверьте подключение и попробуйте еще раз."
        action={<Button onClick={() => void refetch()}>Повторить</Button>}
      />
    );
  }

  const products =
    data?.items
      .filter((product) => cartIds.includes(product.id))
      .map((product) => ({
        product,
        quantity: cartItems[product.id] ?? 0,
      }))
      .filter((item) => item.quantity > 0) ?? [];
  const totalCount = products.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = products.reduce(
    (total, item) => total + getProductPrice(item.product) * item.quantity,
    0,
  );

  if (products.length === 0) {
    return (
      <EmptyState
        title="Товары недоступны"
        description="Товары из корзины не пришли в ответе каталога."
      />
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.list}>
        {products.map(({ product, quantity }) => (
          <Card className={styles.item} key={product.id} as="article">
            <ProductImage
              className={styles.image}
              src={product.preview_picture}
              alt={product.name}
              sizes="96px"
            />
            <div className={styles.info}>
              <h2>{product.name}</h2>
              <Price
                value={getProductPrice(product)}
                oldValue={product.price}
              />
            </div>
            <div className={styles.quantity} aria-label="Количество">
              <button
                type="button"
                className={styles.quantityButton}
                aria-label="Уменьшить количество"
                onClick={() => dispatch(decreaseCartItem(product.id))}
              >
                <Minus
                  className={styles.actionIcon}
                  aria-hidden="true"
                  size={20}
                  strokeWidth={2.4}
                />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                className={styles.quantityButton}
                aria-label="Увеличить количество"
                onClick={() => dispatch(addToCart(product.id))}
              >
                <Plus
                  className={styles.actionIcon}
                  aria-hidden="true"
                  size={20}
                  strokeWidth={2.4}
                />
              </button>
            </div>
            <button
              type="button"
              className={styles.remove}
              aria-label="Удалить из корзины"
              onClick={() => dispatch(removeFromCart(product.id))}
            >
              <Trash2
                className={styles.actionIcon}
                aria-hidden="true"
                size={20}
                strokeWidth={2.4}
              />
            </button>
          </Card>
        ))}
      </div>
      <Card className={styles.summary} as="div">
        <h2>Итого</h2>
        <div className={styles.summaryRow}>
          <span>Товаров</span>
          <strong>{totalCount}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Сумма</span>
          <strong>{priceFormatter.format(totalPrice)}</strong>
        </div>
      </Card>
    </div>
  );
}