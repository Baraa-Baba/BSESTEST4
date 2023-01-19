import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { collection, addDoc, setDoc,doc,getDoc } from "firebase/firestore"; 
import { db } from '../firebase';
import { useUserAuth } from "../context/AuthContext";
import '../css/signin.css' 
const SignIn = () => { 
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [flag, setFlag] = useState(false);
  const [isDisabled,setIsDisabled] =useState(false)
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const { setUpRecaptha,user } = useUserAuth();
  const navigate = useNavigate();
  async function storeUser(){
    try { 
      const docRef = await setDoc(doc(db, "users",user?.phoneNumber), {
        name:'',
        location:'',
        phoneNumber: user?.phoneNumber,
        email: '',
        id:user?.uid
      });   
    } catch (e) { 
      alert('error',e)
      console.error("Error adding document: ", e); 
    }
  }
  useEffect(()=>{
    if(user){  
      setTimeout(()=>{
        if(user){  
          async function saveChanges(){
 
              const docRef = doc(db, "users",user?.phoneNumber); 
              const docSnap = await getDoc(docRef);
              docSnap.data(); 
              try { 
              const docSnap = await getDoc(docRef); 
              if(docSnap.exists()) { console.log(console.log(docSnap.data())); }

               else { 
                console.log("Document does not exist")   
               const docRef2 = await setDoc(doc(db, "users",user?.phoneNumber), { 
                phoneNumber: user?.phoneNumber, 
                id:user?.uid,
                name: '',
                location: '', 
                email: '', 
              }); 
            }
              } catch(error) { console.log(error) }
             
              navigate("/account"); 
          
          }
          saveChanges()
        }
      },1000)
    }
  },[user])
  const getOtp = async (e) => {
    if(!isDisabled){
    e.preventDefault();
    setIsDisabled(true)
    console.log(number);
    setError("");
    if (number === "" || number === undefined){ 
      setIsDisabled(false)
      return setError("Please enter a valid phone number!");
    }
    try {
      const response = await setUpRecaptha(number);
      setResult(response);
      setFlag(true);
      setIsDisabled(false)
    } catch (err) {
      setIsDisabled(false)
       if(err.message=='Firebase: TOO_SHORT (auth/invalid-phone-number).'){
        setError( 'الرقم قصير تأكد من صحة رقمك')
      }if(err.message=='reCAPTCHA has already been rendered in this element'){
        alert('k') 
      }else{
        setError(err.message);
      }
    }
  }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp === "" || otp === null) return;
    try {
      await result.confirm(otp);  
      
         
    } catch (err) {
      if(err.message =='Firebase: Error (auth/invalid-verification-code).'){
        setError('رقم التوثيق خطأ تأكد من صحة رقم التوثيق')
      }else if(err.message=='Firebase: TOO_SHORT (auth/invalid-phone-number).'){
        setError( 'الرقم قصير تأكد من صحة رقمك')
      }
      else{
      setError(err.message);
      }
    }
  };

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">سجل دخول من خلال رقم هاتفك</h2> 
        <Form onSubmit={getOtp} style={{ display: !flag ? "block" : "none" }}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <PhoneInput
            style={{direction:'ltr'}}
            className='PhoneInput'
             dir="left"
              defaultCountry="LB"
              value={number}
              countries=  {["US","IS","AG","AI","AS","BB","BM","BS","CA","DM","DO","GD","GU","JM","KN","KY","LC","MP","MS","PR","SX","TC","TT","VC","VG","VI","RU","KZ","EG","ZA","GR","NL","BE","FR","ES","HU","IT","VA","RO","CH","AT","GB","GG","IM","JE","DK","SE","NO","SJ","PL","DE","PE","MX","CU","AR","BR","CL","CO","VE","MY","AU","CC","CX","ID","PH","NZ","SG","TH","JP","KR","VN","CN","TR","IN","PK","AF","LK","MM",'LB',"SS","MA","EH","DZ","TN","LY","GM","SN","MR","ML","GN","CI","BF","NE","TG","BJ","MU","LR","SL","GH","NG","TD","CF","CM","CV","ST","GQ","GA","CG","CD","AO","GW","IO","AC","SC","SD","RW","ET","SO","DJ","KE","TZ","UG","BI","MZ","ZM","MG","RE","YT","ZW","NA","MW","LS","BW","SZ","KM","SH","TA","ER","AW","FO","GL","GI","PT","LU","IE","AL","MT","CY","FI","AX","BG","LT","LV","EE","MD","AM","BY","AD","MC","SM","UA","RS","ME","XK","HR","SI","BA","MK","CZ","SK","LI","FK","BZ","GT","SV","HN","NI","CR","PA","PM","HT","GP","BL","MF","BO","GY","EC","GF","PY","MQ","SR","UY","CW","BQ","TL","NF","BN","NR","PG","TO","SB","VU","FJ","PW","WF","CK","NU","WS","KI","NC","TV","PF","TK","FM","MH","KP","HK","MO","KH","LA","BD","TW","MV","LB","JO","SY","IQ","KW","SA","YE","OM","PS","AE","BH","QA","BT","MN","NP","TJ","TM","AZ","GE","KG","UZ"]}
              onChange={setNumber}
              placeholder="أدخل رقم هاتفك"
            />
            <div id="recaptcha-container"></div>
          </Form.Group>
          <div className="button-right"> 
            &nbsp;
            <Button disabled={isDisabled} className="verfiy" type="submit" variant="primary">
              وثق 
            </Button>
          </div>
        </Form>

        <Form onSubmit={verifyOtp} style={{ display: flag ? "block" : "none" }}>
          <Form.Group className="mb-3" controlId="formBasicOtp">
            <Form.Control
              type="otp"
              placeholder="أدخل الرمز الذي أرسل لك من خلال sms"
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
          <div className="button-right"> 
            &nbsp;
            <Button type="submit" variant="primary">
              Verify
            </Button>
          </div>
        </Form>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default SignIn;