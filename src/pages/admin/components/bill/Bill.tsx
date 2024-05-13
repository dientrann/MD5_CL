import apis from "@/apis";
import { StoreType, dispatchFetch } from "@/stores";
import { billAction } from "@/stores/slices/bill.slice";
import { message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShippingFast } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";


export default function Bill() {
    useEffect(() => {
        dispatchFetch.fetchBill()
        dispatchFetch.fetchListUser()
        dispatchFetch.fetchProduct()
    }, [])
    const billStore = useSelector((store: StoreType) => store.billStore)
    const listUserStore = useSelector((store: StoreType) => store.listUserStore)
    const productStore = useSelector((store: StoreType) => store.productStore)

    const dispatch = useDispatch()

    const handleUpdate = async(id: number) =>{
        try{
            console.log(id);
            let resUpdate = await apis.billApi.updateStatus(id)
            console.log(resUpdate);
            if(resUpdate.status != 200){
                throw{
                    message: "Update Status Fail"
                }
            }
            dispatch(billAction.update(resUpdate.data.data))
            message.success("Update Status Success")
        }catch(err){
            console.log(err);
            
        }
    }
    return (
        <div className="toolPage">
            <div className="headerTool">
                <h3>{`Bill`}</h3>
            </div>
            <div className="bodyTool">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>User</th>
                            <th>Content</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            billStore.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="sttTool">{index + 1}</td>
                                        <td>{listUserStore.data?.find(itemUser => itemUser.id == item.userId)?.userName}</td>
                                        <td>{JSON.parse(item.content).map((itemContent: any, index2: any) => {
                                            return (
                                                <div key={index2}>{itemContent.name}</div>
                                            )
                                        })}</td>
                                        <td>{item.total}</td>
                                        <td className="status">{item.status == "PENDING" ? <button className=" btn btnShip" onClick={()=>{
                                            handleUpdate(item.id)
                                        }}>ShipPing <span><FaShippingFast/></span></button> : item.status == "SHIPPING" ? <button className="btn btnComplete" onClick={()=>{
                                            handleUpdate(item.id)
                                        }}>Coplete <span><FaRegCircleCheck/></span></button> : "Bill Complete" }</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
