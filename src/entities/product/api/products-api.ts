import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { ProductsResponseDto } from "../model";
import { normalizeProductsResponse } from "../lib";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponseDto, void>({
      query: () => "/products",
      transformResponse: normalizeProductsResponse,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;