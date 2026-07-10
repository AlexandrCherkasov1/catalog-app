import { Suspense } from "react";

import { Header } from "@widgets/header";

import styles from "./app-layout.module.scss";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {children}
    </div>
  );
}