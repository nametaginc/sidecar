import React from 'react'
import { Page } from './page'
import { Button, Card, Col, Row, Alert } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as outlineStar } from '@fortawesome/free-regular-svg-icons'

const Rating:React.FC<{value: number}> = ({ value }) => {
  return <div>
      <FontAwesomeIcon icon={value >= 1 ? solidStar : outlineStar} />
      <FontAwesomeIcon icon={value >= 2 ? solidStar : outlineStar} />
      <FontAwesomeIcon icon={value >= 3 ? solidStar : outlineStar} />
      <FontAwesomeIcon icon={value >= 4 ? solidStar : outlineStar} />
      <FontAwesomeIcon icon={value >= 5 ? solidStar : outlineStar} />
  </div>
}

const Driver: React.FC<{image: string, name: string, rating: number}> = ({ image, name, rating }) => (
    <Card className={'h-100'}>
        <Card.Img variant={'top'} src={image} style={{ height: '230px' }} />
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text><Rating value={rating} /></Card.Text>
            <Button variant="primary">Book a ride with {name}</Button>
        </Card.Body>
    </Card>
)

export const HomePage = () => (
    <Page>
        <Alert variant="info">
            <strong>Nametag demo app</strong>
            <p>This is a demonstration app to show how Nametag connects companies with genuine, validated information
                about real people.</p>

            <p><a href="https://github.com/nametaginc/sidecar">Source on Github</a></p>

            <div><a href="https://nametag.co/manage">Nametag developer console</a></div>
        </Alert>
        <Row>
            <Col md={4}>
                <Driver image={require('./images/ride001.jpg').default} name={'Earl'} rating={4} />
            </Col>
            <Col md={4}>
                <Driver image={require('./images/ride002.jpg').default} name={'Connie'} rating={5} />
            </Col>
        </Row>
    </Page>
)
