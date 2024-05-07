import { StoreType } from "@/stores";
import { Carousel, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiArrowUpDoubleFill } from "react-icons/ri";

import './homeBody.style.scss'
import { useNavigate } from "react-router-dom";
import apis from "@/apis";
import { cartAction } from "@/stores/slices/cart.slice";
import { useEffect, useState } from "react";


const contentStyle1: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  background: '#364d79',
  backgroundImage: 'url(https://shopdunk.com/images/uploaded/banner/banner%202024/Thang_5/15%20PRM%20PC.png)',
};
const contentStyle2: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  background: '#364d79',
  backgroundImage: 'url(https://shopdunk.com/images/uploaded/banner/banner%202024/Thang_5/15%20PRM%20PC.png)',
};
const contentStyle3: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  background: '#364d79',
  backgroundImage: 'url(https://shopdunk.com/images/uploaded/banner/banner%202024/Thang_5/15%20PRM%20PC.png)',
};



export default function HomeBody() {

  const navigate = useNavigate()
  const productStore = useSelector((store: StoreType) => store.productStore)
  const userStore = useSelector((store: StoreType) => store.userStore)
  const dispatch = useDispatch()
  const categoryStore = useSelector((store: StoreType) => store.categoryStore)
  const cartStore = useSelector((store: StoreType) => store.cartStore)
  let reversedData: any[] = [];
  if (productStore.data) {
    reversedData = [...productStore.data].reverse();
  }

  const handleCreateCart = async (dataCreate: {
    productId: number,
    quantity: number,
    userId: number,
  }) => {
    try {
      let resCreateCart = await apis.cartApi.create(dataCreate);

      if (resCreateCart.status != 200) {
        throw {
          message: "Create Cart Error"
        }
      }
      console.log(resCreateCart);

      if (cartStore.data?.find(item => item.productId == resCreateCart.data.data.productId)) {
        dispatch(cartAction.update(resCreateCart.data.data))
      } else {
        dispatch(cartAction.create(resCreateCart.data.data))
      }
      message.success("Create Cart Success")

    } catch (err) {
      console.log(err);
      message.error("Create Cart Error")
    }
  }


  const isIntrView = (el: any) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom <= window.innerHeight
  }

  useEffect(() => {
    categoryStore.data?.map((item) => {
      const el = document.querySelector(`.${item.title}`) as HTMLElement;
      if (isIntrView(el)) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })
  }, [])
  window.addEventListener('scroll', () => {
    categoryStore.data?.map((item) => {
      const el = document.querySelector(`.${item.title}`) as HTMLElement;
      if (el && isIntrView(el)) {
        el.classList.add('active')
        el.classList.remove('out')
      } else {
        
        el.classList.remove('active')
        el.classList.add("out")
      }
    })
  })

  return (
    <>
      <div className="carousel">
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle1}></h3>
          </div>
          <div>
            <h3 style={contentStyle2}></h3>
          </div>
          <div>
            <h3 style={contentStyle3}></h3>
          </div>

        </Carousel>
      </div>
      <div className="contentBody">
        {
          categoryStore.data?.map((item, index) => {
            let count = 0;
            return (
              <div key={index} className={`listProductCategory ${item.title}`}>
                <div className={`category`}>{item.title}</div>
                <div className={`listProduct`} >
                  {
                    reversedData?.map((itemProduct) => {
                      if (count < 5 && itemProduct.categoryId == item.id) {
                        count++;
                        return (
                          <div key={Number(Date.now() * Math.random())} className={`itemProduct`}>
                            <div className="imgProduct">
                              <img src={`http://localhost:3000/${itemProduct.image}`} alt="" />
                            </div>
                            <div className="descProduct">
                              <RiArrowUpDoubleFill></RiArrowUpDoubleFill>
                              <div className="disc">
                                <p>{itemProduct.describe}</p>
                              </div>
                            </div>
                            <div className="infoProduct">
                              <h3>{itemProduct.name}</h3>
                              <h5>{itemProduct.price}</h5>
                            </div>
                            <div className="btnProduct">
                              <button onClick={() => {
                                navigate(`/detail/${itemProduct.id}`)
                                document.querySelectorAll('.itemMenu').forEach((el) => {
                                  el.classList.remove('select');
                                });
                              }}>Chi Tiết</button>
                              <button onClick={() => {
                                handleCreateCart({
                                  userId: userStore.data?.id as number,
                                  productId: itemProduct.id,
                                  quantity: 1
                                })

                              }}>Mua Ngay</button>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  );
}
