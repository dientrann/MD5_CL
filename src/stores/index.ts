import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { listUserAction, userAction, userReducer, listUserReducer } from "./slices/user.slice";
import { categoryAction, categoryReducer } from "./slices/category.slice";
import { fetchProduct, fetchProductCategory, productAction, productReducer } from "./slices/product.slice";
import { cartAction, cartReducer } from "./slices/cart.slice";
import { chatReducer } from "./slices/chat.slice";
import { billAction, billReducer } from "./slices/bill.slice";
import { billUserAction, billUserReducer } from "./slices/billUser.slice";
import { carouselAction, carouselReducer } from "./slices/carousel.slice";


const RootReducer = combineReducers({
    userStore: userReducer,
    categoryStore: categoryReducer,
    listUserStore: listUserReducer,
    productStore: productReducer,
    cartStore: cartReducer,
    chatStore: chatReducer,
    billStore: billReducer,
    billUserStore: billUserReducer,
    carouselStore: carouselReducer
})

export type StoreType = ReturnType<typeof RootReducer>

export const store = configureStore({
    reducer: RootReducer
})

store.dispatch(userAction.fetchUser())
store.dispatch(categoryAction.fetchCategory())
//store.dispatch(productAction.fetchProduct(1))
store.dispatch(cartAction.fetchCart())
store.dispatch(carouselAction.fetchCarousel())
store.dispatch(productAction.fetchProductHome())

export const dispatchFetch = {
    fetchUser: () => store.dispatch(userAction.fetchUser()),
    fetchCategory: () => store.dispatch(categoryAction.fetchCategory()),
    fetchListUser: () => store.dispatch(listUserAction.fetchListUser()),
    fetchProductCategory: (infoPage: {category: number, page: number}) => store.dispatch(productAction.fetchProductCategory(infoPage)),
    fetchProduct: () => store.dispatch(productAction.fetchProduct()),
    fetchProductHome: () => store.dispatch(productAction.fetchProductHome()),
    fetchCart: () => store.dispatch(cartAction.fetchCart()),
    fetchBill: () => store.dispatch(billAction.fetchBill()),
    fetchBillUser: () => store.dispatch(billUserAction.fetchBillUser()),
    fetchCarousel: () => store.dispatch(carouselAction.fetchCarousel())
}