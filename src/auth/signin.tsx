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

import React from "react";
import { Nav, NavDropdown, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import {GetProfile} from "./props";
import {Auth} from "@nametag/browser"

export const auth = (() => {
  switch (window.location.origin) {
    case "http://localhost:3000":
    {
      const auth = new Auth({
        ClientID: "319f99a0-1020-4774-b384-e3498e1fa5f9",
      })
      auth.server = "https://ross.nametagdev.com"
      return auth
    }

    case "https://sidecar.ninja":
    {
      const auth = new Auth({
        ClientID: "55578457-e684-464d-9366-1ca6c329f74f",
      })
      auth.server = "https://nametagstaging.com"
      return auth
    }

    default:
      return new Auth({ClientID: "TODO-FILL-IN-CLIENT-ID"})
  }
})()

export const SigninOrProfile: React.FunctionComponent<{}> = () => {
  const location = useLocation();
  const history = useHistory();

  const Signin = async () => {
    const url = await auth.AuthorizeURL(["nt:email", "nt:name"], location.pathname);
    window.location.assign(url);
  };

  const Signout = async () => {
    auth.Signout()
    profileQuery.refetch()
    history.push("/");
  };

  const profileQuery = useQuery(["profile"], () => GetProfile())
  if (profileQuery.isLoading) {
    return <Spinner animation={"border"} />;
  }
  const profile = profileQuery.data
  if (!profile) {
    return <Nav.Link onClick={() => Signin()}>Signin</Nav.Link>;
  }
  const greeting = profile.name || profile.email

  return (
    <NavDropdown
      title={"Hello, " + greeting}
      id={"signin-dropdown"}
    >
      <NavDropdown.Item onClick={() => Signout()}>
        Signout
      </NavDropdown.Item>
    </NavDropdown>
  );
};
