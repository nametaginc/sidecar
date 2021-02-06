
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router'
import { Alert, Nav, NavDropdown, Spinner } from 'react-bootstrap'
import { Auth } from '@nametag/browser'

import { Page } from './page'

export const nametag = new Auth({
  // get your client ID for your app from https://nametag.co/manage
  ClientID: process.env.REACT_APP_NAMETAG_CLIENT_ID || '55578457-e684-464d-9366-1ca6c329f74f'
})

// generally the default is fine
if (process.env.REACT_APP_NAMETAG_SERVER) {
  nametag.server = process.env.REACT_APP_NAMETAG_SERVER
}

class Profile {
  name: string = ''
  email: string = ''
}

export const GetProfile = async (): Promise<Profile|null> => {
  const props = await nametag.GetProperties(['nt:name', 'nt:email'])
  if (!props) {
    return null
  }

  const rv = new Profile()
  const nameProp = props.get('nt:name')
  if (nameProp) {
    rv.name = nameProp.value as string
  }

  const emailProp = props.get('nt:email')
  if (emailProp) {
    rv.email = emailProp.value as string
  }

  return rv
}

const scopes = ['nt:email', 'nt:name']

export const SigninOrProfile: React.FunctionComponent<{}> = () => {
  const location = useLocation()

  // undefined => pending, null => not logged in, !null => logged in
  const [profile, setProfile] = useState<Profile|null|undefined>(undefined)

  const getData = async () => {
    if (!nametag.SignedIn()) {
      setProfile(null)
      return
    }
    const p = await GetProfile()
    setProfile(p || null)
  }
  useEffect(() => {
    getData()
  }, [])

  if (profile === undefined) {
    return <Spinner animation={'border'}/>
  }

  if (profile === null) {
    return (
        <Nav.Link onClick={async () => {
          const state = location.pathname // pass the current URL through the signin process
          const url = await nametag.AuthorizeURL(scopes, state)
          window.location.assign(url)
        }}>
            <img alt="Say hellow with Nametag" src={nametag.server + '/button.svg'}/>
        </Nav.Link>
    )
  }

  const signout = async () => {
    await nametag.Signout()
    setProfile(null)
  }

  const greeting = profile.name || profile.email || 'Anonymous'
  return (
      <NavDropdown
            title={'Hello, ' + greeting}
            id={'signin-dropdown'}
        >
          <NavDropdown.Item onClick={signout}>
              Signout
          </NavDropdown.Item>
      </NavDropdown>
  )
}

export const AuthCallbackPage: React.FunctionComponent<{}> = () => {
  const location = useLocation()
  const history = useHistory()
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    nametag.HandleCallback().then((state) => {
      history.push(state || '/')
    }).catch(err => {
      setError(err)
    })
  }, [history, location.hash])

  // Note: annoyingly, nav=false is required here because if we don't, the
  // presence of the SigninOrProfile component will cause the use to loop
  // back into the authorize flow.
  return (
      <Page nav={false}>
          {error
            ? <Alert variant={'danger'}>
                <strong>Error</strong>
                <div>{error.toString()}</div>
            </Alert>
            : <Spinner animation={'border'}/> }
      </Page>
  )
}
