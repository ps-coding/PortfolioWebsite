# Portfolio Website *Template*: [shahprasham.com](https://shahprasham.com)

## About

This is my **personal portfolio** website. It is online **[here](https://shahprasham.com)**.

I originally built this website independently **when I was in 8<sup>th</sup> grade.** I am constantly modernizing it.

This website was created using **Angular, Firebase, and various other technologies**.

It has the following features:
- **Accounts** with [OAuth 2.0](https://oauth.net/2) (sign in with google)
- **Authorization status** (anonymous, user, admin, superadmin)
- **Role-based** features
  - Anonymous individuals can only view
  - Users can comment and delete their own comments
  - Admins can create posts, add comments, delete any comments on their posts, and delete their own posts and comments
  - Superadmins can create posts, add comments, manage admins, manage about-page content, and delete any post or comment
  - Both *client-side route guards and UI updates* and *server-side security rules* protect the site
- Complete and full-featured **blog**
  - Title (HTML allowed)
  - Image
  - Body (HTML allowed)
  - Summary (HTML allowed)
  - *Instant updates* with new comments/posts, edited posts, and deleted comments/posts reflected instantaneously
    - This is especially great if you have struck up a conversation with someone in the comments or if I (or another blogger "admin") needs to correct a post and get the update out quickly
  - Custom-built *full-text search*
  - HTML is *sanitized* before it is saved and again when it is loaded (for security)
  - All data associated with a blog post (e.g., images) are deleted automatically when a blog is taken down to save space
- Dynamic **about** page
  - Content such as age and grade *dynamically update*
  - All other *content is editable from the admin panel within the site itself* by superadmins without changing the code
  - There are *instant updates* when a superadmin edits the content of the about page
- **Admin panel**
  - Only accessible to superadmins
  - Can add and remove admins (*change in permission will instantly reflect* on client and server)
  - Can add and remove achievements and hobbies using a *custom-built interface*
    - This is *not* just editing the HTML of the about page
    - The entries for different categories on the about page are stored in a database, which can only be updated by users with the appropriate role
- Click **game**
  - Very simple click game that tells you your clicks per second and how many times you have clicked the button
  - It stores your highest score and the number of times clicked in *local storage* so you can continue where you left off
  - There is a reset button that clears local storage for you
- **Material design** with a simple and user-friendly interface
- **PWA**
  - The website is a progressive web app (PWA)
  - It can *run without internet connection* (although blog features will be unavailable during that time)
  - It can be installed as an app on phones and computers though supported browsers

While this website is very advanced, I still believe that it is a **great template** to use for a personal or business website.

## Setup

For a live and fully-functional version, visit [shahprasham.com](https://shahprasham.com).

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
