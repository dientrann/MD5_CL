import { StoreType } from "@/stores";
import { Carousel, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiArrowUpDoubleFill } from "react-icons/ri";

import './homeBody.style.scss'
import { useNavigate } from "react-router-dom";
import apis from "@/apis";
import { cartAction } from "@/stores/slices/cart.slice";
import { CSSProperties, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";




export default function HomeBody() {

  const navigate = useNavigate()
  const productStore = useSelector((store: StoreType) => store.productStore)
  const userStore = useSelector((store: StoreType) => store.userStore)
  const dispatch = useDispatch()
  const categoryStore = useSelector((store: StoreType) => store.categoryStore)
  const cartStore = useSelector((store: StoreType) => store.cartStore)
  const carouselStore = useSelector((store: StoreType) => store.carouselStore)

  console.log(productStore.productHome);


  let reversedData: any[] = [];

  if (productStore.productHome) {
    reversedData = [...productStore.productHome].reverse();
  }

  const handleCreateCart = async (dataCreate: {
    productId: number,
    quantity: number,
    userId: number,
  }) => {
    try {
      if (!userStore.data) {
        message.error("Please login to create cart")
        return
      }
      let resCreateCart = await apis.cartApi.create(dataCreate);

      if (resCreateCart.status != 200) {
        throw {
          message: "Create Cart Error"
        }
      }

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
      if (el && isIntrView(el)) {
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

  let listCarousel: CSSProperties[] | undefined = carouselStore.data?.map((item) => {
    return {
      height: '500px',
      color: '#fff',
      lineHeight: '500px',
      textAlign: 'center',
      background: '#364d79',
      backgroundSize: 'cover',
      backgroundImage: `url(${import.meta.env.VITE_SERVER}${item.image})`,
    }
  })

  return (
    <>
      <div className="carouselHome">
        <Carousel autoplay>
          {listCarousel?.map((item, index) => {
            return (
              <div key={index}>
                <h3 style={item}></h3>
              </div>
            )
          })}
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
                    productStore.productHome?.map((itemProduct) => {
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
                              <h5>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemProduct.price)}</h5>
                            </div>
                            <div className="btnProduct">
                              <button className="btn btnDetail" onClick={() => {
                                navigate(`/detail/${itemProduct.id}`)
                                document.querySelectorAll('.itemMenu').forEach((el) => {
                                  el.classList.remove('select');
                                });
                              }}>Detail <span><BiDetail></BiDetail></span></button>
                              <button className="btn btnBuy" onClick={() => {
                                handleCreateCart({
                                  userId: userStore.data?.id as number,
                                  productId: itemProduct.id,
                                  quantity: 1
                                })

                              }}>Buy <span><FaCartPlus></FaCartPlus></span></button>
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
