import apis from "@/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export interface Carousel {
    id: number,
    image: string,
    createdAt: string,
    updatedAt: string
}

interface CarouselState {
    data: Carousel[] | null;
    loading: boolean;
}

let initialState: CarouselState = {
    data: null,
    loading: false,
}

export const fetchCarousel = createAsyncThunk(
    'carousel/fetchCarousel',
    async () => {
        try {
            let res = await apis.carouselApi.getAll()
            console.log("res", res);
            
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

const carouselSlice = createSlice({
    name: "carousel",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        create: (state, action) =>{
            state.data?.push(action.payload)
        },
        delete: (state, action) =>{
            console.log(action.payload);
            
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
        builder.addCase(fetchCarousel.pending, (state) => {

            state.loading = true;
        })
        builder.addCase(fetchCarousel.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchCarousel.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const carouselReducer = carouselSlice.reducer;
export const carouselAction = {
    ...carouselSlice.actions,
    fetchCarousel
}
