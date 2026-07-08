import type { CSSProperties, HTMLAttributes } from "react";

import styles from "./skeleton.module.scss";

type SkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
};

export function Skeleton({
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const classes = [styles.skeleton, className].filter(Boolean).join(" ");

  return (
    <span
      aria-hidden="true"
      className={classes}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}