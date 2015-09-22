(function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // Store all selectors and callbacks e.g. { '#foo': fn, '.bar': fn }
    var nodeAddedCallbacks = {};
    var nodeRemovedCallbacks = {};

    /**
     * Add a new selector and callback
     * @param {string} selector Selector to be passed to querySelector(). e.g. '#foo' or 'my-element'
     * @param {function} addedCallback Callback when the selector was found on a node added to the DOM
     * @param {function} removedCallback Callback when the selector was found on a node removed from the DOM
     */
    function registerCallbacks(selector, addedCallback, removedCallback) {
        if(addedCallback)
            nodeAddedCallbacks[selector] = addedCallback;
        if(removedCallback)
            nodeRemovedCallbacks[selector] = removedCallback;

        // Check if the element is already in the DOM
        if(addedCallback && document.querySelector(selector))
            addedCallback();
    }

    /**
     * Search all the added/removed nodes for registered callbacks
     * @param {object} nodes Either 'addedNodes' or 'removedNodes' from the Mutation Observer.
     * @param {array} callbacks Array of objects with {selector: callback()}
     */
    function searchNodes(nodes, callbacks) {
        var elem = document.createElement('div');
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i].nodeType === 1 && nodes[i].localName !== 'script')
                elem.appendChild(nodes[i].cloneNode());
        }

        // Call all callbacks for any custom elements that were found
        if(elem.hasChildNodes()) {
            for(var key in callbacks) {
                if(elem.querySelector(key))
                    callbacks[key]();
            }
        }
    }

    /**
     * If any new node match the selectors we are watching for, execute the corresponding callback
     * @param {object} mutations Object passed from Mutation Observer
     */
    function executeCallbacks(mutations) {
        mutations.forEach(function(mutation) {
            searchNodes(mutation.addedNodes, nodeAddedCallbacks);
            searchNodes(mutation.removedNodes, nodeRemovedCallbacks);
        });
    }

    // Watch for all node additions to the <body>
    if(MutationObserver) {
        var observer = new MutationObserver(executeCallbacks);
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    } else if(window.addEventListener) { // Fallback for IE 9 + 10
        document.addEventListener('DOMNodeInserted', executeCallbacks, false);
    }

    window.onDOMchange = registerCallbacks;
})();
