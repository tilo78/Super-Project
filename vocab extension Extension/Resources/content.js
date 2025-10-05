//browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
//    console.log("Received response: ", response);
//});
//
//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    console.log("Received request: ", request);
//});

let foundWords = new Set();
let highlighting = true;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "getFoundWords") {
        sendResponse({ words: Array.from(foundWords) });
    } else if (msg.type === "toggleHighlight") {
        highlighting = !highlighting;
//        chrome.storage.session.set({ highlighting }); // store state
        
        if (highlighting) {
            (async () => {
                const words = await getWordList();
                for (const word of words) {
                    highlightWord(word.trim());
                }
                chrome.runtime.sendMessage({
                    type: "foundWords",
                    words: Array.from(foundWords)
                });
            })();
        } else {
//            location.reload();
            document.querySelectorAll("span[style*='background-color']").forEach(span => {
                const text = document.createTextNode(span.textContent);
                span.parentNode.replaceChild(text, span);
            });
            foundWords.clear();
            chrome.runtime.sendMessage({
                type: "foundWords",
                words: []
            });
        }
        sendResponse({ enabled: highlighting });
        
        return true;
    }
});

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
        alert(collection[i].innerHTML);
    }
}

async function getWordList() {
    
    const url = chrome.runtime.getURL("words.txt");
    const response = await fetch(url);
    const text = await response.text();
    return text.split(/\r?\n/).filter(Boolean);
}

function highlightWord(word, color = "yellow") {
    
    const regex = new RegExp(`\\b(${word})\\b`, "gi"); // case-insensitive

    function walk(node) {
        let child, next;
        switch (node.nodeType) {
            case 1: // element node
                if (["script", "style"].includes(node.tagName.toLowerCase())) break;
                for (child = node.firstChild; child; child = next) {
                    next = child.nextSibling;
                    walk(child);
                }
                break;
            case 3: // text node
                const frag = document.createDocumentFragment();
                let lastIdx = 0;
                const text = node.nodeValue;
                text.replace(regex, (match, p1, offset) => {
                    if (offset > lastIdx) {
                        frag.appendChild(document.createTextNode(text.substring(lastIdx, offset)));
                    }
                    const span = document.createElement("span");
                    span.textContent = match;
                    foundWords.add(match.toLowerCase());
                    span.style.backgroundColor = color;
                    frag.appendChild(span);
                    lastIdx = offset + match.length;
                });
                if (lastIdx < text.length) {
                    frag.appendChild(document.createTextNode(text.substring(lastIdx)));
                }
                if (frag.childNodes.length) {
                    node.parentNode.replaceChild(frag, node);
                }
                break;
        }
    }

    walk(document.body);
}


(async () => {
  const words = await getWordList();
  for (const word of words) {
    highlightWord(word.trim());
  }
    console.log("words are highlighted!!!");
    
    chrome.runtime.sendMessage({
      type: "foundWords",
      words: Array.from(foundWords)
    });
})();


handleContentEnabled();




