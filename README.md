# Covey.Town

Covey.Town provides a virtual meeting space where different groups of people can have simultaneous video calls, allowing participants to drift between different conversations, just like in real life.
Covey.Town was built for Northeastern's [Spring 2021 software engineering course](https://neu-se.github.io/CS4530-CS5500-Spring-2021/), and is designed to be reused across semesters.
You can view our reference deployment of the app at [app.covey.town](https://app.covey.town/), and our project showcase ([Fall 2022](https://neu-se.github.io/CS4530-Fall-2022/assignments/project-showcase), [Spring 2022](https://neu-se.github.io/CS4530-Spring-2022/assignments/project-showcase), [Spring 2021](https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase)) highlight select student projects.

![Covey.Town Architecture](docs/covey-town-architecture.png)

The figure above depicts the high-level architecture of Covey.Town.
The frontend client (in the `frontend` directory of this repository) uses the [PhaserJS Game Library](https://phaser.io) to create a 2D game interface, using tilemaps and sprites.
The frontend implements video chat using the [Twilio Programmable Video](https://www.twilio.com/docs/video) API, and that aspect of the interface relies heavily on [Twilio's React Starter App](https://github.com/twilio/twilio-video-app-react). Twilio's React Starter App is packaged and reused under the Apache License, 2.0.

A backend service (in the `townService` directory) implements the application logic: tracking which "towns" are available to be joined, and the state of each of those towns.

## Running this app locally

Running the application locally entails running both the backend service and a frontend.

### Setting up the backend

To run the backend, you will need a Twilio account. Twilio provides new accounts with $15 of credit, which is more than enough to get started.
To create an account and configure your local environment:

1. Go to [Twilio](https://www.twilio.com/) and create an account. You do not need to provide a credit card to create a trial account.
2. Create an API key and secret (select "API Keys" on the left under "Settings")
3. Create a `.env` file in the `townService` directory, setting the values as follows:

| Config Value            | Description                               |
| ----------------------- | ----------------------------------------- |
| `TWILIO_ACCOUNT_SID`    | Visible on your twilio account dashboard. |
| `TWILIO_API_KEY_SID`    | The SID of the new API key you created.   |
| `TWILIO_API_KEY_SECRET` | The secret for the API key you created.   |
| `TWILIO_API_AUTH_TOKEN` | Visible on your twilio account dashboard. |

### Starting the backend

Once your backend is configured, you can start it by running `npm start` in the `townService` directory (the first time you run it, you will also need to run `npm install`).
The backend will automatically restart if you change any of the files in the `townService/src` directory.

### Configuring the frontend

Create a `.env` file in the `frontend` directory, with the line: `NEXT_PUBLIC_TOWNS_SERVICE_URL=http://localhost:8081` (if you deploy the towns service to another location, put that location here instead)

For ease of debugging, you might also set the environmental variable `NEXT_PUBLIC_TOWN_DEV_MODE=true`. When set to `true`, the frontend will
automatically connect to the town with the friendly name "DEBUG_TOWN" (creating one if needed), and will *not* try to connect to the Twilio API. This is useful if you want to quickly test changes to the frontend (reloading the page and re-acquiring video devices can be much slower than re-loading without Twilio).

### Running the frontend

In the `frontend` directory, run `npm run dev` (again, you'll need to run `npm install` the very first time). After several moments (or minutes, depending on the speed of your machine), a browser will open with the frontend running locally.
The frontend will automatically re-compile and reload in your browser if you change any files in the `frontend/src` directory.

### Spotify Jukebox specific instructions

In the `frontend/.env` file, you'll need to add the following variables:

```
NEXT_PUBLIC_TOWNS_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDsvdfyDZG5-zERQqHsk77SqvRGg3jwssU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=covey-403.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=covey-403
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=covey-403.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=762839545067
NEXT_PUBLIC_FIREBASE_APP_ID=1:762839545067:web:fcfc57e34eea005cacbaae
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-24WD7BX3VW
```

In the `townService/.env` file, you'll need to add the following variables: (Set DEBUG_MODE to true for additional logs)

```
TWILIO_ACCOUNT_SID=<fill in>
TWILIO_API_KEY_SID=<fill in>
TWILIO_API_KEY_SECRET=<fill in>
TWILIO_API_AUTH_TOKEN=<fill in>
SPOTIFY_CLIENT_ID=33a6670b69934f33b1f91e7a196a3cd7 
SPOTIFY_CLIENT_SECRET=f2d28a264ce24996a7592678f9d8269f
BACKEND_URL=http://localhost:8081
FRONTEND_URL=http://localhost:3000
DEBUG_MODE=true
```

As specificed above, start the backend by running `npm start` in the `townService` directory
```
npm start
```
And the frontend by running `npm run dev` in the `frontend` directory
```
npm run dev
```

The Spotify portion of the application is still in devlopment mode, so only allowed users will be authorized to use the application.

Send the email associated with your Spotify premium account to the following:

Send:
```
<Full Name>, <example@email.com>
```
to
```
gaus.e@northeastern.edu
```
in order to be added as an allowed user.


(there is a 6-8 week application and approval process to move it to public mode)