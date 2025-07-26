import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser, UserType } from "./features/userSlice";

type AuthResponse = {
    user: UserType;
    success: boolean;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5555/",
        // baseUrl: "http://localhost:5555/",
        credentials: 'include' as const,
    }),
    endpoints: (builder) => ({
        loadUser: builder.query<AuthResponse, void>({
            query: () => ({
                url: 'me',
                method: 'GET',
                credentials: "include" as const
            }),
            async onQueryStarted(queryArgument, { queryFulfilled, dispatch }) {

                const { data } = await queryFulfilled;

                dispatch(
                    setUser({
                        user: data.user
                    })
                )
            },
        })
    })
});

export const { useLoadUserQuery } = apiSlice;