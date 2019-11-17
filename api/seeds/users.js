// Require our user model soe we can create new users
const { User, JobApp, Progress, Interaction } = require('../models/User')

// Create an array to store our fake users
const users = []

//Create a fake user
const alan = new User({
    firstName: 'Alan', 
    lastName: 'Jones',
    userName: 'alan_jones',
    password: 'password',
    email: 'jones.alan21@gmail.com',
    googleSub: 'alanfakesub'
})

//One more time!
const rulo = new User({
    firstName: 'Rulo',
    lastName: 'Jones',
    userName: 'rulo_jones',
    password: 'password',
    email: 'rulo@gmail.com',
    googleSub: 'rulofakesub'
})

const alanJobApps = []

const startup = new JobApp({
    position: "Front End Developer",
    company: "Very Cool Startup",
    contactEmail: "recruiter@coolstartup.com",
    contactFirstName: "Mark",
    contactLastName: "Zuckerberg",
})

const startupProgress = new Progress({
    status: "unapplied",
})

startup.progress = startupProgress

alanJobApps.push(startup)

const bigCorp = new JobApp({
    position: "Email Developer",
    company: "Big Corporation",
    contactEmail: "recruiter@bigcorp.com",
    contactFirstName: "Bill",
    contactLastName: "Gates",
    postingUrl: 'http://www.linkedin.com/jobposting',
    postDate: new Date('November 14, 2018'),
})

const bigCorpProgress = new Progress({
    status: "applied",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('January 15 2019'),
            info: "email to recruiter",
            followups: [
                new Date("January 22 2019")
            ]
        })
    ]
})

bigCorp.progress = bigCorpProgress

alanJobApps.push(bigCorp)

const dreamCompany = new JobApp({
    position: "Full Stack Developer",
    company: "Dream Company",
    contactEmail: "jerry@dream.co",
    contactFirstName: "Jerry",
    contactLastName: "Dreamer",
    postingUrl: 'http://www.linkedin.com/jobposting2',
    postDate: new Date('November 1, 2018'),
})

const dreamCompanyProgress = new Progress({
    status: "applied",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 20 2018'),
            followups: [
                new Date("December 27 2018"),
                new Date("January 4 2019"),
                new Date("February 17 2019")
            ]
        })
    ]
})

dreamCompany.progress = dreamCompanyProgress

alanJobApps.push(dreamCompany)

const anotherJob = new JobApp({
    position: "Web Developer",
    company: "Another Company",
    contactEmail: "someguy@another.co",
    contactFirstName: "Some",
    contactLastName: "Recruiter",
    postingUrl: 'http://www.monster.com/jobposting',
    postDate: new Date('October 15, 2018'),
})

const anotherJobProgress = new Progress({
    status: "applied",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 20 2018'),
            followups: [
                new Date("December 27 2018"),
                new Date("January 4 2019"),
                new Date("January 11 2019")
            ],
        })
    ]
})

anotherJob.progress = anotherJobProgress

alanJobApps.push(anotherJob)

const fourthJob = new JobApp({
    position: "Web Developer 4",
    company: "Another Company Again",
    contactEmail: "someguy@another.co",
    contactFirstName: "Some",
    contactLastName: "Recruiter",
    postingUrl: 'http://www.monster.com/jobposting',
    postDate: new Date('October 15 2018'),
})

const fourthJobProgress = new Progress({
    status: "callback",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 2 2018'),
            followups: [
                new Date("December 9 2018"),
                new Date("December 16 2018"),
                new Date("December 17 2018")
            ]
        }),
        new Interaction({
            kind: 'callback',
            date: new Date("December 20 2018"),
        })
    ]
})

fourthJob.progress = fourthJobProgress

alanJobApps.push(fourthJob)

const fifthJob = new JobApp({
    position: "Web Developer 5",
    company: "Another Company 5",
    contactEmail: "5@another.co",
    contactFirstName: "5",
    contactLastName: "5",
    postingUrl: 'http://www.monster.com/jobposting',
    postDate: new Date('October 15, 2018'),
})

const fifthJobProgress = new Progress({
    status: "interview",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 2 2018'),
            followups: [
                new Date("December 9 2018"),
                new Date("December 16 2018"),
                new Date("December 17 2018")
            ]
        }),
        new Interaction({
            kind: 'callback',
            date: new Date("December 20 2018"),
        }),
        new Interaction({
            kind: 'interview',
            date: new Date("January 5 2019"),
            followups: [
                new Date("January 6 2019")
            ]
        })
    ]
})

fifthJob.progress = fifthJobProgress

alanJobApps.push(fifthJob)

const rejectedJob = new JobApp({
    position: "Rejected Developer 5",
    company: "Rejected Company 5",
    contactEmail: "Rejected@another.co",
    contactFirstName: "Rejected",
    contactLastName: "Rejected",
    postingUrl: 'http://www.monster.com/jobposting',
    postDate:new Date('October 15, 2018'),
})

const rejectedJobProgress = new Progress({
    status: "rejected",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 2 2018'),
            followups: [
                new Date("December 9 2018"),
                new Date("December 16 2018"),
                new Date("December 17 2018")
            ]
        }),
        new Interaction({
            kind: 'callback',
            date: new Date("December 20 2018"),
        }),
        new Interaction({
            kind: 'interview',
            date: new Date("January 5 2019"),
            info: 'in person',
            followups: [
                new Date("January 6 2019")
            ]
        })
    ] 
})

rejectedJob.progress = rejectedJobProgress

alanJobApps.push(rejectedJob)

const laterJob = new JobApp({
    position: "Later Developer 5",
    company: "Later Company 5",
    contactEmail: "later@another.co",
    contactFirstName: "Later",
    contactLastName: "Later",
    postingUrl: 'http://www.monster.com/jobposting',
    postDate:new Date('October 15, 2018'),
})

const laterJobProgress = new Progress({
    status: "keepInTouch",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 2 2018'),
            followups: [
                new Date("December 9 2018"),
                new Date("December 16 2018"),
                new Date("December 17 2018")
            ]
        }),
        new Interaction({
            kind: 'callback',
            date: new Date("December 20 2018"),
        }),
        new Interaction({
            kind: 'interview',
            date: new Date("January 5 2019"),
            info: "phone",
            followups: [
                new Date("January 6 2019")
            ]
        })
    ],
})

laterJob.progress = laterJobProgress

alanJobApps.push(laterJob)

const acceptedJob = new JobApp({
    position: "Accepted Developer 5",
    company: "Accepted Company 5",
    contactEmail: "Accepted@another.co",
    contactFirstName: "Accepted",
    contactLastName: "Accepted",
    postingUrl: 'http://www.monster.com/jobposting',
    postDate:new Date('October 15, 2018'),
})

const acceptedJobProgress = new Progress({
    status: "accepted",
    interactions: [
        new Interaction({
            kind: 'application',
            date: new Date('December 2 2018'),
            followups: [
                new Date("December 9 2018"),
                new Date("December 16 2018"),
                new Date("December 17 2018")
            ]
        }),
        new Interaction({
            kind: 'callback',
            date: new Date("December 20 2018"),
            followups: new Date("December 29 2018")
        }),
        new Interaction({
            kind: 'interview',
            date: new Date("January 5 2019"),
            info: 'in person',
            followups: [
                new Date("January 6 2019")
            ]
        })
    ]
})

acceptedJob.progress = acceptedJobProgress

alanJobApps.push(acceptedJob)

alan.jobApps = alanJobApps

users.push(alan)

users.push(rulo)

module.exports = users