import React from 'react';
import { Container, Typography} from '@material-ui/core';
const Home = (props) => {
  const { user } = props;
  return( <Container maxWidth="lg">
    <Typography variant="h6" >
      Welcome, {user.attributes.name}
    </Typography>
  </Container>);
};


export default Home;
