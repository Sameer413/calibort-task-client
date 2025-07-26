import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5555/",
        // baseUrl: "http://localhost:5555/",
        credentials: 'include' as const,
    }),
    endpoints: (builder) => ({
    })
})