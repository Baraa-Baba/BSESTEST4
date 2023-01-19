import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/AuthContext'; 
import { collection, addDoc, setDoc,doc , getDocs,getDoc } from "firebase/firestore";  
import { async } from '@firebase/util';
import { db,storage } from '../firebase';
import ProductCard from '../components/productCard';
export default function Buy() {
    const {  user } = useUserAuth(); 
    const [productList,setproductList]=useState([])
    const [allProducts,setAllProducts]=useState([])
    
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(Infinity);
    const [category, setCategory] = useState('all');
    const [priceCurrency, setPriceCurrency] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate=useNavigate()
    useEffect(()=>{ 

            async function getMarker(){
            const querySnapshot = await getDocs(collection(db, "products"));
            querySnapshot.forEach((doc) => {
              setAllProducts(((prevProducts)=>[...prevProducts,doc.data()]))
              if(doc.data().productState==='accepted'){ 
              setFilteredProducts((prevProducts)=>[...prevProducts,doc.data()])
              console.log(doc.id, " => ", doc.data());
              }
            });
        }
          getMarker()  
      },[user])
    
  useEffect(() => {
    
    setFilteredProducts(
      allProducts.filter(product => {
        return ( 
          (product.productPrice <= maxPrice || !maxPrice)&&
          (category === 'all' || product.productCategory === category) &&
          (priceCurrency === 'all' || product.productCurrency === priceCurrency)
        );
      })
    );
  }, [minPrice, maxPrice, category, priceCurrency, allProducts]);
      useEffect(()=>{
        console.log(filteredProducts) 
            
             
      setproductList(filteredProducts.map((product) =>
      <div id={`mainProductCont${product.productId}`}>
      <ProductCard isFullScreen={false} isShowStatus={false} IsDontShowDelete={false} product={product} 
      key={product.productId} route={'buy'} /> 
      </div> 
      )) 
      },[filteredProducts])
  return (
    <>  
     <form>
    <div className='filtersInputCont'>
      <label htmlFor="">
      Min Price:
      </label>
      <input 
        type="number"
        value={minPrice}
        onChange={event => setMinPrice(Number(event.target.value))}
      />
    </div>
    <br />
    <div className='filtersInputCont'>
      <label htmlFor="">
      Max Price:
      </label>
      <input
        type="number"
        value={maxPrice}
        onChange={event => setMaxPrice(Number(event.target.value))}
      />
    </div>
    <br />
    <div className='filtersInputCont'>
      <label htmlFor="">
      فئة المنتج
      </label>
      <select value={category} onChange={event => setCategory(event.target.value)}>
        <option value="all">الكل</option>
        <option value="آخر">آخر</option>
        <option value="هواتف">هواتف</option>
        <option value="أغراض كهرابئية">أغراض كهرابئية</option>
      </select>
    </div>
    <br />
    <div className='filtersInputCont'>
      <label htmlFor="">
      عُمْلة 
      </label>
      <select value={priceCurrency} onChange={event => setPriceCurrency(event.target.value)}>
        <option value="all">الكل</option>
        <option value="dollar">dollar</option>
        <option value="lebaneseLira">lebaneseLira</option>
      </select>
    </div>
    <br /> 
  </form>

    <div className='productsCont'>
       {filteredProducts[0]?.productId ? productList:
       <div> لا يوجد</div>}
       </div>
       <style jsx>{`
       form { 
        display:flex;
        flex-direction:row;
        margin-top:1rem
}

label {
  margin-right: 1em; 
  display:block
}

input[type="number"] {
  width: 80%;
  padding: 0.5em;
  
  flex: 1;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 1em;
}

select {
  width: 80%;
  padding: 0.5em;
  border: 1px solid gray;
  border-radius: 5px;
  font-size: 1em;
  
  flex: 1;
}
.filtersInputCont{
  display:inline-block;
  width:50%
}

#productsCont{
    width: 50%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(auto-fill, 450px);
    grid-row-gap: 10rem;
    grid-column-gap:4rem;
}
@media screen and (max-width:1000px) {
    #productsCont{ 
        grid-template-columns: repeat(2, 1fr); 
    }
    }
@media screen and (max-width:750px) {
    #productsCont{ 
        grid-template-columns: repeat(1, 1fr); 
    }
    
.AccountCont{
    padding: 0 2.5vw 0 2.5vw;
}
    
.textInput{ 
    background-color: white; 
    outline: none; 
    width: 90vw;
}
    }
        `}</style>
    </>
  )
}
