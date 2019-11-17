import React, { Component } from 'react'
import { Table, Modal, Button } from 'react-bootstrap'
import axios from 'axios';

export default class ComponentName extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: '',
            position: '',
            company: '',
            contactFirstName: '',
            contactLastName: '',
            contactEmail: '',
            jobBoard: '',
            postingUrl: '',
            postDate: new Date(),
            comments: '',
            progress: {}
        }

        this.handleChange = this.handleChange.bind(this)
        this.submitNewJobDetails = this.submitNewJobDetails.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.getDatesArray = this.getDatesArray.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
    }

    componentDidMount() {      
        if (this.props.properties) {
            for (let property in this.props.properties) {                
                this.setState({ [property]: this.props.properties[property]})
            }
        }
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleDateChange(event) {
        const datesArray = this.getDatesArray(this.state.postDate)
        this.setState({ [event.target.id]: datesArray[event.target.value] });
    }

    getDatesArray(date) {
        const dates = []
        //90 day range before and after
        for (let i = -30; i < 60; i++) {

            //Creating new Date object to prevent unintended modification of date
            const steadyDate = new Date(date)
            const newDate = new Date(steadyDate.setDate(steadyDate.getDate() + i))

            dates.push(newDate)
        }

        return dates
    }

    async submitNewJobDetails(e) {
        e.preventDefault()

        const jobApp = this.state
        jobApp.progress.status = 'applied'
        jobApp.progress.interactions = []
        const interaction = {
            kind: 'application',
            date: new Date(),
            followups: []
        }
        jobApp.progress.interactions.push(interaction)
        const user = this.props.user

        if (jobApp._id) {
            user.jobApps = user.jobApps.map(function(app) {
                if (app._id === jobApp._id) {
                    app = jobApp
                }
                return app
            })
        } else {
            user.jobApps.push(jobApp)
        }

        // jobApp.progress.state = jobApp.progress.state ? jobApp.progress.state : 'applied'

        try {
            await axios.put(`/users/${this.props.user._id}/jobApp`, {
                user
            })
            this.props.handleClose()
            this.props.getUserData(user._id)
        } catch (e) {
            console.error(e)
        }

    }


    render() {
        return (
            <>
            <Modal.Header closeButton>
                <Modal.Title>Add a Job Application</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <form onSubmit={this.submitNewJobDetails}>
                    <Table bordered responsive>
                        <tbody>

                        <tr>
                            <td>
                                <label htmlFor="position">Position:</label>
                            </td>
                            <td>
                                <input type="text" id="position" value={this.state.position} onChange={this.handleChange}/>
                            </td>
                        </tr>                    
                        <tr>
                            <td>
                                <label htmlFor="company">Company:</label>
                            </td>
                            <td>
                                <input type="text" id="company" value={this.state.company} onChange={this.handleChange}/>
                            </td>
                        </tr>    
                        <tr>
                            <td>
                                <label htmlFor="contactFirstName">Contact First Name:</label>
                            </td>
                            <td>
                                <input type="text" id="contactFirstName" value={this.state.contactFirstName} onChange={this.handleChange}/>
                            </td>
                        </tr>       
                        <tr>
                            <td>
                                <label htmlFor="contactLastName">Contact Last Name:</label>
                            </td>
                            <td>
                                <input type="text" id="contactLastName" value={this.state.contactLastName} onChange={this.handleChange}/>
                            </td>
                        </tr>                         
                        <tr>
                            <td>
                                <label htmlFor="contactEmail">Contact Email:</label>
                            </td>
                            <td>
                                <input type="text" id="contactEmail" value={this.state.contactEmail} onChange={this.handleChange}/>
                            </td>
                        </tr>                    
                        <tr>
                            <td>
                                <label htmlFor="jobBoard">Job Board:</label>
                            </td>
                            <td>
                                <input type="text" id="jobBoard" value={this.state.jobBoard} onChange={this.handleChange}/>
                            </td>
                        </tr>                    
                        <tr>
                            <td>
                                <label htmlFor="postingUrl">Job Posting:</label>
                            </td>
                            <td>
                                <input type="text" id="postingUrl" value={this.state.postingUrl} onChange={this.handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="postDate">Date Posted:</label>
                            </td>
                            <td>
                                <select name="date" id="postDate" value="30" onChange={this.handleDateChange}>
                                    {this.getDatesArray(new Date(this.state.postDate)).map((date, i) => {
                                        return <option key={i} value={i}>{this.props.getDateString(date)}</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                        {/* <tr>
                            <td>
                                <label htmlFor="comments">Comments:</label>
                            </td>
                            <td>
                                <textarea type="text" id="comments" value={this.state.comments} onChange={this.handleChange}></textarea>
                            </td>
                        </tr> */}
                        <tr>
                            <td colSpan="2">
                            <Button type="submit" bsStyle="success" bsSize="large">Submit</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </form>
            </Modal.Body>
            <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.props.handleClose}>Close</Button>
            </Modal.Footer>
            </>
        )
    }
}