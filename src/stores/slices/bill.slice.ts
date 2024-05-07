import apis from "@/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

enum StatusBill {
    PENDING = "PENDING",
    SHIPPING = "SHIPPING",
    COMPLETE = "COMPLETE",
}

export interface Bill {
    id: number,
    userId: number,
    status: StatusBill,
    content: string,
    total: number,
    createAt: string,
    updateAt: string,
}

interface BillState {
    data: Bill[] | null;
    loading: boolean;
}

let initialState: BillState = {
    data: null,
    loading: false,
}

export const fetchBill = createAsyncThunk(
    'bill/fetchBill',
    async () => {
        try {            
            let res = await apis.billApi.getAll(localStorage.getItem('token'))
            console.log("res", res.data.data);

            
            return res.data.data
        } catch (err) {
            console.log(err)
        }
    }
)

const billSlice = createSlice({
    name: "bill",
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
            console.log("action ", action.payload);
            
            if(state.data){
                state.data = state.data?.map((item) => item.id == action.payload.id ? action.payload : item)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBill.pending, (state) => {

            state.loading = true;
        })
        builder.addCase(fetchBill.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchBill.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const billReducer = billSlice.reducer;
export const billAction = {
    ...billSlice.actions,
    fetchBill
}
