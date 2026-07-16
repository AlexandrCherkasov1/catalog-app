import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductCatalog } from "@widgets/product-catalog";
import { getAbsoluteUrl } from "@shared/config/site";

import { getProducts } from "./lib/get-products";
import styles from "./page.module.scss";

interface HomePageProps {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}

function getPageNumber(value?: string | string[]) {
  const page = Number(Array.isArray(value) ? value[0] : value);

  return Number.isInteger(page) && page > 1 ? page : 1;
}

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNumber = getPageNumber(page);
  const title =
    pageNumber > 1
      ? `Охотничий каталог — страница ${pageNumber}`
      : "Охотничий каталог";
  const description = "Каталог огнестрельного оружия с ценами и наличием";

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "Охотничий каталог",
      title,
      description,
    },
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page } = await searchParams;
  const initialPage = getPageNumber(page);
  const canonical = getAbsoluteUrl(
    initialPage > 1 ? `/?page=${initialPage}` : "/",
  );
  const initialData = await getProducts();

  return (
    <>
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1>Огнестрельное оружие</h1>
          <Suspense fallback={null}>
            <ProductCatalog
              initialData={initialData ?? undefined}
              initialPage={initialPage}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}