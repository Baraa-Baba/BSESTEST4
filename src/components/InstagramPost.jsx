import React, { useState } from 'react';

function InstagramPost() {
  const [accessToken, setAccessToken] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('access_token', accessToken);
    data.append('photo', photo);

    const response = await fetch('https://api.instagram.com/v1/media/upload', {
      method: 'POST',
      body: {data},
      mode: 'no-cors'
    });

    const json = await response.json();
    console.log(json);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Access Token" onChange={e => setAccessToken(e.target.value)} />
        <input type="file" onChange={e => setPhoto(e.target.files[0])} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default InstagramPost;
