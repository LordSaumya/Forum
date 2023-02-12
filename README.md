# HighGear

BUG [12th February 2023]: A bug has occurred where users are unable to post, view, or edit comments. A fix will be deployed as soon as possible.

Submission for CVWO 2023 by Saumya Shah, A0264785M
[Final writeup](https://docs.google.com/document/d/1f2wX0CDKO_SHDk1LVjVbsXGcUtazLfoIT0cOV62347k/edit#)

## Deployment
**Public Site:** 
	Click on this [link](https://highgear.netlify.app/).  
 
**LocalHost**:
1.  Download the files for the [frontend](https://github.com/LordSaumya/Forum) and the [backend](https://github.com/LordSaumya/Forum_API_old) (old version of backend for LocalHost).
    
2.  Open the frontend files, and change all instances of “https://highgear.herokuapp.com/” to “[http://localhost:4000/](http://localhost:4000/)”.
    
3.  Open CMD, navigate to the frontend directory, run `npm i`, and then `npm start -p 3000`.
    
4.  On another instance of CMD, navigate to the backend directory, run `bundle install`, and then run `rails s -p 4000`.
    
5.  You can now access the website at [http://localhost:3000](http://localhost:3000).

## Features

 **Sitewide**
 - Responsive
 - Toggle between dark and light mode
 - Minimalistic navbar for easy navigation (with links to sites and logout button)
 - Automatic redirection to registration page if the user is not logged in
 - Persisted user session (user remains logged in till they choose to log out)
 - Scroll to top button
 - *For moderators:* option to access moderator dashboard through the navbar

**Registration**
- Sign up and login forms with instantaneous input validation
- Secure (sensitive data is hashed before storage)
- Sign up: error handling for taken usernames, emails, and insecure passwords
- Login: error handling for wrong passwords and usernames that don't exist.

**Profile Page (Yours)**
- Secure forms to update your password, email, and bio
- A clickable list of all of your comments and threads, with buttons to edit/delete them
- Option to delete your account after entering your password correctly

**Profile Page (others)**
- Their bio and username 
- A clickable list of all of their comments and threads
- *For moderators*: Option to delete a user's account without having to enter the password.

**Home**
- All of the threads on the website, lazy loaded and collapsible to improve performance and convenience.
- Search threads by title, tag, and content
- Sort by date, title, or tag in both ascending/alphabetical and descending/reverse-alphabetical order
- Rich text display of threads with images
- Thread creation form with WYSIWYG editor and instantaneous validation.
- Clickable usernames to go to other users' profile pages

**Thread**
- All of the comments on the particular thread, lazy loaded to improve performance
- Search comments by content
- Sort by date or content in both ascending/alphabetical and descending/reverse-alphabetical order
- Rich text display of comments and thread with images
- Comment creation form with WYSIWYG editor and instantaneous validation.
- Buttons to edit/delete thread if it was posted by you.
- Buttons to edit/delete comments if they were posted by you.

**EditThread/Comment**
- Comment/Thread update form with WYSIWYG editor and instantaneous validation.
- Automatic redirection to homepage if the user is not a moderator or does not have permission to edit the thread/comment.

***For moderators:* Moderator Dashboard**
- Clickable list of all the threads and comments on the site, with buttons to edit/delete them.
- Clickable list of all the users on the website to go to their profiles.

## User Manual
**Registration Page**
|Element  |Action 
|--|--|
|Sign up form  | Fill appropriately and click the submit button to create an account
Login form  |Fill appropriately and click the submit button to log into an existing account

**Navbar**
|Element  |Action 
|--|--|
|Links | Click to go to the linked page
Logout Button |Click on the 'Hello <username\>' button to log out
Sun/Moon button| Click to toggle dark mode

**Home**
|Element  |Action 
|--|--|
|Thread Container  | Click to go to the page for that specific thread
Show all button|Click to see the whole thread.
Search bar|Enter search terms to search for threads by title, tag, and content
Sort dropdown| Click to change sorting field
Up/Down Chevron button| Click to toggle between ascending and descending sort
Create Thread button| Click to toggle between showing threads and showing thread creation form
Thread creation form | Fill appropriately and click the submit button to post thread

**Profile Page**
|Element  |Action 
|--|--|
|Change Email address form  | Enter a valid email address and click on submit to change your email address.
Edit Bio button  | Click to be redirected to a page to change your bio.
Threads list/Comments list| Click on each link to go to that page
Edit/Delete buttons next to threads & comments| Delete or edit your threads and comments
Change password form | Enter your old password correctly, and then enter a new password and click submit to change your password.
Delete account form | Enter your password correctly and then click on submit to delete your account.

**Thread**
|Element  |Action 
|--|--|
|Edit/Delete buttons for thread & comments | Click to edit/delete your comments/thread
Login form  |Fill appropriately and click the submit button to log into an existing account
Search bar|Enter search terms to search for comments by content
Sort dropdown| Click to change sorting field
Up/Down Chevron button| Click to toggle between ascending and descending sort
Add Comment button| Click to toggle between comment creation form and existing comments.
Comment creation form| Fill appropriately and click submit to post a comment on that thread.

**Thread/Comment Edit Page**
|Element  |Action 
|--|--|
|Update Form | Fill appropriately and click the submit button to update the comment/thread
Discard changes button  | Click to go back without making any changes

## Backend
[Github Repo](https://github.com/LordSaumya/HighGear_API)
Deployed using Heroku.
