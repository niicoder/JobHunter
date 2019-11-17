import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'datejs'
import './App.css';
import axios from 'axios'
import CustomNav from './components/CustomNav'
import Home from './components/Home'
import GoogleButton from './components/GoogleButton'

class App extends Component {
    constructor(props) {
      super(props)

      this.state = {
        user: null,
        show: false,
        error: false
      }
      this.getUserData = this.getUserData.bind(this)
    }

  googleSignOut = () => {
    if (this.state.user._id === this.state.user.googleSub) {
      this.setState({
        user: null
      })
    } else {
      var auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut().then( () => {
        this.setState({
          user: null
        })
      });
    }
  }

  authenticateGoogleId = async (id_token) => {

    const res = await axios.post('/users/token', {id_token})

    const user = res.data.data[0]    
    this.setState({
      user
    })
  }

  onFailure = () => {
    this.setState({
      error: true
    })
  }

  //Pulls in user data and sets in state
  getUserData = async (id) => {
    const res = await axios.get(`/users/${id}`)

    const user = res.data.data[0]
    this.setState({
      user
    })
  }

  //For demo purposes, this will create an account for new visitors using this model. Will delete once I add account-based login functionality
  createUserForDemo = async () => {

    const startupDate = (5).days().ago()
    const techGiantDate = (6).weeks().ago()
    const enterpriseDate = (8).weeks().ago()
    const anotherstartupDate = (3).months().ago()
    const anotherTechFirmDate = (6).weeks().ago()
    const dreamJobDate = (6).weeks().ago()    

    const user = {
      firstName: 'User',
      lastName: 'At Large',
      userName: 'user_atlarge',
      password: 'password',
      email: 'user@useremail.com',
      jobApps: [
        {
          position: "Front End Developer",
          company: "Very Cool Startup",
          contactEmail: "recruiter@coolstartup.com",
          contactFirstName: "Sparky",
          contactLastName: "Zuckerberg",
          progress: {
            status: 'applied',
            interactions: [
              {
                kind: 'application',
                date: startupDate,
                followups: [
                  new Date(startupDate).addDays(7)
                ]
              }
            ]
          }
        },
        {
          position: "Web Developer",
          company: "Big Tech Giant",
          contactEmail: "recruiter@bigtech.com",
          contactFirstName: "Bill",
          contactLastName: "Gates",
          postDate: new Date('February 20 2019'),
          progress: {
            status: 'waitingForInterview',
            interactions: [
              {
                kind: 'application',
                date: new Date(techGiantDate).addDays(14),
                followups: [
                  new Date(techGiantDate).addDays(21),
                  new Date(techGiantDate).addDays(28),
                  new Date(techGiantDate).addDays(35)
                ]
              },
              {
                kind: 'callback',
                date: new Date(techGiantDate).addDays(36),
              },
              {
                kind: 'interview',
                date: new Date(techGiantDate).addDays(55),
              }
            ]
          }
        },
        {
          position: "Full Stack Developer",
          company: "Exciting Enterprise",
          contactEmail: "jerry@enterprise.co",
          contactFirstName: "Jerry",
          contactLastName: "Enterprise",
          postDate: enterpriseDate,
          progress: {
            status: 'interview',
            interactions: [
              {
                kind: 'application',
                date: new Date(enterpriseDate).addDays(7),
                followups: [
                  new Date(enterpriseDate).addDays(14),
                  new Date(enterpriseDate).addDays(21),
                  new Date(enterpriseDate).addDays(28)
                ]
              },
              {
                kind: 'callback',
                date: new Date(enterpriseDate).addDays(34),
              },
              {
                kind: 'interview',
                date: new Date(enterpriseDate).addDays(40),
                followups: [
                  new Date(enterpriseDate).addDays(47),
                  new Date(enterpriseDate).addDays(54)
                ]
              }
            ]
          }
        },
        {
          position: "Another Developer Position",
          company: "Another Startup",
          contactEmail: "recruiter@anotherstartup.com",
          contactFirstName: "Jim",
          contactLastName: "Zuckerberg",
          progress: {
            status: 'rejected',
            interactions: [
              {
                kind: 'application',
                date: anotherstartupDate,
                followups: [
                  new Date(anotherstartupDate).addDays(7),
                  new Date(anotherstartupDate).addDays(14),
                  new Date(anotherstartupDate).addDays(21)
                ]
              }
            ]
          }
        },
        {
          position: "Back End Developer",
          company: "Another Tech Firm",
          contactEmail: "recruiter@techfirm.com",
          contactFirstName: "Bob",
          contactLastName: "Gates",
          postDate: anotherTechFirmDate,
          progress: {
            status: 'keepInTouch',
            interactions: [
              {
                kind: 'application',
                date: new Date(anotherTechFirmDate).addDays(7),
                followups: [
                  new Date(anotherTechFirmDate).addDays(14),
                  new Date(anotherTechFirmDate).addDays(21),
                  new Date(anotherTechFirmDate).addDays(28)
                ]
              },
              {
                kind: 'callback',
                date: new Date(anotherTechFirmDate).addDays(35),
              }
            ]
          }
        },
        {
          position: "Dream Job",
          company: "Cool Company",
          contactEmail: "jerry@cool.co",
          contactFirstName: "Very",
          contactLastName: "Cool",
          postDate: new Date(dreamJobDate).addDays(7),
          progress: {
            status: 'accepted',
            interactions: [
              {
                kind: 'application',
                date: new Date(dreamJobDate).addDays(14),
                followups: [
                  new Date(dreamJobDate).addDays(21),
                ]
              },
              {
                kind: 'callback',
                date: new Date(dreamJobDate).addDays(28),
              },
              {
                kind: 'interview',
                date: new Date(dreamJobDate).addDays(35),
                followups: [
                  new Date(dreamJobDate).addDays(42)
                ]
              }
            ]
          }
        }
      ]
    }
    //Posting demo user to database
    try {
      axios.post('/users', {
        user
      }).then((res) => {
        const demoUserId = res.data.data[0]._id
        //Loading new data, which will trigger a login into demo user account
        window.localStorage.setItem('jobhunterId', demoUserId)
        window.localStorage.setItem('jobhunterUpdate', 1)
        this.getUserData(demoUserId)
      })
    } catch (e) {
      console.error(e)
    }

  }


  signInAsGuest = () => {

    const jobhunterId = window.localStorage.getItem('jobhunterId')
    const update = window.localStorage.getItem('jobhunterUpdate')
    
    if (jobhunterId && update === "1") {
     this.getUserData(jobhunterId)
    } else {
     this.createUserForDemo()
    }

  }

  handleClose = () => {
    this.setState({
      show: false
    })
  }

  onSuccess = (googleUser) => {

    console.log(googleUser)
    var id_token = googleUser.getAuthResponse().id_token;
    this.authenticateGoogleId(id_token)

    this.setState({
      error: false
    })

  }

  render() {

    return (
      <Router>
        <div className="App">

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>JobHunter Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <p>JobHunter is a prototype for a web application that will help users organize their job search and keep track of job applications and recruitments.</p> 
            <p>Feel free to play around with the app, but do not input any confidential or sensitive information. Data that you input will be stored via MongoDB and returned to you when you return to the site on the same browser.</p>
              <p>For more information on JobHunter, click <a href="https://github.com/alanrandolphjones/jobhunter">HERE</a>.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={this.handleClose}>Try JobHunter!</Button>
            </Modal.Footer>
          </Modal>

          <CustomNav 
            googleSignOut={this.googleSignOut} 
            user={this.state.user}
          />

          <Route 
            exact
            path="/" 
            render={ () => (
              this.state.user ?
                <Redirect 
                  to={`/user/${this.state.user.userName}`}
                />
              :
                <Redirect 
                  to="/login" 
                />
            )}
          />

          <Route 
            path="/user/:userId"
            render={ () => (
              this.state.user ?
                <Home
                  user={this.state.user}
                  getUserData={this.getUserData}
                />
              :
                <Redirect 
                  to="/login"
                />
            )}
          />

          <Route 
            path="/login"
            render={ () => (
              this.state.user ?
              <Redirect 
                to={`/user/${this.state.user.userName}`}
              />
            :
              <div className="sign-in">
                <h2>Sign in with Google or sign in as guest</h2>
                {this.state.error ? 
                  <div className="err">Google signin failed! Please check that you have enabled third-party cookies in your browser!</div>
                :null}
                <div className="sign-in-container">
                  <GoogleButton 
                    className="sign-in-child" 
                    onSuccess={this.onSuccess} 
                    onFailure={this.onFailure}
                  />
                  <Button className="sign-in-child" onClick={this.signInAsGuest}>Sign in as guest</Button>
                </div>
              </div>
            )}
          />

        </div>

      </Router>
    );
    
  }
}

export default App;
