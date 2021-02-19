import React, { useEffect, useState } from 'react'
import firebase from 'firebase'
import { nametag } from './auth'

import '../node_modules/firebaseui/dist/firebaseui.css'
import { Button } from 'react-bootstrap'

firebase.initializeApp({
  apiKey: 'AIzaSyDDj1yo8fLOum4Iblv4ElFgyD2C4O7Z6mo',
  authDomain: 'sidecar-8b6e3.firebaseapp.com',
  projectId: 'sidecar-8b6e3',
  storageBucket: 'sidecar-8b6e3.appspot.com',
  messagingSenderId: '206569587612',
  appId: '1:206569587612:web:fa6d7625a0a4e4ca7dbe59'
})

export const FirebasePage = () => {
  const [user, setUser] = useState<firebase.User|null>()

  useEffect(() => {
    (async () => {
      const token = nametag.Token()
      if (token && token.firebase_custom_token) {
        await firebase.auth().signInWithCustomToken(token.firebase_custom_token)
        setUser(firebase.auth().currentUser)
        // This is counter-intuitive, but we want to clear the id token from local storage
        // so that normal signout can work
        await nametag.Signout()
      }
    })()
  })

  return (
      <>
          <pre>current user: {JSON.stringify(user, null, '  ')}</pre>
          <Button onClick={async () => {
            const url = await nametag.AuthorizeURL(['nt:email', 'nt:name'], '/firebase')
            console.log(url)
            window.location.assign(url)
          }}>Sign in</Button>
          <Button onClick={async () => {
            await firebase.auth().signOut()
            setUser(firebase.auth().currentUser)
          }}>Signout</Button>
      </>
  )
}
