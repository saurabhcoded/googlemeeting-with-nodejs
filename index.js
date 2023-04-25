import fs from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const CALENDAR_PATH = path.join(process.cwd(), 'calendar.json');

const loadSavedCredentialsIfExist = async () => {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

const saveCredentials = async (client) => {
    const content = await fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_id,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFileSync(TOKEN_PATH, payload);
}

const authorize = async () => {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH
    });
    console.log({ client })
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

const event = {
    'summary': 'Govardhan Learning CLoud',
    'location': 'Address',
    'description': 'A chance to hear more about Govardhan Learning CLoud products.',
    'start': {
        'dateTime': '2023-04-07T18:00:00',
        'timeZone': 'Asia/Calcutta',
    },
    'end': {
        'dateTime': '2023-04-07T19:00:00',
        'timeZone': 'Asia/Calcutta',
    },
    'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=1'
    ],
    'attendees': [
        { 'email': 'saurabhcoded@gmail.com' },
    ],
    'reminders': {
        'useDefault': true,
    },
};

const listEvents = async (auth) => {
    const calendar = google.calendar({ version: 'v3', auth });
    // const res = await calendar.events.list({
    //     calendarId: 'primary',
    //     timeMin: new Date().toISOString(),
    //     maxResults: 10,
    //     singleEvents: true,
    //     orderBy: 'startTime'
    // });
    // const events = res.data.items;
    // if (!events || events.length == 0) {
    //     console.log("No Upcoming events found.");
    //     return
    // }
    // console.log('Upcoming 10 events');
    // events.map((event, i) => {
    //     const start = event.start.dateTime || event.start.date;
    //     console.log(`${start}-${event.summary}`, event.htmlLink);
    // });
    // create Events 
    // calendar.events.insert({
    //     auth: auth,
    //     calendarId: 'primary',
    //     resource: event
    // }, (err, event) => {
    //     if (err) {
    //         console.log('There was an error contacting the calendar service:' + err);
    //         return;
    //     }
    //     fs.writeFileSync(CALENDAR_PATH, JSON.stringify(event.data))
    //     console.log('Event created :%s', event);
    // })
    // const eventPatch = {
    //     conferenceData: {
    //         createRequest: { requestId: "7qxalsvy0e" }
    //     }
    // };
    // try {
    //     calendar.events.patch({
    //         calendarId: 'primary',
    //         eventId: "p4fqaea9jtjke3jsc11n31jrgc",
    //         resource: eventPatch,
    //         sendNotifications: true,
    //         conferenceDataVersion: 1
    //     })
    // } catch (error) {
    //     console.log("ERROR:", error)
    // }

}
authorize().then(listEvents).catch(console.error);