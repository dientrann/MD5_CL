import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { listUserAction, userAction, userReducer, listUserReducer } from "./slices/user.slice";
import { categoryAction, categoryReducer } from "./slices/category.slice";
import { productAction, productReducer } from "./slices/product.slice";
import { cartAction, cartReducer } from "./slices/cart.slice";
import { chatReducer } from "./slices/chat.slice";
import { billAction, billReducer } from "./slices/bill.slice";
import { billUserAction, billUserReducer } from "./slices/billUser.slice";


const RootReducer = combineReducers({
    userStore: userReducer,
    categoryStore: categoryReducer,
    listUserStore: listUserReducer,
    productStore: productReducer,
    cartStore: cartReducer,
    chatStore: chatReducer,
    billStore: billReducer,
    billUserStore: billUserReducer,
})

export type StoreType = ReturnType<typeof RootReducer>

export const store = configureStore({
    reducer: RootReducer
})

store.dispatch(userAction.fetchUser())
store.dispatch(categoryAction.fetchCategory())
store.dispatch(productAction.fetchProduct())
store.dispatch(cartAction.fetchCart())

export const dispatchFetch = {
    fetchUser: () => store.dispatch(userAction.fetchUser()),
    fetchCategory: () => store.dispatch(categoryAction.fetchCategory()),
    fetchListUser: () => store.dispatch(listUserAction.fetchListUser()),
    fetchProduct: () => store.dispatch(productAction.fetchProduct()),
    fetchCart: () => store.dispatch(cartAction.fetchCart()),
    fetchBill: () => store.dispatch(billAction.fetchBill()),
    fetchBillUser: () => store.dispatch(billUserAction.fetchBillUser()),
}