import apis from '@/apis';
import { carouselAction } from '@/stores/slices/carousel.slice';
import { message } from 'antd';
import { useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { IoClose } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import "cropperjs/dist/cropper.css";
import '../../product/Modals/modalCreate.style.scss'

export default function ModalCreate({ handleIsModalCreate = () => { } }) {
    const cropperRef = useRef<ReactCropperElement>(null);
    const dispatch = useDispatch()
    const [image, setImage] = useState("https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg");

    const cropImage = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
    };
    const handleCreate = async () => {
        try {

            if (typeof cropperRef.current?.cropper !== "undefined") {
                const canvas = cropperRef.current?.cropper.getCroppedCanvas();
                canvas.toBlob(async (blob: Blob | null) => {
                    if (blob) {
                        const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
                        // Sử dụng đối tượng file ở đây hoặc truyền cho hàm xử lý khác
                        console.log("Cropped image file:", file);


                        let resCreate = await apis.carouselApi.create(file)
                        if (resCreate.status != 200) {
                            throw {
                                message: "Create Product Error"
                            }
                        }
                        dispatch(carouselAction.create(resCreate.data.data))
                        message.success("Create Product Success")
                    }
                }, "image/jpeg");


            }
        } catch (err: any) {
            message.error(err.response.data.message ? err.response.data.message.join(', ') : "Error Create Category")

        }
    };
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalCreate()
                }, 800)
            }
        }}>
            <div className='contentModal step2'>
                <div className="bodyModal carousel">
                    <div className="headerModal">
                        <h3>Create Carousel</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalCreate()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        <div className='formStep2'>
                            <div style={{ width: "100%" }}>
                                <input type="file" onChange={cropImage} />
                                <br />
                                <Cropper
                                    style={{ height: '400px', width: '100%' }}
                                    initialAspectRatio={1440/500}
                                    aspectRatio={1440/500}
                                    preview=".img-preview"
                                    src={image}
                                    ref={cropperRef}
                                    viewMode={1}
                                    guides={true}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    checkOrientation={false}
                                />
                            </div>

                            <div className="formBtn">
                                <button className="createBtn" onClick={() => {
                                    handleCreate()
                                    document.querySelector('.bodyModal')?.classList.add('close')
                                    setTimeout(() => {
                                        handleIsModalCreate()
                                    }, 800)
                                }}>Create</button>
                                <button type='button' className="cancelBtn" onClick={() => {
                                    document.querySelector('.bodyModal')?.classList.add('close')
                                    setTimeout(() => {
                                        handleIsModalCreate()
                                    }, 800)
                                }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
