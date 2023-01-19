import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserAuth } from '../context/AuthContext';
import { doc ,getDoc,setDoc } from "firebase/firestore";  
import { db,storage,messaging} from '../firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import ImageGetter from '../components/ImageGetter'; 
import ProductFullScreen from '../components/ProductFullScreen';
import { getToken } from 'firebase/messaging';
export default function AdminSpecfic() {
    const {  user } = useUserAuth();
    const [product,setProduct]=useState({})
    const [DefualtUserInfo,setDefualtUserInfo]=useState({})
    const Pramas =useParams()
    const ProductId=Pramas.productId
    useEffect(() => { 
        if(user){ 
        async function readDb(){
          const docRef = doc(db, "users",user?.phoneNumber); 
          const docSnap = await getDoc(docRef);
          docSnap.data(); 
          try { const docSnap = await getDoc(docRef); 
          if(docSnap.exists()) { console.log(setDefualtUserInfo(docSnap.data())); }
           else { console.log("Document does not exist") } } catch(error) { console.log(error) }
          
     
        }
        readDb()
      }
      }, [user])
    useEffect(()=>{
        if(user?.phoneNumber){
        console.log(Pramas)
        console.log()
        async function getProduct(){
            const docRef = doc(db, `products/${ProductId}`); 
            const docSnap = await getDoc(docRef);
            docSnap.data(); 
            try { const docSnap = await getDoc(docRef); 
            if(docSnap.exists()) { setProduct(docSnap.data()); }
             else { console.log("Document does not exist") } } 
             catch(error) { console.log(error) }
            
       
          }
          getProduct()
        }
    },[user])

    function EditStatus(productId,status){
        const productRef = doc(db, 'products', productId);
        setDoc(productRef, { productState: status }, { merge: true });
        alert(productId)

      }
      useEffect(()=>{  
        Notification.requestPermission().then(permission => {  
            if (permission === 'granted') {
              alert('granted')
          console.log('Your token is:',getToken(messaging, {vapidKey: "BPyh4hdlS6a_jwhiZSf1YGLloh_MAp-5BASTajTYsPkJhpEosnlIncmLOa3E4tWvUHHGlPfUwsls9T-mqi9WWfY"}) );
        }
          });  
      },[])
    
  return (
    <div>
          {user?.phoneNumber=='+96176032809'? 
          <>
    {product?.ProductsImagesName&&
    <>
     <ProductFullScreen route={'admin'} product={product} >
        
     </ProductFullScreen>
  </>
}
    <div style={{direction:'ltr',fontSize:'2rem',marginLeft:'3rem'}}>
        user info  <br />
        user name : {DefualtUserInfo?.name} <br />
        user phone number : {user?.phoneNumber} <br />
        user defualt phone number : {DefualtUserInfo?.phoneNumber} <br />
        user location : {DefualtUserInfo?.location} <br />
        user email : {DefualtUserInfo?.email} <br />
    </div>
  <button className='EditStatus' onClick={()=>EditStatus(product.productId,'rejected')}>rejected</button>
  <button className='EditStatus' onClick={()=>EditStatus(product.productId,'accepted')}>accept</button>
    </>
        :<div>loading...</div>}
    </div>
  )
}
