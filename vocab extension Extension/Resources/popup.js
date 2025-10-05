//console.log("Hello World!", browser);

function populateList(words) {
    const list = document.getElementById("found-list");
    list.innerHTML = ""; // clear old results
    words.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tabId = tabs[0].id;

        // inject content script if not already loaded
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["content.js"]
        }).then(() => {
            // ask the content script for the current foundWords
            chrome.tabs.sendMessage(tabId, { type: "getFoundWords" }, (response) => {
                if (response) populateList(response.words);
            });
            
//            const toggleBtn = document.getElementById("toggle-btn");
//            toggleBtn.addEventListener("click", () => {
//                chrome.tabs.sendMessage(tabId, { type: "toggleHighlight" }, (response) => {
//                    if (!response || !response.enabled) {
//                        toggleBtn.textContent = "Turn On Highlight";
//                    } else {
//                        toggleBtn.textContent = "Turn Off Highlight";
//                    }
//
//                    // refresh list if still on
//                    if (response?.enabled) {
//                        chrome.tabs.sendMessage(tabId, { type: "getFoundWords" }, (resp) => {
//                            if (resp) populateList(resp.words);
//                        });
//                    } else {
//                        const list = document.getElementById("found-list");
//                        list.innerHTML = "";
//                    }
//                });
//            });
            
            document.getElementById("toggle-highlight").addEventListener("click", () => {
                chrome.tabs.sendMessage(tabId, { type: "toggleHighlight" });
            });
            
        });
    });
    
});

