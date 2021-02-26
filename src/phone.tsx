import { useQuery } from 'react-query'
import { nametag } from './auth'
import { Button, Card, Spinner } from 'react-bootstrap'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

interface PhoneQueryData {
    number: string | null
    authorizationURL: string
}

export const Phone = () => {
  const phoneQuery = useQuery<PhoneQueryData>(['phone'], async (): Promise<PhoneQueryData> => {
    if (!nametag.SignedIn()) {
      const state = location.pathname // pass the current URL through the signin process
      const url = await nametag.AuthorizeURL(['nt:phone'], state)
      return { number: null, authorizationURL: url }
    }

    const props = await nametag.GetProperties(['nt:phone'])
    if (props) {
      const phoneProp = props.get('nt:phone')
      if (phoneProp && phoneProp.value) {
        return { number: phoneProp.value, authorizationURL: '' }
      }
    }

    const state = location.pathname // pass the current URL through the signin process
    const url = await nametag.AuthorizeURL(['nt:phone'], state)
    return { number: null, authorizationURL: url }
  })

  if (phoneQuery.isLoading) {
    return <Spinner animation={'border'}/>
  }

  return (
      <Card className={'h-100'}>
          <Card.Body>
              <Card.Title>Call me</Card.Title>
              <Card.Text>
                  {phoneQuery.isError &&
                  <Button onClick={() => phoneQuery.refetch()}>
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                  </Button>}
                  {phoneQuery.data?.authorizationURL &&
                  <a onClick={() => {
                    window.location.assign(phoneQuery.data?.authorizationURL)
                  }}>
                      <img alt="Say hellow with Nametag" src={nametag.server + '/button.svg'}/>
                  </a>
            }
                  {phoneQuery.data?.number && <div><strong>{phoneQuery.data?.number}</strong></div>}
              </Card.Text>

          </Card.Body>
      </Card>
  )
}
