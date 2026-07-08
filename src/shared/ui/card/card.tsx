import type { HTMLAttributes } from "react";

import styles from "./card.module.scss";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div";
};

export function Card({
  as: Component = "article",
  className,
  ...props
}: CardProps) {
  const classes = [styles.card, className].filter(Boolean).join(" ");

  return <Component className={classes} {...props} />;
}