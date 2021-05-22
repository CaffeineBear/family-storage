import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';
import Home from './pages/HomeContainer' ;
import { AppBar, Typography, Toolbar, Grid, Container } from '@material-ui/core';

Amplify.configure(awsconfig);

const AuthStateApp = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData)
      });
  }, []);

  return ( <div style={{ backgroundColor : 'gray' , color: 'white', height: '100vh'}} >
    {authState === AuthState.SignedIn && user 
      ? (<>
          <AppBar position="static" style={{ marginBottom: "20px"}}>
            <Toolbar>
              <Container maxWidth="lg">
              <Grid container justify="space-between" alignItems="center">
                <Typography variant="h6" align="center">
                 Family Storage 
                </Typography>
                <AmplifySignOut />
              </Grid>
              </Container>
            </Toolbar>
          </AppBar>
          <Home user={user} />
      </>) : (
      <AmplifyAuthenticator usernameAlias="email" >
        <AmplifySignUp
          slot="sign-up"
          usernameAlias="email"
          formFields={[
            { type: "email" },
            { type: "name", placeholder: "Full Name", label: "Your Name", required: true},
            { type: "password" },
            
          ]}
        />
        <AmplifySignIn slot="sign-in" usernameAlias="email" />
      </AmplifyAuthenticator>
    )}
  </div>);
}

export default AuthStateApp;
