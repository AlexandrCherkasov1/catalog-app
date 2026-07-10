import type { Metadata } from "next";

import type { ProductsResponseDto } from "@entities/product";
import { ProductDetails } from "@widgets/product-details";

import styles from "../../page.module.scss";

const PRODUCTS_API_URL =
  "https://maxifoxy-testfront-96b4.twc1.net/api/products";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(productId: number) {
  try {
    const response = await fetch(PRODUCTS_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ProductsResponseDto;

    return data.items.find((product) => product.id === productId) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  const product = Number.isInteger(productId)
    ? await getProduct(productId)
    : null;

  if (!product) {
    return {
      title: "Товар не найден",
    };
  }

  return {
    title: product.name,
    description: `Купить ${product.name}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <ProductDetails productId={productId} />
      </div>
    </main>
  );
}