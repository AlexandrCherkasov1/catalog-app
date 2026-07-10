"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  ALL_CATALOG_FILTER_VALUE,
  filterAndSortProducts,
  getCatalogCategories,
  getCatalogPage,
  getCatalogProductTypes,
  ProductCard,
  PRODUCTS_PER_PAGE,
  useGetProductsQuery,
  type AvailabilityFilter,
  type CatalogSortValue,
} from "@entities/product";
import { Button, Card, EmptyState, Skeleton } from "@shared/ui";

import styles from "./product-catalog.module.scss";

const SKELETON_COUNT = 8;
const SEARCH_DEBOUNCE_MS = 350;

function CatalogSkeleton() {
  return (
    <div className={styles.grid} aria-label="Загрузка товаров" aria-busy="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <Card className={styles.skeletonCard} key={index}>
          <Skeleton className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <Skeleton width="35%" height={14} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="75%" height={20} />
            <Skeleton width="55%" height={24} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") ?? "";
  const { data, isError, isLoading, refetch } = useGetProductsQuery();
  const [searchValue, setSearchValue] = useState(querySearch);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(querySearch);
  const [availability, setAvailability] = useState<AvailabilityFilter>(
    ALL_CATALOG_FILTER_VALUE,
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState(ALL_CATALOG_FILTER_VALUE);
  const [productType, setProductType] = useState(ALL_CATALOG_FILTER_VALUE);
  const [sort, setSort] = useState<CatalogSortValue>("default");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    setSearchValue(querySearch);
    setDebouncedSearchValue(querySearch.trim().toLowerCase());
  }, [querySearch]);

  const categories = useMemo(() => {
    if (!data) {
      return [];
    }

    return getCatalogCategories(data.items);
  }, [data]);

  const productTypes = useMemo(() => {
    if (!data) {
      return [];
    }

    return getCatalogProductTypes(data.items);
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data) {
      return [];
    }

    return filterAndSortProducts(data.items, {
      availability,
      category,
      maxPrice,
      minPrice,
      productType,
      search: debouncedSearchValue,
      sort,
    });
  }, [
    availability,
    category,
    data,
    debouncedSearchValue,
    maxPrice,
    minPrice,
    productType,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const pageProducts = getCatalogPage(filteredProducts, currentPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    availability,
    category,
    debouncedSearchValue,
    maxPrice,
    minPrice,
    productType,
    sort,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function resetFilters() {
    setSearchValue("");
    setDebouncedSearchValue("");
    setAvailability(ALL_CATALOG_FILTER_VALUE);
    setMinPrice("");
    setMaxPrice("");
    setCategory(ALL_CATALOG_FILTER_VALUE);
    setProductType(ALL_CATALOG_FILTER_VALUE);
    setSort("default");
    setCurrentPage(1);
  }

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Не удалось загрузить товары"
        description="Проверьте подключение к интернету и попробуйте еще раз."
        action={<Button onClick={() => void refetch()}>Повторить</Button>}
      />
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="Товары не найдены"
        description="В каталоге пока нет доступных товаров."
      />
    );
  }

  return (
    <>
      <div className={styles.filters}>
        <label className={styles.search}>
          <span>Поиск</span>
          <input
            value={searchValue}
            type="search"
            placeholder="Название товара"
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </label>
        <label>
          <span>Наличие</span>
          <select
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value as AvailabilityFilter)
            }
          >
            <option value={ALL_CATALOG_FILTER_VALUE}>Все</option>
            <option value="available">В наличии</option>
            <option value="unavailable">Нет в наличии</option>
          </select>
        </label>
        <label>
          <span>Цена от</span>
          <input
            value={minPrice}
            type="number"
            min="0"
            inputMode="numeric"
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </label>
        <label>
          <span>Цена до</span>
          <input
            value={maxPrice}
            type="number"
            min="0"
            inputMode="numeric"
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </label>
        <label>
          <span>Категория</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value={ALL_CATALOG_FILTER_VALUE}>Все</option>
            {categories.map((categoryItem) => (
              <option value={categoryItem} key={categoryItem}>
                {categoryItem}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Тип</span>
          <select
            value={productType}
            onChange={(event) => setProductType(event.target.value)}
          >
            <option value={ALL_CATALOG_FILTER_VALUE}>Все</option>
            {productTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Сортировка</span>
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as CatalogSortValue)
            }
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="name-asc">По названию</option>
            <option value="rating-desc">По рейтингу</option>
          </select>
        </label>
        <Button variant="outline" onClick={resetFilters}>
          Сбросить
        </Button>
      </div>
      <p className={styles.count}>
        Товаров: {filteredProducts.length} из {data.count_items}
      </p>
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Товары не найдены"
          description="Измените условия фильтрации."
        />
      ) : (
        <>
          <div className={styles.grid}>
            {pageProducts.map((product, index) => (
              <div className={styles.item} key={product.id}>
                <ProductCard product={product} priority={index < 4} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Страницы каталога">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Назад
              </Button>
              <div className={styles.pages}>
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      className={page === currentPage ? styles.currentPage : ""}
                      type="button"
                      key={page}
                      aria-current={page === currentPage ? "page" : undefined}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Вперед
              </Button>
            </nav>
          )}
        </>
      )}
    </>
  );
}