// client/src/components/AvatarUploader.js
import React, { useState } from 'react';
import axios from 'axios';

const AvatarUploader = ({ setAvatar }) => {
  const [file, setFile] = useState(null);

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post('/api/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatar(res.data.file);
      alert('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        alert('There was a problem with the server');
      } else {
        alert(err.response.data.msg);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="file" onChange={onChange} />
      <input type="submit" value="Upload" />
    </form>
  );
};

export default AvatarUploader;