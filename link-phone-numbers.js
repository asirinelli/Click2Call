//var voiceBaseCallUrl = localStorage["baseURLClick2Dial"];
var voiceBaseCallUrl = "http://www.mydomain.com/Click2Dial.php&amp;call=";
var phoneNumberRegExFR = /(0([-.\s]?\d[-.\s]?){9})/;

var phoneNumberRegExMatcher = new RegExp(phoneNumberRegExFR);

var linkClass = "Clin2Call-link";

linkPhoneNumbers(document.body);
document.body.addEventListener("DOMNodeInserted", OnNodeInserted, false);

function linkPhoneNumbers(node) {
    for (var i = 0; i < node.childNodes.length; ++i) {
        var child = node.childNodes[i];
        if (child.nodeName == "SCRIPT" || child.nodeName == "NOSCRIPT"
                || child.nodeName == "OBJECT" || child.nodeName == "EMBED"
                || child.nodeName == "APPLET" || child.nodeName == "IFRAME") {
            continue;
        }

        if (child.childNodes.length > 0) {
            linkPhoneNumbers(child);
        } else if (child.nodeType == 3) {
            var phoneNumbers = phoneNumberRegExMatcher.exec(child.nodeValue);
            if (phoneNumbers) {
                var nextChild = child.nextSibling;
                if (nextChild && nextChild.class == linkClass) {
                    continue;
                }

		var phoneNumber = phoneNumbers[0].replace(/\s+|-+|\.+/g, '');
                var formattedPhoneNumber = phoneNumbers[0];

                var image = document.createElement("img");
                image.src = chrome.extension.getURL("icon48.png");
                image.style.width = "1em";
                image.style.height = "1em";

                var link = document.createElement("a");
                link.href = voiceBaseCallUrl + phoneNumber;
		/*link.target = "_blank";*/
                link.title = "Call " + formattedPhoneNumber + " with ClickCall";
                link.class = linkClass;
                link.style.marginLeft = "0.25em";
                link.appendChild(image);

                child.splitText(phoneNumbers.index + phoneNumbers[0].length);
                node.insertBefore(link, node.childNodes[++i]);
            }
        }
    }
}

var linking = false;

function OnNodeInserted(event) {
    if (linking) return;
    linking = true;
    linkPhoneNumbers(event.target)
    linking = false;
}
