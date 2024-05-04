import { store } from "@/stores";
import { chatAction } from "@/stores/slices/chat.slice";
import { Socket, io } from "socket.io-client";

class ChatClient {
    soket!: Socket
    constructor() { }

    connect() {
        console.log("connect Soket");
        this.soket = io(`http://localhost:3000?token=${localStorage.getItem('token')}`)
        this.soket.on("result-connect", data =>{
            console.log("result-connect", data);
        })

        this.soket.on('listMessage', data =>{
            console.log("data", data);
            store.dispatch(chatAction.setData(data))
        })

        this.soket.on('result-send-message', data =>{
            store.dispatch(chatAction.newMessage(data))
        })

        this.soket.on('update-token', data =>{
            localStorage.setItem('token', data)
        })
    }

    userSendMessage(data:{
        content: string,
        userId: number,
        userName: string,
    }) {        
        this.soket.emit('user-send-message', data)
    }

}
export default new ChatClient()