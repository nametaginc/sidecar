import React, {useEffect, useRef, useState} from "react";
import firebase from 'firebase'
import * as firebaseui from 'firebaseui'

import "../node_modules/firebaseui/dist/firebaseui.css"
import { Firebase as NametagFirebase } from './auth2/firebase'
import {Button} from "react-bootstrap";

firebase.initializeApp({
    apiKey: "AIzaSyDDj1yo8fLOum4Iblv4ElFgyD2C4O7Z6mo",
    authDomain: "sidecar-8b6e3.firebaseapp.com",
    projectId: "sidecar-8b6e3",
    storageBucket: "sidecar-8b6e3.appspot.com",
    messagingSenderId: "206569587612",
    appId: "1:206569587612:web:fa6d7625a0a4e4ca7dbe59"
});

var ui = new firebaseui.auth.AuthUI(firebase.auth())
var nametag = new NametagFirebase({ClientID: "319f99a0-1020-4774-b384-e3498e1fa5f9"})

export const FirebaseIndex = () => {
    const container = useRef<HTMLDivElement>(null)
    const [user, setUser ] = useState<firebase.User|null>()

    useEffect(() => {
        if (!container.current) {
            return
        }

        firebase.auth().onAuthStateChanged((user) => {
            setUser(user)
        })
        const scopes = ["nt:email", "nt:name"]
        ui.start(container.current, {
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            callbacks: {
                uiShown: () => {
                    nametag.start(scopes)
                }
            }
            // Other config options...
        });
    }, [container])

    return (
        <>
            <pre>current user: {JSON.stringify(user)}</pre>
            <Button onClick={() => firebase.auth().signOut()}>Signout</Button>
            <div ref={container}></div>
        </>
    );
}
