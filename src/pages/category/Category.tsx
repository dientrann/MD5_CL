import apis from '@/apis';
import { StoreType, dispatchFetch } from '@/stores';
import { cartAction } from '@/stores/slices/cart.slice';
import { Pagination, PaginationProps, message } from 'antd';
import { useEffect, useState } from 'react';
import { RiArrowUpDoubleFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCartPlus } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";

import './category.style.scss'

export default function Category() {
  useEffect(() => {
    if (categoryStore.data == null) {
      dispatchFetch.fetchCategory()
    }
    if (userStore.data == null) {
      dispatchFetch.fetchUser()
    }
    if (productStore.data == null) {
      dispatchFetch.fetchProductCategory({ category: idCategory as number, page: 1 })
    }
    if (cartStore.data == null) {
      dispatchFetch.fetchCart()
    }
  }, [])
  const { category } = useParams()
  const productStore = useSelector((store: StoreType) => store.productStore)
  const categoryStore = useSelector((store: StoreType) => store.categoryStore)
  const userStore = useSelector((store: StoreType) => store.userStore)
  const cartStore = useSelector((store: StoreType) => store.cartStore)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [idCategory, setIdCategory] = useState(categoryStore.data?.find((item) => item.link == category)?.id)
  const [current, setCurrent] = useState(1);
  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page)
  };
  useEffect(() => {
    setIdCategory(categoryStore.data?.find((item) => item.link == category)?.id)
    setCurrent(1)
    //dispatchFetch.fetchProductCategory({ category: idCategory as number, page: current })
  }, [category])

  useEffect(() => {
    dispatchFetch.fetchProductCategory({ category: idCategory as number, page: current })
    document.querySelectorAll('.itemProduct').forEach(item => {
      item.classList.add('active');
    });
  }, [current])

  useEffect(() => {
    dispatchFetch.fetchProductCategory({ category: idCategory as number, page: 1 })
  }, [idCategory])

  useEffect(() => {
    document.querySelectorAll('.itemProduct').forEach(item => {
      item.classList.add('active');
    });
  }, [productStore.productCategory])

  
  const handleCreateCart = async (dataCreate: {
    productId: number,
    quantity: number,
    userId: number,
  }) => {
    try {
      let resCreateCart = await apis.cartApi.create(dataCreate);
      if (resCreateCart.status != 200) {
        throw {
          message: "Lỗi khi thêm vào giỏ hàng"
        }
      }
      if (cartStore.data?.find(item => item.productId == resCreateCart.data.data.productId)) {
        dispatch(cartAction.update(resCreateCart.data.data))
      } else {
        dispatch(cartAction.create(resCreateCart.data.data))
      }
      message.success("Create Cart Success")

    } catch (err) {
      message.error("Create Cart Error")
    }
  }
  return (
    <>
      <div className="contentBodyCategory">
        {
          productStore.productCategory?.map((itemProduct, index) => {
            return (
              <div key={index} className={`itemProduct ${category}`}>
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
                  <button className='btn btnDetail' onClick={() => {
                    navigate(`/detail/${itemProduct.id}`)
                    document.querySelectorAll('.itemMenu').forEach((el) => {
                      el.classList.remove('select');
                    });
                  }}>Detail <span><BiDetail /></span></button>
                  <button className='btn btnBuy' onClick={() => {
                    handleCreateCart({
                      userId: userStore.data?.id as number,
                      productId: itemProduct.id,
                      quantity: 1
                    })

                  }}>Buy <span><FaCartPlus /></span></button>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className='pagination'><Pagination defaultCurrent={current} total={productStore.total as number} pageSize={8} onChange={onChange} /></div>
    </>
  )
}
