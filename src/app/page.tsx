import { ProductCatalog } from "@widgets/product-catalog";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Огнестрельное оружие</h1>
        <ProductCatalog />
      </div>
    </main>
  );
}