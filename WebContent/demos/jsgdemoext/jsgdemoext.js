'use strict';

var JSGDemo = JSGDemo || {};

/**
 * Creates a new namespace object based on the provided namespace string
 * 
 * @static
 * @method namespace
 * @param {String} ns_str The namespace string
 * @param {String} [delimiter="."] The delimiter is used to split the namespace string
 * @return {Object} the namespace object
 */
JSGDemo.namespace = function(namespace) {
	var delimiter = ".";
	var parent = JSGDemo,
		parts = namespace.split(delimiter),
		index;
	for (index = (parts[0] === "JSGDemo") ? 1 : 0; index < parts.length; index += 1) {
		if (typeof parent[parts[index]] === "undefined") {
			parent[parts[index]] = {};
		}
		parent = parent[parts[index]];
	}
	return parent;
};

// navigator
JSGDemo.navigator = undefined;
// current language class
JSGDemo.resourceProvider = undefined;
// repository to show when initializing
JSGDemo.activeRepository = undefined;
// all libraries loaded from library.xml
JSGDemo.libraries = new JSG.commons.Map();
// current language
JSGDemo.lang = 'en';

/**
 * Creates a unique id. The id is used to store documents in the local storage.
 * 
 * @method getNewId
 * @return {String} New unique id as a string.
 * @static
 */
JSGDemo.getNewId = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                                return v.toString(16);
                            });
};

/**
 * Retrieve the value of a URL parameter.
 * 
 * @method getURLParameters
 * @param {String} paramName Parameter name to get value for.
 * @return {String} Value of parameter name, if it exists, otherwise undefined.
 * @static
 */
JSGDemo.getURLParameters = function(paramName) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf("?") > 0) {
        var arrParams = sURL.split("?");
        var arrURLParams = arrParams[1].split("&");
        var arrParamNames = new Array(arrURLParams.length);
        var arrParamValues = new Array(arrURLParams.length);
        var i = 0;
        for ( i = 0; i < arrURLParams.length; i++) {
            var sParam = arrURLParams[i].split("=");
            arrParamNames[i] = sParam[0];
            if (sParam[1] !== "") {
                arrParamValues[i] = unescape(sParam[1]);
            } else {
                arrParamValues[i] = "No Value";
            }
        }

        for ( i = 0; i < arrURLParams.length; i++) {
            if (arrParamNames[i] === paramName) {
                return arrParamValues[i];
            }
        }
        return undefined;
    }
};

JSGDemo.init = function() {
	JSG.graph.interaction.Highlighter.OPTIONS.text = JSGDemo.resourceProvider.getString("Add to container");
};
