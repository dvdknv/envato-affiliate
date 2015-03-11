var manifest = chrome.runtime.getManifest();
var time = 300;
    localStorage["username"] == null ? localStorage["username"] = '' : localStorage["username"];

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status == 'loading') {
        chrome.pageAction.show(tabId);
    }
});

var allowClickProcessing = true;
var clickCount = 0;
var tabCount = 0;
var clickTimer = null;
var tooltipTimer = null;
var iconTimer = null;

chrome.pageAction.onClicked.addListener(function (t) {
    if (allowClickProcessing) {
        clearTimeout(clickTimer);
        clickCount++;
        clickTimer = setTimeout(doCopy, (clickCount > 2 ? 0 : 300), t, clickCount);
    }
});

function doCopy(t, inType) {
    allowClickProcessing = false;
    if (t) {
        chrome.tabs.getAllInWindow(null, function (tabs) {
            buffer_clear();
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].selected) {
                    buffer_appendTabInfo(tabs[i]);
                }
            }

            if (buffer_copyToClipboard()) {
                notifyOK(t, inType);
            } else {
                notifyError(t);
            }
        });
    } else {
        notifyError(t);
    }
}

function buffer_clear() {
    b.value = '';
    tabCount = 0;
}

function buffer_copyToClipboard() {
    if (b.value.length > 0) {
        b.select();
        document.execCommand('copy');
        return true;
    }

    return false;
}

function buffer_appendTabInfo(t) {
    if (b.value.length > 0) {
        b.value += '\n\n';
    }

    b.value += getTabInfoText(t);
    tabCount++;
}

function getTabInfoText(t) {
    return t.url + '?ref=' + localStorage['username'];
}


function notifyOK(t, inType) {
    clearTimeout(tooltipTimer);
    clearTimeout(iconTimer);

    clickCount = 0;
    allowClickProcessing = true;

    chrome.pageAction.setTitle({
        tabId: t.id,
        title: (inType === 1 ? 'Copied ' + tabCount + ' selected ' + (tabCount === 1 ? 'tab' : 'tabs') : (inType === 2 ? 'Copied ' + tabCount + ' window ' + (tabCount === 1 ? 'tab' : 'tabs') : 'Copied ' + tabCount + ' session ' + (tabCount === 1 ? 'tab' : 'tabs')))
    });
    tooltipTimer = setTimeout(chrome.pageAction.setTitle, 1000, {"tabId": t.id, title: ''});

    chrome.pageAction.setIcon({"tabId": t.id, path: "img/ok.png"});
    iconTimer = setTimeout(chrome.pageAction.setIcon, 5000, {"tabId": t.id, path: "img/copy.png"});
}

function notifyError(t) {
    clickCount = 0;
    allowClickProcessing = true;
    chrome.pageAction.setIcon({"tabId": t.id, path: "img/error.png"});
}

var b = document.getElementById('buffer');
