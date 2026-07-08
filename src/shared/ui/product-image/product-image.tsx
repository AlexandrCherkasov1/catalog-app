"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

import styles from "./product-image.module.scss";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: CSSProperties["aspectRatio"];
};

export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  aspectRatio = "1 / 1",
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !src || failedSrc === src;
  const classes = [styles.wrapper, className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={{ aspectRatio }}>
      {showFallback ? (
        <span className={styles.fallback}>Нет изображения</span>
      ) : (
        <Image
          fill
          alt={alt}
          sizes={sizes}
          src={src}
          priority={priority}
          className={styles.image}
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  );
}