import { createSlice } from "@reduxjs/toolkit";

interface Chat{
    id: number;
    content: string;
    userId: number;
    employeeId: number | null;
    createdAt: string;
}

interface ChatState{
    data: Chat[] | null;
    loading: boolean;
}

let initialState: ChatState = {
    data: null,
    loading: false,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setData: (state, action) => {            
            state.data = action.payload.data;
        },
        newMessage: (state, action) => {
            state.data?.push(action.payload.data);
        }
    }
})

export const chatReducer = chatSlice.reducer;
export const chatAction = chatSlice.actions;
