## JobHunter

JobHunter is a prototype for a web application that will help users organize their job search and keep track of job applications and recruitments.
            
Feel free to play around with the app, but do not input any confidential or sensitive information. Data that you input will be stored via MongoDB and returned to you when you return to the site on the same browser. If you clear the local storage on your browser, a new account will be created.

## How It Works

Data is compiled by the user and hosted via MongoDB. You may sign in with a Google account or view the app as a 'guest,' which will show you pre-populated data and illustrate the possibilities and flexibility of the app.

For the guest account, the app will create a user with pre-populated data the first time a user visits the website. On subsequent visits, the app will detect a unique ID stored in the browser and automatically sign you in to the account that was previously created.

The app will allow you to create new job applications and input data unique to them. From there, you can create 'interactions' -- applications, callbacks and interviews -- that you will make during the recruitment process. On a weekly basis after each interaction, the app will tell you to send a followup, using node-schedule to keep track of the date.

After the user makes three followups to an interaction, the status up the job application will change to 'rejected' and move to the 'completed' tab.

## Specs

JobHunter was made with: 

- [React](https://reactjs.org/)
- [Create React App](https://github.com/facebook/create-react-app) 
- [React Bootstrap](https://react-bootstrap.github.io/) 
- [Lodash](https://lodash.com/)
- [axios](https://github.com/axios/axios)
- [node-schedule](https://github.com/node-schedule/node-schedule)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/en/)

# Wishlist

- Improved validation on form submissions
- Improved styling
