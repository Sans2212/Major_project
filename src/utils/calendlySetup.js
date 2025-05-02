// This is a helper script to set up Calendly event types
// You'll need to run this after creating your Calendly account

const eventTypes = {
  plans: [
    {
      name: "Lite Plan Call",
      duration: 60,
      description: "Monthly mentoring call for Lite Plan subscribers",
      eventType: "lite-plan"
    },
    {
      name: "Standard Plan Call",
      duration: 60,
      description: "Monthly mentoring call for Standard Plan subscribers",
      eventType: "standard-plan"
    },
    {
      name: "Pro Plan Call",
      duration: 60,
      description: "Monthly mentoring call for Pro Plan subscribers",
      eventType: "pro-plan"
    }
  ],
  sessions: [
    {
      name: "Introductory Call",
      duration: 15,
      description: "15-minute introductory call to discuss mentoring needs",
      eventType: "intro-call"
    },
    {
      name: "Ask Me Anything",
      duration: 45,
      description: "45-minute Q&A session with the mentor",
      eventType: "ama-session"
    },
    {
      name: "Mock Interview",
      duration: 60,
      description: "60-minute technical mock interview",
      eventType: "mock-interview"
    }
  ]
};

// Instructions for setting up Calendly:
console.log(`
Calendly Setup Instructions:

1. Log in to your Calendly account
2. Go to Event Types
3. Create the following event types:

Plans:
${eventTypes.plans.map(plan => `
- ${plan.name}
  Duration: ${plan.duration} minutes
  Description: ${plan.description}
  Event Type: ${plan.eventType}
`).join('\n')}

Sessions:
${eventTypes.sessions.map(session => `
- ${session.name}
  Duration: ${session.duration} minutes
  Description: ${session.description}
  Event Type: ${session.eventType}
`).join('\n')}

4. After creating each event type, note down the event type ID from the URL
5. Update the eventType values in src/data/mentors.js with the actual event type IDs
`); 