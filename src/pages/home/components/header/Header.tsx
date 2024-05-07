import pictures from "@/pictures";
import { StoreType } from "@/stores";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import UserInfo from "./components/UserInfo";
import { FaSearch, FaAngleRight } from "react-icons/fa";
import { Product } from "@/stores/slices/product.slice";


export default function Header() {

  const { category } = useParams()

  const [infoUser, setInfoUser] = useState(false)

  const navigate = useNavigate()
  const { t } = useTranslation()
  const userStore = useSelector((store: StoreType) => store.userStore)
  const categoryStore = useSelector((store: StoreType) => store.categoryStore)
  const productStore = useSelector((store: StoreType) => store.productStore)

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
    if (page == "cart") {
      document.querySelectorAll('.itemMenu').forEach((el) => {
        el.classList.remove('select');
      });
    }
  }, [category])

  const [listSearch, setListSearch] = useState<Product[] | undefined>([])

  const handleSearch = (dataSearch: string) => {
    try {
      const keyword = dataSearch.toLowerCase();
      const foundProducts = productStore.data?.filter((product) => {
        return product.name.toLowerCase().includes(keyword) || product.describe.toLowerCase().includes(keyword);
      });
      setListSearch(foundProducts?.slice(0, 5));
    } catch (err) {
      console.log(err)
    }
  }
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
          <input type="text" name="search" className="searchInput" placeholder="Search" onChange={(e) => {
            const dataSearch = e.target.value;
            handleSearch(dataSearch)
          }} />
          <div className="listSearch">
            {
              listSearch?.map((item, index) => {
                return (
                  <div className="itemSearch" key={index}>
                    <div className="img">
                      <img src={`${import.meta.env.VITE_SERVER}${item.image}`} alt="" />
                    </div>
                    <div className="content">
                      <h3>{item.name}</h3>
                      <h4>{item.price}</h4>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <button onClick={()=>{
            const elSearch = document.querySelector('.searchInput') as HTMLInputElement;
            handleSearch(elSearch.value)
          }}><FaSearch></FaSearch></button>

      </div>
      <div className="infoUser">
        {infoUser ? <UserInfo></UserInfo> : <button onClick={() => {
          navigate('/authen')
        }}>Login <FaAngleRight></FaAngleRight></button>}
      </div>
    </>
  );
}
