import React, { Component } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import EditJobApp from './EditJobApp'
import Progress from './Progress'
import axios from 'axios'

export default class JobApp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            expanded: false,
            show: false,
            appProperties: null,
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.deleteApp = this.deleteApp.bind(this)
        this.convertDateObjects = this.convertDateObjects.bind(this)
    }

    componentWillReceiveProps = (newProps) => {
        const appProperties = this.getAppProperties(newProps.app)
        this.setState({
            appProperties
        })
    }

    async deleteApp() {

        const appId = this.props.app._id
        const user = this.props.user

        user.jobApps = user.jobApps.filter((app) => {
            return app._id !== appId
        })

        // Send to API with new data
        try {
            await axios.put(`/users/${this.props.user._id}/jobApp`, {
                user
            })
            this.props.getUserData(user._id)
        } catch (e) {
            console.error(e)
        }
        
    }

    handleClose() {
        if (this.state.show === true) this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    componentDidMount() {
        const appProperties = this.getAppProperties(this.props.app)
        
        this.setState({
            appProperties,
        })
        
    }

    getAppProperties(app) {
        const appPropertiesArray = Object.keys(app)
        const titles = {
            position: 'Position',
            company: 'Company',
            contactEmail: 'Contact Email',
            jobBoard: 'Job Board',
            postingUrl: 'Job Posting',
            postDate: 'Date Posted',
            comments: 'Comments',
        }
        const appProperties = appPropertiesArray.map((property) => {
            for (let title in titles) {
                if (title === property) {
                    let newObj = {
                        [property]: app[property],
                        title: titles[title],
                        input: property
                    }

                    if (property === 'postDate') {
                        const dateObj = new Date(newObj.postDate)
                        newObj.dateString = this.props.getDateString(dateObj)
                    }

                    return newObj
                }
            }
            let newObj = {
                [property]: app[property]
            }
            return newObj
        })
        appProperties.progressProps = this.getAppProgress(app.progress)
        return appProperties
    }

    convertDateObjects(appProgress) {

        // //Convert dates to JS Date objects
        for (let key in appProgress) {
            if (key !== 'status' && key !== '_id') {
                appProgress[key] = appProgress[key].map((property) => {
                    property.date = new Date(property.date)
                    property.followups = property.followups.map((followup) => {
                        return new Date(followup)
                    })
                    return property
                })
            }
        }
        return appProgress
    }

    isItAlmostDone(progress) {

        const status = progress.status
        if (status === 'applied' || status === 'callback' || status === 'interview') {
            let lastResponse
            lastResponse = progress.interactions[progress.interactions.length - 1]
            if (lastResponse.followups.length === 3) return true
        }

        return false
    }

    getLastActionDate(progress) {
        let lastActionDate

        const status = progress.status

        if (status === 'applied' || status === 'callback' || status === 'interview' || status === 'waitingForInterview') {
            let lastResponse
            lastResponse = progress.interactions[progress.interactions.length - 1]

            lastActionDate =
                lastResponse.followups.length > 0 ?
                    lastResponse.followups[lastResponse.followups.length - 1] :
                    lastResponse.date
        }
        return lastActionDate
    }

    getNextActionDate(lastActionDate, progress) {

        let nextActionDate

        if (lastActionDate) {

            //Have to create new object or they will both have same ref
            nextActionDate = new Date(lastActionDate.getTime())
            nextActionDate.setDate(nextActionDate.getDate() + 7)

            //Do not return a number if date has passed
            const now = new Date()

            if (nextActionDate <= now) {
                return false
            }

        }

        if (progress && progress.status === 'waitingForInterview') {
            const lastInterview = progress.interactions[progress.interactions.length - 1]

            nextActionDate = lastInterview.followups > 0 ?
                lastInterview.followups[lastInterview.followups.length - 1] :
                lastInterview.date

            const now = new Date()
            if (nextActionDate <= now) {
                return false
            }
        }
        return nextActionDate
    }

    getAppProgress = (progress) => {

        const newProgress = this.convertDateObjects(progress)
        const almostDone = this.isItAlmostDone(newProgress)
        let inProgress

        const status = newProgress.status
        if (status === 'applied' || status === 'callback' || status === 'interview' || status === 'waitingForInterview') {
            inProgress = true
        } else {
            inProgress = false
        }

        
        const lastActionDate = this.getLastActionDate(newProgress)
        const nextActionDate = this.getNextActionDate(lastActionDate, newProgress)

        if (status === 'waitingForInterview' && !nextActionDate) {
            progress.status = 'interview'
        }

        if (inProgress && almostDone && !nextActionDate) {
            progress.status = 'rejected'
        }

        return {
            progress: newProgress,
            lastActionDate: lastActionDate,
            nextActionDate: nextActionDate,
            almostDone: almostDone
        }
    }

    handleClick() {
        const expanded = !this.state.expanded

        this.setState({
            expanded
        })
    }

    render() {

        if (!this.state.appProperties) return <tr><td>There are no apps here, dawg</td></tr>

        return (
            <>
            <tr>
                <td>{this.props.index + 1}</td>
                <td>{this.props.app.position}</td>
                <td>{this.props.app.company}</td>


                    {(this.state.appProperties.progressProps.progress.status === 'applied' 
                    || this.state.appProperties.progressProps.progress.status === 'callback' 
                    || this.state.appProperties.progressProps.progress.status === 'interview')
                    && this.state.appProperties.progressProps.nextActionDate && !this.state.appProperties.progressProps.almostDone ?
                        <td>{`Send a followup email on ${this.props.getDateString(this.state.appProperties.progressProps.nextActionDate)}`}</td>
                        : null}

                    {(this.state.appProperties.progressProps.progress.status === 'applied'
                    || this.state.appProperties.progressProps.progress.status === 'callback'
                    || this.state.appProperties.progressProps.progress.status === 'interview') 
                    && !this.state.appProperties.progressProps.nextActionDate && !this.state.appProperties.progressProps.almostDone ?
                        <td>Send a followup email, ASAP!</td>
                        : null}

                    {(this.state.appProperties.progressProps.progress.status === 'applied'
                    || this.state.appProperties.progressProps.progress.status === 'callback'
                    || this.state.appProperties.progressProps.progress.status === 'interview') 
                    && this.state.appProperties.progressProps.nextActionDate && this.state.appProperties.progressProps.almostDone ?
                        <td>Wait for a response!</td>
                        : null}

                    {this.state.appProperties.progressProps.progress.status === 'waitingForInterview' && this.state.appProperties.progressProps.nextActionDate ?
                        <td>{`Interview on ${this.props.getDateString(this.state.appProperties.progressProps.nextActionDate)}`}</td>
                    : null}

                    {this.state.appProperties.progressProps.progress.status === 'keepInTouch' ?
                        <td>Keep in touch!</td>
                    : null}

                    {this.state.appProperties.progressProps.progress.status === 'rejected' ?
                        <td>Rejected</td>
                    : null}
                    {this.state.appProperties.progressProps.progress.status === 'accepted' ?
                        <td>Congratulations, you got the job!</td>
                    : null}


                <td><button onClick={this.handleClick}>{this.state.expanded ? "Collapse" : "Expand"}</button></td>
            </tr>
            {this.state.expanded 
                ? 
                    <tr>
                        <td></td>
                        <td colSpan="3">
                            <Table bordered responsive>
                                <tbody>
                                {
                                    this.state.appProperties.map((appProp, i) => {     
                                        if (appProp[appProp.input] && !appProp.postDate && !appProp.postingUrl && !appProp.contactEmail) {
                                            return (
                                                <tr key={i}>
                                                    <th>{appProp.title}:</th>
                                                    <th>{appProp[appProp.input]}</th>
                                                </tr>
                                            )
                                        }
                                        if (appProp.postDate) {
                                            return (
                                                <tr key={i}>
                                                    <th>{appProp.title}:</th>
                                                    <th>{appProp.dateString}</th>
                                                </tr>
                                            )
                                        }
                                        if (appProp.postingUrl) {
                                            return (
                                                <tr key={i}>
                                                    <th>{appProp.title}:</th>
                                                    <th><a href={appProp.postingUrl}>{appProp.postingUrl}</a></th>
                                                </tr>
                                            )
                                        }
                                        if (appProp.contactEmail) {
                                            return (
                                                <tr key={i}>
                                                    <th>{appProp.title}:</th>
                                                    <th><a href={`mailto:${appProp.contactEmail}`}>{appProp.contactEmail}</a></th>
                                                </tr>                                               
                                            )
                                        }
                                    })
                                }
                                <tr>
                                    <th colSpan="2">
                                            <Button bsStyle="primary" bsSize="small" onClick={this.handleShow}>
                                                Edit application details
                            </Button>
                                    </th>
                                </tr>
                                </tbody>
                            </Table>
                            <Modal
                                show={this.state.show}
                                onHide={this.handleClose}
                            >
                                <EditJobApp
                                    handleClose={this.handleClose}
                                    properties={this.props.app}
                                    user={this.props.user}
                                    getUserData={this.props.getUserData}
                                    getDateString={this.props.getDateString}
                                ></EditJobApp>
                            </Modal>
                            <Progress
                                progress={this.props.app.progress}
                                getDateString={this.props.getDateString}
                                handleClose={this.handleClose}
                                properties={this.props.app}
                                user={this.props.user}
                                getUserData={this.props.getUserData}
                                jobApp={this.props.app}
                                convertDateObjects={this.convertDateObjects}
                                isItAlmostDone={this.isItAlmostDone}
                                getLastActionDate={this.getLastActionDate}
                                getNextActionDate={this.getNextActionDate}
                            >
                            </Progress>

                            <Button bsStyle="danger" onClick={this.deleteApp}>
                                Delete this Application
                            </Button>
                        </td>
                    </tr> 
                : null
            }
            </>
        )
    }
}