"use client";

import { Heart, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useAppSelector } from "@app/store";
import {
  getProductPrice,
  selectCartTotalCount,
  selectFavoritesCount,
  useGetProductsQuery,
} from "@entities/product";
import { Price } from "@shared/ui";

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

const HEADER_SEARCH_DEBOUNCE_MS = 300;
const HEADER_SEARCH_RESULTS_LIMIT = 5;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCatalogActive = pathname === "/";
  const currentSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(currentSearch);
  const normalizedSearch = searchValue.trim().toLowerCase();
  const { data } = useGetProductsQuery();
  const cartCount = useAppSelector(selectCartTotalCount);
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const countsByHref: Record<string, number> = {
    "/favorites": favoritesCount,
    "/cart": cartCount,
  };

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const value = searchValue.trim();

      if (value === currentSearch) {
        return;
      }

      router.replace(value ? `/?search=${encodeURIComponent(value)}` : "/", {
        scroll: false,
      });
    }, HEADER_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [currentSearch, pathname, router, searchValue]);

  const searchResults = useMemo(() => {
    if (!data || normalizedSearch.length < 2) {
      return [];
    }

    return data.items
      .filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch),
      )
      .slice(0, HEADER_SEARCH_RESULTS_LIMIT);
  }, [data, normalizedSearch]);

  const isSearchResultsVisible = normalizedSearch.length >= 2;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = searchValue.trim();

    if (value === "") {
      router.push("/");
      return;
    }

    router.push(`/?search=${encodeURIComponent(value)}`);
  }

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
            <span>Каталог</span>
          </Link>

          <form className={styles.search} onSubmit={handleSearchSubmit}>
            <div className={styles.searchField}>
              <input
                value={searchValue}
                type="search"
                placeholder="Искать в ОхотАктив"
                aria-label="Поиск товаров"
                aria-controls="header-search-results"
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <button type="submit" aria-label="Найти">
                <Search aria-hidden="true" size={22} />
              </button>
            </div>
            {isSearchResultsVisible && (
              <div className={styles.searchResults} id="header-search-results">
                {searchResults.length > 0 ? (
                  <>
                    <ul>
                      {searchResults.map((product) => (
                        <li key={product.id}>
                          <Link href={`/product/${product.id}`}>
                            <span>{product.name}</span>
                            <Price value={getProductPrice(product)} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      className={styles.searchAll}
                      href={`/?search=${encodeURIComponent(searchValue.trim())}`}
                    >
                      Все результаты
                    </Link>
                  </>
                ) : (
                  <p>Ничего не найдено</p>
                )}
              </div>
            )}
          </form>
        </div>

        <nav aria-label="Основная навигация">
          <ul className={styles.navigation}>
            {navigation.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              const count = countsByHref[href] ?? 0;

              return (
                <li key={href}>
                  <Link
                    className={`${styles.link} ${isActive ? styles.active : ""}`}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles.icon}>
                      <Icon aria-hidden="true" size={24} strokeWidth={2} />
                      <span className={styles.count}>{count}</span>
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