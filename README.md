# authenticated-whisper

Place where you vent (whisper) your feelings to strangers.

<p align="center">
    <a href="https://www.google.com" target="_blank" rel="noreferrer">
        <img src="./design/app-icon.png" alt="Icon" width="175">
    </a>
</p>

Feel free to test the app using the following credentials, or create own
account.

- Username: `sophie_j23`; password: `b@wy,fb#B^Ct=3`
- Username: `alex991023`; password: `)edX8A@dRk}@5`

## Tools

- Express.js
- MongoDB (via Mongoose)
- Passport.js
- nodemailer

## Features

- _Authentication/authorization_. Available login methods:

  - username and password
  - Google OAuth
  - Facebook OAuth
  - email magic link

  Username and password can be set later if first logged in with another method.

- _Friend features_. Only approved friends can view your private whispers.
- _Like system_.
- _Responsive design_.

## TODO

- TODO: limit email sender rate strictly to avoid spam
- TODO: signing in with email, test on deployment
