//console.log("Hello World!", browser);

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
                if (!response) return; // safety check
                const list = document.getElementById("found-list");
                list.innerHTML = ""; // clear old results
                response.words.forEach(word => {
                    const li = document.createElement("li");
                    li.textContent = word;
                    list.appendChild(li);
                });
            });
        });
    });
    
});

