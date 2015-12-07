'use strict';
JSGDemo.namespace("JSGDemo");

/**
 * @class JSGDemo.Default
 *
 * Base class for string localization. 
 * It only provides a string array that can contains translations for the original strings.
 * 
 * @constructor
 */
JSGDemo.Default = function() {
    this.strings = [];
};

/**
 * Get a translated string identified by the given id.
 * 
 * @method getString
 * @param {String} id Id of String to translate. Here we usually provide the English string.
 * @return {String} Translated string.
 */
JSGDemo.Default.prototype.getString = function(id) {
    var string = this.strings[id];
    
    // if string is not available use original
    if (string === undefined) {
        return id;
    }
        
    return string;
};
