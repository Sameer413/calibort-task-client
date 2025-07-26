import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserType = {
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
            state.isAuthenticated = true;
        },
        updateProfile(state, action: PayloadAction<UserType>) {
            state.user = action.payload;
        },
        
    },
});

export const { login, updateProfile } = userSlice.actions;

export default userSlice.reducer;