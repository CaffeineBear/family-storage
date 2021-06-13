import { Grid, Typography, Button } from '@material-ui/core';

const HomeHeader = (props) => {
  const { user, handleOnClick } = props;
  return (
    <Grid container justify="space-between" style={{ marginBottom: '20px' }}>
      <Typography variant="h6" >
        Welcome, {user && user.attributes.name}
      </Typography>
      <Button color="primary" onClick={() => handleOnClick()} variant="contained">
        Choose Files
      </Button>
    </Grid>
  );
};

export default HomeHeader;
