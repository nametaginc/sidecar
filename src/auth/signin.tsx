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
import * as H from "history";
import { Nav, NavDropdown, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { bytesToBase64 } from "../lib/string";
import { useHistory } from "react-router";
import {GetProfile} from "./props";

const newPKCEverifier = async () => {
  const verifierLenth = 43;
  let verifier = "";
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < verifierLenth; i++) {
    verifier += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  let challenge = verifier;
  let challengeMethod = "plain";
  try {
    var digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verifier)
    );

    challenge = bytesToBase64(new Uint8Array(digest));
    challengeMethod = "S256";
  } catch (err) {
    // no change
  }

  return {
    verifier: verifier,
    challenge: challenge,
    challengeMethod: challengeMethod,
  };
};

export const RootURL = () => {
  return window.location.origin
}

export const nametagURL = "https://ross.nametagdev.com" //"https://nametagstaging.com"
export const nametagClientID = "408915b2-7ba5-4b43-bb0e-f6b99e24b247" //"06650b60-f0a7-43b1-9760-f8c77a9fa429";

export const AuthorizeURL = async (state: string) => {
  const clientID = nametagClientID;
  const scopes = ["nt:email", "nt:name"];
  const q = new URLSearchParams();
  q.set("client_id", clientID);
  q.set("scope", scopes.join(" "));
  q.set("response_mode", "fragment");
  q.set("state", state);
  q.set("redirect_uri", RootURL() + "/callback");

  const pkce = await newPKCEverifier();
  window.sessionStorage.setItem("code_verifier", pkce.verifier);

  q.set("code_challenge", pkce.challenge);
  q.set("code_challenge_method", pkce.challengeMethod);

  const authorizeURL = nametagURL + "/authorize?" + q.toString();
  return authorizeURL;
};

export const Signin = async (location: H.Location) => {
  const url = await AuthorizeURL(location.pathname);
  window.location.assign(url);
};

export const SigninOrProfile: React.FunctionComponent<{}> = () => {
  const location = useLocation();
  const history = useHistory();

  const Signin = async () => {
    const url = await AuthorizeURL(location.pathname);
    window.location.assign(url);
  };

  const Signout = async () => {
    localStorage.removeItem("token");
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
