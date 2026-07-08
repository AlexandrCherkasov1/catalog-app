import type { ReactNode } from "react";

import styles from "./empty-state.module.scss";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const classes = [styles.emptyState, className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}