import React, { useEffect, useState } from 'react'
import '../css/productFullScreen.css'
import ImageGetter from './ImageGetter' 
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc,setDoc,getDoc } from "firebase/firestore";
import PhoneInput from 'react-phone-number-input';
import {db,storage} from '../firebase'
import { messaging } from '../firebase';
import { getToken } from 'firebase/messaging';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useUserAuth } from '../context/AuthContext';
export default function ProductFullScreen({route,product,showBuyButton,IsProductFullScreen,isShowProductState,IsShowDelete}) {
    const [isClosed,setisClosed]=useState(false)
    const [status,setStatus]=useState('') 
    const { logOut, user } = useUserAuth();
    const [IsShowForm,setIsShowForm]=useState(false)
    const [DefualtUserInfo,setDefualtUserInfo]=useState({})
    const [CourselItems,setCourselItems]=useState()
    const [Images,setImages]=useState([]) 
    const navigate=useNavigate() 
    useEffect(() => { 
        if(user){ 
        async function readDb(){
          const docRef = doc(db, "users",user?.phoneNumber); 
          const docSnap = await getDoc(docRef);
          docSnap.data(); 
          try { const docSnap = await getDoc(docRef); 
          if(docSnap.exists()) { 
            console.log(setDefualtUserInfo(docSnap.data()) 
            );
            if(user?.phoneNumber!==docSnap.data().phoneNumber){
                navigate('/')
            }
        }
           else { console.log("Document does not exist") } } catch(error) { console.log(error) }
          
            
        }
        readDb()
      }
      }, [user])
    useEffect(()=>{ 
        if(product.productState=='pending'){
            setStatus('بإنتظار الموافقة')
        }else if(product.productState=='accepted'){
        setStatus('موافق عليه')
    }else if(product.productState=='rejected'){
        setStatus('مرفوض')
    }
    },[product])
    const responsive = {
        0: { items: 1 },
        568: { items: 1 },
        1024: { items: 1 },
    };
    
    const items = [
    ];
    useEffect(()=>{
        if(product?.ProductsImagesName){ 
            var tmpImages=[]
            product.ProductsImagesName.forEach((elment,index) => { 
                    tmpImages=[...tmpImages,<ImageGetter imageIndex={index}  imgClass='product-imageFullScreen' product={product} />] 
        })
        setImages(tmpImages)
        console.log(tmpImages)
        }
    },[product]) 
    useEffect(()=>{
        console.log(Images)
    },[Images])
    function closeButton(){
        if(route=='admin'){
            navigate('/admin')
        }else if(route=='buy'){
            navigate('/buy')
        }else{
            navigate('/account/')
        }
    }
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
        navigate('/account')
      }
      function buyProduct(){
        if(!user?.phoneNumber){
            navigate('/sign-in')
            
        } 
        else if(user?.phoneNumber===product?.userPhoneNumber){
             alert("Sorry, you can't buy your own product!"); 
        }else if(!DefualtUserInfo?.location){
             alert('enter location'); 
        } 
         const getToken = () => {
             getToken(messaging, {vapidKey: 'BPyh4hdlS6a_jwhiZSf1YGLloh_MAp-5BASTajTYsPkJhpEosnlIncmLOa3E4tWvUHHGlPfUwsls9T-mqi9WWfY'}).then((currentToken) => {
              if (currentToken) {
                console.log('current token for client: ', currentToken);
                // Track the token -> client mapping, by sending to backend server
                // show on the UI that permission is secured
              } else {
                console.log('No registration token available. Request permission to generate one.');
                // shows on the UI that permission is required 
              }
            }).catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
              // catch error while creating client token
            });
          }
          getToken()
        if(DefualtUserInfo?.phoneNumber&&DefualtUserInfo?.location){
            alert('bought')
        }
        else{
            setIsShowForm(true)
            alert('الرجاء ملئ موقعك لنرفع أين نسلمك')
        }
      }
      useEffect(()=>{
        if(product.ProductsImagesName.length==3){
            setCourselItems([<ImageGetter imageIndex={0}  imgClass='product-imageFullScreen' product={product} />,<ImageGetter imageIndex={1}  imgClass='product-imageFullScreen' product={product}/>, <ImageGetter imageIndex={2}  imgClass='product-imageFullScreen' product={product} />])
        }if(product.ProductsImagesName.length==2){
            setCourselItems([<ImageGetter imageIndex={0}  imgClass='product-imageFullScreen' product={product} />,<ImageGetter imageIndex={1}  imgClass='product-imageFullScreen' product={product}/>])
        }if(product.ProductsImagesName.length==1){
            setCourselItems([<ImageGetter imageIndex={0}  imgClass='product-imageFullScreen' product={product} />])
        }if(product.ProductsImagesName.length==0){
            setCourselItems([])
        }
      },[product])
  return (
    <div className='topOne'>
    <div id={`productFullScreenCont${product.productId}`}>
        
    <div className="container"> 
    <button id={`closeButton${product.productId}`}  className='closeButton' onClick={(e)=>closeButton()}>X</button>

        <div className='imgBx'>
    {Images.length>1 ?
                <AliceCarousel  renderPrevButton={()=><button id='prev' className='nextPrev'>{'<'}</button>} 
                renderNextButton={()=><button id='next' className='nextPrev'>{'>'}</button>}
                 items={CourselItems}  />
            :<ImageGetter imageIndex={0}  imgClass='product-imageFullScreen' product={product} />}
                </div> 
        <div className="details">
            <div className="content">
                <h2>{product.productName}<br/>
                    <span>{product.productCategory}</span>
                </h2>
                <p style={{fontSize:'1.5rem'}} className='descriptionFullScreen'>
                    {product.productDescription}
                </p> 
                <h3>{product.productPrice}{product.productCurrency}</h3> 
              {isShowProductState!==false&&  <p className='productStatus'>الحالة: {status}</p>}
              {IsShowForm&& <>
            <label className='accountLabel'  htmlFor="location">موقعك</label>
      <input style={{width:'30vw'}} defaultValue={DefualtUserInfo?.location} type="text" className='textInput' id='location' 
      placeholder=' موقعك (أكتب موقعك بتفصيل المنطقة الحي البنايا الطابق)' />
      <p>نحتاج موقع  لتسليم وإستلام المنتجات</p>
        
           </>
           }
           {showBuyButton==true && <button className='buyProduct' style={{fontSize:'2rem',padding:'10px'}}
           onClick={()=>buyProduct()}>أشترى</button>}
            </div>
            {IsShowDelete==true&& <button className='delete-button' onClick={()=>deleteProduct()}>delete</button>}
           
        </div>
    </div>
    <style jsx>{`
        ${`.productFullScreenCont${product.productId}`}{ 
            position:relative;
        }
        .container{
            position:relative;
        }
        body {
    margin: 0;
    padding: 0;  
    min-height: 100vh;  
    align-items: center;
    min-height: 100vh;
    position:relative; 
    display:flex;
    justify-content:center;
    font-family: 'Poppins', sans-serif;
    background: #000;
}
.contanior
    .topOne{ 
        position:relative;

    }
    .closeButton{
        top:0px;
        right:15px;
        position:absolute;
        z-index:100
    }
        `}</style>
    </div>
    </div>
  )
}
