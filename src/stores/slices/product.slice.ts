import apis from "@/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export interface Product {
    id: number,
    name: string,
    image: string,
    describe: string,
    price: number,
    categoryId: number,
    content: string,
    createdAt: string,
    updatedAt: string
}

interface ProductState {
    data: Product[] | null;
    loading: boolean;
}

let initialState: ProductState = {
    data: null,
    loading: false,
}

export const fetchProduct = createAsyncThunk(
    'product/fetchProduct',
    async () => {
        try {
            let res = await apis.productApi.getAll()
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

const productSlice = createSlice({
    name: "product",
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
        builder.addCase(fetchProduct.pending, (state) => {

            state.loading = true;
        })
        builder.addCase(fetchProduct.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchProduct.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const productReducer = productSlice.reducer;
export const productAction = {
    ...productSlice.actions,
    fetchProduct
}
