let browserDataBuffer = [];
let prevTab = null;
let activeTabEntry = null;

browser.browserAction.onClicked.addListener(()=>{
    const uiUrl = browser.runtime.getURL("index.html");
    browser.windows.create({
      url: uiUrl,
      type: "popup",
      width: 800,
      height: 600
    });
})

document.addEventListener("DOMContentLoaded", init);

browser.tabs.onActivated.addListener(async (activeInfo) => {
    const activeTab = await getActiveTab();
    if (activeTab) {
        //console.log("Tab switched:", activeInfo);
        addBrowserDataToBuffer(activeTab);
    }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.url) {
       // console.log("Tab URL updated:", tab);
        addBrowserDataToBuffer(tab);
    }
});

browser.windows.onFocusChanged.addListener(async (windowId) => {
    const activeTab = await getActiveTab();
    if (activeTab) {
      //  console.log("Window focus changed:", windowId);
        addBrowserDataToBuffer(activeTab);
    }
});

browser.tabs.onRemoved.addListener(() => {
  //  console.log("Tab closed. Flushing data.");
    postBufferData();
});

window.addEventListener("beforeunload", () => {
   // console.log("Browser closing. Flushing data.");
    postBufferData();
});

// Initialize timers and setup auto-save
function init() {
    console.log("Initialization complete.");
    setInterval(autoSaveData, 12000); // Autosave every 5 minutes (300,000 ms)
}

async function getActiveTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs.length > 0 ? tabs[0] : null;
}

function addBrowserDataToBuffer(tabData) {
    const now = new Date();

    // Update previous tab session
    if (prevTab) {
        const prevIndex = browserDataBuffer.findIndex((data) => data.url === prevTab.url);
        if (prevIndex !== -1) {
            browserDataBuffer[prevIndex].endTime = now;
            browserDataBuffer[prevIndex].totalTimeSpent += 
            (now - new Date(browserDataBuffer[prevIndex].startTime)) / 1000;         
        }
    }

    // Handle active tab entry separately
    if (activeTabEntry && activeTabEntry.url === tabData.url) {
        activeTabEntry.lastAccessed = now;
        return;
    }

    // Update or add the new active tab
    const existingIndex = browserDataBuffer.findIndex((data) => data.url === tabData.url);
    if (existingIndex !== -1) {
        browserDataBuffer[existingIndex].lastAccessed = now;
        browserDataBuffer[existingIndex].startTime = now;
        browserDataBuffer[existingIndex].endTime = null;
        browserDataBuffer[existingIndex].timesAccessed++;
        activeTabEntry = browserDataBuffer[existingIndex];
    } else {
        activeTabEntry = {
            title: tabData.title,
            url: tabData.url,
            startTime: now,
            endTime: null,
            lastAccessed: now,
            timesAccessed: 1,
            totalTimeSpent: 0
        };
        browserDataBuffer.push(activeTabEntry);
    }

    prevTab = tabData;
    console.log("Buffer updated:", browserDataBuffer);
}

async function autoSaveData() {
    console.log("Auto-saving data...");

    // Ensure the active tab is retained before clearing the buffer
    let activeItemIndex = browserDataBuffer.findIndex((tab) => tab.url === activeTabEntry.url);
    if (activeItemIndex > -1) {
        browserDataBuffer.splice(activeItemIndex, 1);
    }

    // Retain the active tab state before posting
    const activeTab = { ...activeTabEntry };  // Make a copy
    await postBufferData();

    // Add the active tab back to the buffer after posting
    browserDataBuffer.push(activeTab);
    console.log("Active tab retained:", browserDataBuffer);
}


async function postBufferData() {
    if (browserDataBuffer.length > 0) {
        console.log("Posting browser data:", browserDataBuffer);

        try {
            await sendPostRequest();
            // Clear buffer after successful post
            browserDataBuffer = [];
            console.log("Data posted successfully. Buffer cleared.");
        } catch (error) {
            console.error("Error posting data:", error);
        }
    }
}


async function sendPostRequest() {
    fetch("http://localhost:8080/BrowserActivity/Api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify(browserDataBuffer)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Response:", data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }


  