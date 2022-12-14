import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  Paper,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useAlert } from "react-alert";
import { CategoryService } from "../../../services/category-service";
import { ProductService } from "../../../services/product-service";
import { Editor } from 'primereact/editor';

import "./style.scss";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const UpdateProduct = () => {
  const {id} = useParams();
  const [product,setProduct] = useState({});

  const [categories, setCategories] = useState([{
    name:"LAPTOP",
    subCategories: "Dell, HP, MACBOOK"
  },{
    name:"DIEN THOAI",
    subCategories: "nokia, sam sung, oppo"
  }]);
  const [description,setDescription] = useState("");
  const [subcategory, setSubcategory] = useState([]);
  const category = categories.map((item)=>item.name);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [cate, setCate] = useState("");
  const alert = useAlert();
  const history = useHistory();
  console.log(categories);
  const categoryService = new CategoryService();
  const productService = new ProductService();
  useEffect(()=>{
    const getProductById = async()=>{
      const res = await productService.getProductById({id})
      setProduct(res.product);
      
    }
    getProductById();
  },[])
  console.log(product)
  // useEffect(() => {
  //   const getCategory = async () => {
  //     const res = await categoryService.getCategory();
  //     setCategories(res);
  //     setCate(res[0]?.name);
  //   };
  //   getCategory();
    
  // }, []);
  // console.log(categories)

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChangeCategory = (e) => {
    setCate(e.target.value);
  };

  const backProdPage = () => {
    history.push("/admin/products");
  };
  const handelChangeCategory=(value,setFieldValue)=>{
    console.log(value);
    console.log(setFieldValue);
    const element = categories.find(item => item.name=== value);
    const nsx = element?.subCategories.split(", ");
    nsx && setSubcategory(nsx)
    setFieldValue("category",value);
   
  }
  const Ref = useRef();
 
  return (
    <>
      <Paper className="addProd-container grid wide pt-2 pb-2 mt-4">
        <div className="grid wide">
          <h2 className="title">Th??m s???n ph???m</h2>
          <Formik
            ref = {Ref}
            initialValues={product}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              const newProduct = {
                ...values,
                images: imagesPreview,
                description
              };
              console.log(newProduct)
              try {
                await productService.addProduct(newProduct);
                history.push("/admin/products");
                alert.success("Th??n th??nh c??ng!");
              } catch (e) {
                console.log(e);
              }
            }}
          >
            {({ errors, touched, handleSubmit, handleChange ,setFieldValue}) => (
              <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col  m-12 c-12 mb-1">
                  <TextField
                    label="T??n s???n ph???m"
                    name="name"
                    variant="outlined"
                   
                    onChange={handleChange}
                  />
                  {errors.name && touched.name && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="col l-6  m-12 c-12 mb-1">
                <Autocomplete
                  disablePortal
                  name="category"
                  id="com"
                  options={category}
                  onChange={(event, value) => {
                    handelChangeCategory(value,setFieldValue)
                  }}
                  renderInput={(params) => <TextField {...params}  label="Danh m???c s???n ph???m" />}
                />
                 {errors.category && touched.quantity && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.category}
                    </div>
                  )}
                </div>
                <div className="col l-6  m-12 c-12 mb-1">
                <Autocomplete
                  disablePortal
                  name="nsx"
                  id="combo-box-demo"
                  options={subcategory}
                  onChange={(event, value) => {
                    setFieldValue("nsx",value)
                  }}
                  renderInput={(params) => <TextField {...params} label="Nh?? s???n xu???t" />}
                />
                 {errors.quantity && touched.quantity && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.nsx}
                    </div>
                  )}
                </div>
                
                <div className="col  m-12 c-12 mb-1">
                  <TextField
                    label="S??? l?????ng nh???p v??o"
                    name="quantity"
                    type="number"
                    variant="outlined"
                    defaultValue={product.quantity}
                    onChange={handleChange}
                  />
                  {errors.quantity && touched.quantity && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.quantity}
                    </div>
                  )}
                </div>
                <div className="col  m-12 c-12 mb-1">
                  <TextField
                    label="Gi?? (vn??)"
                    type="number"
                    name="price"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  {errors.price && touched.price && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.price}
                    </div>
                  )}
                </div>
                <div className="col  m-12 c-12 mb-1">
                  <TextField
                    label="Gi???m gi?? (%)"
                    type="number"
                    name="discount"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  {errors.discount && touched.discount && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.discount}
                    </div>
                  )}
                </div>
                <div className="col  m-12 c-12 mb-1">
                  <TextField
                    label="M??u s???c"
                    name="color"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  {errors.color && touched.color && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {errors.color}
                    </div>
                  )}
                </div>
                <div className="col l-12">
                    <Editor style={{height:'320px'}} value={description} onTextChange={(e) => setDescription(e.htmlValue)} />
                </div>
                <div id="createProductFormFile" className="col">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={createProductImagesChange}
                    multiple
                  />
                </div>
                <div id="createProductFormImage" className="row mt-2">
                  {imagesPreview.map((image, index) => (
                    <div key={index} className="col l-2">
                      <img
                        className="image-prod"
                        key={index}
                        src={image}
                        alt="Product Preview"
                      />
                    </div>
                  ))}
                </div>
                <div className="group-btn">
                  <input
                    type="submit"
                    onClick={handleSubmit}
                    value="Th??m s???n ph???m"
                  />
                  <Button
                    startIcon={<KeyboardBackspaceIcon />}
                    size="medium"
                    onClick={backProdPage}
                  >
                    Tr??? v???
                  </Button>
                </div>
              </div>
              </Form>
            )}
          </Formik>
         
                  
        </div>
      </Paper>
    </>
  );
};

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("T??n kh??ng ???????c ????? tr???ng!"),
  category: Yup.string().required("Danh m???c kh??ng ???????c ????? tr???ng!"),
  nsx: Yup.string().required("Nh?? s???n xu???t kh??ng ???????c ????? tr???ng!"),
  quantity: Yup.number().min(1,"C???n nh???p s??? l?????ng ?????u v??o!"),
  price: Yup.number().required("Price kh??ng ???????c ????? tr???ng!"),
  color: Yup.string().required("M??u s???c kh??ng ???????c ????? tr???ng!"),
  discount: Yup.number().required("Gi???m gi?? kh??ng ???????c ????? tr???ng!"),
});

export default UpdateProduct;
