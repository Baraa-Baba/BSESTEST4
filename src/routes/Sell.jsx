import React, { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { collection, addDoc, setDoc,doc , getDocs,getDoc } from "firebase/firestore"; 
import { db } from '../firebase';
import '../css/Sell.css'    
import PhoneInput from 'react-phone-number-input';
import { useUserAuth } from '../context/AuthContext'; 
import { ref, getDownloadURL,getStorage,uploadString, uploadBytesResumable } from "firebase/storage"; 
import { storage } from '../firebase';  
import { uuidv4 } from '@firebase/util';
export default function Sell() {

  const {  user } = useUserAuth();
  const [productId,setproductId] =useState(uuidv4)
  const [progress, setProgress] = useState(0);
  const [Images,setImages]=useState([])
  const [ImagesName,setImagesName]=useState([])

  const [idk,setidk]=useState(0)
  const [idk1,setidk1]=useState(0) 
  const [idk2,setidk2]=useState(0)
  const [idk3,setidk3]=useState(0)
  const [idk4,setidk4]=useState(0)
  const [DefualtUserInfo,setDefualtUserInfo]=useState({})
  useEffect(()=>{
    if(user){ 
    }
  },[])
  const formHandler = (e) => { 
     e.preventDefault();
     const file = e.target[0].files[0];
     uploadFiles(file);
  };
  async function saveChanges(){

    try {
      const docRef = await setDoc(doc(db, "users",user?.phoneNumber), {
        name: document.getElementById('user-name').value,
        location: document.getElementById('text-location').value,
        phoneNumber: user?.phoneNumber,
        email: document.getElementById('user-email').value,
        id:user?.uid,
        userProductsId:DefualtUserInfo.userProductsId?
        [...DefualtUserInfo?.userProductsId,productId]:[productId]
      });  
    } catch (e) { 
      console.error("Error adding document: ", e);
      //alert('يبدو أن حصل خطأ',e)
    }
    
  }
  async function storeProduct(e){
    try {  
      const docRef = await setDoc(doc(db, "products",productId), {
        productName: document.getElementById('product-name').value,
        productDescription: document.getElementById('product-desc').value,
        productPrice: document.getElementById('product-price').value,
        productCurrency: document.getElementById('product-currency').value,
        productCategory: document.getElementById('product-category').value ,
        productId:productId,
        userPhoneNumber:user?.phoneNumber,
        productState:'pending',
        ProductsImagesName: ImagesName,
      });   
    } catch (e) { 
      console.error("Error adding document: ", e);
      //alert('يبدو أن حصل خطأ',e)
    }
  }
  useEffect(()=>{
    console.log(ImagesName) 
      storeProduct() 
      console.log('stored')
  },[ImagesName])
  const uploadFiles = (file) => {
    //
    if (!file) return; 
    setImagesName((ImagesName)=>[...ImagesName,file.name])
    const sotrageRef = ref(storage, `productImages/${productId}/${file.name}`);
    const uploadTask = uploadBytesResumable(sotrageRef, file); 
     uploadTask.on(
       "state_changed",
       (snapshot) => {
         const prog = Math.round(
           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
         );
         setProgress(prog);
       },
       (error) => console.log(error),
       () => {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
           console.log("File available at", downloadURL);
         }); 
       }
     );
  };
  function getImage(upload,display){
    if(document.getElementById(display).getAttribute('src')!==''&&
    document.getElementById(upload).files[0]){ 
      return document.getElementById(upload).files[0]
    }else{ 
      return null
    }
  }
  function uploadProductImages(){
   uploadFiles(getImage('upload','display-image'))
   uploadFiles(getImage('upload1','display-image1'))
   uploadFiles(getImage('upload2','display-image2'))
  }
  function submitProduct(e){
    e.preventDefault()
    if(getImage('upload','display-image')||getImage('upload1','display-image1')
    ||getImage('upload2','display-image2')){ 
    saveChanges() 
    uploadProductImages()
    alert('submited')
    }else{
      alert('الرجاء وضع صورة واحدة على الأقل')
    }
  }
  useEffect(() => { 
    if(user){
      
    async function readDb(){
      const docRef = doc(db, "users",user?.phoneNumber); 
      const docSnap = await getDoc(docRef);
      docSnap.data(); 
      try { const docSnap = await getDoc(docRef); 
      if(docSnap.exists()) { setDefualtUserInfo(docSnap.data()); }
       else { console.log("Document does not exist") } } catch(error) { console.log(error) }
     
    }
    readDb()
  }
  }, [user]) 
  useEffect(() => {
    function updateTextView(_obj){
      var num = getNumber(_obj.value);
      if(num==0){
        _obj.value='';
      }else{
        _obj.value=num.toLocaleString();
      }
    }
    function getNumber(_str){
      var arr = _str.split('');
      var out = new Array();
      for(var cnt=0;cnt<arr.length;cnt++){
        if(isNaN(arr[cnt])==false){
          out.push(arr[cnt]);
        }
      }
      return Number(out.join(''));
    }  
      function inputLimiter(inputFieldId,ChangerFun){
        document.getElementById(inputFieldId).addEventListener('input',()=>{ 
          ChangerFun(document.getElementById(inputFieldId).value.length)
         }) 
      }
      inputLimiter('product-name',setidk)
      inputLimiter('product-desc',setidk1)
      inputLimiter('user-name',setidk2)
      inputLimiter('user-email',setidk3)
      inputLimiter('text-location',setidk4)
      function handleImageUpload(displayImage,upload,addIcon) 
      {
        
        console.log(ImagesName)
        document.getElementById(addIcon).style.display='none'
      var image = document.getElementById(upload).files[0];
      
          var reader = new FileReader();
          
          reader.onload = function(e) { 
            if(e.total>25*10**6){
              alert('to big')
              removeImage(displayImage,upload,addIcon)
              return
            }else{
            document.getElementById(displayImage).src = e.target.result;
            } 
          }   
          reader.readAsDataURL(image);
      
      }
      function removeImage(displayImage,upload,addIcon){   
        document.getElementById(displayImage).src = '';   
        document.getElementById(addIcon).style.display='block' 

      }
      document.getElementById('remove').addEventListener('click',()=>{
        removeImage('display-image','upload','addIcon') 
      })
      document.getElementById('upload').addEventListener('change',()=>{
        handleImageUpload('display-image','upload','addIcon')
      })
      document.getElementById('remove1').addEventListener('click',()=>{
        removeImage('display-image1','upload1','addIcon1') 
      })
      document.getElementById('upload1').addEventListener('change',()=>{
        handleImageUpload('display-image1','upload1','addIcon1')
      })
      document.getElementById('remove2').addEventListener('click',()=>{
        removeImage('display-image2','upload2','addIcon2') 
      })
      document.getElementById('upload2').addEventListener('change',()=>{
        handleImageUpload('display-image2','upload2','addIcon2')
      })
  }, [])
useEffect(()=>{
 
  setidk2(document.getElementById('user-name').value.length)
  setidk3(document.getElementById('user-email').value.length)
  setidk4(document.getElementById('text-location').value.length)
},[DefualtUserInfo])
  return (
    <form onSubmit={(e)=>submitProduct(e)}>
    <div style={{maxWidth:'100vw'}}>
    <div className='mainSellCont'> 
{/* 
    <div className="App">
      <form onSubmit={formHandler}>
        <input required type="file" className="input" />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <h2>Uploading done {progress}%</h2>
    </div> */}
    <p className='subHeader'>
        معلومات خاصة بالمنتج
         </p>
      <div>
        <label htmlFor="product-name">أسم المنتج </label>
        <input required id='product-name' maxLength='70' dir="rtl" type="text" className='text-input' placeholder='أسم منتج' /> 
      <p  id='name-limit'>{idk}/70</p>
      </div>
      <div>
        <label htmlFor="product-category">فئةالمنتج </label>
        <select required  className='text-input' name="" id="product-category">
          <option selected disabled value=''>أختر فئة المنتج</option>
          <option value="آخر">آخر</option>
          <option value="هواتف">هواتف</option>
          <option value="أغراض كهرابئية">أغراض كهرابئية</option>
        </select>
      </div>
      <div>
        <label htmlFor="product-desc">وصف المنتج </label>
        <textarea required maxLength='250' id='product-desc' dir="rtl" type="text" className='text-input' placeholder='وصف المنتج' /> 
        <p  id='name-limit'>{idk1}/250</p>
        </div>

          
      <div className='dollorCont'>
        <label htmlFor="product-price">السعر</label> 
         <input required id='product-price' dir="rtl" type="number" className='price-input' placeholder='السعر'  />
        
         </div> 
         <select required className='currency-selector' name="" id="product-currency">
          <option value="dollar">الدولار الأمريكي</option>
          <option value="lebaneseLira">الليرة اللبنانية</option>
        </select> 

      <p className="subHeader">أضافة الصور</p>
        <div className='imageCont'> 
    <div className='imgAdderCont'>
        <p className='removeImg'  id='remove'>X</p>
         <label htmlFor="upload">
          <div className='img-input-label'> 
              <svg className='addIcon' id='addIcon' xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 1024 1024">
    <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
</svg> 
<img id="display-image" className='display-image' height={250} width={250} src="" /></div>
         </label> 
         <input  id="upload" type="file"  />
         </div>

         <div className='imgAdderCont'>
         <p className='removeImg' id='remove1'>X</p>
         <label htmlFor="upload1">
          <div className='img-input-label'>
          <svg className='addIcon' id='addIcon1' xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 1024 1024">
    <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
</svg> 
<img id="display-image1" className='display-image'  height={250} width={250} src="" /></div>
         </label> 
         <input id="upload1" type="file"  />
    </div>


         <div className='imgAdderCont'>
         <p  className='removeImg' id='remove2'>X</p>
         <label htmlFor="upload2">
          <div className='img-input-label'>
     
         <svg  className='addIcon' id='addIcon2' xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 1024 1024">
    <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.040 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
</svg>
<img id="display-image2" className='display-image'  height={250} width={250} src="" /></div> 
         </label>
         </div>
         <input id="upload2" type="file"  />
    </div>

         <p className='subHeader'>
          مراجعة معلوماتك الشخصية  
         </p>
         <div className='flex'>
          <div>
          <label style={{display:'block'}} htmlFor="user-name">أسمك</label>
         <input defaultValue={DefualtUserInfo?.name} id='user-name' dir="rtl" type="text"
          className='pers-input' maxLength={70} placeholder='أسمك ' />  
          <p  id='name-limit'>{idk2}/70</p>
         </div>
         <div>
         <label style={{display:'block'}} >رقم هاتفك</label>
          <PhoneInput
            style={{direction:'ltr'}}
            className='pers-input' 
             dir="left"
              defaultCountry="LB" 
              value={user?.phoneNumber}
              disabled
              onChange={()=>setNumber(0)}
              countries=  {["US","IS","AG","AI","AS","BB","BM","BS","CA","DM","DO","GD","GU","JM","KN","KY","LC","MP","MS","PR","SX","TC","TT","VC","VG","VI","RU","KZ","EG","ZA","GR","NL","BE","FR","ES","HU","IT","VA","RO","CH","AT","GB","GG","IM","JE","DK","SE","NO","SJ","PL","DE","PE","MX","CU","AR","BR","CL","CO","VE","MY","AU","CC","CX","ID","PH","NZ","SG","TH","JP","KR","VN","CN","TR","IN","PK","AF","LK","MM",'LB',"SS","MA","EH","DZ","TN","LY","GM","SN","MR","ML","GN","CI","BF","NE","TG","BJ","MU","LR","SL","GH","NG","TD","CF","CM","CV","ST","GQ","GA","CG","CD","AO","GW","IO","AC","SC","SD","RW","ET","SO","DJ","KE","TZ","UG","BI","MZ","ZM","MG","RE","YT","ZW","NA","MW","LS","BW","SZ","KM","SH","TA","ER","AW","FO","GL","GI","PT","LU","IE","AL","MT","CY","FI","AX","BG","LT","LV","EE","MD","AM","BY","AD","MC","SM","UA","RS","ME","XK","HR","SI","BA","MK","CZ","SK","LI","FK","BZ","GT","SV","HN","NI","CR","PA","PM","HT","GP","BL","MF","BO","GY","EC","GF","PY","MQ","SR","UY","CW","BQ","TL","NF","BN","NR","PG","TO","SB","VU","FJ","PW","WF","CK","NU","WS","KI","NC","TV","PF","TK","FM","MH","KP","HK","MO","KH","LA","BD","TW","MV","LB","JO","SY","IQ","KW","SA","YE","OM","PS","AE","BH","QA","BT","MN","NP","TJ","TM","AZ","GE","KG","UZ"]}
              placeholder="أدخل رقم هاتفك"  
            />
            </div>
         </div>
         <label style={{display:'block'}} htmlFor="user-email">البريد الإلكتروني</label>
         <input maxLength={200} defaultValue={DefualtUserInfo?.email} id='user-email'   type="text" className='text-input' placeholder='البريد الإلكتروني' />
         <p  id='name-limit'>{idk3}/200</p>
         <label  style={{display:'block'}} htmlFor="text-location">موقعك</label>
         <input required defaultValue={DefualtUserInfo?.location} id='text-location' dir="rtl" type="text" 
         className='text-input' maxLength={220} placeholder=' موقعك (أكتب موقعك بتفصيل المنطقة الحي البنايا الطابق)' /> 
                    <p  id='name-limit'>{idk4}/220</p>
         

         <button type='submit'>أنشر الآن</button>
    </div>
    </div>
    </form>
  )
}
