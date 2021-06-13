const config = {
  UPLOADER_ENDPOINT: 
    process.env.NODE_ENV === 'production' 
      ?  'https://0ylz4qghi2.execute-api.ap-southeast-2.amazonaws.com/dev/' 
      : 'https://0ylz4qghi2.execute-api.ap-southeast-2.amazonaws.com/dev/' 
      //: 'http://localhost:3000/dev/',
};

export default config;
