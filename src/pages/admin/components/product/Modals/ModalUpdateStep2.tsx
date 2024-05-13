import { useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import apis from '@/apis';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { productAction } from '@/stores/slices/product.slice';
import { FaUpload } from "react-icons/fa";

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageResize } from "quill-image-resize-module-ts";
import { StoreType } from '@/stores';

//dataUpdateStep1 = {name: "", describe: "", price: 0, categoryId: 0}


export default function ModalUpdateStep2({ handleIsModalUpdate = () => { }, dataUpdateStep1 = { id: 0, name: "", describe: "", price: 0, categoryId: 0 } }) {
  const productStore = useSelector((store: StoreType) => store.productStore)
  const findProduct = productStore.data?.find(item => item.id === dataUpdateStep1.id)
  const cropperRef = useRef<ReactCropperElement>(null);
  const dispatch = useDispatch()
  const [image, setImage] = useState(`http://localhost:3000/${findProduct?.image}`);

  const [content, setContent] = useState(findProduct?.content);
  Quill.register('modules/imageResize', ImageResize);
  console.log(dataUpdateStep1);


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
  const handleUpdate = async () => {
    try {

      if (typeof cropperRef.current?.cropper !== "undefined") {
        const canvas = cropperRef.current?.cropper.getCroppedCanvas();
        canvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
            // Sử dụng đối tượng file ở đây hoặc truyền cho hàm xử lý khác
            if (!dataUpdateStep1) {
              throw {
                message: "Vui Lòng Hoàn Thành Bước 1"
              }
            }
            let resUpdate = await apis.productApi.update(dataUpdateStep1.id, file, { ...dataUpdateStep1, content: content })
            if (resUpdate.status != 200) {
              throw {
                message: "Create Product Error"
              }
            }
            dispatch(productAction.update(resUpdate.data.data))
            message.success("Update Product Success")
          }
        }, "image/jpeg");


      }
    } catch (err: any) {
      message.error(err.response.data.message ? err.response.data.message.join(', ') : "Error Create Category")

    }
  };
  return (
    <div className='formStep2'>
      <div>Image Product: </div>
      <div style={{ width: "100%" }}>
        <label htmlFor="fileImg"><span><FaUpload /></span></label>
        <input type="file" id="fileImg" onChange={cropImage} />

        <br />
        <Cropper
          style={{ height: '300px', width: '100%' }}
          initialAspectRatio={290 / 315}
          aspectRatio={290 / 315}
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
        <div>Describe:</div>
        <ReactQuill
          style={{ width: '100%', height: '300px' }}
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
          handleUpdate()
          document.querySelector('.bodyModal')?.classList.add('close')
          setTimeout(() => {
            handleIsModalUpdate()
          }, 800)
        }}>Create</button>
        <button type='button' className="cancelBtn" onClick={() => {
          document.querySelector('.bodyModal')?.classList.add('close')
          setTimeout(() => {
            handleIsModalUpdate()
          }, 800)
        }}>Cancel</button>
      </div>
    </div>
  );
}
