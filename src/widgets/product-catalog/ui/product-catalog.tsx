"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getProductPrice,
  ProductCard,
  useGetProductsQuery,
  type ProductDto,
} from "@entities/product";
import { Button, Card, EmptyState, Skeleton } from "@shared/ui";

import styles from "./product-catalog.module.scss";

const SKELETON_COUNT = 8;
const PRODUCTS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 350;
const ALL_VALUE = "all";

type AvailabilityFilter = "all" | "available" | "unavailable";
type SortValue = "default" | "price-asc" | "price-desc" | "name-asc";

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

function getProductCategory(product: ProductDto) {
  const [rawCategory = "Другое"] = product.name.trim().split(/\s+/);
  const category = rawCategory.toLowerCase();

  if (category === "ружьё" || category === "ружье") {
    return "Ружье";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getProductType(product: ProductDto) {
  const action = product.characteristics.find(
    (characteristic) => characteristic.name === "action",
  )?.value;

  if (action) {
    return action;
  }

  const name = product.name.toLowerCase();

  if (
    name.includes("semiauto") ||
    name.includes("полуавтомат") ||
    name.includes("п/а")
  ) {
    return "Полуавтоматический";
  }

  return null;
}

function sortValues(values: string[]) {
  return [...values].sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue, "ru"),
  );
}

export function ProductCatalog() {
  const { data, isError, isLoading, refetch } = useGetProductsQuery();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>(ALL_VALUE);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState(ALL_VALUE);
  const [productType, setProductType] = useState(ALL_VALUE);
  const [sort, setSort] = useState<SortValue>("default");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim().toLowerCase());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  const categories = useMemo(() => {
    if (!data) {
      return [];
    }

    return sortValues(
      Array.from(
        new Set(data.items.map((product) => getProductCategory(product))),
      ),
    );
  }, [data]);

  const productTypes = useMemo(() => {
    if (!data) {
      return [];
    }

    return sortValues(
      Array.from(
        new Set(
          data.items
            .map((product) => getProductType(product))
            .filter((type): type is string => Boolean(type)),
        ),
      ),
    );
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data) {
      return [];
    }

    const minPriceValue = minPrice === "" ? null : Number(minPrice);
    const maxPriceValue = maxPrice === "" ? null : Number(maxPrice);

    return data.items
      .filter((product) => {
        const price = getProductPrice(product);
        const matchesSearch =
          debouncedSearchValue === "" ||
          product.name.toLowerCase().includes(debouncedSearchValue);
        const matchesAvailability =
          availability === ALL_VALUE ||
          (availability === "available" && product.available) ||
          (availability === "unavailable" && !product.available);
        const matchesMinPrice =
          minPriceValue === null ||
          (Number.isFinite(minPriceValue) && price >= minPriceValue);
        const matchesMaxPrice =
          maxPriceValue === null ||
          (Number.isFinite(maxPriceValue) && price <= maxPriceValue);
        const matchesCategory =
          category === ALL_VALUE || getProductCategory(product) === category;
        const matchesType =
          productType === ALL_VALUE || getProductType(product) === productType;

        return (
          matchesSearch &&
          matchesAvailability &&
          matchesMinPrice &&
          matchesMaxPrice &&
          matchesCategory &&
          matchesType
        );
      })
      .sort((firstProduct, secondProduct) => {
        switch (sort) {
          case "price-asc":
            return (
              getProductPrice(firstProduct) - getProductPrice(secondProduct)
            );
          case "price-desc":
            return (
              getProductPrice(secondProduct) - getProductPrice(firstProduct)
            );
          case "name-asc":
            return firstProduct.name.localeCompare(secondProduct.name, "ru");
          default:
            return 0;
        }
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
  const pageStartIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = filteredProducts.slice(
    pageStartIndex,
    pageStartIndex + PRODUCTS_PER_PAGE,
  );

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
    setAvailability(ALL_VALUE);
    setMinPrice("");
    setMaxPrice("");
    setCategory(ALL_VALUE);
    setProductType(ALL_VALUE);
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
            <option value={ALL_VALUE}>Все</option>
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
            <option value={ALL_VALUE}>Все</option>
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
            <option value={ALL_VALUE}>Все</option>
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
            onChange={(event) => setSort(event.target.value as SortValue)}
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="name-asc">По названию</option>
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