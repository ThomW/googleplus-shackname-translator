function getNames(callback)
{
    chrome.extension.sendRequest({"name": "getNames"}, function(response)
    {
        callback(response);
    });
}

function getName(oid, link, callback)
{
    chrome.extension.sendRequest({"name": "getName", "oid": oid}, function(response)
    {
        callback(link, response);
    });
}

var oid_regex = /^https?:\/\/(plus|profiles)\.google\.com\/(u\/\d\/)?(\d+)$/i

var shack_icon = chrome.extension.getURL("shack.png");

function mapNames(map, ids, source)
{
    var links = source.getElementsByTagName("a");

    // look for all the links with an 'oid' attribute
    for (var i = 0; i < links.length; i++)
    {
        // use a regex instead of the oid attribute to try to catch more items
        var match = oid_regex.exec(links[i].href);

        // don't put names after images
        if (match != null && links[i].firstChild.tagName != "IMG")
        {
            var oid = match[3];

            if (links[i].className.indexOf("shack") > 0)
                continue;

            if (ids.indexOf("\"" + oid + "\"") >= 0)
            {
                links[i].innerHTML += "<img style='vertical-align: bottom' src='" + shack_icon + "'/>";
                links[i].className += " shack";
            }

            // match the oid number with our mapping
            var name = map[oid];
            if (name != null)
            {
                if (name != '')
                    links[i].innerHTML += " (" + name + ")";
            }
            else
            {
                getName(oid, links[i], function(link, name)
                {
                    if (name && name != '')
                        link.innerHTML += " (" + name + ")";
                });
            }
        }
    }
}

getNames(function (response)
{
    var map = response.names;
    var ids = response.chatty_ids;

    // map all the links alread in the document
    mapNames(map, ids, document);

    document.addEventListener('DOMNodeInserted', function(e)
    {
        // try to map all the links that just got added
        mapNames(map, ids, e.srcElement);
    });

});
