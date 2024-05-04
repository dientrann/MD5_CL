
import { StoreType, dispatchFetch } from "@/stores";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


import { FaShoppingCart, FaUser } from "react-icons/fa";
import { HiLogout, } from "react-icons/hi";
import { RiSettings2Fill } from "react-icons/ri";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
    useEffect(()=>{
        dispatchFetch.fetchCart()
    },[])
    const navigate = useNavigate();
    const userStore = useSelector((store: StoreType) => store.userStore);
    const [isMenu, setIsMenu] = useState(false);
    const cartStore = useSelector((store: StoreType) => store.cartStore);
    return (
        <div className="userInfo">
            <div onClick={() => {
                document.querySelectorAll('.itemMenu').forEach((el) => {
                    el.classList.remove('select');
                });
                navigate('/cart');
            }} className="cart"><FaShoppingCart></FaShoppingCart><span>{cartStore.data?.length}</span></div>
            <div onClick={() => {
                setIsMenu(!isMenu);
            }}>{userStore.data?.userName.includes('.') ? userStore.data?.email.split('@')[0] : userStore.data?.userName}<FaUser></FaUser></div>
            {
                isMenu && <div onClick={(e) => {
                    console.log(typeof userStore.data?.userName)

                    console.log((e.target as any).closest('.menu'));
                    if (!(e.target as any).closest('.menu')) {
                        setIsMenu(false);
                    }
                }} className="menu">
                    <div className="itemMenu"><RiSettings2Fill></RiSettings2Fill> <span>Account Setting</span></div>
                    {userStore.data?.role == 'ADMIN' && <div className="itemMenu"><MdOutlineAdminPanelSettings></MdOutlineAdminPanelSettings><span onClick={() => {
                        navigate('/admin/user');
                    }}>Admin</span></div>}
                    <div className="itemMenu final" onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                    }}><HiLogout></HiLogout> <span>LogOut</span></div>
                </div>
            }
        </div>
    );
}
