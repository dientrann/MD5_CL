import apis from "@/apis";
import { StoreType } from "@/stores";
import { categoryAction } from "@/stores/slices/category.slice";
import { message } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function ModalUpdate({ handleIsModalUpdate = () => { }, title = "" }) {
    const dispatch = useDispatch()

    const categoryStore = useSelector((store: StoreType) => store.categoryStore);

    const findCategory = categoryStore.data?.find((item) => {
        return item.title == title;
    })

    const handleUpdate = (values: formValues):Promise<string> => {

        return new Promise(async(resolve, reject) => {
            try{
                let resUpdate = await apis.categoryApi.update(localStorage.getItem("token") as string, findCategory?.title as string, values)
                console.log(resUpdate);
                if(resUpdate.status != 200){
                    throw {
                        message: "Update Error"
                    }
                }
                resolve(resUpdate.data.message)
                dispatch(categoryAction.update(resUpdate.data.data))
                
            }catch(err: any){
                reject(err.response.data.message? err.response.data.message.join(', ') : "Error Create Category")
            }
        })
    }


    interface formValues {
        title: string,
        link: string
    }
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalUpdate()
                }, 800)
            }

        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Update Category</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalUpdate()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        <Formik
                            initialValues={{
                                title: findCategory?.title? findCategory.title : "",
                                link: findCategory?.title ? findCategory.link : ""
                            }}
                            validate={values => {
                                const errors: Partial<formValues> = {};

                                if(values.link == findCategory?.link && values.title == findCategory?.title){
                                    errors.link = "* The data has not been changed"
                                    errors.title = "* The data has not been changed"
                                }
                                if (typeof values.title != "string") {
                                    errors.title = "* Title is String"
                                }
                                if (!values.title) {
                                    errors.title = "* Title is required"
                                }
                                if (values.title.length > 50) {
                                    errors.title = "* Title is max 50 characters"
                                }
                                if (typeof values.link != "string") {
                                    errors.link = "* Link is String"
                                }
                                if (!values.link) {
                                    errors.link = "* Link is required"
                                }
                                if (values.link.length > 50) {
                                    errors.link = "* Link is max 50 characters"
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                                handleUpdate(values).then((res)=>{
                                    setSubmitting(false);
                                    message.success(res);
                                    document.querySelector('.bodyModal')?.classList.add('close')
                                    setTimeout(() => {
                                        handleIsModalUpdate()
                                    }, 800)
                                }).catch(err => {
                                    setSubmitting(false);
                                    message.error(err);
                                })

                            }}

                        >
                            {({ isSubmitting, errors, touched ,handleChange, handleBlur, values}) => {
                                return (
                                    <Form>
                                        <div className={`formInput ${errors.title && touched.title ? 'error' : ''}`}>
                                            <label htmlFor="title">Title:</label>
                                            <Field type="text" name="title" id="title" value={values.title} onChange={handleChange} onBlur={handleBlur}></Field>
                                            <ErrorMessage name="title" component="div" className="errMessage" />
                                        </div>
                                        <div className={`formInput ${errors.link && touched.link ? 'error' : ''}`}>
                                            <label htmlFor="link">Link:</label>
                                            <Field type="text" name="link" id="link" value={values.link} onChange={handleChange} ></Field>
                                            <ErrorMessage name="link" component="div" className="errMessage" />
                                        </div>
                                        <div className="formBtn">
                                            <button className="updateBtn" type="submit" disabled={isSubmitting}>Update</button>
                                            <button type='button' className="cancelBtn" onClick={() => {
                                                document.querySelector('.bodyModal')?.classList.add('close')
                                                setTimeout(() => {
                                                    handleIsModalUpdate()
                                                }, 800)
                                            }}>Cancel</button>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>

                    </div>
                </div>
            </div>
        </div>
    );
}
