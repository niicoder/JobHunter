import React, { Component } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import ProgressPopup from './ProgressPopup'
import ChangeStatusPopup from './ChangeStatusPopup'
import EditProgress from './EditProgress'

export default class Progress extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            progress: null,
            nextActionDate: null,
            progressShow: false,
            lastActionDate: null,
            almostDone: false,
            editshow: false
        }

        this.addInteraction = this.addInteraction.bind(this)
        this.updateDatabase = this.updateDatabase.bind(this)
        this.addFollowup = this.addFollowup.bind(this)
        this.handleProgressClose = this.handleProgressClose.bind(this);
        this.handleProgressShow = this.handleProgressShow.bind(this);
        this.handleChangeStatusClose = this.handleChangeStatusClose.bind(this)
        this.handleChangeStatusShow = this.handleChangeStatusShow.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
        this.handleEditShow = this.handleEditShow.bind(this)
        this.handleEditClose = this.handleEditClose.bind(this)
    }

    handleEditShow() {
        this.setState({editShow: true})
    }

    handleEditClose() {
        this.setState({ editShow: false })
    }

    handleProgressClose() {
        this.setState({ progressShow: false });
    }

    handleProgressShow() {
        this.setState({ progressShow: true });
    }

    handleChangeStatusClose() {
        this.setState({ changeStatusShow: false });
    }

    handleChangeStatusShow() {
        this.setState({ changeStatusShow: true });
    }

    componentDidMount() {
        const progress = this.props.convertDateObjects(this.props.progress)
        const almostDone = this.props.isItAlmostDone(progress)
        let inProgress

        const status = progress.status
        if (status === 'applied' || status === 'callback' || status === 'interview' || status === 'waitingForInterview') {
            inProgress = true
        } else {
            inProgress = false
        }

        const lastActionDate = this.props.getLastActionDate(progress)
        const nextActionDate = this.props.getNextActionDate(lastActionDate, progress)
        
        if (inProgress && almostDone && !nextActionDate) {
            progress.status = 'rejected'
        }

        this.setState({
            progress,
            lastActionDate,
            nextActionDate,
            almostDone
        })
    }

    componentWillReceiveProps = (newProps) => {
        const progress = this.props.convertDateObjects(newProps.progress)
        const almostDone = this.props.isItAlmostDone(progress)
        let inProgress

        const status = progress.status
        if (status === 'applied' || status === 'callback' || status === 'interview' || status === 'waitingForInterview') {
            inProgress = true
        } else {
            inProgress = false
        }

        const lastActionDate = this.props.getLastActionDate(progress)
        const nextActionDate = this.props.getNextActionDate(lastActionDate, progress)

        if (inProgress && almostDone && !nextActionDate) {
            progress.status = 'rejected'
        }

        this.setState({
            progress,
            lastActionDate,
            nextActionDate,
            almostDone
        })
    }

    async updateDatabase(progress) {
        //Get jobApp from props
        const jobApp = this.props.jobApp

        //Add progress to jobApp
        jobApp.progress = progress

        //Add jobApp to user
        const user = this.props.user

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

        // Send to API with new data
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

    changeStatus(newStatus) {
        const progress = this.state.progress
        progress.status = newStatus

        this.updateDatabase(progress)
    }

    addInteraction(date, interactionType, newStatus) {
        const progress = this.state.progress
        progress.status = newStatus
        const app = {}
        app.date = date
        app.kind = interactionType
        progress.interactions.push(app)

        const lastActionDate = date
        const nextActionDate = this.props.getNextActionDate(lastActionDate)

        this.setState({
            nextActionDate,
            lastActionDate
        })

        this.updateDatabase(progress)
    }

    addFollowup(followup) {
        //Get Progress
        const progress = this.state.progress
        const status = progress.status
        const lastResponse = progress.interactions[progress.interactions.length - 1]

        //Add new followup to array
        lastResponse.followups.push(followup)
        //Change nextActionDate in state
        const lastActionDate = this.props.getLastActionDate(progress)
        const nextActionDate = this.props.getNextActionDate(lastActionDate)

        this.setState({
            nextActionDate,
            lastActionDate
        })

        //Update DB
        this.updateDatabase(progress)
    }

    render() {
        if (!this.state.progress) return <p>Data Missing</p>

        if (this.state.progress.status === 'unapplied') return (
                <>
                <Modal
                    show={this.state.changeStatusShow}
                    onHide={this.handleChangeStatusClose}
                >
                    <ChangeStatusPopup
                        handleChangeStatusClose={this.handleChangeStatusClose}
                        lastActionDate={this.state.lastActionDate}
                        getDateString={this.props.getDateString}
                        addInteraction={this.addInteraction}
                        status={this.state.progress.status}
                    ></ChangeStatusPopup>
                </Modal>
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>Next Steps:</th>
                            <th>Hurry up and apply!</th>
                            <th><Button bsStyle="success" bsSize="small"
                                onClick={this.handleChangeStatusShow}>Done! What's next?</Button></th>
                        </tr>
                    </thead>
                </Table>
                </>
            )

        if (this.state.progress.status !== 'unapplied') return (
            <>
            <Modal
                show={this.state.changeStatusShow}
                onHide={this.handleChangeStatusClose}
            >
                <ChangeStatusPopup
                    handleChangeStatusClose={this.handleChangeStatusClose}
                    lastActionDate={this.state.lastActionDate}
                    getDateString={this.props.getDateString}
                    addInteraction={this.addInteraction}
                    status={this.state.progress.status}
                ></ChangeStatusPopup>
            </Modal>
            <Modal
                show={this.state.progressShow}
                onHide={this.handleProgressClose}
            >
                <ProgressPopup
                    handleClose={this.handleProgressClose}
                    addFollowup={this.addFollowup}
                    lastActionDate={this.state.lastActionDate}
                    getDateString={this.props.getDateString}
                ></ProgressPopup>
            </Modal>
            <Modal
                show={this.state.editShow}
                onHide={this.handleEditClose}
            >
                <EditProgress
                    interactions={this.state.progress.interactions}
                    status={this.state.progress.status}
                    handleClose={this.handleEditClose}
                    getDateString={this.props.getDateString}
                    getUserData={this.props.getUserData}
                    user={this.props.user}
                    jobApp={this.props.jobApp}
                ></EditProgress>
            </Modal>
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>Next Steps:</th>

                        {this.state.progress.status === 'applied' && this.state.nextActionDate && !this.state.almostDone ? 
                            <>
                                <th>{`If you don't hear from a recruiter, send a followup email on ${this.props.getDateString(this.state.nextActionDate)}`}</th>
                                    <th><Button bsStyle="success" bsSize="small" onClick={this.handleChangeStatusShow}>I heard back!</Button></th>
                            </>
                        : null}

                        {this.state.progress.status === 'applied' && !this.state.nextActionDate && !this.state.almostDone ? 
                            <>
                                <th>Haven't heard back? Send a followup email!</th>
                                <th><Button bsStyle="success" bsSize="small" onClick={this.handleProgressShow}>Done! What's next?</Button></th>
                            </>
                        : null}

                        {this.state.progress.status === 'applied' && this.state.nextActionDate && this.state.almostDone ?
                            <>
                                <th colSpan="2">{`If you don't hear from a recruiter by ${this.props.getDateString(this.state.nextActionDate)}, you should move on`}</th>
                            </>
                        : null}

                        {this.state.progress.status === 'callback' && this.state.nextActionDate && !this.state.almostDone  ?
                            <>
                                <th>{`If you don't hear from them again soon, send a followup email on ${this.props.getDateString(this.state.nextActionDate)}`}</th>
                                <th><Button bsStyle="success" bsSize="small" onClick={this.handleChangeStatusShow}>I heard back!</Button></th>
                            </>
                        : null}

                        {this.state.progress.status === 'callback' && !this.state.nextActionDate && !this.state.almostDone  ?
                            <>
                                <th>Haven't heard back? Send a followup email!</th>
                                    <th><Button bsStyle="success" bsSize="small" onClick={this.handleProgressShow}>Done! What's next?</Button></th>
                            </>
                        : null}

                        {this.state.progress.status === 'callback' && this.state.nextActionDate && this.state.almostDone ?
                            <>
                                <th colSpan="2">{`If you don't hear from them by ${this.props.getDateString(this.state.nextActionDate)}, you should move on`}</th>
                            </>
                        : null}

                        {this.state.progress.status === 'interview' && this.state.nextActionDate && !this.state.almostDone  ?
                            <>
                                <th>{`If you don't hear from them again soon, send a followup email on ${this.props.getDateString(this.state.nextActionDate)}`}</th>
                                <th><Button bsStyle="success" bsSize="small" onClick={this.handleChangeStatusShow}>I heard back!</Button></th>
                            </>
                        : null}

                        {this.state.progress.status === 'interview' && !this.state.nextActionDate && !this.state.almostDone  ?
                            <>
                                <th>Haven't heard back? Send a followup email!</th>
                                    <th><Button bsStyle="success" bsSize="small" onClick={this.handleProgressShow}>Done! What's next?</Button></th>
                            </>
                        : null}

                        {this.state.progress.status === 'interview' && this.state.nextActionDate && this.state.almostDone ?
                            <>
                                <th colspan="2">{`If you don't hear back from them by ${this.props.getDateString(this.state.nextActionDate)}, you should move on`}</th>
                            </>
                        : null}

                        {this.state.progress.status === 'waitingForInterview' && this.state.nextActionDate ?
                            <>
                                    <th>{`You have an interview on ${this.props.getDateString(this.state.nextActionDate)}`}</th>
                            </>
                        : null}
                    </tr>
                </thead>
            </Table>
            <Table bordered responsive key="key">
                <tbody>
                    {this.state.progress.interactions.map((app, i) => {
                        const jsxObject = []
                        let interaction
                        let followups
                        
                        if (app.kind === 'application') {
                            interaction = (
                                <tr key={i}>
                                    <th>Applied on:</th>
                                    <th>{this.props.getDateString(app.date)}</th>
                                </tr>
                            )
                            jsxObject.push(interaction)
    
                            followups = app.followups ? app.followups.map((followup, j) => {
                                return (
                                    <tr key={j}>
                                        <td>{`Followup #${j + 1} to application:`}</td>
                                        <td>{this.props.getDateString(followup)}</td>
                                    </tr>
                                )
                            }) : null
                                                    
                            jsxObject.push(followups)
                        }

                        if (app.kind === 'callback') {
                            interaction = (
                                <tr key={i}>
                                    <th>Heard back from them on:</th>
                                    <th>{this.props.getDateString(app.date)}</th>
                                </tr>
                            )
                            jsxObject.push(interaction)

                            followups = app.followups ? app.followups.map((followup, j) => {
                                return (
                                    <tr key={j}>
                                        <td>{`Followup #${j + 1} from the last time I heard:`}</td>
                                        <td>{this.props.getDateString(followup)}</td>
                                    </tr>
                                )
                            }) : null

                            jsxObject.push(followups)
                        }

                        if (app.kind === 'interview') {
                            interaction = (
                                <tr key={i}>
                                    <th>Interview scheduled on:</th>
                                    <th>{this.props.getDateString(app.date)}</th>
                                </tr>
                            )
                            jsxObject.push(interaction)

                            followups = app.followups ? app.followups.map((followup, j) => {
                                return (
                                    <tr key={j}>
                                        <td>{`Followup #${j + 1} to interview:`}</td>
                                        <td>{this.props.getDateString(followup)}</td>
                                    </tr>
                                )
                            }) : null

                            jsxObject.push(followups)
                        }

                        return jsxObject
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan="3">
                            <Button bsStyle="primary" bsSize="small" onClick={this.handleEditShow}>
                                Edit progress detail
                            </Button>
                        </th>
                    </tr>
                </tfoot>
            </Table>
            </>
        )
    }
}