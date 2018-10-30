import React, { Component } from "react";
import { fetchUtils, Admin, Resource } from "react-admin";
import jsonAPIRestClient from "./jsonapi-client/src/restClient";
import * as R from "ramda";

import envConfig from "./envConfig";
import logo from "./logo.svg";
import "./App.css";
import { ReportList, ReportShow } from "./components/reports";

import {
  AffiliateList,
  AffiliateCreate,
  AffiliateEdit
} from "./components/affiliates";

import DispatchCreate from "./components/dispatches/DispatchCreate";
import ReportNoteCreate from "./components/report_notes/ReportNoteCreate";

import { UserList, UserCreate, UserEdit } from "./components/users";

import { ZipFenceCreate, ZipFenceEdit } from "./components/zip_fences";

import { configureAuth } from "./authProvider";
import authManager from "./authManager";
import AuthContext from "./components/AuthContext";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const storedAuth = authManager.read();
  if (storedAuth) {
    options.headers.set("Authorization", `Bearer ${storedAuth.jwt}`);
  }
  return fetchUtils.fetchJson(url, options);
};

const restClient = jsonAPIRestClient(envConfig.CONCRN_API_URL, httpClient);

class App extends Component {
  state = {
    auth: authManager.read()
  };

  render() {
    const auth = {
      ...this.state.auth,
      isAffiliate: /affiliate_/.test(R.path(["auth", "role"], this.state))
    };
    const title = auth.affiliate ? `Concrn: ${auth.affiliate.name}` : "Concrn";
    return (
      <AuthContext.Provider value={auth}>
        <Admin
          authProvider={configureAuth()}
          dataProvider={restClient}
          title={title}
        >
          <Resource
            name="admin/affiliates"
            list={auth.isAffiliate ? null : AffiliateList}
            edit={AffiliateEdit}
            create={AffiliateCreate}
            options={{ label: "Affiliates" }}
          />
          <Resource
            name="admin/reports"
            list={ReportList}
            show={ReportShow}
            options={{ label: "Reports" }}
          />
          <Resource
            name="admin/users"
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            options={{ label: "Users" }}
          />
          <Resource
            name="admin/zip_fences"
            create={ZipFenceCreate}
            edit={ZipFenceEdit}
          />
          <Resource name="admin/report_notes" create={ReportNoteCreate} />
          <Resource name="admin/report_events" />
          <Resource create={DispatchCreate} name="dispatches" />
        </Admin>
      </AuthContext.Provider>
    );
  }
}

export default App;
