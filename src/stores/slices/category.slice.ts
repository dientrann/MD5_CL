import apis from "@/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export interface Category {
    id: number,
    title: string,
    link: string,
    createdAt: string,
    updatedAt: string
}

interface CategoryState {
    data: Category[] | null;
    loading: boolean;
}

let initialState: CategoryState = {
    data: null,
    loading: false,
}

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async () => {
        try {
            let res = await apis.categoryApi.getAll()
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

const categorySlice = createSlice({
    name: "category",
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
            state.data = state.data?.filter((item) => item.title != action.payload)
            }
        },
        update: (state, action) =>{
            if(state.data){
                state.data = state.data?.map((item) => item.id == action.payload.id ? action.payload : item)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategory.pending, (state) => {

            state.loading = true;
        })
        builder.addCase(fetchCategory.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchCategory.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const categoryReducer = categorySlice.reducer;
export const categoryAction = {
    ...categorySlice.actions,
    fetchCategory
}
