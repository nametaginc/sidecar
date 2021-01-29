import React from 'react';
import {Page} from './page'
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NotFoundPage } from './not_found'
import {Button, Card, Col, Row} from "react-bootstrap";

import { QueryClient, QueryClientProvider } from 'react-query'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {AuthCallbackPage} from "./auth/callback";
import {FirebaseIndex} from "./firebase_index";

const queryClient = new QueryClient()

const Rating:React.FC<{value: number}> = ({value}) => {
    return <div>
        <FontAwesomeIcon icon={[value >= 1 ? "fas": "far", "star"]} />
        <FontAwesomeIcon icon={[value >= 2 ? "fas": "far", "star"]} />
        <FontAwesomeIcon icon={[value >= 3 ? "fas": "far", "star"]} />
        <FontAwesomeIcon icon={[value >= 4 ? "fas": "far", "star"]} />
        <FontAwesomeIcon icon={[value >= 5 ? "fas": "far", "star"]} />
        Rating {value}
    </div>
}

const Driver: React.FC<{image: string, name: string, rating: number}> = ({image, name, rating})=> (
    <Card>
        <Card.Img variant={"top"} src={image} />
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text><Rating value={rating} /></Card.Text>
            <Button variant="primary">Book a ride with {name}</Button>
        </Card.Body>
    </Card>
)

function Index() {
  return (
    <Page>
        <Row>
            <Col md={4}>
                <Driver image={require('./rides/001.jpg').default} name={"Earl"} rating={4} />
            </Col>
            <Col md={4}>
                <Driver image={require('./rides/002.jpg').default} name={"Connie"} rating={5} />
            </Col>
        </Row>
    </Page>
  );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
                <Switch>
                    <Route exact={true} path={"/"} render={() => <Index />} />
                    <Route exact={true} path={"/callback"} render={() => <AuthCallbackPage />} />
                    <Route exact={true} path={"/firebase"} render={() => <FirebaseIndex />} />
                    <Route render={() => <NotFoundPage />} />
                </Switch>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App;
