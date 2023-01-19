import React, { useState,useEffect } from 'react';
import { useUserAuth } from '../context/AuthContext';
import PhoneInput from "react-phone-number-input";
import '../css/Acccount.css'
import { collection, addDoc, setDoc,doc , getDocs,getDoc } from "firebase/firestore";  
import { db,storage } from '../firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import ImageGetter from '../components/ImageGetter';
import ProductCard from '../components/productCard';
const Account = () => {
  const { logOut, user } = useUserAuth();
  const [DefualtUserInfo,setDefualtUserInfo]=useState({})
  const [productsBought,setProductsBought]=useState([]) 
  const [productboughtList,setproductboughtList]=useState([])
  const [number,setNumber]=useState(0) 
  const [idk,setidk]=useState(0)
  const [idk1,setidk1]=useState(0) 
  const [idk2,setidk2]=useState(0)
  const [Images,setImages]=useState([])
  useEffect(() => {
    function inputLimiter(inputFieldId,ChangerFun){
      document.getElementById(inputFieldId).addEventListener('input',()=>{ 
        ChangerFun(document.getElementById(inputFieldId).value.length)
       }) 
    }
    inputLimiter('user-name',setidk)
    inputLimiter('location',setidk1)
    inputLimiter('user-email',setidk2)
  }, [])
  useEffect(()=>{
 
    setidk(document.getElementById('user-name').value.length)
    setidk2(document.getElementById('user-email').value.length)
    setidk1(document.getElementById('location').value.length)
  },[DefualtUserInfo])
  async function saveChanges(){

    try {
      const docRef = await setDoc(doc(db, "users",user?.phoneNumber), {
        name: document.getElementById('user-name').value,
        location: document.getElementById('location').value,
        phoneNumber: user?.phoneNumber,
        email: document.getElementById('user-email').value,
        id:user?.uid, 
        userProductsId:DefualtUserInfo?.userProductsId,  
      }); 
      alert('لقد تم حفظ التغيرات بنجاح')
    } catch (e) { 
      console.error("Error adding document: ", e);
      alert('يبدو أن حصل خطأ',e)
    }
    
  } 
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
    console.log(DefualtUserInfo)
    if(DefualtUserInfo.userProductsId){
      setTimeout(()=>{
        
      console.log(productsBought)
      console.log(productsBought.length) 
      if(DefualtUserInfo?.userProductsId.length!==productsBought.length) {
        console.log(productsBought)
        async function readUserProducts(){
          if(DefualtUserInfo?.userProductsId.length==productsBought.length) return
          for(var i=0;i<DefualtUserInfo?.userProductsId.length;i++){ 
          const docRef = doc(db, "products",DefualtUserInfo?.userProductsId[i]); 
          const docSnap = await getDoc(docRef);
          docSnap.data(); 
          try { const docSnap = await getDoc(docRef); 
          if(docSnap.exists()) { setProductsBought((product)=>[...product,docSnap.data()]) }
           else { console.log("Document does not exist") } } catch(error) { console.log(error) }
         }
        }
        readUserProducts() 
      }
      },1000)
  }
  },[DefualtUserInfo])

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error); 
    }
  };
useEffect(()=>{

},[])
useEffect(()=>{
  if(productsBought!=[]&&productsBought[0]?.productId){  
      
       
setproductboughtList(productsBought.map((product) =>
<ProductCard route='sell'
 IsDontShowDelete={true} DefualtUserInfo={DefualtUserInfo} product={product} key={product.productId} />
))
}
},[productsBought])
  return (
    <div id='AccountCont'  className='AccountCont'>  
    <img src="" alt="" id="firebaseImage" /> 
      <p className='subHeader'> المعلومات الخاصة بك</p>
      <label className='accountLabel' htmlFor="user-name">أسمك</label>
      <input maxLength={70} defaultValue={DefualtUserInfo?.name} className='textInput' type="text" placeholder='أسمك' 
      id='user-name' />
   <p  id='name-limit'>{idk}/70</p>
      <label className='accountLabel'  htmlFor="location">موقعك</label>
      <input maxLength={220} defaultValue={DefualtUserInfo?.location} type="text" className='textInput' id='location' 
      placeholder=' موقعك (أكتب موقعك بتفصيل المنطقة الحي البنايا الطابق)' />
         <p  id='name-limit'>{idk1}/220</p>
      <span>نحتاج موقع  لتسليم وإستلام المنتجات</span>
      
    <label style={{display:'block'}} htmlFor="">رقمك</label>
    <div className='flex'>
      <PhoneInput
            style={{direction:'ltr'}}
            className='PhoneInputAccount' 
             dir="left"
              defaultCountry="LB"
              id='margin0'
              value={user?.phoneNumber}
              disabled
              onChange={()=>setNumber(0)}
              countries=  {["US","IS","AG","AI","AS","BB","BM","BS","CA","DM","DO","GD","GU","JM","KN","KY","LC","MP","MS","PR","SX","TC","TT","VC","VG","VI","RU","KZ","EG","ZA","GR","NL","BE","FR","ES","HU","IT","VA","RO","CH","AT","GB","GG","IM","JE","DK","SE","NO","SJ","PL","DE","PE","MX","CU","AR","BR","CL","CO","VE","MY","AU","CC","CX","ID","PH","NZ","SG","TH","JP","KR","VN","CN","TR","IN","PK","AF","LK","MM",'LB',"SS","MA","EH","DZ","TN","LY","GM","SN","MR","ML","GN","CI","BF","NE","TG","BJ","MU","LR","SL","GH","NG","TD","CF","CM","CV","ST","GQ","GA","CG","CD","AO","GW","IO","AC","SC","SD","RW","ET","SO","DJ","KE","TZ","UG","BI","MZ","ZM","MG","RE","YT","ZW","NA","MW","LS","BW","SZ","KM","SH","TA","ER","AW","FO","GL","GI","PT","LU","IE","AL","MT","CY","FI","AX","BG","LT","LV","EE","MD","AM","BY","AD","MC","SM","UA","RS","ME","XK","HR","SI","BA","MK","CZ","SK","LI","FK","BZ","GT","SV","HN","NI","CR","PA","PM","HT","GP","BL","MF","BO","GY","EC","GF","PY","MQ","SR","UY","CW","BQ","TL","NF","BN","NR","PG","TO","SB","VU","FJ","PW","WF","CK","NU","WS","KI","NC","TV","PF","TK","FM","MH","KP","HK","MO","KH","LA","BD","TW","MV","LB","JO","SY","IQ","KW","SA","YE","OM","PS","AE","BH","QA","BT","MN","NP","TJ","TM","AZ","GE","KG","UZ"]}
              placeholder="أدخل رقم هاتفك"  
            />
           <span className='clar'> <br ></br> سنستعمل رقمك للتواصل معك عبر الواتساب</span>
           </div>
           <label style={{display:'block',marginTop:'10px'}} htmlFor="user-email">البريد الإلكتروني</label>
      <input className='textInput' type="email" placeholder='  البريد الإلكتروني (إختياري)' 
        id='user-email' maxLength={200}  defaultValue={DefualtUserInfo?.email} />
               <p  id='name-limit'>{idk2}/200</p>
             <button onClick={handleSignOut} className='logOut'>
        تسجيل الخروج
      </button>
      <button onClick={()=>saveChanges()} className='saveChanges'>
        حفظ التغيرات
      </button>
      <p className='subHeader'> المنتجات التي تريد بيعه </p>
      <div id='productsCont'>
      {productboughtList}
      </div>
       
      <p className='subHeader'> المنتجات التي تريد شرائها </p>
    </div>
  );
};

export default Account;