import React, { useEffect,useState } from 'react'
import { getStorage,ref,getDownloadURL } from 'firebase/storage';
export default function ImageGetter({product,imgClass,imageIndex}) {
    const [url,setUrl]=useState()
    useEffect(()=>{
    if(product&&product?.ProductsImagesName[0]){ 
        const storage = getStorage(); 
        getDownloadURL(ref(storage, `gs://bses-1fed7.appspot.com/productImages/${product?.productId}/${product.ProductsImagesName[imageIndex]}`))
          .then((url) => { 
        
            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send(); 
            // Or inserted into an <img> element 
            setUrl(url)
            console.log(url)
        })
        .catch((error) => {
          // Handle any errors
        });   
    }
    },[product])
  return ( 
        <img  alt="Product Image" className={imgClass}  src={url} /> 
  )
}
