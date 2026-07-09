import { CartPage } from "@widgets/cart-page";

import styles from "../page.module.scss";

export default function Cart() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Корзина</h1>
        <CartPage />
      </div>
    </main>
  );
}