import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class ProgressPopup extends Component {
    constructor() {
        super()

        this.state = {
            selectedDate: 0,
            dates: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.submitFollowup = this.submitFollowup.bind(this)
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    getDiffDays(firstDate, secondDate) {

        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        return diffDays
    }

    componentDidMount() {

        const today = new Date()
        const dates = []
        const lastActionDate = this.props.lastActionDate

        if (!lastActionDate) return false
        const diffDays = this.getDiffDays(lastActionDate, today)

        for (let i = 0; i < diffDays; i++) {

            //Creating new Date object to prevent unintended modification of lastActionDay
            const steadyDate = new Date(lastActionDate.getTime())
            const newDate = new Date(steadyDate.setDate(steadyDate.getDate() + i))
            
            dates.push(newDate)
        }
        const selectedDate = dates.length - 1

        this.setState({
            selectedDate,
            dates
        })
    }

    // autoUpdate() {

    // }

    leapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    submitFollowup(e) {
        e.preventDefault()

        const followUpDate = this.state.dates[this.state.selectedDate]

        this.props.addFollowup(followUpDate)
        this.props.handleClose()

    }

    render() {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>When did you send the followup?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.submitFollowup}>
                        <select name="" id="selectedDate" value={this.state.selectedDate} onChange={this.handleChange}>
                            {this.state.dates.map((date, i) => {
                                return <option key={i} value={i}>{this.props.getDateString(date)}</option>
                            })}
                        </select>
                        <Button type="submit">Submit</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.handleClose}>Close</Button>
                </Modal.Footer>
            </>
        )
    }
}