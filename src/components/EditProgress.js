import React, { Component } from 'react'
import { Table, Modal, Button } from 'react-bootstrap'
import axios from 'axios';
import _ from 'lodash'

export default class EditProgress extends Component {
    constructor(props) {
        super(props)

        this.state = {
            interactions: null,
            status: null,
            _id: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.getDatesArray = this.getDatesArray.bind(this)
        this.addInteraction = this.addInteraction.bind(this)
        this.confirmStatus = this.confirmStatus.bind(this)
        this.submitProgressChanges = this.submitProgressChanges.bind(this)
        this.deleteFollowup = this.deleteFollowup.bind(this)
    }

    componentDidMount() {
        const interactions = _.cloneDeep(this.props.interactions)
        const status = this.props.status
        
        this.setState({
            interactions,
            status
        })
    }

    confirmStatus() {
        const lastInteraction = this.state.interactions[this.state.interactions.length - 1]

        const today = new Date()
        const sevenDaysFromNow = new Date(today.setDate(today.getDate() + 7)); 
        let status

        if (lastInteraction.kind === 'application') {
            status = 'applied'
        }
        if (lastInteraction.kind === 'callback') {
            status = 'callback'
        }
        if (lastInteraction.kind === 'interview' && lastInteraction.date < today) {
            status = 'interview'
        }
        if (lastInteraction.kind === 'interview' && lastInteraction.date >= today) {
            status = 'waitingForInterview'
        }
        if (lastInteraction.followups && lastInteraction.followups[lastInteraction.followups.length - 1] > sevenDaysFromNow) {
            status = 'rejected'
        }
        if (!lastInteraction.followups && lastInteraction.date > sevenDaysFromNow) {
            status = 'rejected'
        }

        return status

    }

    addInteraction() {
        const interactions = this.state.interactions
        const today = new Date()

        const newInteraction = {
            kind: '',
            date: today,
            followups: []
        }

        interactions.push(newInteraction)

        this.setState({
            interactions
        })
    }

    addFollowup(i) {
        const interactions = this.state.interactions
        const today = new Date()

        interactions[i].followups.push(today)

        this.setState({
            interactions
        })

    }

    handleChange(event) {

        const interactions = this.state.interactions
        const name = event.target.name

        //For changes on the interaction kind
        if (name === "kind") {
            const key = event.target.id.split('_').pop()
            interactions[key][name] = event.target.value
        }

        if (name === "date") {
            const key = event.target.id.split('_').pop()
            interactions[key][name] = this.getDatesArray(interactions[key].date)[event.target.value]
        }

        if (name === 'followup') {
            const followupKey = event.target.id.split('_')[2]
            const interactionsKey = event.target.id.split('_')[1]
            interactions[interactionsKey].followups[followupKey] = this.getDatesArray(interactions[interactionsKey].followups[followupKey])[event.target.value]
        }


        //Make new func for changes on followups

        this.setState({ interactions });
    }

    getDatesArray(date) {

        const dates = []
        //90 day range before and after
        for (let i = -30; i < 60; i++) {

            //Creating new Date object to prevent unintended modification of date
            const steadyDate = new Date(date.getTime())
            const newDate = new Date(steadyDate.setDate(steadyDate.getDate() + i))

            dates.push(newDate)
        }
    
        return dates
    }

    deleteFollowup(i, j) {
        const interactions = this.state.interactions
        interactions[i].followups.splice(j, 1)

        this.setState({
            interactions
        })
    }

    deleteInteraction(i) {
        const interactions = this.state.interactions
        interactions.splice(i, 1)

        this.setState({
            interactions
        })
    }

    async submitProgressChanges(e) {
        e.preventDefault()

        const newStatus = this.confirmStatus()
        const progress = this.state
        progress.status = newStatus
        const user = this.props.user
        const jobApp = this.props.jobApp

        jobApp.progress = progress
    
        //get user from props
        if (jobApp._id) {
            user.jobApps = user.jobApps.map(function (app) {
                if (app._id === jobApp._id) {
                    app = jobApp
                }
                return app
            })
        } else {
            user.jobApps.push(jobApp)
        }

        try {
            await axios.put(`/users/${this.props.user._id}/jobApp`, {
                user
            })
            this.props.getUserData(user._id)
            this.props.handleClose()

        } catch (e) {
            console.error(e)
        }

    }


    render() {
        if (!this.state.interactions) return <p>Loading...</p>
        
        if (this.state.interactions) return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Job Application Progress</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.submitProgressChanges}>

                        {this.state.interactions.map((interaction, i) => {

                            return ( <Table bordered responsive key={i}>
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="">Interaction with employer #{i + 1}:</label>
                                    </td>
                                    <td>
                                        <select name="kind" id={`kind_${i}`} value={interaction.kind} onChange={this.handleChange}>
                                            <option value="application">Application</option>
                                            <option value="callback">I heard back from them</option>
                                            <option value="interview">An interview</option>
                                        </select>
                                    </td>
                                    <td>
                                        <Button bsStyle="danger" onClick={() => this.deleteInteraction(i)}>Delete interaction</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="">Date of interaction</label>
                                    </td>
                                    <td>
                                        <select name="date" id={`date_${i}`} value="30" onChange={this.handleChange}>
                                            {this.getDatesArray(interaction.date).map((date, i) => {
                                                return <option key={i} value={i}>{this.props.getDateString(date)}</option>
                                            })}
                                        </select>
                                    </td>
                                </tr>
                                {interaction.followups ? interaction.followups.map((followup, j) => {
                                    return (
                                        <tr key={j}>
                                            <td>
                                                <label htmlFor="">Followup #{j + 1} date</label>
                                            </td>
                                            <td>
                                                <select name="followup" id={`followup_${i}_${j}`} value="30" onChange={this.handleChange}>
                                                    {this.getDatesArray(followup).map((date, k) => {
                                                        return <option key={k} value={k}>{this.props.getDateString(date)}</option>
                                                    })}
                                                </select>
                                            </td>
                                            <td>
                                                <Button bsStyle="danger" bsSize="small" onClick={() => this.deleteFollowup(i, j)}>Delete followup</Button>
                                            </td>
                                        </tr>
                                    )
                                }) : null}

                                {interaction.followups.length < 3 ? (
                                    <tr>
                                        <td colSpan="2">
                                            <Button bsStyle="primary" bsSize="small" onClick={() => this.addFollowup(i)}>Add followup</Button>
                                        </td>
                                    </tr>
                                ):null}
                            </tbody>
                            </Table>)
                            
                        })}
                        <div style={{marginBottom: 20 + 'px'}}>
                            <Button bsStyle="primary" onClick={this.addInteraction}>Add Interaction</Button>
                        </div>
                        <div>
                            <Button bsStyle="success" bsSize="large" type="submit">Submit</Button>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.props.handleClose}>Close</Button>
                </Modal.Footer>
            </>
        )
    }
}