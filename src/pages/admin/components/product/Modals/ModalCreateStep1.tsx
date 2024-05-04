import { ErrorMessage, Field, Form, Formik } from 'formik';
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { StoreType } from '@/stores';
import { useState } from 'react';
import ModalCreateStep2 from './ModalCreateStep2';
import './modalCreate.style.scss'

export interface step1Data {
    name: string;
    describe: string;
    price: number;
    categoryId: number;
}
export default function ModalCreateStep1({ handleIsModalCreate = () => { } }) {
    const categoryStore = useSelector((store: StoreType) => store.categoryStore)
    const [isStep2, setIsStep2] = useState(false)
    const [dataCreate, setDataCreate] = useState<step1Data | null>(null)

    interface errorsFormValues {
        name: string
        describe: string
        price: string
        categoryId: string
    }
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalCreate()
                }, 800)
            }
        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Create Product</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalCreate()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        {
                            isStep2 ? <ModalCreateStep2 handleIsModalCreate={handleIsModalCreate} dataCreate={dataCreate}></ModalCreateStep2> :
                                <Formik
                                    initialValues={{
                                        name: "",
                                        describe: "",
                                        price: 0,
                                        categoryId: 0,
                                    }}
                                    validate={values => {
                                        const errors: Partial<errorsFormValues> = {};
                                        if (typeof values.name != "string") {
                                            errors.name = "* Name is String"
                                        }
                                        if (!values.name) {
                                            errors.name = "* Name is required"
                                        }
                                        if (values.name.length > 100) {
                                            errors.name = "* Name is max 100 characters"
                                        }
                                        if (!values.price) {
                                            errors.price = "* Price is required"
                                        }
                                        if (values.price <= 0) {
                                            errors.price = "* Price is greater than 0"
                                        }
                                        if (!values.describe) {
                                            errors.describe = "* Describe is required"
                                        }
                                        if (values.categoryId == 0) {
                                            errors.categoryId = "* Category is required"
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        setSubmitting(true);
                                        document.querySelector('.bodyModal')?.classList.add('step2')
                                        setIsStep2(!isStep2)
                                        setDataCreate(values)
                                    }}

                                >
                                    {({ isSubmitting, errors, touched }) => {
                                        return (
                                            <Form>
                                                <div className={`formInput ${errors.name && touched.name ? 'error' : ''}`}>
                                                    <label htmlFor="name">Name:</label>
                                                    <Field type="text" name="name" id="name"></Field>
                                                    <ErrorMessage name="name" component="div" className="errMessage" />
                                                </div>
                                                <div className={`formInput ${errors.describe && touched.describe ? 'error' : ''}`}>
                                                    <label htmlFor="describe">Describe:</label>
                                                    <Field as="textarea" name="describe" id="describe"></Field>
                                                    <ErrorMessage name="describe" component="div" className="errMessage" />
                                                </div>
                                                <div className={`formInput ${errors.price && touched.price ? 'error' : ''}`}>
                                                    <label htmlFor="price">Price:</label>
                                                    <Field type="number" name="price" id="price"></Field>
                                                    <ErrorMessage name="price" component="div" className="errMessage" />
                                                </div>
                                                <div className={`formInput ${errors.categoryId && touched.categoryId ? 'error' : ''}`}>
                                                    <label htmlFor="category">Category:</label>
                                                    <Field as="select" name="categoryId" id="category">
                                                        <option value="0">Select a category</option>
                                                        {
                                                            categoryStore.data?.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.title}
                                                                </option>
                                                            ))}
                                                    </Field>
                                                    <ErrorMessage name="categoryId" component="div" className="errMessage" />
                                                </div>
                                                <div className="formBtn">
                                                    <button className="createBtn" type="submit" disabled={isSubmitting}>Next</button>
                                                    <button type='button' className="cancelBtn" onClick={() => {
                                                        document.querySelector('.bodyModal')?.classList.add('close')
                                                        setTimeout(() => {
                                                            handleIsModalCreate()
                                                        }, 800)
                                                    }}>Cancel</button>
                                                </div>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
