import { FavoritesPage } from "@widgets/favorites-page";

import styles from "../page.module.scss";

export default function Favorites() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Избранное</h1>
        <FavoritesPage />
      </div>
    </main>
  );
}