import React, { Component } from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin'
import jsonAPIRestClient from "./jsonapi-client/src/restClient"

import logo from './logo.svg';
import './App.css';
import { ReportList } from './components/ReportList'
import authProvider from './authProvider'

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('token')
  options.headers.set('Authorization', `Bearer ${token}`)
  return fetchUtils.fetchJson(url, options)
}

const restClient = jsonAPIRestClient("http://localhost:3000", httpClient)


class App extends Component {
  render() {
    return (
      <Admin authProvider={authProvider} dataProvider={restClient} title="Concrn">
        <Resource name="admin/reports" list={ReportList} options={{label: 'Reports'}}/>
      </Admin>
    );
  }
}

export default App;
