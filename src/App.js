import React, {Component} from 'react';
import {fetchUtils, Admin, Resource} from 'react-admin';
import jsonAPIRestClient from './jsonapi-client/src/restClient';

import logo from './logo.svg';
import './App.css';
import {ReportList} from './components/ReportList';

import {
  AffiliateList,
  AffiliateCreate,
  AffiliateEdit,
} from './components/affiliates';

import {
  UserList,
  UserCreate,
  UserEdit,
} from './components/users';

import {configureAuth} from './authProvider';
import authManager from './authManager';
import AuthContext from './components/AuthContext';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'});
  }
  const storedAuth = authManager.read();
  if (storedAuth) {
    options.headers.set('Authorization', `Bearer ${storedAuth.jwt}`);
  }
  return fetchUtils.fetchJson(url, options);
};

const restClient = jsonAPIRestClient('http://localhost:3000', httpClient);

class App extends Component {
  state = {
    auth: authManager.read(),
  };

  onLogin = loginResponse => {
    // the intention here was to set state for the AuthContext
    // however, changing the value of the AuthContext.Provider
    // would cause the redux store and router to update
    // which would cause react-admin to choke
    // so we'll just reload so we can set the initial state from localStorage
    // this approach causes a flicker, but seems to be the only way
    // to get auth's values accessible to children deep in the app
    window.location.reload(true);
  };

  render() {
    const auth = {
      ...this.state.auth,
      isAffiliate: /affiliate_/.test(this.state.auth.role)
    }
    const title = auth.affiliate ? `Concrn: ${auth.affiliate.name}` : 'Concrn';
    return (
      <AuthContext.Provider value={auth}>
        <Admin
          authProvider={configureAuth({callback: this.onLogin})}
          dataProvider={restClient}
          title={title}>
          <Resource
            name="admin/affiliates"
            list={auth.isAffiliate ? null : AffiliateList}
            edit={AffiliateEdit}
            create={AffiliateCreate}
            options={{label: 'Affiliates'}}
          />
          <Resource
            name="admin/reports"
            list={ReportList}
            options={{label: 'Reports'}}
          />
          <Resource
            name="admin/users"
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            options={{label: 'Users'}}
          />
        </Admin>
      </AuthContext.Provider>
    );
  }
}

export default App;
