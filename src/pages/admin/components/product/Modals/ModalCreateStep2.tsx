
import { useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import { step1Data } from './ModalCreateStep1';
import apis from '@/apis';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { productAction } from '@/stores/slices/product.slice';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageResize } from "quill-image-resize-module-ts";

interface ModalCreateStep2Props {
    handleIsModalCreate: () => void;
    dataCreate: step1Data | null;
}

export default function ModalCreateStep2({ handleIsModalCreate, dataCreate }: ModalCreateStep2Props) {
    const cropperRef = useRef<ReactCropperElement>(null);
    const dispatch = useDispatch()
    const [image, setImage] = useState("https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg");

    const [content, setContent] = useState('');
    Quill.register('modules/imageResize', ImageResize);

    const handleChange = (value: any) => {
        setContent(value);
    };

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
                        if (!dataCreate) {
                            throw {
                                message: "Vui Lòng Hoàn Thành Bước 1"
                            }
                        }


                        let resCreate = await apis.productApi.create(file, { ...dataCreate, content: content })
                        if (resCreate.status != 200) {
                            throw {
                                message: "Create Product Error"
                            }
                        }
                        dispatch(productAction.create(resCreate.data.data))
                        message.success("Create Product Success")
                    }
                }, "image/jpeg");


            }
        } catch (err: any) {
            message.error(err.response.data.message ? err.response.data.message.join(', ') : "Error Create Category")

        }
    };
    return (
        <div className='formStep2'>
            <div style={{ width: "100%" }}>
                <input type="file" onChange={cropImage} />
                <br />
                <Cropper
                    style={{ height: '300px', width: '100%px' }}
                    initialAspectRatio={290 /315}
                    aspectRatio={290/315}
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
            <div className='quill'>
                <ReactQuill
                    style={{ width: '100%px', height: '300px' }}
                    value={content}
                    onChange={handleChange}
                    modules={{
                        toolbar: [
                            [{ header: '1' }, { header: '2' }, { font: [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [
                                { list: 'ordered' },
                                { list: 'bullet' },
                                { indent: '-1' },
                                { indent: '+1' }
                            ],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                        clipboard: {
                            // toggle to add extra line breaks when pasting HTML:
                            matchVisual: false
                        },
                        imageResize: {
                            parchment: Quill.import('parchment'),
                            modules: ['Resize', 'DisplaySize']
                        }
                        // toolbar: [
                        //   [{ 'header': [1, 2, false] }],
                        //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        //   [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        //   ['link', 'image', 'video'],
                        //   ['clean']
                        // ],
                        // imageResize: {
                        //   displaySize: true, // Hiển thị kích thước ảnh trong editor
                        //   modules: ['Resize', 'DisplaySize', 'Toolbar']
                        // },
                        // imageDrop: true, // Cho phép kéo thả ảnh vào trình soạn thảo
                    }}
                    formats={[
                        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'link', 'image', 'video'
                    ]}
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
    );
}