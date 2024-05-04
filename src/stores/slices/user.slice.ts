import apis from "@/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

enum Role {
    MEMBER = 'MEMBER',
    ADMIN = 'ADMIN'
}

interface User {
    id: number,
    userName: string,
    password: string,
    email: string,
    emailConfirm: boolean,
    role: Role,
    walet: number,
    createdAt: string,
    updatedAt: string
}

interface UserState {
    data: User | null;
    loading: boolean;
}

interface ListUserState {
    data: User[] | null;
    loading: boolean;
}

let initialState: UserState = {
    data: null,
    loading: false,
}

let initialListState: ListUserState = {
    data: null,
    loading: false,
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async () => {
        try {
            let token = localStorage.getItem('token') || null;
            let res = await apis.userApi.getData(token)
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

export const fetchListUser = createAsyncThunk(
    'users/fetchUser',
    async () => {
        try {
            let token = localStorage.getItem('token') || null;
            let res = await apis.userApi.getAll(token)
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        deleteData: (state) => {
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchUser.rejected, (state) => {
            state.loading = false;
        })
    }
})

const listUserSlice = createSlice({
    name: "users",
    initialState: initialListState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchListUser.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchListUser.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchListUser.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const userReducer = userSlice.reducer;
export const userAction = {
    ...userSlice.actions,
    fetchUser
}

export const listUserReducer = listUserSlice.reducer;
export const listUserAction = {
    ...userSlice.actions,
    fetchListUser
}
