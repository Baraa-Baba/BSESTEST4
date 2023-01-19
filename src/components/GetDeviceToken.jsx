import React, { useState } from 'react';
import { messaging } from '../firebase';
import { getToken } from 'firebase/messaging';

function GetDeviceToken() {
  const [deviceToken, setDeviceToken] = useState(null);
  const [error, setError] = useState(null);

  async function getToken() {  
        try {


          //console.log('Your token is:',getToken(messaging, {vapidKey: "BPyh4hdlS6a_jwhiZSf1YGLloh_MAp-5BASTajTYsPkJhpEosnlIncmLOa3E4tWvUHHGlPfUwsls9T-mqi9WWfY"})          );
           
        } catch (error) {
          console.error(error);
        } 
  }

  return (
    <div>
      <button onClick={()=>getToken()}>
        Get Device Token
      </button>
      {deviceToken && <p>Device Token: {deviceToken}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default GetDeviceToken;
