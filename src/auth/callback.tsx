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

import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { ProgressBar } from "../lib/progress_bar";
import { Page } from "../page";
import {auth } from "./signin";
import {Alert} from "react-bootstrap";

export const AuthCallbackPage: React.FunctionComponent<{}> = () => {
  const location = useLocation();
  const history = useHistory();

  const [error, setError ] = useState<any>(null)

  useEffect(() => {
    auth.HandleCallback().then((state) => {
      history.push(state || "/");
    }).catch(err => {
      setError(err)
    })
  }, [history, location.hash]);

  // Note: annoyingly, nav=false is required here because if we don't, the
  // presence of the SigninOrProfile component will cause the use to loop
  // back into the authorize flow.
  return (
    <Page nav={false}>
      {error ?
          <Alert variant={"danger"}>
            <strong>Error</strong>
            <div>{error.toString()}</div>
          </Alert>
          : <ProgressBar estimated={1000} /> }
    </Page>
  );
};
