import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserType = {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
};

type UserState = {
    user: UserType | null;
    isAuthenticated: boolean;
};

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ user: UserType | null; isAuthenticated: boolean }>) {
            state.user = action.payload.user;
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        updateProfile(state, action: PayloadAction<UserType>) {
            state.user = action.payload;
        },
        setUser: (state, action: PayloadAction<{ user: UserType }>) => {
            state.user = action.payload.user
        }

    },
});

export const { login, updateProfile, setUser } = userSlice.actions;

export default userSlice.reducer;