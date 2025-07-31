import { apiSlice } from "../apiSlice";
import { login, UserType } from "./userSlice";

type AuthResponse = {
    user: UserType;
    success: boolean;
};

export interface ThirdPartyUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

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
        signOut: builder.query({
            query: () => ({
                url: 'sign-out',
                method: "GET",
                credentials: "include" as const
            }),
        }),
        syncThirdPartyUsers: builder.mutation<void, { data: ThirdPartyUser[] }>({
            query: ({ data }) => ({
                url: "sync-users",
                method: "POST",
                credentials: "include" as const,
                body: {
                    data
                }
            })
        }),
        getThirdPartyUser: builder.query({
            query: ({ id }: { id: string }) => ({
                url: `third-party-user/${id}`,
                method: "GET",
                credentials: "include" as const
            })
        })
    })
});

export const {
    useLoginRequestMutation,
    useSignUpRequestMutation,
    useGetUserByIdQuery,
    useDeleteByIdMutation,
    useUploadOrEditImageMutation,
    useLazySignOutQuery,
    useGetThirdPartyUserQuery,
    useSyncThirdPartyUsersMutation
} = authApi;