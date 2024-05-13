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
    productCategory: Product[] | null;
    productHome: Product[] | null;
    total: number | null;
    loading: boolean;
}

let initialState: ProductState = {
    data: null,
    productCategory: null,
    productHome: null,
    total: null,
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

export const fetchProductCategory = createAsyncThunk(
    'productCategoru/fetchProductCategory',
    async (infoPage: { category: number, page: number }) => {
        try {
            let res = await apis.productApi.getPage(infoPage.category, infoPage.page)
            return res.data
        } catch (err) {
            console.log(err)
        }
    }
)
export const fetchProductHome = createAsyncThunk(
    'productHome/fetchProductHome',
    async () => {
        try {
            let res = await apis.productApi.getProductHome()
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
        create: (state, action) => {
            state.data?.push(action.payload)
        },
        delete: (state, action) => {
            if (state.data) {
                state.data = state.data?.filter((item) => item.id != action.payload)
            }
        },
        update: (state, action) => {
            if (state.data) {
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
        builder.addCase(fetchProductCategory.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchProductCategory.fulfilled, (state, action) => {
            state.productCategory = action.payload.data;
            state.total = action.payload.total;
            state.loading = false;
        })
        builder.addCase(fetchProductCategory.rejected, (state) => {
            state.loading = false;
        })
        builder.addCase(fetchProductHome.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchProductHome.fulfilled, (state, action) => {
            state.productHome = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchProductHome.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const productReducer = productSlice.reducer;
export const productAction = {
    ...productSlice.actions,
    fetchProduct,
    fetchProductCategory,
    fetchProductHome
}
