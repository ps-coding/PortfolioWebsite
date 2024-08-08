# PortfolioWebsite

## Status: Archived
This was a highly over-engineered website that I used to develop my skills in role-based authentication, database management (Firebase), security, Google Analytics, Boostrap, responsive design, build pipelines, Angular, PWA, and other technologies. This is a **fantastic template** for any large-scale blog/portfolio website. However, it is a bit excessive for me now. Thus, I have archived this repository. I hope it can help others and serve as a demonstration of my various skills (although I have significantly improved my skills in all of the aforementioned technologies since creating this website).

## About

This is my **personal portfolio** website. It is online **[here](https://old.shahprasham.com)**.

It was originally built **when I was in 8<sup>th</sup> grade** so it may not work with the latest versions of Node.js or its dependencies.

This website was created using **Angular and Firebase** and built from *scratch*.

It has the following features:
- **Accounts** with [OAuth 2.0](https://oauth.net/2) (sign in with google)
- **Authorization status** (anonymous, user, admin, superadmin)
- **Role-based** features
  - Anonymous individuals can only view
  - Users can comment and delete their own comments
  - Admins can create posts, add comments, delete comments on their posts, and delete their own posts and comments
  - Superadmins can create posts, add comments, manage admins, manage about-page content, and delete any post or comment
  - Both *client-side route guards and UI updates* and *server-side security rules* protect the site
- Complete and full-featured **blog**
  - Title (HTML allowed)
  - Image
  - Body (HTML allowed)
  - Summary (HTML allowed)
  - *Instant updates* with new comments/posts, edited posts, and deleted comments/posts reflected instantaneously
  - Custom-built *full-text search*
  - HTML is *sanitized* before it is saved and again when it is loaded
- Dynamic **about** page
  - Content such as age and grade *dynamically update*
  - All other *content is editable from the admin panel* by superadmins without changing the code
  - *Instant updates* when a superadmin edits the content of the about page
- **Admin panel**
  - Only accessible to superadmins
  - Can add and remove admins (*change in permission will instantly reflect* on client and server)
  - Can add and remove achievements and hobbies using a *custom-built interface (not just editing HTML)*
- Click **game**
  - Very simple click game that tells you your clicks per second and how many times you have clicked the button
  - It stores your highest score and the number of times clicked in *local storage* so you can continue where you left off
  - There is a reset button that clears local storage for you
- **Material design** with a simple and user-friendly interface
- **PWA**
  - The website is a progressive web app (PWA)
  - It can *run without internet connection*
  - It can be installed as an app on phones and computers though supported browsers

While it is very advanced for a personal site, it is a **great template** to use for a personal or business website.

## Setup

For a live and fully-functional version, visit (https://old.shahprasham.com).

### Local
1. For a local version, make sure you have the *LTS version* of [Node.js](https://nodejs.org) and NPM installed (NPM should come with your Node.js installation)
2. *Clone* the repository
3. Inside the repository directory, run `npm install` - this will download all of the packages and development dependencies used

#### Non-PWA version
4. Run `ng serve` to launch a local version
5. Open (http://localhost:4200) to see the website

#### PWA version
4. Run `ng build` to build the website
5. Use any *http server to host the website* in the *dist/* directory
