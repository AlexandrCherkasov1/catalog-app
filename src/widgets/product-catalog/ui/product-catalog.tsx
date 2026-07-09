"use client";

import { ProductCard, useGetProductsQuery } from "@entities/product";
import { Button, Card, EmptyState, Skeleton } from "@shared/ui";

import styles from "./product-catalog.module.scss";

const SKELETON_COUNT = 8;

function CatalogSkeleton() {
  return (
    <div className={styles.grid} aria-label="Загрузка товаров" aria-busy="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <Card className={styles.skeletonCard} key={index}>
          <Skeleton className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <Skeleton width="35%" height={14} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="75%" height={20} />
            <Skeleton width="55%" height={24} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ProductCatalog() {
  const { data, isError, isLoading, refetch } = useGetProductsQuery();

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить товары"
        description="Проверьте подключение к интернету и попробуйте ещё раз."
        action={<Button onClick={() => void refetch()}>Повторить</Button>}
      />
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="Товары не найдены"
        description="В каталоге пока нет доступных товаров."
      />
    );
  }

  return (
    <>
      <p className={styles.count}>Товаров: {data.count_items}</p>
      <div className={styles.grid}>
        {data.items.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>
    </>
  );
}