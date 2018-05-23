import React, {Component} from 'react';
import {fetchUtils, Admin, Resource} from 'react-admin';
import jsonAPIRestClient from './jsonapi-client/src/restClient';

import logo from './logo.svg';
import './App.css';
import {
  ReportList
} from './components/ReportList';

import {
  AffiliateList,
  AffiliateCreate,
  AffiliateEdit,
} from './components/affiliates';

import {
  UserList,
  UserCreate,
  UserEdit
} from './components/users'

import {
  AffiliateUserCreate,
  AffiliateUserEdit
} from './components/affiliate_users'


import authProvider from './authProvider';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'});
  }
  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const restClient = jsonAPIRestClient('http://localhost:3000', httpClient);

class App extends Component {
  render() {
    return (
      <Admin
        authProvider={authProvider}
        dataProvider={restClient}
        title="Concrn">
        <Resource
          name="admin/affiliates"
          list={AffiliateList}
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
        <Resource
          name="admin/affiliate_users"
          edit={AffiliateUserEdit}
          create={AffiliateUserCreate}
        />
      </Admin>
    );
  }
}

export default App;
