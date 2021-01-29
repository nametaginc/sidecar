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
import { Auth, Options} from "@nametag/browser"
import {auth} from "../auth/signin";
import firebase from "firebase";

export class Firebase {
  auth: Auth

  constructor(opts: Auth | Options) {
    if (opts instanceof Auth) {
      this.auth = opts
    } else {
      this.auth = new Auth(opts)
    }
    this.start = this.start.bind(this)
  }

  addButtonToIDPList(scopes: string[]) {
    const listEl = document.querySelector(".firebaseui-idp-list")
    if (!listEl) {
      return
    }

    const existingButtonEl = document.querySelector('*[data-provider-id="nametag"]')
    if (existingButtonEl) {
      return
    }

    const liEl = document.createElement('li') as HTMLLIElement
    liEl.className = "firebaseui-list-item"
    liEl.innerHTML = `<button class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-generic firebaseui-id-idp-button" data-provider-id="nametag" style="background-color:#db4437" data-upgraded=",MaterialButton"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg"></span><span class="firebaseui-idp-text firebaseui-idp-text-long">Sign in with Nametag</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Nametag</span></button>`

    const buttonEl = liEl.firstChild as HTMLButtonElement
    buttonEl.addEventListener("click", async (evt) => {
      evt.stopImmediatePropagation()
      evt.preventDefault()
      const state = window.location.pathname + window.location.search
      const url = await auth.AuthorizeURL(scopes, state)
      window.location.assign(url)
    })

    listEl.insertBefore(liEl, listEl.firstChild)
  }

  async start(scopes: string[]) {
    const token = auth.Token()
    if (token && token.firebase_custom_token) {
      await firebase.auth().signInWithCustomToken(token.firebase_custom_token)
      return
    }
  }
}
