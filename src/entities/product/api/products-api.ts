import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { ProductsResponseDto } from "../model";

const API_URL = "https://maxifoxy-testfront-96b4.twc1.net/api";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponseDto, void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;