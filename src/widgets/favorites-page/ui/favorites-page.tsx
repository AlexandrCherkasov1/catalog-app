"use client";

import { Trash2 } from "lucide-react";

import {
  getProductPrice,
  removeFromFavorites,
  selectFavoriteIds,
  useGetProductsQuery,
} from "@entities/product";
import { useAppDispatch, useAppSelector } from "@app/store";
import {
  Button,
  Card,
  EmptyState,
  Price,
  ProductImage,
  Skeleton,
} from "@shared/ui";

import styles from "./favorites-page.module.scss";

function FavoritesSkeleton() {
  return (
    <div
      className={styles.list}
      aria-label="Загрузка избранного"
      aria-busy="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Card className={styles.skeleton} key={index} as="div">
          <Skeleton className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <Skeleton width="70%" height={20} />
            <Skeleton width="36%" height={24} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const { data, isError, isLoading, refetch } = useGetProductsQuery();

  if (favoriteIds.length === 0) {
    return (
      <EmptyState
        title="В избранном пока пусто"
        description="Добавленные товары появятся на этой странице."
      />
    );
  }

  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить избранное"
        description="Проверьте подключение и попробуйте еще раз."
        action={<Button onClick={() => void refetch()}>Повторить</Button>}
      />
    );
  }

  const products =
    data?.items.filter((product) => favoriteIds.includes(product.id)) ?? [];

  if (products.length === 0) {
    return (
      <EmptyState
        title="Товары недоступны"
        description="Выбранные товары не пришли в ответе каталога."
      />
    );
  }

  return (
    <div className={styles.list}>
      {products.map((product) => (
        <Card className={styles.item} key={product.id} as="article">
          <ProductImage
            className={styles.image}
            src={product.preview_picture}
            alt={product.name}
            sizes="96px"
          />
          <div className={styles.info}>
            <span
              className={
                product.available ? styles.available : styles.unavailable
              }
            >
              {product.available ? "В наличии" : "Нет в наличии"}
            </span>
            <h2>{product.name}</h2>
            <Price value={getProductPrice(product)} oldValue={product.price} />
          </div>
          <Button
            className={styles.remove}
            variant="outline"
            aria-label="Удалить из избранного"
            onClick={() => dispatch(removeFromFavorites(product.id))}
          >
            <Trash2 className={styles.actionIcon} aria-hidden="true" />
          </Button>
        </Card>
      ))}
    </div>
  );
}