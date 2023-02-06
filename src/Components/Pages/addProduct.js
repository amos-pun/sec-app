import React, { useEffect, useState } from "react";
import Footer from "../Layout/Footer";
import Admin from "../Layout/Admin";
import NavbarAdmin from "../Layout/NavbarAdmin";
import { isAuthenticated } from "../../api/userAPi";
import { getAllCategories } from "../../api/categoryAPI";
import { addproducts } from "../../api/praductApi";

const AddProduct = () => {
    const [ categories, setCategories ] = useState ([])
    const [product, setProduct] = useState({
    product_name: "",
    product_price: "",
    product_description: "",
    count_in_stock: "",
    product_image: "",
    category: "",
    error: "",
    success: false,
    formdata: ""
  });

  const{token} = isAuthenticated()

  const {
    product_name,
    product_price,
    product_description,
    count_in_stock,
    error,
    success,
    formdata,
  } = product;

  useEffect(()=>{
    getAllCategories()
    .then(data=>setCategories(data))
    setProduct({...product, formdata: new FormData})
  },[])



  const handleChange = name => e => {
    let value
    if (name === "product_image") {
      value = e.target.files[0];
    } else {
      value = e.target.value;
    }
    setProduct({ ...product, [name]: value });
    formdata.set(name, value);
  };

  const handleSubmit = e => {
    e.preventDefault()
    addproducts(formdata, token)
    .then(data =>{
        if(data.error){
            setProduct({...product, error:data.error,success:false})
        }
        else{
            setProduct({success:true, product_name: '', product_price: '', product_description: '',
            count_in_stock:'', formdata: new FormData , error: ''})
        }
    })
  }

  const showError = () => {
    if(error){
        return <div className="alert alert-danger">{error}</div>
    }
  }

  const showSuccess = () => {
    if(success){
        return <div className="alert alert-success">Product Added Successfully.</div>
    }
  }

  return (
    <div className="bg-light">
      <NavbarAdmin />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-3">
            <Admin product />
          </div>

          <div className="col-lg-7">
            <h1>Add New Product</h1>
            {showError()}
            {showSuccess()}
            <form>
              <label htmlFor="product_name">Product Name</label>
              <input
                type="text"
                className="form-control mb-1"
                id="product_name"
                onChange={handleChange('product_name')}
                value={product_name}
              />

              <label htmlFor="product_price">Product Price</label>
              <input
                type={'number'}
                className="form-control mb-1"
                id="product_price"
                onChange={handleChange('product_price')}
                value={product_price}
              />

              <label htmlFor="product_description">Description</label>
              <textarea
                className="form-control mb-1"
                rows={3}
                id="product_description"
                onChange={handleChange('product_description')}
                value={product_description}
              ></textarea>

              <label htmlFor="count"> Count in stock</label>
              <input type={"number"} className="form-control mb-1" 
                onChange={handleChange('count_in_stock')}
                value={count_in_stock}
              id="count" />

              <label htmlFor="image">Product Image</label>
              <input
                type={"file"}
                className="form-control mb-1"
                id="image"
                onChange={handleChange('product_image')} 
              ></input>

              <label htmlFor="category">Category</label>
              <select id="category" className="form-control mb-1"
              onChange={handleChange('category')}
              >
                <option>Select Category</option>
                {
                    categories && categories.map(cat => {
                        return <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                    })
                }
              </select>

              <button className="btn btn-warning w-100" 
                onClick={handleSubmit}
              >Add Product</button>
            </form>
          </div>

          <div className="col-lg-1"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;
