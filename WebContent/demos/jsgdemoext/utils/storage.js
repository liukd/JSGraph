JSGDemo.namespace("JSGDemo.utils");

/**
 * @module JSGDemo.utils
 * @namespace JSGDemo.utils
 */

/**
 * A simple wrapper around native <code>localStorage</code> element object. This wrapper defines a
 * small API to access the <code>localStorage</code> in a standardized way.
 *
 * @class JSGDemo.utils.Storage
 * @constructor
 */
JSGDemo.utils.Storage = function() {
};

/**
 * The maximum local storage size in megabyte.<br/>
 * Note: although the underlying local storage may has a higher capacity we limit it here to
 * support correct calculation of allocated storage space.
 *
 * @property MAX_SIZE
 * @type {Number}
 * @static
 */
JSGDemo.utils.Storage.MAX_SIZE = 5; /* in Mb */

/**
 * Constant property representing a kilobyte.
 *
 * @property KB
 * @type {Number}
 * @static
 */
JSGDemo.utils.Storage.KB = 1024;

/**
 * Constant property representing a megabyte.
 *
 * @property MB
 * @type {Number}
 * @static
 */
JSGDemo.utils.Storage.MB = 1024 * JSGDemo.utils.Storage.KB;

/**
 * Clears complete storage.
 *
 * @method clear
 * @static
 */
JSGDemo.utils.Storage.clear = function() {
    localStorage.clear();
};

/**
 * Returns the allocated storage space either in megabytes or relative to maximum storage size.
 *
 * @method allocation
 * @param {Boolean} [relative] Specify <code>true</code> to return the percentage allocated size.
 * @return {Number} The allocated storage space in megabytes or relative to maximum storage size.
 * @static
 */
JSGDemo.utils.Storage.allocation = function(relative) {
    var i, n, item, amount, total = 0;

    for ( i = 0, n = localStorage.length; i < n; i++) {
        item = localStorage.getItem(localStorage.key(i));
        amount = item.length * 2 / JSGDemo.utils.Storage.MB;
        total += isNaN(amount) ? 0 : amount;
    }
    return relative ? total / JSGDemo.utils.Storage.MAX_SIZE : total;
};

/**
 * Checks if there is enough remaining storage space for given item object.
 *
 * @method fits
 * @param {String} key The key under which given item should be stored.
 * @param {Object} item The item to be stored.
 * @param {Boolean} [showSizeWarning] Flag to indicate if a warning dialog should be displayed.
 * @return {Boolean} <code>true</code> if there is enough remaining storage space for given item,
 * <code>false</code> otherwise.
 * @static
 */
JSGDemo.utils.Storage.fits = function(key, item, showSizeWarning) {
    var required = JSGDemo.utils.Storage.requiredSizeOf(item, key);
    var allocated = JSGDemo.utils.Storage.allocation();
    var fits = (allocated + required) < JSGDemo.utils.Storage.MAX_SIZE;
    if (!fits && showSizeWarning) {
        this.showSizeWarning(required, JSGDemo.utils.Storage.MAX_SIZE - allocated);
    }
    return fits;
};

/**
 * Returns the size of given object in megabytes.
 *
 * @method sizeOf
 * @param {Object} item The object to determine the size of.
 * @return {Number} The size of given object in megabytes.
 * @static
 */
JSGDemo.utils.Storage.sizeOf = function(item, key) {
    return (item.length * 2) / JSGDemo.utils.Storage.MB;
};
/**
 * Returns the required size of given object in megabytes.<br/>
 * The required size is size of given object minus the size of the object stored under given key.
 * Therefore the required size is not necessarily the size of given object.
 *
 * @method sizeOf
 * @param {Object} item The object to determine the required size of.
 * @param {String} key The key under which given item is stored.
 * @return {Number} The required size of given object in megabytes.
 * @static
 */
JSGDemo.utils.Storage.requiredSizeOf = function(item, key) {
    var old = key ? JSGDemo.utils.Storage.load(key) : undefined;
    var itemsize = JSGDemo.utils.Storage.sizeOf(item);
    itemsize -= old ? JSGDemo.utils.Storage.sizeOf(old) : 0;
    return itemsize;
};

/**
 * Stores given item object under specified key. Note that a previously stored item for the same
 * key is simply overwritten.
 *
 * @method save
 * @param {String} key The key under which given item should be stored.
 * @param {Object} item The item to store.
 * @return {Boolean} <code>true</code> if saving was successful, <code>false</code> otherwise.
 * @static
 */
JSGDemo.utils.Storage.save = function(key, item) {
    try {
        localStorage.setItem(key, item);
        return true;
    } catch (ex) {//QuotaExceededError
        this.showException(ex, key);
    }
    return false;
};

/**
 * Loads the object stored for given key.
 *
 * @method load
 * @param {String} key The key to identify the object to load.
 * @return {Object} The loaded object or <code>undefined</code> if no object exists for given key.
 * @static
 */

JSGDemo.utils.Storage.load = function(key) {
    return localStorage.getItem(key);
};
/**
 * Removes the object stored for given key.
 *
 * @method remove
 * @param {String} key The key to identify the object to remove.
 * @static
 */
JSGDemo.utils.Storage.remove = function(key) {
    return localStorage.removeItem(key);
};
/**
 * Shows a modal Ext.js error dialog.
 *
 * @method showException
 * @param {Exception} ex The exception to display.
 * @param {String} key The key of the object for which the exception occurred.
 * @static
 */
JSGDemo.utils.Storage.showException = function(ex, key) {
    var title = JSGDemo.resourceProvider.getString("Storage Exception");
    var msg = JSGDemo.resourceProvider.getString("Failed to access local storage!<br/>Reason:<br/>");
    msg = msg + ex.message;
    Ext.Msg.show({
        title : title,
        msg : msg,
        buttons : Ext.Msg.OK,
        icon : Ext.Msg.ERROR
    });
};
/**
 * Shows a modal Ext.js warning dialog which might be presented if there is not enough space left in
 * storage.
 *
 * @method showSizeWarning
 * @param {Number} required The required size in megabytes.
 * @param {Number} available The remaining storage size in megabytes.
 * @static
 */
JSGDemo.utils.Storage.showSizeWarning = function(required, available) {
    var title = JSGDemo.resourceProvider.getString("Storage Warning");
    var msg = JSGDemo.resourceProvider.getString("Not enough storage available!<br/>%1 are needed, but only %2 are available.");

    msg = msg.replace("%1", required.toFixed(2) + "Mb");
    msg = msg.replace("%2", available.toFixed(2) + "Mb");

    Ext.Msg.show({
        title : title,
        msg : msg,
        buttons : Ext.Msg.OK,
        icon : Ext.Msg.WARNING
    });
};

JSGDemo.utils.Storage._mb2kb = function(mb) {
    return mb * JSGDemo.utils.Storage.KB;
};
