import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthSlice {
    user: User | null;
    token: string | null;
    loading: boolean | null;
    error: string | null;
}

const initialState: AuthSlice = {
    user: null,
    token: null,
    loading: null,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: state => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User, token: string}>
        ) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token
        },
        loginFailure: ( 
            state,
            action: PayloadAction<string>
        ) => {
            state.loading = false;
            state.error = action.payload
        },
        logout : state => {
            state.user = null,
            state.token = null
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;