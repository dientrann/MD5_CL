import apis from "@/apis";
import { message } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function EmailConfirm() {
    const navigate = useNavigate();

    const { token } = useParams();

    useEffect(() => {
        try {
            confirmEmail()
        } catch (err) {
            console.log(err);

        }

    }, [])

    let confirmEmail = async () => {

        try {
            console.log(token);

            let res = await apis.userApi.update(token as string, { emailConfirm: true })

            if (res.status != 200) {
                message.error("Error Server")
            }

            message.success("Email Confirmed")

            navigate('/')


        } catch (err) {
            console.log(err);
            message.error((err as any).response.data.message ? (err as any).response.data.message : "Error Server")
        }
    }
    return (
        <div>

        </div>
    );
}
