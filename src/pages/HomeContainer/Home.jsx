import { Container } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import UploadProgressMonitor from './UploadProgressMonitor';
import { FILE_SIZE_LIMIT, FILE_NUMBER_LIMIT } from './constants';
import HomeHeader from './HomeHeader';

const Home = (props) => {
  const {
    user,
    addedFiles,
    onClick: handleOnClick,
    onSave: handleOnSave,
    onClose: handleClose,
    openDialog: open
  } = props;

  return( <Container maxWidth="lg" style={{ color: 'inherit', backgroundColor: 'inherit'}}>
    <HomeHeader user={user} handleOnClick={handleOnClick} />
    <UploadProgressMonitor addedFiles={addedFiles} /> 
    <DropzoneDialog
      open={open}
      onSave={(files) => handleOnSave(files) }
      showPreviews={true}
      maxFileSize={FILE_SIZE_LIMIT}
      filesLimit={FILE_NUMBER_LIMIT}
      onClose={handleClose}
    />
  </Container>);
};

export default Home;
