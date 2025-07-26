import { apiSlice } from "../apiSlice";
import { login, UserType } from "./userSlice";

type AuthResponse = {
    user: UserType;
    success: boolean;
};

export const authApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        loginRequest: builder.mutation<AuthResponse, { email: string; password: string }>({
            query: ({ email, password }: { email: string, password: string }) => ({
                url: 'sign-in',
                method: 'POST',
                body: {
                    email,
                    password
                },
                credentials: "include",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        login({
                            user: data?.user,
                            isAuthenticated: true,
                        })
                    );
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.log(error.message);
                    } else {
                        console.log("An unknown error occurred");
                    }
                }
            },
        }),
        signUpRequest: builder.mutation({
            query: ({ name, email, password, confirmPassword }: { name: string, email: string, password: string, confirmPassword: string }) => ({
                url: 'sign-up',
                method: 'POST',
                body: {
                    email,
                    password,
                    confirmPassword,
                    name,
                },
                credentials: "include" as const,
            }),
            async onQueryStarted(queryArgument, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        login({
                            user: data?.user,
                            isAuthenticated: true,
                        })
                    );
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.log(error.message);
                    } else {
                        console.log("An unknown error occurred");
                    }
                }
            },
        }),
        getUserById: builder.query({
            query: () => ({
                url: 'user',
                method: 'GET',
                credentials: "include",
            }),
        }),
        deleteById: builder.mutation({
            query: () => ({
                url: 'user',
                method: 'DELETE',
                credentials: "include",
            }),
            async onQueryStarted(_, { dispatch }) {
                dispatch(
                    login({
                        user: null,
                        isAuthenticated: false,
                    })
                );
            }
        }),
        uploadOrEditImage: builder.mutation({
            query: ({ formData }: { formData: FormData }) => ({
                url: 'upload-file',
                method: 'POST',
                credentials: "include",
                body: formData,
            }),
        }),
    })
});

export const { useLoginRequestMutation, useSignUpRequestMutation, useGetUserByIdQuery, useDeleteByIdMutation, useUploadOrEditImageMutation } = authApi;