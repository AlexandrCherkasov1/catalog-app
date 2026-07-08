import type { HTMLAttributes } from "react";

import styles from "./price.module.scss";

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

type PriceProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number;
  oldValue?: number;
};

export function Price({ value, oldValue, className, ...props }: PriceProps) {
  const classes = [styles.price, className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      <span className={styles.current}>{priceFormatter.format(value)}</span>
      {oldValue !== undefined && oldValue > value && (
        <span className={styles.old}>{priceFormatter.format(oldValue)}</span>
      )}
    </div>
  );
}