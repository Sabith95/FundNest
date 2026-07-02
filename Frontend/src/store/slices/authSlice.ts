import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { IAuthState, IUser } from "../../types/auth.types";
import { removeAccessToken, setAccessToken } from "../../services/api";

const initialState: IAuthState = {
    user: null, 
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: ( 
            state,
            action: PayloadAction<{user: IUser; accessToken: string}>
        ) =>{
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.isLoading = false
            state.error = null
            setAccessToken(action.payload.accessToken, action.payload.user.role)
        },

        logout: (state) =>{
            removeAccessToken(state.user?.role)
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null
        },

        setLoading: (state, action: PayloadAction<boolean>) =>{
            state.isLoading = action.payload
        },

        setError: (state, action: PayloadAction<string | null>) =>{
            state.error = action.payload
           
        },


    },
})

export const {loginSuccess, logout, setLoading, setError} = authSlice.actions
export default authSlice.reducer
