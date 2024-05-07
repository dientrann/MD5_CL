import { FaFacebookF, FaPhoneAlt, FaTiktok, FaTwitter } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { MdHome } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
export default function Footer() {
  return (
    <>
				<div className="contentFooter">
					<div className='map'>
            <h3>Address</h3>
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15673.10237133752!2d106.72562562110906!3d10.86663092860176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527f063241d47%3A0x67dba266f4c86cf9!2zVGFtIELDrG5oLCBUaOG7pyDEkOG7qWMsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1714895281674!5m2!1svi!2s" ></iframe>
					</div>
          <div className="about">
            <h3>About</h3>
            <h4>With a diverse collection of top brands such as Apple, Samsung, Xiaomi, OnePlus and more, we are proud to offer you a rich choice of product lines from different price segments, From high-end phone models to cheap but quality products.</h4>
          </div>
          <div className="contact">
            <h3>Contact</h3>
            <h4><MdHome></MdHome> <span>Tam Binh, Thu Duc</span></h4>
            <h4><IoIosMail></IoIosMail> <span>trandien99@gmail.com</span></h4>
            <h4><FaPhoneAlt></FaPhoneAlt> <span>(+84) 964 968 163</span></h4>
            <h4></h4>
          </div>
				</div>
        <div className="link">
            <div className="itemLink"><span><FaFacebookF></FaFacebookF></span></div>
            <div className="itemLink"><span><FaTiktok></FaTiktok></span></div>
            <div className="itemLink"><span><BiLogoGmail></BiLogoGmail></span></div>
            <div className="itemLink"><span><FaTwitter></FaTwitter></span></div>
        </div>
		</>
  );
}
