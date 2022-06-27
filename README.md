# slido-notification

Chrome extension that notifies when a new question is posted. The admin page for the questions must be kept open on a tab (it can be in the background, though).

## How to install

 1. Clone the repository
 1. Access [chrome://extensions/](chrome://extensions/)
 1. Turn on "Developer mode"
 1. Click "Load unpacked" and select the extension directory
 
## How to use

 1. Access the admin questions page (e.g. https://admin.sli.do/event/xxxxxx/questions)
 2. Do something else while you wait for a question to be posted
 
Note: if you click the notification the admin page will come into focus.
 
## Limitation

* Due to security restrictions against autoplay, the notification sound will only work if you first interact with the admin page (clicking it after loading will be enough)
* The extension will notify you of all existing questions at the moment you load the page
