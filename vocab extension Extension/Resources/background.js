browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

//    if (request.greeting === "hello")
//        return Promise.resolve({ farewell: "goodbye" });
    
    if (request.type == "content_request:enabled") {
            browser.runtime.sendNativeMessage({message: "request:enabled_status"}, function(response) {
                sendResponse({
                    "background_response:enabled": response["delivery:enabled_status"]
                });
            });
        }
        
        return true;
    
});
