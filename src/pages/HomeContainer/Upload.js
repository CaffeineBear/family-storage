import { useState, useEffect } from 'react';

const uploaderEndpoint = 'http://localhost:3000/dev/';
const FILE_CHUNK_SIZE = 10_000_000;

function allProgress(proms, progress_cb) {
  let d = 0;
  progress_cb(0);
  proms.forEach( p => {
    p.then(()=> {    
      d++;
      let currProgress = Math.floor((d * 100) / proms.length);
      if(currProgress === 100){
        currProgress = 99; // to finish last part of merging.
      }
      progress_cb(currProgress);
    });
  });
  return Promise.all(proms);
};

const useUpload = (file, user) => {
  const [ uploadProgress, setProgress ] = useState(0);
  
  useEffect(() => {
    if(!file) {
      return;
    }
    console.log('uploading file: ' + file.name);
    const myAbortController = new AbortController();

    const apiCalls = async () => {
      const accessToken = user.signInUserSession.accessToken.jwtToken;
      let settings = {
        method: 'POST',
        headers:{
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name
        })
      }
      // initiate upload in case of multi part upload.  
      let response = await fetch(
          uploaderEndpoint + 'initiate-upload',
          { ...settings, signal: myAbortController.signal }
      ).then(r => r.json()
      ).catch(err => console.log(err));
      const { objectKey, uploadId } = response;

      const numParts = Math.ceil(file.size / FILE_CHUNK_SIZE);
      const newBody = {
        fileName: file.name,
        operation: 'putObject',
        numParts,
        ...response,
      };
      settings.body = JSON.stringify(newBody);

      // Get presigned url from the backend.
      response = await fetch(
          uploaderEndpoint + 'get-presigned-url',
          { ...settings, signal: myAbortController.signal }
      ).then(r => r.json());
      
      // uploading only one part (no - multi part uploading)
      if(numParts === 1){
        const url = response.presignedUrl;
        const data = new FormData()
        data.append('file', file);
        response = await fetch(
            url,
            { method: 'PUT', body: data, signal: myAbortController.signal }
        ).then(r => {
          setProgress(100); 
          return r.json();
        }).catch(err => console.log(err));
        return;
      }

      // multi part uploading
      const urls = response.presignedUrls;
      const promises = [];
      const keys = Object.keys(urls);

      for (const indexStr of keys) {
        const index = parseInt(indexStr)
        const start = index * FILE_CHUNK_SIZE
        const end = (index + 1) * FILE_CHUNK_SIZE
        const blob = index < keys.length
          ? file.slice(start, end)
          : file.slice(start)
        const data = blob;

        promises.push(
          fetch(urls[index], 
            { method: 'PUT', body: data, signal: myAbortController.signal }
          )
        );
      }
      const resParts = await allProgress(promises, (progress) => {
        setProgress(progress);
      });

      const partTags = resParts.map((part, index) => ({
        ETag: part.headers.get('Etag'),
        PartNumber: index + 1
      }));

      const body = {
        objectKey,
        uploadId,
        partTags,
      };

      response = await fetch(
        uploaderEndpoint + 'complete-upload',
        { method: 'POST', body: JSON.stringify(body), signal: myAbortController.signal }
      ).then(r => {
        setProgress(100);
        return r;
      }).catch(err => console.log(err)); 
            
      return ;
    };

    apiCalls();
  }, [file, user]);
  return [uploadProgress, setProgress];
}

export default useUpload;
