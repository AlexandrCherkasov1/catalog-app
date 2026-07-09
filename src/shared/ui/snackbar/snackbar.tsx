import type { ReactNode } from "react";

import styles from "./snackbar.module.scss";

interface SnackbarProps {
  actionLabel?: string;
  children: ReactNode;
  onAction?: () => void;
}

export function Snackbar({ actionLabel, children, onAction }: SnackbarProps) {
  return (
    <div className={styles.snackbar} role="status" aria-live="polite">
      <span>{children}</span>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}