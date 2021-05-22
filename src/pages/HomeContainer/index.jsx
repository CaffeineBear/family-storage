import React, { useState } from 'react';
import Home from './Home';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const HomeContainer = (props) => {
  const { user } = props;
  const [ open, setOpen ] = useState(false);
  const [ addedFiles, addNewFiles ] = useState([]);
  const handleOnClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleOnSave = (files) => {
    const fileCollectionPromises = files.map(async file => {
      let currFileDataUrl = null;
      if(/^image/.test(file.type)) {
        currFileDataUrl = await toBase64(file);
      }
      return {
        file: file,
        dataUrl: currFileDataUrl     
      } 
    });
    Promise.all(fileCollectionPromises).then(filesCollections => {
      addNewFiles(prevFiles => {
        return [...prevFiles, ...filesCollections];
      });
    });
  };

  return (
    <Home 
      user={user}
      addedFiles={addedFiles}
      onClick={handleOnClick}
      onSave={handleOnSave}
      onClose={handleClose}
      openDialog={open}
    />
  )
};


export default HomeContainer;
