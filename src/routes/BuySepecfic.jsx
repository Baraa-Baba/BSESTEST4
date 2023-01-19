import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc ,getDoc } from "firebase/firestore";  
import { db,storage } from '../firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import ImageGetter from '../components/ImageGetter';
import ProductFullScreen from '../components/ProductFullScreen';
export default function BuySepecfic() {
    const [product,setProduct]=useState({})
    const Pramas =useParams()
    const ProductId=Pramas.buyId
    useEffect(()=>{
        console.log(Pramas)
        async function getProduct(){
            const docRef = doc(db, `products/${ProductId}`); 
            const docSnap = await getDoc(docRef);
            docSnap.data(); 
            try { const docSnap = await getDoc(docRef); 
            if(docSnap.exists()) { setProduct(docSnap.data()); }
             else { console.log("Document does not exist") } } catch(error) { console.log(error) }
            
       
          }
          getProduct()
    },[])
    useEffect(()=>{
        console.log(product)
    },[product])
  return (
    <>  
    {product?.ProductsImagesName&& <ProductFullScreen showBuyButton={true} isShowProductState={false}
     product={product} route={'buy'} />}
    </>
  )
}
