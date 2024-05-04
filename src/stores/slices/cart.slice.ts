import apis from "@/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export interface Cart {
    id: number,
    productId: number,
    userId: number,
    quantity: number,
    createdAt: string,
    updatedAt: string
}

interface CartState {
    data: Cart[] | null;
    loading: boolean;
}

let initialState: CartState = {
    data: null,
    loading: false,
}

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        try {
            let resUser = await apis.userApi.getData(localStorage.getItem('token'))
            console.log("resUser", resUser.data.data);
            
            let res = await apis.cartApi.getAll(resUser.data.data.id)
            console.log("res", res.data.data);
            
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        create: (state, action) =>{
            state.data?.push(action.payload)
        },
        delete: (state, action) =>{
            if(state.data){
            state.data = state.data?.filter((item) => item.id != action.payload)
            }
        },
        update: (state, action) =>{
            if(state.data){
                state.data = state.data?.map((item) => item.id == action.payload.id ? action.payload : item)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => {

            state.loading = true;
        })
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchCart.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const cartReducer = cartSlice.reducer;
export const cartAction = {
    ...cartSlice.actions,
    fetchCart
}
