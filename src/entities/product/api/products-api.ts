import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { ProductsResponseDto } from "../model";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponseDto, void>({
      query: () => "/products",
      transformResponse: (response: ProductsResponseDto) => ({
        ...response,
        items: response.items.map((product) => ({
          ...product,
          preview_picture: product.preview_picture?.replace(
            "https://ohotaktiv.ru",
            "https://img.ohotaktiv.ru",
          ),
        })),
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;