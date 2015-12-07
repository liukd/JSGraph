'use strict';

var BASEDIR = "..";
var EXT_HOME = "ext";
var EXT_LIB = "ext-all.js";
var JSG_HOME = BASEDIR + "/../lib";
var JSG_LIB = "jsg.js";
var ARAC_HOME = JSG_HOME;
//var ARAC_HOME = JSG_HOME;
var ARAC_CONFIG = "resources/aracconfig.xml";
var ARAC_LIB = "jsgarac.js";
var JSGSVG_HOME = BASEDIR + "/../lib";
var JSGSVG_LIB = "jsgsvg.js";
var APP_LIB = "jsgdemo.js";
var RELEASE = true;

/**
 * Handler called, when JS Graph is loaded
 *  
 * @method onJSGLoaded
 * @static
 */
function onJSGLoaded() {
    JSG.init(JSG_HOME);
}

/**
 * Handler called, when JS Graph Demo is loaded
 *  
 * @method onAppLoaded
 * @static
 */
function onAppLoaded() {
    JSGDemo.init();
}

/**
 * Handler called, when Layout Library is loaded
 * 
 * @method onAracLoaded
 * @static
 */
function onAracLoaded() {
    // read layout definitions from XML
    var xmlConfig = new XMLHttpRequest();
    
    xmlConfig.onreadystatechange = function() {
        if (xmlConfig.readyState === 4 && xmlConfig.status === 200) {
            ARAC.layout.initDefaultConfigStore();
            ARAC.layout.defaultConfigStore.loadXML(xmlConfig.responseXML.documentElement);
        }
    };
    // open(method, url, async, username, password)
    // "resources/aracconfig.xml"
    xmlConfig.open("GET", ARAC_CONFIG, true); 
    xmlConfig.send(null);
}

/**
 * Handler called, when Language files are loaded.
 * 
 * @method onLanguageLoaded
 * @static
 */
function onLanguageLoaded() {
    // check, if there is a language setting in the local storage
    var lang = JSGDemo.utils.Storage.load('language');
    if (!lang) {
        lang = window.navigator.userLanguage || window.navigator.language;
    }
    if (lang) {
        JSGDemo.lang = lang;
    }

    // if a URL parameter was set for the language, use this one 
    lang = JSGDemo.getURLParameters('lang');
    if (lang) {
        JSGDemo.lang = lang;
    }
    //JSGDemo.lang = "zh_CN";
    // load language string and EXT locales based on settings
    switch (JSGDemo.lang) {
    case "de":
    case "de-CH":
    case "de-AT":
    case "de-DE":
        JSGDemo.lang = "de";
        JSGDemo.resourceProvider = new JSGDemo.German();
        Loader.addScript("ext-lang-de.js", EXT_HOME + "/locale");
        break;
    case "zh_CN":
    	JSGDemo.lang = "zh_CN";
        JSGDemo.resourceProvider = new JSGDemo.German();
    	Loader.addScript("ext-lang-zh_CN.js", EXT_HOME + "/locale");
    	break;
    default:
        JSGDemo.lang = "en";
        JSGDemo.resourceProvider = new JSGDemo.Default();
        Loader.addScript("ext-lang-en.js", EXT_HOME + "/locale");
        break;
    }

    // set the library to show initially 
    var activeRepository = JSGDemo.getURLParameters('library');
    if (activeRepository !== undefined) {
        JSGDemo.activeRepository = activeRepository;
    }
}

/**
 * Load all JavaScript files necessary for the application.
 * 
 * @method loadDemo
 * @static
 */
function loadDemo() {
    // add all necessary scripts
    Loader.addScript(JSG_LIB, JSG_HOME, onJSGLoaded);
    Loader.addScript(EXT_LIB, EXT_HOME);
    Loader.addScript(ARAC_LIB, ARAC_HOME, onAracLoaded);
    Loader.addScript("jsgdemoext.js");
    Loader.addScript("utils/storage.js");
    Loader.addScript("utils/default.js");
    Loader.addScript("utils/german.js", undefined, onLanguageLoaded);
	Loader.addScript(JSGSVG_LIB, JSGSVG_HOME);
    Loader.addScript(APP_LIB, undefined, onAppLoaded);
    
    // Load all files and show progress
    Loader.load(RELEASE, {
        //a very simple monitor, just update progress bar...
        loaded : function(percentage) {
            var bar = document.getElementById("bar");
            if (bar) {
                bar.value = percentage;
            }
        }
    });
}
