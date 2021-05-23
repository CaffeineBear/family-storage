import React, { useEffect, useState } from 'react';
import Home from './Home';
import useUpload from './Upload';

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
  const [ selectedFile, selectFile ] = useState(null);
  const [ overallProgress, updateOverallProgress ] = useState({});

  const handleOnClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleOnSave = (files) => {
    // filtered out the file with the same name
    const filteredFiles = files.filter(file => {
      const currType = typeof (addedFiles.find(prevFile => {
          //console.log(`prev: ${prevFile.file.name}, currFile: ${file.name}`);
          return prevFile.file.name === file.name;
      } ));
      return currType === 'undefined';
    });

    // add thumnail of image file uploading by converting to base64.
    const fileCollectionPromises = filteredFiles.map(async file => {
      // setFilesToUpload(prevFiles => [...prevFiles, file]);
      let currFileDataUrl = null;
      if(/^image/.test(file.type)) {
        currFileDataUrl = await toBase64(file);
      }
      updateOverallProgress(prevProgress => {
        return {
          ...prevProgress,
          [file.name] : 0,
        };
      });
      return {
        file: file,
        dataUrl: currFileDataUrl,
      } 
    });
    Promise.all(fileCollectionPromises).then(filesCollections => {
      addNewFiles(prevFiles => {
        return [...prevFiles, ...filesCollections];
      });
    });
  };
  // Look for next file to upload
  useEffect(() => {
    const nextFileNameToUpload 
        = Object.keys(overallProgress).find(key => overallProgress[key] === 0);
    if(!selectedFile && addedFiles.length > 0 && nextFileNameToUpload){
      const nextFileItem = addedFiles.find(
        fileItem => fileItem.file.name === nextFileNameToUpload
      );
      
      if(nextFileItem){
        selectFile(nextFileItem.file); 
      }
      return;
    }
  }, [overallProgress, selectedFile, addedFiles]);

  // Upload currently allocated file.
  const [currProgress, setProgress] = useUpload(selectedFile, user);

  // Progress check for current file and once its done,
  // set currently selected file to be null.
  useEffect(() => {
    if(selectedFile) {
      console.log(currProgress);
      updateOverallProgress(prev => {
        return {
          ...prev,
          [selectedFile.name] : currProgress
        };
      });

      if(currProgress === 100) {
        setProgress(0);
        selectFile(null);
      }
    }
  }, [currProgress, selectedFile]);  
  
  return (
    <Home 
      user={user}
      addedFiles={addedFiles}
      progresses={overallProgress}
      onClick={handleOnClick}
      onSave={handleOnSave}
      onClose={handleClose}
      openDialog={open}
    />
  )
};


export default HomeContainer;
