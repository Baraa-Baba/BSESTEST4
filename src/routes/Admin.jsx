import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/AuthContext'; 
import { collection, addDoc, setDoc,doc , getDocs,getDoc } from "firebase/firestore";  
import { async } from '@firebase/util';
import { db,storage } from '../firebase';
import ProductCard from '../components/productCard';
import '../css/Admin.css'
import GetDeviceToken from '../components/GetDeviceToken';
export default function Admin() { 
  const {  user } = useUserAuth();
  const [products,setProducts]=useState([])
  const [filteredStatus,setFilteredStatus]=useState('pending')
  const [productList,setproductList]=useState([])
  const navigate=useNavigate()
  useEffect(() => { 
    if(user?.phoneNumber){ 
    }
  }, [user]) 
  useEffect(()=>{
    if(user?.phoneNumber){
        async function getMarker(){
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots 
          if(doc.data().productState==filteredStatus){
          setProducts((prevProducts)=>[...prevProducts,doc.data()])
          console.log(doc.id, " => ", doc.data());
          }
        });
    }
      getMarker()
    }
  },[user,filteredStatus]) 
  useEffect(()=>{
    
  },[])
  useEffect(()=>{
    console.log(products)
    if(products!=[]&&products[0]?.productId){  
        console.log(productList)
         
  setproductList(products.map((product) =>
  <div id={`mainProductCont${product.productId}`}>
  <ProductCard IsDontShowDelete={false} product={product} key={product.productId} /> 
  </div>
  ))
  } 
  },[products,filteredStatus])
  useEffect(()=>{ 
    if(user?.phoneNumber==='+96176032809'){
    document.getElementById('statusFilter').addEventListener('change',()=>{
        setFilteredStatus(document.getElementById('statusFilter').value)
        setProducts([])
        setproductList([])
        console.log(document.getElementById('statusFilter').value)
    })
  }
  },[user])
  function EditStatus(productId,status){
    const productRef = doc(db, 'products', productId);
    setDoc(productRef, { productState: status }, { merge: true });
    alert(productId)
  }



 
  return ( 
        <>
        {user?.phoneNumber=='+96176032809'?
        <div>
        access accepted  {user?.phoneNumber}
        <select name="" id="statusFilter">
            <option value="pending">pending</option>
            <option value="rejected">rejected</option>
            <option value="accepted">accepted</option> 
        </select> 
        <GetDeviceToken />
        <div className='productsCont'>
       {productList}
       </div>

        </div>
        :<div>loading...</div>}
        </>
  )
}
