import { StoreType } from "@/stores";
import { FormEvent, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import services from "@/services";
import './formChat.style.scss'

export default function FormChat({ handleStatus = () => { } }) {
  const userStore = useSelector((store: StoreType) => store.userStore)
  const chatStore = useSelector((store: StoreType) => store.chatStore)

  useEffect(() => {
    services.chatService.connect()
    console.log("chatStore", chatStore);
  }, [])

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cuộn xuống vị trí cuối cùng khi chatStore thay đổi hoặc khi component được tải
    if(scrollContainerRef.current){
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatStore]);

  const handleSednMessage = (e: FormEvent) => {
    e.preventDefault()

    if(userStore.data?.id){
      let message = {
        content: (e.target as any).message.value,
        userId: userStore.data?.id,
        userName: userStore.data?.userName
      }      
      services.chatService.userSendMessage(message)
    }
  }
  return (
    <div className="containerFormChat">
      <div className="headerFormChat">
        <h3>Chat</h3>
        <span className="closeForm" onClick={() => {
          handleStatus()
        }}><IoClose /></span>
      </div>
      <div className="bodyFormChat" ref={scrollContainerRef}>
        {
          chatStore && chatStore.data?.map((item, index) => {
            if(item.employeeId){
              return(<div key={index} className="message"><span>{item.content}</span></div>)
            }else{
              return(<div key={index} className="message userMessage"><span>{item.content}</span></div>)
            }
          })
        }
      </div>
      <div className="footerFormChat">
        <form onSubmit={(e)=>{
          handleSednMessage(e)
        }}>
          <input type="text" name="message" placeholder="Type your message here" />
          <button><IoIosSend /></button>
        </form>
      </div>
    </div>
  );
}
