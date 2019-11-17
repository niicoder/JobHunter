import React, { Component } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import JobApp from './JobApp'
import EditJobApp from './EditJobApp'

export default class Spreadsheet extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {        
        this.setState({ show: true });
    }

    getDateString(dateObj) {
        const month = dateObj.getMonth()
        const year = dateObj.getFullYear()
        const date = dateObj.getDate()

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        return `${months[month]} ${date}, ${year}`
    }

    render() {

        const user = this.props.user
        const getUserData = this.props.getUserData
        const getDateString = this.getDateString
        if (!this.props.apps) return <div>Loading!</div>
        if (this.props.apps) return (
            <div>
                <Table bordered responsive striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Position</th>
                            <th>Employer</th>

                            {this.props.openTab === 'inProgress' ? 
                                <th>Next Steps</th>
                                : <th>Status</th>
                            }

                            <th>Expand</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.apps.map(function(app, i) {
                                return <JobApp 
                                    app={app} 
                                    key={app._id} 
                                    index={i} 
                                    user={user}
                                    getUserData={getUserData}
                                    getDateString={getDateString}
                                />
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th colSpan="3">
                                <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
                                    Add job application
                                </Button>
                            </th>
                            <th></th>
                        </tr>
                    </tfoot>
                </Table>
                <Modal 
                    show={this.state.show} 
                    onHide={this.handleClose}
                >
                    <EditJobApp
                        handleClose={this.handleClose}
                        user={this.props.user}
                        getUserData={this.props.getUserData}
                        getDateString={this.getDateString}
                    ></EditJobApp>
                </Modal>
            </div>
        )
    }
}