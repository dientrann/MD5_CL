import apis from '@/apis';
import { StoreType, dispatchFetch } from '@/stores';
import { cartAction } from '@/stores/slices/cart.slice';
import { Pagination, PaginationProps, message } from 'antd';
import { useEffect, useState } from 'react';
import { RiArrowUpDoubleFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

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
      dispatchFetch.fetchProduct()
    }
  }, [])
  const { category } = useParams()
  const productStore = useSelector((store: StoreType) => store.productStore)
  const categoryStore = useSelector((store: StoreType) => store.categoryStore)
  const userStore = useSelector((store: StoreType) => store.userStore)
  const idCategory = categoryStore.data?.find((item) => item.link == category)?.id
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const productsCategory = productStore.data?.filter((item) => item.categoryId == idCategory)

  const [products, setProducts] = useState(productStore.data?.filter((item) => item.categoryId == idCategory))


  const [current, setCurrent] = useState(1);
  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page)
  };

  const [total, setTotal] = useState(productsCategory?.length);
  useEffect(() => {
    setProducts(productStore.data?.filter((item) => item.categoryId == idCategory))
    console.log("total", products?.length);
    setTotal(products?.length)
  },[])



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
      dispatch(cartAction.create(resCreateCart.data.data))
      message.success("Thêm vào giỏ hàng thành công")

    } catch (err) {
      message.error("Lỗi khi thêm vào giỏ hàng")
    }
  }
  return (
    <>
      <div className="contentBodyCategory">
        {
          productsCategory?.splice(((current - 1) * 4), (current * 4)).map((itemProduct, index) => {
            return (
              <div key={index} className={`itemProduct`}>
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
          })
        }
      </div>
      <div><Pagination defaultCurrent={1} total={total} pageSize={4} onChange={onChange} /></div>
    </>
  )
}
