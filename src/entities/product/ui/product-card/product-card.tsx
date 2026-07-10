"use client";

import Link from "next/link";

import { Badge, Card, Price, ProductImage } from "@shared/ui";

import { getProductPrice } from "../../lib";
import type { ProductDto } from "../../model";
import { ProductActions } from "../product-actions";
import styles from "./product-card.module.scss";

interface ProductCardProps {
  product: ProductDto;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasDiscount = product.price_discount < product.price;
  const labels = Object.values(product.labels);
  const productHref = `/product/${product.id}`;

  return (
    <Card className={styles.card}>
      <div className={styles.image}>
        <div className={styles.labels}>
          {labels.map((label) => (
            <Badge key={label} variant="warning">
              {label}
            </Badge>
          ))}
        </div>
        <Link href={productHref} aria-label={product.name}>
          <ProductImage
            src={product.preview_picture}
            alt={product.name}
            sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
            priority={priority}
          />
        </Link>
      </div>

      <div className={styles.content}>
        <span
          className={product.available ? styles.available : styles.unavailable}
        >
          {product.available ? "В наличии" : "Нет в наличии"}
        </span>
        <h2 className={styles.name}>
          <Link href={productHref}>{product.name}</Link>
        </h2>
        <dl className={styles.characteristics}>
          {product.characteristics.slice(0, 2).map((characteristic) => (
            <div key={characteristic.name}>
              <dt>{characteristic.label}</dt>
              <dd>{characteristic.value}</dd>
            </div>
          ))}
        </dl>
        <Price
          className={styles.price}
          value={getProductPrice(product)}
          oldValue={hasDiscount ? product.price : undefined}
        />
        <ProductActions className={styles.actions} product={product} />
      </div>
    </Card>
  );
}