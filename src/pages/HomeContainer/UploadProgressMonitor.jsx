import { Paper, Typography, Grid } from '@material-ui/core';
import FileItem from './FileItem';
import { v4 as uuidv4 } from 'uuid';

const UploadProgressMonitor = (props) => {
  const { addedFiles } = props;
  return(<Paper 
    elevation={3} 
    style={{ 
      minHeight: '200px', display: 'flex', alignContents: 'center', alignItems : "center"
    }}>
        { addedFiles.length > 0 
          ? (
            <Grid container direction="column" justify="flex-start" style={{ width: '100%', padding: '20px'}}>
              {addedFiles.map(({file, dataUrl}) => {
                return (<FileItem key={uuidv4()} file={file} dataUrl={dataUrl} />);              
              })} 
              </Grid>
            ) : (
              <Grid item container justify="center" xs={12}>
                <Typography variant="h3" align="center" >
                  Choose more files to upload.
                </Typography>
              </Grid>
            )
        }
  </Paper>);
};

export default UploadProgressMonitor;
