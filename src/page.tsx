import React, { ReactNode } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import wordmark from "./images/logo-horizontal.svg";
import {SigninOrProfile} from "./auth";

interface PageProps {
  nav?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Page: React.FunctionComponent<PageProps> = ({
  children,
  nav,
}) => {
  return (
    <div
      className="d-flex flex-column min-vh-100"
    >
      {nav !== false && (
        <header>
          <Navbar variant="light" className="mainnav" expand="lg">
            <Navbar.Brand href="/manage">
              <img className="wordmark" src={wordmark} alt={"Nametag"} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link>Like Uber, but for rides in people's sidecar.</Nav.Link>

                <LinkContainer to="/manage/apps">
                  <Nav.Link>Get a ride</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/drive">
                  <Nav.Link>Drive for us</Nav.Link>
                </LinkContainer>
              </Nav>
              <Nav>
                <SigninOrProfile />
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
      )}
          <Container>
            <div className={"my-5"}>{children}</div>
          </Container>
      <footer className="mt-auto">
        <Navbar bg="light" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link href={"/terms"}>{"Terms of Service"}</Nav.Link>
            <Nav.Link href={"/privacy"}>{"Privacy"}</Nav.Link>
          </Nav>
        </Navbar>
      </footer>
    </div>
  );
};
