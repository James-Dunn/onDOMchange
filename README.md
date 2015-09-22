# onDOMchange

onDOMchange lets you create custom elements (like web components), or execute vanilla JS scripts on dynamically created elements. One function, 1KB minified.

Example:

onDOMchange('#foo', addedCallback, removedCallback);

@param {string} '#foo' => selector passed to document.querySelector() to search all created/removed elements

@param {function} addedCallback() => Callback to be called when the selector matches a created element

@param {function} removedCallback() => Callback to be called when the selector matches a removed element

Example using a jQuery script

onDOMchange( '#foo', $('#foo').execute );

If you simply used $('#foo').execute(); in a script, it requires that element to be present at the moment you execute that line of code. With onDOMchange(), it will watch all changes, and execute that line of code immediately after it gets inserted into the DOM.
