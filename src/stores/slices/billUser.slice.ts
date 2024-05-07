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

export const fetchBillUser = createAsyncThunk(
    'billUser/fetchBillUser',
    async () => {
        try {    
            let resUser = await apis.userApi.getData(localStorage.getItem('token'))
            console.log("resUser", resUser);
            
            if(!resUser.data.data){
                throw{
                    message: "User not found"
                }
            }
            let res = await apis.billApi.getByUserId(resUser.data.data.id)
            return res.data.data
        } catch (err) {
            
            console.log(err)
        }
    }
)

const billUserSlice = createSlice({
    name: "billUser",
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
        builder.addCase(fetchBillUser.pending, (state) => {

            state.loading = true;
        })
        builder.addCase(fetchBillUser.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        builder.addCase(fetchBillUser.rejected, (state) => {
            state.loading = false;
        })
    }
})

export const billUserReducer = billUserSlice.reducer;
export const billUserAction = {
    ...billUserSlice.actions,
    fetchBillUser
}
