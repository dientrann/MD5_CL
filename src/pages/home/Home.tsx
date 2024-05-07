import { useEffect} from "react";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";

import './home.style.scss'
import { StoreType, dispatchFetch } from "@/stores";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import BoxChat from "@/components/boxChat/BoxChat";

export default function Home() {

const userStore = useSelector((store: StoreType) => store.userStore);

  useEffect(() => {
    if (!userStore.data) {
      if (localStorage.getItem('token')) {
        dispatchFetch.fetchUser()
      }
    }
  }, [])

  // const [elFooter, setFooter] = useState<any>()
  // const isIntrView = (el: any) => {
  //   const rect = el.getBoundingClientRect();
  //   return rect.bottom <= window.innerHeight
  // }


  // useEffect(() => {
  //   const elFotter = document.querySelector('footer') as HTMLElement;
  //   console.log(elFooter);
  //   setFooter(elFotter)
  // }, [])

  // window.addEventListener('scroll', () => {
  //   if (isIntrView(elFooter)) {
  //     elFooter?.classList.add('hide')
  //   } else {
  //     elFooter?.classList.remove('hide')
  //   }
  // })
  return (
    <>
      <header>
        <div className="bodyHeader">
            <Header></Header>
        </div>
      </header>
      <div className="container">
        <div className="bodyContainer">
            <Outlet></Outlet>
            <BoxChat></BoxChat>
        </div>
      </div>
      <footer>
        <div className="bodyFooter">
        <Footer></Footer>
        </div>
      </footer>
    </>
  );
}
