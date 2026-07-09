"use client";

import { useEffect, useRef, useState } from "react";

import { ProductCard, useGetProductsQuery } from "@entities/product";
import { Button, Card, EmptyState, Skeleton } from "@shared/ui";

import styles from "./product-catalog.module.scss";

const SKELETON_COUNT = 8;
const INITIAL_VISIBLE_COUNT = 8;
const VISIBLE_COUNT_STEP = 8;

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
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [data?.items.length]);

  useEffect(() => {
    const loader = loaderRef.current;

    if (!loader || !data || visibleCount >= data.items.length) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + VISIBLE_COUNT_STEP, data.items.length),
          );
        }
      },
      {
        rootMargin: "240px",
      },
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [data, visibleCount]);

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить товары"
        description="Проверьте подключение к интернету и попробуйте еще раз."
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

  const visibleItems = data.items.slice(0, visibleCount);
  const hasMoreItems = visibleCount < data.items.length;

  return (
    <>
      <p className={styles.count}>Товаров: {data.count_items}</p>
      <div className={styles.grid}>
        {visibleItems.map((product, index) => (
          <div className={styles.item} key={product.id}>
            <ProductCard product={product} priority={index < 4} />
          </div>
        ))}
      </div>
      {hasMoreItems && <div className={styles.loader} ref={loaderRef} />}
    </>
  );
}