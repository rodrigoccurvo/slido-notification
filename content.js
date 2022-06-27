function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}

function askNotificationPermission() {
    function handlePermission(permission) {
        // console.log("Notification: ", permission)
    }

    if (!('Notification' in window)) {
        console.log("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                })
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

// Question icons created by Pixel perfect - Flaticon
// https://www.flaticon.com/free-icons/question
const notificationIcon = chrome.runtime.getURL("question.png");

// Music from Pixabay
// https://pixabay.com/
const notificationAudio = new Audio(chrome.runtime.getURL("notification.mp3"));

function showNotification(title, text) {
    var notification = new Notification(
        title,
        {
            body: text,
            icon: notificationIcon,
            requireInteraction: true,
            image: notificationIcon,
        });
    notification.onclick = function (e) { window.focus(); this.close(); }
    // TODO: call from extension to be able to do it without the user
    // having to interact with the page first (i.e., bypass autoplay restriction)
    notificationAudio.play();
}

function isQuestion(node) {
    if (!node.tagName) {
        return false;
    }

    var tag = node.tagName.toLowerCase();
    return (
        tag == 'admin-event-questions-item-desktop'
        || (tag == 'div' && node.attributes && node.attributes['data-cy'] == 'question')
        || node.querySelector('div[data-cy="question"]')
    );
}

function hasNewQuestion(mutationList) {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                if (isQuestion(node)) {
                    return true;
                }
            }
        }
    }

    return false;
}

var callback = function (mutationList, observer) {
    if (hasNewQuestion(mutationList)) {
        // console.log("New question!");
        showNotification("Sli.do", "New question!");
    }
};

var temporaryCallback = function (mutationList, observer) {
    // console.log(mutationList)
    var target = document.querySelector('div.questions-main-panel:last-of-type');
    if (target) {
        askNotificationPermission();

        // console.log("**** Switching observers...");
        observer.disconnect();
        observer.takeRecords();

        window.newQuestionObserver = new window.OriginalMutationObserver(callback);

        const config = { attributes: true, childList: true, subtree: true };
        window.newQuestionObserver.observe(target, config);
    }
};

(function () {
    // TODO: put these variables somewhere appropriate
    window.OriginalMutationObserver = window.MutationObserver;
    window.OriginalMutationObserver.prototype = Object.create(window.MutationObserver.prototype);

    window.newQuestionObserver = new window.OriginalMutationObserver(temporaryCallback);
})();
