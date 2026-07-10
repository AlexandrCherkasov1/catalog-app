"use client";

import Link from "next/link";

import {
  getProductPrice,
  ProductActions,
  useGetProductsQuery,
} from "@entities/product";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Price,
  ProductImage,
  Skeleton,
} from "@shared/ui";

import styles from "./product-details.module.scss";

interface ProductDetailsProps {
  productId: number;
}

function ProductDetailsSkeleton() {
  return (
    <div
      className={styles.details}
      aria-label="Загрузка товара"
      aria-busy="true"
    >
      <Card className={styles.preview} as="div">
        <Skeleton className={styles.imageSkeleton} />
      </Card>
      <div className={styles.info}>
        <Skeleton width="80%" height={32} />
        <Skeleton width="40%" height={28} />
        <Skeleton width="100%" height={50} />
        <Skeleton width="70%" height={120} />
      </div>
    </div>
  );
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const { data, isError, isLoading, refetch } = useGetProductsQuery();

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить товар"
        description="Проверьте подключение и попробуйте еще раз."
        action={<Button onClick={() => void refetch()}>Повторить</Button>}
      />
    );
  }

  const product = data?.items.find((item) => item.id === productId);

  if (!product) {
    return (
      <EmptyState
        title="Товар не найден"
        description="Вернитесь в каталог и выберите другой товар."
        action={<Button onClick={() => window.history.back()}>Назад</Button>}
      />
    );
  }

  const labels = Object.values(product.labels);
  const hasDiscount = product.price_discount < product.price;

  return (
    <>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <Link href="/">Каталог</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <div className={styles.details}>
        <Card className={styles.preview} as="div">
          <div className={styles.labels}>
            {labels.map((label) => (
              <Badge key={label} variant="warning">
                {label}
              </Badge>
            ))}
          </div>
          <ProductImage
            src={product.preview_picture}
            alt={product.name}
            sizes="(max-width: 767px) 100vw, 520px"
            priority
          />
        </Card>
        <div className={styles.info}>
          <span
            className={
              product.available ? styles.available : styles.unavailable
            }
          >
            {product.available ? "В наличии" : "Нет в наличии"}
          </span>
          <h1>{product.name}</h1>
          <Price
            className={styles.price}
            value={getProductPrice(product)}
            oldValue={hasDiscount ? product.price : undefined}
          />
          <ProductActions product={product} />
          <Card className={styles.meta} as="div">
            <h2>Информация</h2>
            <dl>
              <div>
                <dt>Код товара</dt>
                <dd>{product.id}</dd>
              </div>
              <div>
                <dt>Остаток</dt>
                <dd>{product.quantity}</dd>
              </div>
              <div>
                <dt>Отзывы</dt>
                <dd>{product.reviews}</dd>
              </div>
            </dl>
          </Card>
          <Card className={styles.characteristics} as="div">
            <h2>Характеристики</h2>
            <dl>
              {product.characteristics.map((characteristic) => (
                <div key={characteristic.name}>
                  <dt>{characteristic.label}</dt>
                  <dd>{characteristic.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}