import React, { useState,useEffect } from 'react'
import ImageGetter from './ImageGetter'
import '../css/productCard.scss'
import { doc, deleteDoc,setDoc } from "firebase/firestore";
import {db,storage} from '../firebase'
import { getStorage, ref, deleteObject } from "firebase/storage";
import ProductFullScreen from './ProductFullScreen';
import { useNavigate } from 'react-router-dom';
export default function ProductCard({route,product,DefualtUserInfo,IsDontShowDelete,isShowStatus,isFullScreen}) {
  const [isDeleted,setIsDeleted] =useState(false)
  const [status,setStatus]=useState('') 
  const [IsProductFullScreen,setIsProductFullScreen]=useState(false)
  const navigate =useNavigate()
  useEffect(()=>{ 
    if(product.productState=='pending'){
        setStatus('بإنتظار الموافقة')
    }else if(product.productState=='accepted'){
    setStatus('موافق عليه')
}else if(product.productState=='rejected'){
    setStatus('مرفوض')
}
},[product])
  async function deleteProduct(){ 
    await deleteDoc(doc(db, "products", product.productId)); 

    product.ProductsImagesName.forEach(imageName => {
      const sotrageRef = ref(storage, `productImages/${product.productId}/${imageName}`); 
      // Delete the file
      deleteObject(sotrageRef).then(() => {
        // File deleted successfully 
      }).catch((error) => {
        // Uh-oh, an error occurred! 
      });
    });
    

    setIsDeleted(true)
    document.getElementById(`mainProductCont${product.productId}`).style.display='none'
   let productsbought = DefualtUserInfo?.userProductsId
   console.log(productsbought)
   console.log(DefualtUserInfo?.userProductsId)
   console.log(product.id)
   const index = productsbought.indexOf(product.productId);
   console.log(index)
    if (index > -1) { // only splice productsbought when item is found
      productsbought.splice(index, 1); // 2nd parameter means remove one item only 
    }console.log(productsbought)
    const productRef = doc(db, 'users', DefualtUserInfo?.phoneNumber);
    setDoc(productRef, { userProductsId:productsbought }, { merge: true });
    
    console.log(productsbought);
  }
  function productFullScreen(){
    alert(route)
      
      if(!route){
      navigate(`./${product.productId}`) 
      }else if(route=='buy'){
        navigate(`/buy/${product.productId}`)  
      }
      else{
        navigate(`/account/${route}/${product.productId}`)
      }
  }
  function setColor(){
    if(product?.productState=='rejected'){
      return 'red'
    }else if(product?.productState=='pending'){
      return '#FFBF00'
    }else if(product?.productState=='accepted'){
      return 'green'
    }
  }
  return ( 
    <>
    <div onClick={()=>productFullScreen()} style={{display:`${isDeleted?'none':'block'}`}} id='product' className="product-card"> 
         <ImageGetter imgClass='product-image'  product={product} imageIndex={0} />  
        <div className="description">
  
          <div className="info">
            <h2 className='product-title'>{product.productName}</h2>
            <div className={product.productName.length&&isShowStatus!==false>50&&'flex2'}>

            <div>
            <h4 style={{fontSize:'1.3rem'}} className='product-catgeory'>{product.productCategory}</h4>
    {IsDontShowDelete&& <button className='delete-button' onClick={()=>deleteProduct()}>delete</button>}
          {isShowStatus!==false && <p 
          className='product-status'>الحالة: <span style={{color:`${setColor()}`}}>{status}</span> </p>}  
    </div>

      <div className='price' style={{display:'bl'}}>  
          {product.productPrice} {product?.productCurrency=='dollar'?'usd':'l.l'}
            </div> 
          </div>
            </div>
          </div> 
    
        </div>   
    {IsProductFullScreen&&isFullScreen!==false&&<ProductFullScreen IsProductFullScreen={IsProductFullScreen}  product={product} />}  
        </>
  )
}
