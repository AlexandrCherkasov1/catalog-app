import type { Metadata } from "next";

import { ProductDetails } from "@widgets/product-details";
import { getAbsoluteUrl } from "@shared/config/site";

import { getProducts } from "../../lib/get-products";
import styles from "../../page.module.scss";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(productId: number) {
  const products = await getProducts();

  return products?.items.find((product) => product.id === productId) ?? null;
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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = `Купить ${product.name}. Цена, наличие и характеристики товара.`;
  const canonical = getAbsoluteUrl(`/product/${product.id}`);

  return {
    title: product.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonical,
      siteName: "Охотничий каталог",
      title: product.name,
      description,
      images: product.preview_picture
        ? [
            {
              url: product.preview_picture,
              alt: product.name,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);
  const initialProduct = Number.isInteger(productId)
    ? await getProduct(productId)
    : null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <ProductDetails
          productId={productId}
          initialProduct={initialProduct ?? undefined}
        />
      </div>
    </main>
  );
}