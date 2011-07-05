function getNames(callback)
{
    chrome.extension.sendRequest({"name": "getNames"}, function(response)
    {
        callback(response);
    });
}

function mapNames(map, source)
{
    var links = source.getElementsByTagName("a");

    // look for all the links with an 'oid' attribute
    for (var i = 0; i < links.length; i++)
    {
        var oid = links[i].getAttribute("oid");

        if (oid)
        {
            // match the oid number with our mapping
            var name = map[oid];
            if (name)
            {
                // don't put names after images
                if (links[i].firstChild.tagName != "IMG")
                {
                    links[i].innerHTML += " (" + name + ")";
                }
            }
        }
    }
}

getNames(function (response)
{
    var map = JSON.parse(response);


    // map all the links alread in the document
    mapNames(map, document);

    document.addEventListener('DOMNodeInserted', function(e)
    {
        // try to map all the links that just got added
        mapNames(map, e.srcElement);
    });

});
