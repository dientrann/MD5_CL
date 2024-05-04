import pictures from "@/pictures";
import { StoreType } from "@/stores";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import UserInfo from "./components/UserInfo";
import { FaSearch, FaAngleRight } from "react-icons/fa";


export default function Header() {

  const { category } = useParams()

  const [infoUser, setInfoUser] = useState(false)

  const navigate = useNavigate()
  const { t } = useTranslation()
  const userStore = useSelector((store: StoreType) => store.userStore)
  const categoryStore = useSelector((store: StoreType) => store.categoryStore)

  useEffect(() => {
    if (userStore.data) {
      setInfoUser(true)
    }
  }, [userStore.data, userStore.loading])
  useEffect(() => {
    const currentURL = window.location.href;
      const page = currentURL.split('/')[3]
    if (category) {
      
      document.querySelectorAll('.itemMenu').forEach((el) => {
        el.classList.remove('select');
      });
      document.querySelector(`.${category}`)?.classList.add("select");
    } else {
      document.querySelectorAll('.itemMenu').forEach((el) => {
        el.classList.remove('select');
      });
      document.querySelector(`.home`)?.classList.add("select");
    }
    if(page == "cart"){
      document.querySelectorAll('.itemMenu').forEach((el) => {
        el.classList.remove('select');
      });
    }
  }, [category])

  return (
    <>
      <div className="logoHeader">
        <img src={pictures.logo} alt="Logo" />
        <div className="slogan">
          <h1>Name</h1>
          <h3>Slogan</h3>
        </div>
      </div>
      <div className="navGlobal">
        <div className="listMenu">
          <div className={`itemMenu home`} onClick={(e) => {
            document.querySelectorAll('.itemMenu').forEach((el) => {
              el.classList.remove('select');
            });
            (e.currentTarget as HTMLDivElement).classList.add('select');
            navigate('/')
          }}>Home</div>
          {
            categoryStore.data?.map((item, index) => {
              return <div className={`itemMenu ${item.link}`} key={index} onClick={(e) => {
                document.querySelectorAll('.itemMenu').forEach((el) => {
                  el.classList.remove('select');
                });
                (e.currentTarget as HTMLDivElement).classList.add('select');
                navigate(item.link)
              }}>{item.title}</div>
            })
          }
        </div>
      </div>
      <div className="search">
        <form action="">
          <input type="text" name="search" placeholder="Search" />
          <button><FaSearch></FaSearch></button>
        </form>

      </div>
      <div className="infoUser">
        {infoUser ? <UserInfo></UserInfo> : <button onClick={() => {
          navigate('/authen')
        }}>Login <FaAngleRight></FaAngleRight></button>}
      </div>
    </>
  );
}
