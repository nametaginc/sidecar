/**
 * Copyright 2020 Nametag Inc.
 *
 * All information contained herein is the property of Nametag Inc.. The
 * intellectual and technical concepts contained herein are proprietary, trade
 * secrets, and/or confidential to Nametag, Inc. and may be covered by U.S.
 * and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Reproduction or distribution, in whole or in part, is
 * forbidden except by express written permission of Nametag, Inc.
 */

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { ProgressBar } from "../lib/progress_bar";
import { Page } from "../page";
import {nametagClientID, nametagURL, RootURL} from "./signin";

export const AuthCallbackPage: React.FunctionComponent<{}> = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const exchange = async () => {
      const query = new URLSearchParams(location.hash.replace(/^#/, ""));
      const code = query.get("code");
      const state = query.get("state");
      const body = new FormData();
      body.set("grant_type", "authorization_code");
      body.set("client_id", nametagClientID);
      body.set("code", code || "");
      body.set("redirect_uri", RootURL() + "/callback");

      const codeVerifier = window.sessionStorage.getItem("code_verifier");
      if (codeVerifier) {
        body.set("code_verifier", codeVerifier);
      }

      const resp = await fetch(nametagURL + "/token", {
        method: "POST",
        body: body,
      });
      const respBody = await resp.json();
      const tokenStr = respBody["id_token"];
      if (tokenStr) {
        localStorage.setItem("token", tokenStr);
      } else {
        localStorage.removeItem("token");
      }

      // clear the entire query cache when the token changes
      window.sessionStorage.removeItem("code_verifier");

      history.push(state || "/manage");
    };
    exchange();
  }, [history, location.hash]);

  // Note: annoyingly, nav=false is required here because if we don't, the
  // presence of the SigninOrProfile component will cause the use to loop
  // back into the authorize flow.
  return (
    <Page nav={false}>
      <ProgressBar estimated={1000} />
    </Page>
  );
};
