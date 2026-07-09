"use client";

import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./header.module.scss";

const navigation = [
  {
    href: "/favorites",
    label: "Избранное",
    icon: Heart,
  },
  {
    href: "/cart",
    label: "Корзина",
    icon: ShoppingBag,
  },
];

export function Header() {
  const pathname = usePathname();
  const isCatalogActive = pathname === "/";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.primary}>
          <Link className={styles.logo} href="/" aria-label="На главную">
            <Image
              src="/logo.webp"
              alt="ОхотАктив"
              width={50}
              height={50}
              priority
            />
          </Link>

          <Link
            className={`${styles.catalog} ${isCatalogActive ? styles.active : ""}`}
            href="/"
            aria-current={isCatalogActive ? "page" : undefined}
          >
            <Menu aria-hidden="true" size={20} />
            <span>Каталог</span>
          </Link>

          <div className={styles.search} aria-hidden="true">
            <span>Искать в ОхотАктив</span>
            <Search size={22} />
          </div>
        </div>

        <nav aria-label="Основная навигация">
          <ul className={styles.navigation}>
            {navigation.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;

              return (
                <li key={href}>
                  <Link
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles.icon}>
                      <Icon aria-hidden="true" size={24} strokeWidth={2} />
                      <span className={styles.count}>0</span>
                    </span>
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}