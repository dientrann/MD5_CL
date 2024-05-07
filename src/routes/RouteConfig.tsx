import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazyFn } from "./lazy/Lazy";
import { useSelector } from "react-redux";
import { StoreType } from "@/stores";

export default function RouteConfig() {
    const userStore = useSelector((store: StoreType) => store.userStore)

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={lazyFn(() => import('@pages/home/Home'))} >
                        <Route path="/" element={lazyFn(()=> import('@pages/home/components/HomeBody'))}/>
                        <Route path="/:category" element={lazyFn(()=> import('@pages/category/Category'))}/>
                        <Route path="/detail/:id" element={lazyFn(()=> import('@pages/detail/Detail'))}/>
                        <Route path="/cart" element={lazyFn(()=> import('@pages/cart/Cart'))}/>
                    </Route>
                    <Route path="/authen" element={lazyFn(() => import('@pages/authen/Authen'), userStore.data ? false : true, userStore.data ? '/' : '')} />
                    <Route path="/confirm-email/:token" element={lazyFn(() => import('@components/emailConfirm/EmailConfirm'))}/>
                    <Route path="/admin" element={lazyFn(() => import('@pages/admin/Admin'), userStore.data?.role == 'ADMIN' ? true: false)}>
                        <Route path="/admin/category" element={lazyFn(() => import('@pages/admin/components/category/Category'))}/>
                        <Route path="/admin/product" element={lazyFn(() => import('@pages/admin/components/product/Product'))}/>
                        <Route path="/admin/user" element={lazyFn(() => import('@pages/admin/components/user/User'))}/>
                        <Route path="/admin/bill" element={lazyFn(() => import('@pages/admin/components/bill/Bill'))}/>
                    </Route>
                </Routes>

            </BrowserRouter>
        </div>
    );
}
