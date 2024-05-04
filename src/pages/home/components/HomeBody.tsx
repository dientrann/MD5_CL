import { StoreType } from "@/stores";
import { Carousel, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiArrowUpDoubleFill } from "react-icons/ri";

import './homeBody.style.scss'
import { useNavigate } from "react-router-dom";
import apis from "@/apis";
import { cartAction } from "@/stores/slices/cart.slice";


const contentStyle: React.CSSProperties = {
  height: '300px',
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
  const handleCreateCart = async (dataCreate: {
    productId: number,
    quantity: number,
    userId: number,
  }) => {
    try {
      let resCreateCart = await apis.cartApi.create(dataCreate);
      console.log("resCreateCart", resCreateCart);
  
      if(resCreateCart.status != 200){
        throw {
          message: "Lỗi khi thêm vào giỏ hàng"
        }
      }
      dispatch(cartAction.create(resCreateCart.data.data))
      message.success("Thêm vào giỏ hàng thành công")
      
    } catch (err) {
      console.log(err);
      message.error("Lỗi khi thêm vào giỏ hàng")
    }
  }

  return (
    <>
      <div className="carousel">
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}></h3>
          </div>
          <div>
            <h3 style={contentStyle}></h3>
          </div>
          <div>
            <h3 style={contentStyle}></h3>
          </div>
          <div>
            <h3 style={contentStyle}></h3>
          </div>
        </Carousel>
      </div>
      <div className="contentBody">
        <div className="listProduct">
          {
            productStore.data?.map((item, index) => {
              return (
                <div key={index} className="itemProduct">
                  <div className="imgProduct">
                    <img src={`http://localhost:3000/${item.image}`} alt="" />
                  </div>
                  <div className="descProduct">
                    <RiArrowUpDoubleFill></RiArrowUpDoubleFill>
                    <div className="disc">
                      <p>{item.describe}</p>
                    </div>
                  </div>
                  <div className="infoProduct">
                    <h3>{item.name}</h3>
                    <h5>{item.price}</h5>
                  </div>
                  <div className="btnProduct">
                    <button onClick={() => {
                      navigate(`/detail/${item.id}`)
                      document.querySelectorAll('.itemMenu').forEach((el) => {
                        el.classList.remove('select');
                      });
                    }}>Chi Tiết</button>
                    <button onClick={()=>{
                      handleCreateCart({
                        userId: userStore.data?.id as number,
                        productId: item.id,
                        quantity: 1
                      })

                    }}>Mua Ngay</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}
