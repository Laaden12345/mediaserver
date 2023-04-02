import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.BACKEND_URL }),
  tagTypes: ["AllSeries", "Series"],
  endpoints: (builder) => ({
    getAllSeries: builder.query({
      query: () => ({ url: "/media/series" }),
      providesTags: ["AllSeries"],
    }),
    getSeries: builder.query({
      query: (id: string) => ({ url: `/media/series/${id}` }),
      providesTags: ["Series"],
    }),
  }),
})

export const { useGetAllSeriesQuery, useGetSeriesQuery } = apiSlice
