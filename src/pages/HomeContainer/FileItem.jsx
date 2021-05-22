import { Grid, ListItemIcon, LinearProgress, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const FileItem = (props) => {
  const { file, dataUrl, progress = 100 } = props;
  const iconSize = '100px';
  return (<>
    <Grid item container direction="row" xs={12} justify="flex-start" wrap='wrap' style={{height: iconSize, width: '100%', marginBottom: '40px'}}>
      <Grid item xs={6} md={3}> 
        {dataUrl 
          ? (<img style={{width: iconSize, height: iconSize, borderRadius: '10px'}} src={dataUrl} alt={file.name}/>)
          : (<ListItemIcon style={{ color: 'orange' }}>
            <InsertDriveFileIcon style={{width: iconSize, height: iconSize}} />
          </ListItemIcon>)
        }
      </Grid>
      <Grid item container alignItems="center" xs={6} md={3}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" >
            {file.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container direction="column" justify="center" xs={12} md={6}>
        <Typography align="right"> 
          {progress}
        </Typography>
        <BorderLinearProgress variant="determinate" value={progress} />
      </Grid>
    </Grid>
  </>);
};

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

export default FileItem;
