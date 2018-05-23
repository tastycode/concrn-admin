import React from 'react';
import AuthContext from 'components/AuthContext';

export default Component => props => {
  return <AuthContext.Consumer>
    { auth => <Component {...props} auth={auth}/> }
  </AuthContext.Consumer>
}
