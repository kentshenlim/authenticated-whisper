# authenticated-whisper

Place where you vent (whisper) your feelings to strangers. [Live site
here](https://authenticated-whisper-b6194854ff4c.herokuapp.com/).

<p align="center">
    <a href="https://authenticated-whisper-b6194854ff4c.herokuapp.com/" target="_blank" rel="noreferrer">
        <img src="./design/app-icon.png" alt="Icon" width="175">
    </a>
</p>

Feel free to test the app using the following credentials of sample accounts, or
create own account. Welcome any issue or suggestion.

- Username: `sophie123`; password: `@sophie123`
- Username: `alex123`; password: `@alex123`

> **Google Chrome security issue**. This issue is believed to be linked to the
> 'Continue with Google' button (which has been disabled in the production
> environment). Given that this project emphasizes authentication, the author is
> reluctant to completely remove the button. If you feel confident in the
> security measures, you are welcome to proceed; otherwise, visit the site with
> different browser.

## Tools

- Express.js
- MongoDB (via Mongoose)
- Passport.js
- nodemailer

## Features

- _Authentication/authorization_. Available login methods:

  - username and password
  - Google OAuth (disabled on production)
  - Facebook OAuth (disabled on production)
  - email magic link (disabled on production)

  Username and password can be set later if first logged in with another method.

  Only username and password allowed on production; OAuths require registration;
  nodemailer is blocked by account security issues.

- _Friend features_. Only approved friends can view your private whispers.
- _Like system_.
- _Responsive design_.
