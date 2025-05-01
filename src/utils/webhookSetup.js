// This script provides instructions for setting up Calendly webhooks
// Share this with your friend who's developing the video call system

const webhookConfig = {
  events: [
    "invitee.created",
    "invitee.canceled",
    "event_reminder"
  ],
  webhookUrl: "YOUR_VIDEO_CALL_SYSTEM_WEBHOOK_URL", // Replace with actual webhook URL
  signingKey: "YOUR_WEBHOOK_SIGNING_KEY" // Replace with actual signing key
};

console.log(`
Calendly Webhook Setup Instructions for Video Call Integration:

1. In your Calendly account:
   - Go to Integrations
   - Select Webhooks
   - Click "Add Webhook"

2. Configure the webhook:
   - URL: ${webhookConfig.webhookUrl}
   - Events to listen for:
     ${webhookConfig.events.map(event => `- ${event}`).join('\n     ')}
   - Signing Key: ${webhookConfig.signingKey}

3. Webhook Payload Structure:
   {
     "event": "invitee.created",
     "time": "2024-03-20T15:30:00Z",
     "payload": {
       "event_type": {
         "uuid": "EVENT_TYPE_UUID",
         "kind": "One-on-One",
         "slug": "event-type-slug",
         "name": "Event Name",
         "duration": 30,
         "owner": {
           "type": "users",
           "uuid": "USER_UUID"
         }
       },
       "event": {
         "uuid": "EVENT_UUID",
         "assigned_to": ["USER_EMAIL"],
         "extended_assigned_to": [
           {
             "name": "User Name",
             "email": "user@example.com"
           }
         ],
         "start_time": "2024-03-20T15:30:00Z",
         "start_time_pretty": "3:30pm - Wednesday, March 20, 2024",
         "invitee_start_time": "2024-03-20T15:30:00Z",
         "invitee_start_time_pretty": "3:30pm - Wednesday, March 20, 2024",
         "end_time": "2024-03-20T16:00:00Z",
         "end_time_pretty": "4:00pm - Wednesday, March 20, 2024",
         "invitee_end_time": "2024-03-20T16:00:00Z",
         "invitee_end_time_pretty": "4:00pm - Wednesday, March 20, 2024",
         "created_at": "2024-03-19T10:00:00Z",
         "location": null,
         "canceled": false,
         "canceler_name": null,
         "cancel_reason": null,
         "canceled_at": null
       },
       "invitee": {
         "uuid": "INVITEE_UUID",
         "first_name": "John",
         "last_name": "Doe",
         "name": "John Doe",
         "email": "john@example.com",
         "text_reminder_number": null,
         "timezone": "America/New_York",
         "created_at": "2024-03-19T10:00:00Z",
         "is_reschedule": false,
         "payments": [],
         "canceled": false,
         "canceler_name": null,
         "cancel_reason": null,
         "canceled_at": null
       },
       "questions_and_answers": [
         {
           "question": "What would you like to discuss?",
           "answer": "Career advice"
         }
       ],
       "questions_and_responses": {
         "1_question": "What would you like to discuss?",
         "1_response": "Career advice"
       },
       "tracking": {
         "utm_campaign": null,
         "utm_source": null,
         "utm_medium": null,
         "utm_content": null,
         "utm_term": null,
         "salesforce_uuid": null
       },
       "old_event": null,
       "old_invitee": null,
       "new_event": null,
       "new_invitee": null
     }
   }

4. Implementation Steps:
   - Set up a webhook endpoint in your video call system
   - Verify the webhook signature using the signing key
   - Parse the event payload
   - Create video call links based on the event details
   - Send confirmation emails with video call details
   - Handle cancellations and reschedules

5. Security Considerations:
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Implement rate limiting
   - Log all webhook events for debugging
`); 