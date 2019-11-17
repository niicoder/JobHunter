import React, { Component } from 'react'
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap'
import './CustomNav.css'

export default class CustomNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    componentWillReceiveProps(newProps) {
        const show = newProps.user ? true : false 

        this.setState({
            show
        })
    }

    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header className="header">
                        <Navbar.Brand>
                            <h1>JobHunter</h1>
                        </Navbar.Brand>
                    </Navbar.Header>
                    {this.state.show ? 
                        <Nav pullRight>
                            <NavItem eventKey ={1} className="navbar-nav-item">
                                <Button onClick={this.props.googleSignOut}>Sign Out</Button>
                            </NavItem>
                        </Nav>
                    : null}
                </Navbar>
            </div>
        )
    }
}