import { StoreType } from "@/stores";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import './detail.style.scss'

export default function Detail() {
    const { id } = useParams();
    const productStore = useSelector((store: StoreType) => store.productStore)

    const findProduct = productStore.data?.find((item) => item.id == Number(id))

    console.log(productStore);
    

    return (
        <>
            <div className="headerDetail">
                <h3>Detail {findProduct?.name}</h3>
            </div>
            <div className="detailContent">
                <div className="leftContent">
                    <img src={`http://localhost:3000/${findProduct?.image}`} alt="" />
                </div>
                <div className="rightContent">
                    <h1>{findProduct?.name}</h1>
                    <p>{findProduct?.describe}</p>
                    <p>{findProduct?.price}</p>

                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: findProduct?.content as string }}>
            </div>
        </>


    );
}
