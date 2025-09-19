//browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
//    console.log("Received response: ", response);
//});
//
//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log("Received request: ", request);
//});

function onResponse(response) {
    if (response["background_response:enabled"] == true) {
        handleContentReplacement();
        return;
    } else {
    // no-op
    }
}

function handleError(error) {
  // no-op
}

function handleContentEnabled() {
    let sending = browser.runtime.sendMessage({type: "content_request:enabled"});
    sending.then(onResponse, handleError);
}

function handleContentReplacement() {
    const collection = document.getElementsByTagName("p");
    alert(collection.length);
    for (let i = 0; i < collection.length; i++) {
        collection[i].innerHTML = "Hello World!";
        alert(collection[i]);
    }
}

handleContentEnabled();
