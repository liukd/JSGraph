
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page: http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.3.3
var LZString = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _f : String.fromCharCode,

    compressToBase64 : function(input) {
        if (input == null)
            return "";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = LZString.compress(input);

        while (i < input.length * 2) {

            if (i % 2 == 0) {
                chr1 = input.charCodeAt(i / 2) >> 8;
                chr2 = input.charCodeAt(i / 2) & 255;
                if (i / 2 + 1 < input.length)
                    chr3 = input.charCodeAt(i / 2 + 1) >> 8;
                else
                    chr3 = NaN;
            } else {
                chr1 = input.charCodeAt((i - 1) / 2) & 255;
                if ((i + 1) / 2 < input.length) {
                    chr2 = input.charCodeAt((i + 1) / 2) >> 8;
                    chr3 = input.charCodeAt((i + 1) / 2) & 255;
                } else
                    chr2 = chr3 = NaN;
            }
            i += 3;

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + LZString._keyStr.charAt(enc1) + LZString._keyStr.charAt(enc2) + LZString._keyStr.charAt(enc3) + LZString._keyStr.charAt(enc4);

        }

        return output;
    },

    decompressFromBase64 : function(input) {
        if (input == null)
            return "";
        var output = "", ol = 0, output_, chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, f = LZString._f;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = LZString._keyStr.indexOf(input.charAt(i++));
            enc2 = LZString._keyStr.indexOf(input.charAt(i++));
            enc3 = LZString._keyStr.indexOf(input.charAt(i++));
            enc4 = LZString._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            if (ol % 2 == 0) {
                output_ = chr1 << 8;

                if (enc3 != 64) {
                    output += f(output_ | chr2);
                }
                if (enc4 != 64) {
                    output_ = chr3 << 8;
                }
            } else {
                output = output + f(output_ | chr1);

                if (enc3 != 64) {
                    output_ = chr2 << 8;
                }
                if (enc4 != 64) {
                    output += f(output_ | chr3);
                }
            }
            ol += 3;
        }

        return LZString.decompress(output);

    },

    compressToUTF16 : function(input) {
        if (input == null)
            return "";
        var output = "", i, c, current, status = 0, f = LZString._f;

        input = LZString.compress(input);

        for ( i = 0; i < input.length; i++) {
            c = input.charCodeAt(i);
            switch (status++) {
                case 0:
                    output += f((c >> 1) + 32);
                    current = (c & 1) << 14;
                    break;
                case 1:
                    output += f((current + (c >> 2)) + 32);
                    current = (c & 3) << 13;
                    break;
                case 2:
                    output += f((current + (c >> 3)) + 32);
                    current = (c & 7) << 12;
                    break;
                case 3:
                    output += f((current + (c >> 4)) + 32);
                    current = (c & 15) << 11;
                    break;
                case 4:
                    output += f((current + (c >> 5)) + 32);
                    current = (c & 31) << 10;
                    break;
                case 5:
                    output += f((current + (c >> 6)) + 32);
                    current = (c & 63) << 9;
                    break;
                case 6:
                    output += f((current + (c >> 7)) + 32);
                    current = (c & 127) << 8;
                    break;
                case 7:
                    output += f((current + (c >> 8)) + 32);
                    current = (c & 255) << 7;
                    break;
                case 8:
                    output += f((current + (c >> 9)) + 32);
                    current = (c & 511) << 6;
                    break;
                case 9:
                    output += f((current + (c >> 10)) + 32);
                    current = (c & 1023) << 5;
                    break;
                case 10:
                    output += f((current + (c >> 11)) + 32);
                    current = (c & 2047) << 4;
                    break;
                case 11:
                    output += f((current + (c >> 12)) + 32);
                    current = (c & 4095) << 3;
                    break;
                case 12:
                    output += f((current + (c >> 13)) + 32);
                    current = (c & 8191) << 2;
                    break;
                case 13:
                    output += f((current + (c >> 14)) + 32);
                    current = (c & 16383) << 1;
                    break;
                case 14:
                    output += f((current + (c >> 15)) + 32, (c & 32767) + 32);
                    status = 0;
                    break;
            }
        }

        return output + f(current + 32);
    },

    decompressFromUTF16 : function(input) {
        if (input == null)
            return "";
        var output = "", current, c, status = 0, i = 0, f = LZString._f;

        while (i < input.length) {
            c = input.charCodeAt(i) - 32;

            switch (status++) {
                case 0:
                    current = c << 1;
                    break;
                case 1:
                    output += f(current | (c >> 14));
                    current = (c & 16383) << 2;
                    break;
                case 2:
                    output += f(current | (c >> 13));
                    current = (c & 8191) << 3;
                    break;
                case 3:
                    output += f(current | (c >> 12));
                    current = (c & 4095) << 4;
                    break;
                case 4:
                    output += f(current | (c >> 11));
                    current = (c & 2047) << 5;
                    break;
                case 5:
                    output += f(current | (c >> 10));
                    current = (c & 1023) << 6;
                    break;
                case 6:
                    output += f(current | (c >> 9));
                    current = (c & 511) << 7;
                    break;
                case 7:
                    output += f(current | (c >> 8));
                    current = (c & 255) << 8;
                    break;
                case 8:
                    output += f(current | (c >> 7));
                    current = (c & 127) << 9;
                    break;
                case 9:
                    output += f(current | (c >> 6));
                    current = (c & 63) << 10;
                    break;
                case 10:
                    output += f(current | (c >> 5));
                    current = (c & 31) << 11;
                    break;
                case 11:
                    output += f(current | (c >> 4));
                    current = (c & 15) << 12;
                    break;
                case 12:
                    output += f(current | (c >> 3));
                    current = (c & 7) << 13;
                    break;
                case 13:
                    output += f(current | (c >> 2));
                    current = (c & 3) << 14;
                    break;
                case 14:
                    output += f(current | (c >> 1));
                    current = (c & 1) << 15;
                    break;
                case 15:
                    output += f(current | c);
                    status = 0;
                    break;
            }

            i++;
        }

        return LZString.decompress(output);
        //return output;

    },

    compress : function(uncompressed) {
        if (uncompressed == null)
            return "";
        var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, // Compensate for the first entry which should not count
        context_dictSize = 3, context_numBits = 2, context_data_string = "", context_data_val = 0, context_data_position = 0, ii, f = LZString._f;

        for ( ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
            }

            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
            } else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for ( i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for ( i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    } else {
                        value = 1;
                        for ( i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for ( i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            } else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                } else {
                    value = context_dictionary[context_w];
                    for ( i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == 15) {
                            context_data_position = 0;
                            context_data_string += f(context_data_val);
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }

                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                // Add wc to the dictionary.
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
            }
        }

        // Output the code for w.
        if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                    for ( i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1);
                        if (context_data_position == 15) {
                            context_data_position = 0;
                            context_data_string += f(context_data_val);
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for ( i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == 15) {
                            context_data_position = 0;
                            context_data_string += f(context_data_val);
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                } else {
                    value = 1;
                    for ( i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position == 15) {
                            context_data_position = 0;
                            context_data_string += f(context_data_val);
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for ( i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == 15) {
                            context_data_position = 0;
                            context_data_string += f(context_data_val);
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            } else {
                value = context_dictionary[context_w];
                for ( i = 0; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value & 1);
                    if (context_data_position == 15) {
                        context_data_position = 0;
                        context_data_string += f(context_data_val);
                        context_data_val = 0;
                    } else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }

            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
        }

        // Mark the end of the stream
        value = 2;
        for ( i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
            } else {
                context_data_position++;
            }
            value = value >> 1;
        }

        // Flush the last char
        while (true) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == 15) {
                context_data_string += f(context_data_val);
                break;
            } else
                context_data_position++;
        }
        return context_data_string;
    },

    decompress : function(compressed) {
        if (compressed == null)
            return "";
        if (compressed == "")
            return null;
        var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = "", i, w, bits, resb, maxpower, power, c, f = LZString._f, data = {
            string : compressed,
            val : compressed.charCodeAt(0),
            position : 32768,
            index : 1
        };

        for ( i = 0; i < 3; i += 1) {
            dictionary[i] = i;
        }

        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;
        while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = 32768;
                data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }

        switch (next = bits) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = 32768;
                        data.val = data.string.charCodeAt(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = f(bits);
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = 32768;
                        data.val = data.string.charCodeAt(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = f(bits);
                break;
            case 2:
                return "";
        }
        dictionary[3] = c;
        w = result = c;
        while (true) {
            if (data.index > data.string.length) {
                return "";
            }

            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = 32768;
                    data.val = data.string.charCodeAt(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }

            switch (c = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = 32768;
                            data.val = data.string.charCodeAt(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }

                    dictionary[dictSize++] = f(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = 32768;
                            data.val = data.string.charCodeAt(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = f(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 2:
                    return result;
            }

            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }

            if (dictionary[c]) {
                entry = dictionary[c];
            } else {
                if (c === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
            result += entry;

            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;

            w = entry;

            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }

        }
    }
};

if ( typeof module !== 'undefined' && module != null) {
    module.exports = LZString;
}



/**
 * @module JSGDemo.model
 * @namespace JSGDemo.model
 */
JSGDemo.namespace("JSGDemo.model");

/**
 * Class containing library information. A library contains the information about the sections of the library visible 
 * in the Libraries View. It also contains a Map with all used library items in the library.
 *
 * @class Library
 * @constructor
 * Create Library
 * @param {String} type Unique type library identifier.
*/
JSGDemo.model.Library = function(type) {
    this.type = type;
    this.name = "";
    this.sections = [];
    this.items = new JSG.commons.Map();
};

/**
 * Class containing library item infos. A library item is assigned to a library section and contains the 
 * technical name of the symbol to use. 
 *
 * @class LibraryItem
 * @constructor
 * Create LibraryItem
 * @param {String} type Technical name of library item.
 * @param {String} section Section to display the item in.
 */
JSGDemo.model.LibraryItem = function(type, section) {
    this.type = type;
    this.section = section;
};

/**
 * Class containing library section infos. A library section groups LibraryItems in the library view.
 * It is visualized with a caption.
 * The class contains the info about the LibraryItems to display in the section and a label. 
 *
 * @class LibrarySection
 * @constructor
 * Create LibrarySection
 * @param {String} type Technical name of library item.
 * @param {String} section Section to display the item in.
 */
JSGDemo.model.LibrarySection = function(label, type) {
    this.label = label;
    this.type = type;
    this.items = new JSG.commons.Map();
};

/**
 * The Symbol contains the GraphItem XML and attributes to describe the GraphItem. The XML data is used,
 * when the LibraryItem is dragged into the Graph to create the GraphItem. The icons and the label are
 * used to visualize the Symbol in the library view. 
 *
 * @class Symbol
 * @constructor
 * @param {String} type Unique technical name of the Symbol.
 * @param {String} label Label to assign when the item is inserted.
 * @param {String} icon DataURL with icon to display in Shape Library.
 * @param {String} iconsmall Currently not used.
 */
JSGDemo.model.Symbol = function(type, label, icon, iconsmall) {
    this.type = type;
    this.label = label;
    this.icon = icon;
    this.iconsmall = iconsmall;
    this.graphItem = undefined;
};

/**
 * The Libraries class contains all library definitions and all symbol definitions.
 * It reads the informations from the library.xml, where the libraries are persisted.
 *
 * @class Libraries
 * @constructor
 */
JSGDemo.model.Libraries = function() {
    
    this.libraries = new JSG.commons.Map();
    this.symbols = new JSG.commons.Map();
};

/**
 * Get a library by its name.
 * 
 * @method getLibrary
 * @param {String} type Name or type of library to retrieve.
 * @return {JSGDemo.model.Library} Library definition
 */
JSGDemo.model.Libraries.prototype.getLibrary = function(type) {
    return this.libraries.get(type.toLowerCase());
};

JSGDemo.model.Libraries.prototype.loadTemplateStore = function() {
    var json,
		self = this,
		// url = "resources/attrpool.json",
		url = "resources/templates.xml",
		xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState === 4) {
			var status = xhttp.status;
			if (status === 200) {
				JSG.TemplateStore.readXML(xhttp.responseXML);
			}
		}
	}; 
    xhttp.open("GET", url, true);
    xhttp.send(); 
};

/**
 * Read all libraries information from library.xml.
 * 
 * @method load
 * @return {Boolean} true, if successfully loaded, otherwise false.
 */
JSGDemo.model.Libraries.prototype.load = function() {
	this.loadTemplateStore();
	
    var self = this;

    // read library name and type and add it to libraries     
    function readLibrary(xmlLibrary) {
        var type = xmlLibrary.getAttribute("type");
        var library = new JSGDemo.model.Library(type);
        self.libraries.put(type, library);

        var xmlLabels = xmlLibrary.getElementsByTagName("typename");
        var xmlLabel = xmlLabels[0].getElementsByTagName(JSGDemo.lang);
        
        xmlLabels = xmlLibrary.getElementsByTagName("name");
        xmlLabel = xmlLabels[0].getElementsByTagName(JSGDemo.lang);
        library.name = xmlLabel[0].childNodes[0].nodeValue.decode();

        return library;
    }

    // read library items of library
    function readLibraryItems(xmlLibrary, library) {
        var xmlLibraryItems = xmlLibrary.getElementsByTagName("shapes");
        if (!xmlLibraryItems.length) {
            return;
        }
        var moList = xmlLibraryItems[0].getElementsByTagName("shape");
        var j, m;

        for (j = 0, m = moList.length; j < m; j++) {
            var xmlLibraryItem = moList[j];
            var libraryItem = new JSGDemo.model.LibraryItem(xmlLibraryItem.getAttribute("type"), xmlLibraryItem.getAttribute("section"));
        
            library.items.put(libraryItem.type, libraryItem);
        }
    }

    // read all sections of library and add them to library, then read items of library
    function readSections(xmlLibrary, library) {
        // read section
        var xmlSections = xmlLibrary.getElementsByTagName("sections");
        var sectionList = xmlSections[0].getElementsByTagName("section");
        var j, m;

        for (j = 0, m = sectionList.length; j < m; j++) {
            var xmlSection = sectionList[j];
        
            var xmlLabels = xmlSection.getElementsByTagName("labels");
            var xmlLabel = xmlLabels[0].getElementsByTagName(JSGDemo.lang);
            var section = new JSGDemo.model.LibrarySection(xmlLabel[0].childNodes[0].nodeValue.decode(), xmlSection.getAttribute("type"));

            library.sections.push(section);
        }

        // read items of library
        readLibraryItems(xmlLibrary, library);
    }

    function read(xml) {
        var i, n;
        
        if (!xml || !xml.hasChildNodes()) {
            return false;
        }
    
        // root libraries node        
        var root = xml.childNodes[0];
        if (!root || !root.hasChildNodes()) {
            return false;
        }
    
        // get libraries list
        var libraryList = root.getElementsByTagName("library");
            
        // read libraries
        for (i = 0, n = libraryList.length; i < n; i++) {
            var xmlLibrary = libraryList[i];
            var library = readLibrary(xmlLibrary);
            readSections(xmlLibrary, library);
        }
        
        // get symbols root
        var moRoot = root.getElementsByTagName("symbols")[0];
        if (!moRoot || !moRoot.hasChildNodes()) {
            return false;
        }
        
        // get symbol list
        var moList = moRoot.getElementsByTagName("symbol");
            
        // read symbol definitions
        for (i = 0, n = moList.length; i < n; i++) {
            var xmlSymbol = moList[i];
            var xmlLabels = xmlSymbol.getElementsByTagName("labels");
            var xmlLabel = xmlLabels[0].getElementsByTagName(JSGDemo.lang);
    
            var type = xmlSymbol.getAttribute("type");
            var icon = xmlSymbol.getAttribute("icon");
            var iconsmall = xmlSymbol.getAttribute("iconsmall");
            
            var modelObject = new JSGDemo.model.Symbol(type, JSG.Strings.decode(xmlLabel[0].childNodes[0].nodeValue), icon, iconsmall);
            var xmlNodes = xmlSymbol.getElementsByTagName("graphitem");
            if (xmlNodes) {
                modelObject.nodeXML = xmlNodes[0].cloneNode(true);
            }
            self.symbols.put(type, modelObject);
        }
    }

    // retrieve library XML
    var xhttp = new XMLHttpRequest();
    var i, n;

    xhttp.open("GET", "resources/library.xml", true);
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            read(xhttp.responseXML);
            JSGDemo.viewport.initLibraries();
            // create demo repository tree from Local Storage, if it does not exist
            if (JSGDemo.utils.Storage.load('repository') === null) {
                JSGDemo.samples.General.createRepository();
            }
        }
    };

    xhttp.send(); 
    
    return true;
};

/**
 * Ext Model and Store definitions used in repository tree 
 */
Ext.define('graphitem', {
    extend : 'Ext.data.Model',
    fields : [{
        name : 'id',
        type : 'string'
    }, {
        name : 'name',
        type : 'string'
    }, {
        name : 'type',
        type : 'string'
    }, {
        name : 'description',
        type : 'string'
    }]
});

Ext.define('graphitemstore', {
    extend : 'Ext.data.TreeStore',
    folderSort : true,
    sortOnLoad : true,
    model : 'graphitem',
    sorters: [{
        property: 'name',
        direction: 'ASC' // or 'ASC'
    }],  
    proxy : {
        type : 'memory',
        data : {
            name : "Storage",
            expanded : true,
            description : "",
            leaf : false, 
            children : [{
                id : JSGDemo.getNewId(),
                name : "Demo Graph",
                leaf : true
            }, {
                id : JSGDemo.getNewId(),
                name : "Ordner",
                leaf : false,
                expanded : true,
                children : [{
                    id : JSGDemo.getNewId(),
                    name : "Demo 1",
                    leaf : true
                }, {
                    id : JSGDemo.getNewId(),
                    name : "Demo 2",
                    leaf : true
                }]
            }]
        }
    },
    autoLoad : true,
    autoSync : true
});


/**
 * @module JSGDemo.graph.model
 * @namespace JSGDemo.graph.model
 */
JSGDemo.namespace("JSGDemo.graph.model");

/**
 * The GraphItemFactory provides custom shapes or adds functionality to existing shapes. 
 * 
 * @class GraphItemFactory
 * @constructor
 */
JSGDemo.graph.model.GraphItemFactory = function() {
    JSGDemo.graph.model.GraphItemFactory._super.constructor.apply(this, arguments);
};
JSG.extend(JSGDemo.graph.model.GraphItemFactory, JSG.graph.model.GraphItemFactory);

/**
 * Create a shape from the repository. The repository is loaded from an XML file, when the application starts. 
 * The repository contains GraphItem descriptions, which are saved in a Map and can be retrieved from the map using the given name.
 * 
 * @method createShape
 * @param {String} name Name of shape to create.
 * @return {JSG.graph.model.GraphItem[]} Array of GraphItems. Here we only return a single GraphItem.
 */
JSGDemo.graph.model.GraphItemFactory.prototype.createShape = function(name) {

    // get definition from library
    var symbol = JSGDemo.libraries.symbols.get(name);
    if (!symbol.nodeXML) {
        return;
    }

    // check for invalid XML                
    if (symbol.nodeXML.nodeName !== "graphitem") {
        return;
    }
    
    // get basic type to create
    var type = symbol.nodeXML.getAttribute('type');

    // create GraphItem
    var graphItem = JSG.graphItemFactory.createItemFromString(type);
    if (graphItem === undefined) {
        return;
    }

    // read symbol definition
    graphItem.readXML(symbol.nodeXML);
    
    // apply title text, if GraphItem has a lable 
    var text = graphItem.getTextSubItem();
    if (text) {
        text.setText(symbol.label);
    }
    graphItem.evaluate();
    
    // reset id, to allow creation of a new id
    graphItem.setId(undefined);
    
    var result = [];

    result.push(graphItem);
    
    return result;
};

/**
 * Create command buttons for specific items. They can be used to initiate actions. Here we create
 * buttons for the orgchart sample. Each button will create an additional item attached to the item passed. 
 * 
 * @method getCommandButtons
 * @param {JSG.graph.model.GraphItem} item Item to create buttons for.
 * @return {JSG.graph.view.selection.CommandButton[]} Array with CommandButtons.
 */
JSGDemo.graph.model.GraphItemFactory.prototype.getCommandButtons = function(item) {
    var commands = [];
    
    // add command buttons for orgchart based on item type        
    switch (item.getType().getValue()) {
        case "orgperson":
            commands.push(new JSG.graph.view.selection.CommandButton(JSG.graph.view.selection.CommandButton.Type.ADDSIBLINGBEFORE, 
                JSG.graph.view.selection.CommandButton.Position.LEFT | JSG.graph.view.selection.CommandButton.Position.MIDDLE,  
                "resources/icons/orgsiblingbefore.png", "orgperson"));
            commands.push(new JSG.graph.view.selection.CommandButton(JSG.graph.view.selection.CommandButton.Type.ADDSIBLINGAFTER,
                JSG.graph.view.selection.CommandButton.Position.RIGHT | JSG.graph.view.selection.CommandButton.Position.MIDDLE,  
                "resources/icons/orgsiblingafter.png", "orgperson"));
            commands.push(new JSG.graph.view.selection.CommandButton(JSG.graph.view.selection.CommandButton.Type.ADDCHILD, 
                JSG.graph.view.selection.CommandButton.Position.CENTER | JSG.graph.view.selection.CommandButton.Position.BOTTOM,  
                "resources/icons/orgchild.png", "orgperson"));
            commands.push(new JSG.graph.view.selection.CommandButton(JSG.graph.view.selection.CommandButton.Type.ADDCHILD, 
                JSG.graph.view.selection.CommandButton.Position.RIGHT | JSG.graph.view.selection.CommandButton.Position.BOTTOM,  
                "resources/icons/orgassistant.png", "orgassistent"));
            return commands;
        case "orgmanager":
            commands.push(new JSG.graph.view.selection.CommandButton(JSG.graph.view.selection.CommandButton.Type.ADDCHILD, 
                JSG.graph.view.selection.CommandButton.Position.CENTER | JSG.graph.view.selection.CommandButton.Position.BOTTOM,  
                "resources/icons/orgchild.png", "orgperson"));
            commands.push(new JSG.graph.view.selection.CommandButton(JSG.graph.view.selection.CommandButton.Type.ADDCHILD, 
                JSG.graph.view.selection.CommandButton.Position.RIGHT | JSG.graph.view.selection.CommandButton.Position.BOTTOM,  
                "resources/icons/orgassistant.png", "orgassistent"));
            return commands;
    }
};

JSGDemo.namespace("JSGDemo.graph.layout");

JSGDemo.graph.layout.AracConfig =
{
    ARAC_FORCE: new ARAC.layout.force.ForceLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      nodeDistance:3200,
      iterations:120}),

    ARAC_TREE_LOTB_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000}),
    ARAC_TREE_LOBT_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000}),
    ARAC_TREE_LOLR_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000}),
    ARAC_TREE_LORL_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000}),

    ARAC_TREE_LOTB_PBH: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      parentBalancing:ARAC.layout.config.ParentBalancing.HEAD,
      nodeDistance:1000,
      layerDistance:2000}),
    ARAC_TREE_LOTB_PBT: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      parentBalancing:ARAC.layout.config.ParentBalancing.TAIL,
      nodeDistance:1000,
      layerDistance:2000}),

    ARAC_TREELISTSINGLE_LOTB_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
//      parentBalancing:ARAC.layout.config.ParentBalancing.TAIL,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
      nodeDistance:1000,
      layerDistance:500}),
    ARAC_TREELISTSINGLE_LOBT_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.LEFT_TO_RIGHT,
//      parentBalancing:ARAC.layout.config.ParentBalancing.TAIL,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
      nodeDistance:1000,
      layerDistance:500}),
    ARAC_TREELISTSINGLE_LOLR_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.BOTTOM_TO_TOP,
//      parentBalancing:ARAC.layout.config.ParentBalancing.TAIL,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
      nodeDistance:1000,
      layerDistance:500}),
    ARAC_TREELISTSINGLE_LORL_PBM: new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.RIGHT_TO_LEFT,
//      parentBalancing:ARAC.layout.config.ParentBalancing.TAIL,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
      nodeDistance:1000,
      layerDistance:500}),

    ARAC_ORGCHART_L0TREE_L3LISTSINGLE : new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000,
      levelDescriptor:[new ARAC.layout.tree.TreeLevelConfig(3,
        new ARAC.layout.tree.TreeLayoutConfig({
          layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
          treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
          parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
          nodeDistance:1000,
          layerDistance:2000}))]}),
    ARAC_ORGCHART_L0LISTSINGLE_L3TREE : new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000,
      levelDescriptor:[new ARAC.layout.tree.TreeLevelConfig(3,
        new ARAC.layout.tree.TreeLayoutConfig({
          layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
          treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
          parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
          nodeDistance:1000,
          layerDistance:2000}))]}),
    ARAC_ORGCHART_L0TREE_L3ListSINGLE_L5TREE : new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000,
      levelDescriptor:[
        new ARAC.layout.tree.TreeLevelConfig(3,
          new ARAC.layout.tree.TreeLayoutConfig({
            layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
            treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
            parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
            nodeDistance:1000,
            layerDistance:2000})),
        new ARAC.layout.tree.TreeLevelConfig(5,
          new ARAC.layout.tree.TreeLayoutConfig({
            layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
            treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
            parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
            nodeDistance:1000,
            layerDistance:2000})) ]
    }),
    ARAC_ORGCHART_L0LISTSINGLE_L3TREE_L6LISTSINGLE : new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000,
      levelDescriptor:[
        new ARAC.layout.tree.TreeLevelConfig(3,
          new ARAC.layout.tree.TreeLayoutConfig({
            layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
            treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
            parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
            nodeDistance:1000,
            layerDistance:2000})),
        new ARAC.layout.tree.TreeLevelConfig(6,
          new ARAC.layout.tree.TreeLayoutConfig({
            layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
            treeStyle:ARAC.layout.config.TreeStyle.TREE_LIST_SINGLE,
            parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
            nodeDistance:1000,
            layerDistance:2000})) ]
    }),

    ARAC_ORGCHART_CHECK : new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000,
      levelDescriptor:[new ARAC.layout.tree.TreeLevelConfig(3,
        new ARAC.layout.tree.TreeLayoutConfig({
          layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
          treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
          parentBalancing:ARAC.layout.config.ParentBalancing.HEAD,
          nodeDistance:1000,
          layerDistance:2000}))]}),
    ARAC_ORGCHART_ANTICHECK : new ARAC.layout.tree.TreeLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
      treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
      parentBalancing:ARAC.layout.config.ParentBalancing.MEDIAN,
      nodeDistance:1000,
      layerDistance:2000,
      levelDescriptor:[new ARAC.layout.tree.TreeLevelConfig(3,
        new ARAC.layout.tree.TreeLayoutConfig({
          layoutOrientation:ARAC.layout.config.LayoutOrientation.TOP_TO_BOTTOM,
          treeStyle:ARAC.layout.config.TreeStyle.TREE_NORMAL,
          parentBalancing:ARAC.layout.config.ParentBalancing.TAIL,
          nodeDistance:1000,
          layerDistance:2000}))]}),

    ARAC_FLOW: new ARAC.layout.flow.FlowLayoutConfig({
      layoutOrigin:new ARAC.Coord(2000, 2000),
      nodeDistance:3000,
      layerDistance:2000
//      submitIntermediateResults:true,
//      resultUpdate:function() { editor.invalidate(); }
    })
};


JSGDemo.namespace("JSG.graph.model");
/**
 * Specific layout manager to handle layout tasks. You can attach your own layouter to the
 * graph framework. Here we attach the ARAC layouter to the graphic framework. This class works like
 * an interface that provides layout services to the framework.
 *
 * @class JSGDemo.graph.layout.LayoutManager
 * @extends JSG.layout.LayoutManager
 * @constructor
 */
JSGDemo.graph.layout.LayoutManager = function() {
};

/**
 * Provide a layouter. The layout currently only needs to provide a layout function which executes the layout. Here we simply use the ARAC layout.
 * 
 * @method createLayoutFromString
 * @param {String} typeStr Name of layout or layout type.
 */
JSGDemo.graph.layout.LayoutManager.prototype.createLayoutFromString = function(typeStr) {
    switch(typeStr) {
    case "Grid":
        return {
            layout : function(model, constraints) {
                try {
                    ARAC.layout.apply(model, constraints);
                } catch (e) {

                }
            }
        };
    case "Tree":
    case "Flow":
    case "OrgChart":
    case "Force":
        return {
            layout : function(model, constraints) {
                try {
                    ARAC.layout.apply(model, constraints, ARAC.layout.defaultConfigStore.get('Edge-Default'));
                } catch (e) {

                }
            }
        };
    }
};

/**
 * Provide a contraint definition for a specific layout type. The constraint definition defines options that can be used by the layouter.
 * 
 * @method createContrainsForLayout
 * @param {String} typeStr Layout type as string.
 * @return {Object} An object that will be passed to the layout upon execution.
 */
JSGDemo.graph.layout.LayoutManager.prototype.createConstraintsForLayout = function(typeStr) {
    switch(typeStr) {
    case "Grid":
        return ARAC.layout.defaultConfigStore.get('Grid-Default').copy();
    case "Tree":
        return ARAC.layout.defaultConfigStore.get('Tree-CardinalPoints').copy();
    case "OrgChart":
        return ARAC.layout.defaultConfigStore.get('OrgChart-Demo').copy();
    case "Flow":
        return ARAC.layout.defaultConfigStore.get('Flow-CardinalPoints').copy();
    case "Force":
        return ARAC.layout.defaultConfigStore.get('Force-CenterPoints').copy();
    }
};


/**
 * Derives a model for the layouter from the model of the graph. Here we convert the graph model
 * to a model that is usable for the ARAC layouter.
 * 
 * @method getLayoutModel
 * @param {JSG.graph.model.Graph} graph Graph model to layout.
 * @return {JSG.aracadapter.AracGraphAdapter} ARAC adapter that provides the model.
 */
JSGDemo.graph.layout.LayoutManager.prototype.getLayoutModel = function(graph, constraints) {
    return new JSG.aracadapter.AracGraphAdapter(graph);
};

/**
 * Return a layout index based on the position. The layout index is the index where to insert 
 * a new item within a list of GraphItems derived from the position of the mouse and the positions 
 * of already available items within a container. 
 * Here we support only to insert an item within a grid layout.
 * Its use is to insert a Lane into a Pool in a defined way. If you drag a new Pool or Lane
 * on top of an existing Pool, markers are shown to visualize, where the Pool or Lane will be added 
 * within a container.
 * 
 * @method getLayoutIndex
 * @param {JSG.geometry.Point} point location to check for.
 * @param {JSG.ui.viewer.GraphViewer} viewer Viewer to use in InteractionHandler
 * @param {JSG.graph.controller.GraphItemController} controller Controller of container with items to check.
 * @param {String} sortSource Type of item to find layout index for. Usually the type of the object.
 * @param {Boolean} highLight True, if index is needed for highlighting during user interaction or for dropping.
 * @param {Boolean} drop True, if its a drag and drop operation, false if its a move operation.
 * @return {Number} Index, where the item should be inserted in the list of items.
 */
JSGDemo.graph.layout.LayoutManager.prototype.getLayoutIndex = function(point, viewer, container, sortSource, highLight, drop) {
    var oldIndex;
    var selection;
    var sameParent = false;
    var i, n;

    // if its a move get the index where the object is moved from
    if (!drop) {
        selection = viewer.getSelection();
        if (selection === undefined || selection.length !== 1) {
            return;
        }
        oldIndex = selection[0].getModel().getIndex();
    }

    var model = container.getModel();
    var layoutAttributes = model.getLayoutAttributes();
    if (layoutAttributes.getAutoLayout().getValue() === false) {
        return;
    }

    // now check within a grid, where an object shall be inserted. This is done by comparing the current position with the bounding
    // rectangle of the existing items. 
    switch(layoutAttributes.getLayout().getValue()) {
    case "Grid":
        for ( i = 0, n = model._subItems.length; i < n; i++) {
            var item = model._subItems[i];
            if ((this.isSortDesired(item.getType().getValue(), sortSource)) && (drop || item !== selection[0].getModel())) {
                var rect = item.getTranslatedBoundingBox(viewer.getGraph(), new JSG.geometry.BoundingBox(0, 0)).getBoundingRectangle();
                // check, if it is an internal move within the same container
                if (selection && selection.length === 1) {
                    sameParent = (selection[0].getModel().getParent() === item.getParent());
                } else {
                    sameParent = false;
                }
                var constraints = layoutAttributes.getConstraints();
                switch (constraints.flowDirection) {
                case ARAC.layout.config.FlowDirection.ROW_FLOW:
                    if (point.y > rect.y && point.y < rect.y + rect.height / 2) {
                        return {
                            "index" : i,
                            "before" : true
                        };
                    } 
                    if (point.y < rect.getBottom() + constraints.rowGap && point.y >= rect.y + rect.height / 2) {
                        if (sameParent && oldIndex < i && !highLight) {
                            return {
                                "index" : i,
                                "before" : true
                            };
                        } 
                        return {
                            "index" : i,
                            "before" : false
                        };
                    } 
                    if (!i && point.y <= rect.y) {
                        return {
                            "index" : 0,
                            "before" : true
                        };
                    }
                    if (i === n - 1 && point.y >= rect.y + rect.height) {
                        return {
                            "index" : i,
                            "before" : false
                        };
                    }
                    break;
                case ARAC.layout.config.FlowDirection.COL_FLOW:
                    if (point.x > rect.x && point.x < rect.x + rect.width / 2) {
                        return {
                            "index" : i,
                            "before" : true
                        };
                    } 
                    if (point.x < rect.getRight() + constraints.colGap && point.x >= rect.x + rect.width / 2) {
                        if (sameParent && oldIndex < i && !highLight) {
                            return {
                                "index" : i,
                                "before" : true
                            };
                        }
                        return {
                            "index" : i,
                            "before" : false
                        };
                    } 
                    if (!i && point.x <= rect.x) {
                        return {
                            "index" : 0,
                            "before" : true
                        };
                    }
                    if (i === n - 1 && point.x >= rect.x + rect.width) {
                        return {
                            "index" : i,
                            "before" : false
                        };
                    }
                    break;
                }
            }
        }
        break;
    }
};

/**
 * Apply result from the layouter after the layouter calculated the new positions. The bounding box
 * of GraphItems are changed to reflect the layout. In addition necessary changed in the point list
 * of an edge are made.
 * 
 * @method applyLayoutResult
 * @param {type} param_name param_description.
 */

JSGDemo.graph.layout.LayoutManager.prototype.applyLayoutResult = function(model, tracker) {
    var i;

    function layoutItems(progress) {
        function getProgressPoint(point) {
            return new JSG.geometry.Point(point.x * progress, point.y * progress);
        }
        JSG.setDrawingDisabled(true);
        var box = new JSG.geometry.BoundingBox(0, 0);
        var vertices = model.vertices;
        var edges = model.edges;
        var item, vertex;

        for ( i = 0; i < vertices.length; i++) {
            vertex = vertices[i];
            item = vertex.data;
            if (item !== undefined) {
                box = item.getBoundingBox(box);
                var x = box._topleft.x + (vertex.rect.x - box._topleft.x) * progress;
                var y = box._topleft.y + (vertex.rect.y - box._topleft.y) * progress;
                box.setTopLeft(x, y);
                // angle setzen
                if (!item.isCollapsed()) {
                    box.setSize(vertex.rect.width, vertex.rect.height);
                }
                item.setBoundingBoxTo(box);
                if (vertex.label) {
                    item.addLabel(vertex.label);
                }
            }
        }
        for ( i = 0; i < edges.length; i++) {
            var edge = edges[i];
            item = edge.data;
            if (item !== undefined) {
                var points = [];

                if (edge.source.isDummy()) {
                    // source
                    vertex = edge.source;
                    var lastDummyEdge;

                    while (vertex.isDummy()) {
                        lastDummyEdge = vertex.inEdges[0];
                        vertex = vertex.inEdges[0].source;
                    }

                    // first dummy source
                    points.push(getProgressPoint(vertex.rect.getCenter()));

                    // dummy vertices are step points
                    vertex = lastDummyEdge.target;
                    while (vertex.isDummy()) {
                        points.push(getProgressPoint(vertex.rect.getCenter()));
                        vertex = vertex.outEdges[0].target;
                    }

                    // target
                    points.push(getProgressPoint(vertex.rect.getCenter()));

                } else if (edge.target.isDummy()) {
                    // source
                    vertex = edge.source;
                    points.push(getProgressPoint(vertex.rect.getCenter()));

                    // dummy vertices are step points
                    vertex = edge.target;
                    while (vertex.isDummy()) {
                        points.push(getProgressPoint(vertex.rect.getCenter()));
                        vertex = vertex.outEdges[0].target;
                    }

                    // target
                    points.push(getProgressPoint(edge.target.rect.getCenter()));

                } else {
                    points.push(getProgressPoint(edge.source.rect.getCenter()));
                    points.push(getProgressPoint(edge.target.rect.getCenter()));
                }

                item.setPoints(points);
            }
        }
        JSG.setDrawingDisabled(false);

        if (tracker !== undefined) {
            tracker.update();
        }

    }

    if (tracker) {
        var animation = new JSG.anim.Animation(JSG.anim.AnimationType.LINEAR, this);
        //1.5 sec animation...
        animation.start(layoutItems, 1000);
    } else {
        layoutItems(1);
    }

};

JSGDemo.graph.layout.LayoutManager.prototype.isAutoResizeDesired = function(type, containerType) {
    switch (containerType) {
    case "bpmnpool":
    case "bpmnlane":
        switch (type) {
        case "bpmnpoolcontainer":
        case "bpmnlanecontainer":
        case "bpmnpool":
        case "bpmnlane":
            return true;
        default:
            return false;
        }
    case "flowvlane":
        switch (type) {
        case "flowvlanecontainer":
        case "flowvlane":
            return true;
        default:
            return false;
        }
    case "flowhlane":
        switch (type) {
        case "flowhlanecontainer":
        case "flowhlane":
            return true;
        default:
            return false;
        }
    }

    return true;
};

JSGDemo.graph.layout.LayoutManager.prototype.isLayoutDesired = function(type, containerType) {
    switch (containerType) {
    case "bpmnpoolcontainer":
    case "bpmnlanecontainer":
        switch (type) {
        case "bpmnpool":
        case "bpmnlane":
            return true;
        default:
            return false;
        }
    case "flowvlanecontainer":
        switch (type) {
        case "flowvlane":
            return true;
        default:
            return false;
        }
    case "flowhlanecontainer":
        switch (type) {
        case "flowhlane":
            return true;
        default:
            return false;
        }
    }

    return true;
};

JSGDemo.graph.layout.LayoutManager.prototype.isSortDesired = function(type1, type2) {

    switch (type1) {
    case "bpmnpool":
    case "bpmnlane":
        switch (type2) {
        case "bpmnpool":
        case "bpmnlane":
            return true;
        }
        break;
    case "flowvlane":
        switch (type2) {
        case "flowvlane":
            return true;
        }
        break;
    case "flowhlane":
        switch (type2) {
        case "flowhlane":
            return true;
        }
        break;
    }

    return false;
};


JSGDemo.namespace("JSGDemo.graph.interaction");

/**
 * Custom InteractionHandler to handle events within the JSGDemo context.</br>
 * A typical customization is to display a context menu on right button mouse click.
 *
 * @class InteractionHandler
 * @extends JSG.graph.interaction.InteractionHandler
 * @constructor
 * @param {JSG.ui.viewer.GraphViewer} viewer Viewer to use in InteractionHandler
 */
JSGDemo.graph.interaction.InteractionHandler = function(viewer) {
    JSGDemo.graph.interaction.InteractionHandler._super.constructor.apply(this, arguments);
};
JSG.extend(JSGDemo.graph.interaction.InteractionHandler, JSG.graph.interaction.InteractionHandler);

/**
 * A global point object to store event location. Note that this object is reused for each mouse
 * event!
 *
 * @property _eventLocation
 * @type {JSG.geometry.Point}
 * @private
 */
JSGDemo.graph.interaction.InteractionHandler.prototype._eventLocation = new JSG.geometry.Point(0, 0);

/**
 * Called in {{#crossLink "JSG.graph.interaction.InteractionHandler/handleMouseEvent:method"}}{{/crossLink}}
 * if a mouse down event occurred with right button pressed.<br/>
 * Here we use the event to display a context menu.
 *
 * @method handleRightClick
 * @param {JSG.ui.events.MouseEvent} event The mouse down event which is currently handled.
 */
JSGDemo.graph.interaction.InteractionHandler.prototype.handleRightClick = function(event) {
	JSGDemo.graph.interaction.InteractionHandler._super.handleRightClick.call(this, event);
	this.showContextMenu(event);
};

/**
 * Build and display a context menu.
 *
 * @method showContextMenu
 * @param {JSG.ui.events.MouseEvent} event The mouse down event which is currently handled.
 */
JSGDemo.graph.interaction.InteractionHandler.prototype.showContextMenu = function(event) {
	var interaction = this.getActiveInteraction();
	
	event.consume();
	this._eventLocation.setTo(event.location);

    // clear old menu, if existing
	if (this._mnuContext !== undefined) {
		this._mnuContext.removeAll();
	}

    // build menu, if in polygon or bezier edit mode. The menu allows removing and changing points.
	if ( interaction instanceof JSG.graph.interaction.EditShapeInteraction) {
		this._mnuContext = new Ext.menu.Menu({
			interactionHandler : this,
			listeners : {
				hide : function(mnuContext) {
					Ext.destroy(mnuContext);
				}
			},

			items : [{
				text : JSGDemo.resourceProvider.getString("Delete Point"),
				disabled : !interaction._marker || interaction._editview.getMarkerCount() < 3 || interaction._marker.isTemporary === true,
				scope : this,
				handler : function() {
					this.viewer.translateFromParent(this._eventLocation);
					var interaction = this.getActiveInteraction();
					var marker = interaction.getMarkerAt(this._eventLocation, this.viewer);
					if (marker) {
						interaction.deleteMarker(marker);
				    }
				}
            }, {
                text : JSGDemo.resourceProvider.getString("Change to Edge"),
                disabled : !interaction._marker || interaction._marker.isTemporary === true || interaction._item.getShape().getType() !== 'bezier',
                scope : this,
                handler : function() {
                    this.viewer.translateFromParent(this._eventLocation);
                    var interaction = this.getActiveInteraction();
                    var marker = interaction.getMarkerAt(this._eventLocation, this.viewer);
                    if (marker) {
                        interaction.changeMarkerToEdge(marker);
                    }
                }
            }, {
                text : JSGDemo.resourceProvider.getString("Change to Curve"),
                disabled : !interaction._marker || interaction._marker.isTemporary === true || interaction._item.getShape().getType() !== 'bezier',
                scope : this,
                handler : function() {
                    this.viewer.translateFromParent(this._eventLocation);
                    var interaction = this.getActiveInteraction();
                    var marker = interaction.getMarkerAt(this._eventLocation, this.viewer);
                    if (marker) {
                        interaction.changeMarkerToCurve(marker);
                    }
                }
            }, '-', {
				text : JSGDemo.resourceProvider.getString(interaction._item.isClosed() ? "Open Shape" : "Close Shape"),
				scope : this,
				handler : function() {
					var close = interaction._item.isClosed() ? false : true;
					var item = interaction._item;
					var path = JSG.graph.attr.AttributeUtils.createPath(JSG.graph.attr.ItemAttributes.NAME, JSG.graph.attr.ItemAttributes.CLOSED);
					this.getActiveInteraction().close(close);
					this.execute(new JSG.graph.command.ChangeAttributeCommand(item, path, close));
				}
			}, '-', {
                text : JSGDemo.resourceProvider.getString("Finish editing"),
                scope : this,
                handler : function() {
                    interaction.didFinish(event, this.viewer);
                }
            }]
		});
	} else {
	    // Build context menu. The Menu depends on the selection state
		var selection = this.viewer.getSelection();
		this._mnuContext = new Ext.menu.Menu({
			interactionHandler : this,
			listeners : {
				hide : function(mnuContext) {
					Ext.destroy(mnuContext);
				}
			},
			items : [{
				text : JSGDemo.resourceProvider.getString("Copy"),
				disabled : selection.length === 0,
				icon : 'resources/icons/copysmall.png',
				scope : this,
				handler : function() {
					this.copySelection();
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Copy Format"),
				disabled : selection.length === 0,
				icon : 'resources/icons/copyformatsmall.png',
				scope : this,
				handler : function() {
					this.copySelectionFormat();
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Cut"),
				disabled : selection.length === 0,
				icon : 'resources/icons/cutsmall.png',
				scope : this,
				handler : function() {
					this.cutSelection();
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Paste"),
				disabled : !this.isPasteAvailable(),
				icon : 'resources/icons/pastesmall.png',
				scope : this,
				handler : function() {
					this.paste();
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Paste Format"),
				disabled : !this.isPasteFormatAvailable(),
				icon : 'resources/icons/pasteformatsmall.png',
				scope : this,
				handler : function() {
					this.pasteFormat();
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Delete"),
				disabled : selection.length === 0,
				icon : 'resources/icons/deletesmall.png',
				scope : this,
				handler : function() {
					this.deleteSelection();
				}
			}, {
				xtype : 'menuseparator'
			}, {
				text : JSGDemo.resourceProvider.getString("Add Label"),
				disabled : selection.length === 0,
				icon : 'resources/icons/textsmall.png',
				scope : this,
				handler : function() {
					var selection = this.viewer.getSelection();
					this.execute(new JSG.graph.command.AddLabelCommand(selection[0].getModel(), "Label"));
					this.repaint();
				}
			}, {
				xtype : 'menuseparator'
			}]
		});
		if (selection && selection.length > 0) {
			if (selection.length === 1) {
				var selItem = selection[0].getModel();
				var shape = selItem.getShape();
				switch (shape.getType()) {
					case "polygon":
					case "bezier":
						this._mnuContext.add({
							text : JSGDemo.resourceProvider.getString("Edit Points Menu"),
							icon : 'resources/icons/editpointssmall.png',
							scope : this,
							handler : function() {
								this.editSelection();
							}
						}, {
							text : JSGDemo.resourceProvider.getString(selection[0].getModel().isClosed() ? "Open Shape" : "Close Shape"),
							scope : this,
							handler : function() {
								var item = selection[0].getModel();
								var close = item.isClosed() ? false : true;
								var path = JSG.graph.attr.AttributeUtils.createPath(JSG.graph.attr.ItemAttributes.NAME, JSG.graph.attr.ItemAttributes.CLOSED);
								this.execute(new JSG.graph.command.ChangeAttributeCommand(item, path, close));
							}
						}, {
							xtype : 'menuseparator'
						});
						break;
				}
				this._mnuContext.add({
					text : JSGDemo.resourceProvider.getString("Ungroup"),
					icon : 'resources/icons/ungroupsmall.png',
					disabled : !(selItem instanceof JSG.graph.model.Group),
					scope : this,
					handler : function() {
						this.ungroupSelection();
					}
				});
			} else if (selection.length > 1) {
				this._mnuContext.add({
					text : JSGDemo.resourceProvider.getString("Group"),
					icon : 'resources/icons/groupsmall.png',
					scope : this,
					handler : function() {
						this.groupSelection();
					}
				});
			}
			this._mnuContext.add({
				xtype : 'menuseparator'
			}, {
				text : JSGDemo.resourceProvider.getString("Move to Top"),
				icon : 'resources/icons/ordertopsmall.png',
				scope : this,
				handler : function() {
					this.changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.TOTOP);
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Move up"),
				icon : 'resources/icons/ordertotopsmall.png',
				scope : this,
				handler : function() {
					this.changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.UP);
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Move to Bottom"),
				icon : 'resources/icons/orderbottomsmall.png',
				scope : this,
				handler : function() {
					this.changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.TOBOTTOM);
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Move down"),
				icon : 'resources/icons/ordertobottomsmall.png',
				scope : this,
				handler : function() {
					this.changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.DOWN);
				}
			});
		} else {
			this._mnuContext.add({
				text : JSGDemo.resourceProvider.getString("Undo"),
				icon : 'resources/icons/undosmall.png',
				disabled : !this.isUndoAvailable(),
				scope : this,
				handler : function() {
					this.undo();
				}
			}, {
				text : JSGDemo.resourceProvider.getString("Redo"),
				icon : 'resources/icons/redosmall.png',
				disabled : !this.isRedoAvailable(),
				scope : this,
				handler : function() {
					this.redo();
				}
			});
		}
	}

    // finally show menu
	this._mnuContext.showAt(event.windowLocation);
};

/**
 * Called when a model with a link is selected.</br>
 * See {{#crossLink "JSG.graph.model.GraphItem/getLink:method"}}{{/crossLink}}.
 * 
 * @method executeLink
 * @param {JSG.graph.controller.ModelController} controller The corresponding model controller.
 */
JSGDemo.graph.interaction.InteractionHandler.prototype.executeLink = function(controller) {
    var link = controller.getModel().getLink().getValue();
    if (!link.length) {
        return;
    }
    
    var parts = link.split(":");
    if (parts.length < 2) {
        return;
    }
    
    switch (parts[0]) {
        case "file":
            JSGDemo.viewport.setActiveEditorById(parts[1]);    
            return;
    }
    
    JSGDemo.graph.interaction.InteractionHandler._super.executeLink.call(this, controller);
};


/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Small model used in the grid in the dialog for each layer.
 *
 * @class filtermodel
 * @extends Ext.data.Model
 */
Ext.define('filtermodel', {
    extend : 'Ext.data.Model',
    fields : [{
        name : 'name',
        type : 'string'
    }, {
        name : 'visible',
        type : 'bool'
    }, {
        name : 'selectable',
        type : 'bool'
    }]
});

/**
 * Ext derived class for a dialog to define a filter. Filters can be used to show or hide
 * GraphItems that have the filter name assigned to its layer attribute. So if you define
 * a filter called 'Background' using this dialog and assign 'Background' as the value for
 * the layer attribute of the graph item (item.setLayer('Background')), the item will be hidden,
 * if the layer property visible is changed to false.
 *
 * @class JSGDemo.view.FilterDialog
 * @extends Ext.window.Window
 * @constructor
 */
Ext.define('JSGDemo.view.FilterDialog', {
    extend : 'Ext.window.Window',
    alias : 'widget.filterdialog',
    id : 'layerdlg',
    height : 300,
    width : 400,
    modal : true,
    title : JSGDemo.resourceProvider.getString("Filter Settings"),
    layout : 'fit',
    items : [{
        xtype : 'panel',
        layout : 'fit',
        width : 500,
        bodyPadding : '10 10 10 10',
        items : [{
            xtype : 'gridpanel',
            id : 'layergrid',
            store : Ext.create('Ext.data.ArrayStore', {
                model : 'filtermodel',
                autoSync : true
            }),
            height : 300,
            plugins : Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit : 1,
                pluginId : 'cellplugin'
            }),
            columns : [{
                id : 'name',
                text : JSGDemo.resourceProvider.getString("Name"),
                flex : 1,
                sortable : true,
                dataIndex : 'name',
                editor : 'textfield'
            }, {
                xtype : 'checkcolumn',
                text : JSGDemo.resourceProvider.getString("Visible"),
                width : 75,
                sortable : true,
                dataIndex : 'visible'
            }, {
                xtype : 'checkcolumn',
                text : JSGDemo.resourceProvider.getString("Selectable"),
                width : 75,
                sortable : true,
                dataIndex : 'selectable'
            }]
        }],
        buttons : [{
            text : JSGDemo.resourceProvider.getString("Add"),
            handler : function() {
                // add a layer to the store, which will be reflected in the grid
                var win = this.up('window');
                var grid = win.down('gridpanel');
                var store = grid.getStore();
                var layer;
                var name = 'New Filter ';
                var i, n;
                do {
                    layer = true;
                    name += '1';
                    for (i = 0, n = store.getCount(); i < n; i++) {
                        var rec = store.getAt(i);
                        if (rec.get('name') === name) {
                            layer = false;
                            break;
                        }
                    }
                } while (!layer);
                store.add({
                    name : name,
                    visible : true,
                    selectable : true
                });
            }
        }, {
            text : JSGDemo.resourceProvider.getString("OK"),
            handler : function(button) {
                // add a layer to the graph 
                var win = this.up('window');
                var grid = win.down('gridpanel');
                var store = grid.getStore();
                var i, n;
                // TODO create command
                for (i = 0, n = store.getCount(); i < n; i++) {
                    var rec = store.getAt(i);
                    var layer = win.jsgEditor.getGraph().getLayer(rec.get('name'));
                    if (layer !== undefined) {
                        layer.visible = rec.get('visible');
                        layer.selectable = rec.get('selectable');
                    }
                }
                win.jsgEditor.invalidate();
                win.close();
            }
        }, {
            text : JSGDemo.resourceProvider.getString("Cancel"),
            handler : function() {
                var win = this.up('window');
                win.close();
            }
        }]
    }],
    setEditor : function(editor) {
        // get the layers from the graph and put them into the grid store
        var layerData = editor.getGraph()._layers.elements();
        var grid = this.down('gridpanel');
        grid.getStore().loadData(layerData);
        this.jsgEditor = editor;
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to define the settings for the fillcolor. A button is created, which
 * initiates a menu containing a color picker to select the color, a none menu item to remove the color,
 * a menu entry to select a gradient type and color and a slider to define the transparency.
 *
 * @class FillButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.FillButton', {
    extend : 'Ext.Button',
    alias : 'widget.fillbutton',
    cls : 'x-btn-icon',
    icon : 'resources/icons/colorfill.png',
    menu : {
        plain : true,
        listeners : {
            show : function(menu, eOpts) {
                // before the menu is shown the transparency slider and color value is initialized
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        var f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                        if (f !== undefined) {
                            var sldTransparency = menu.down('slider');
                            if (f.getTransparency() !== undefined) {
                                sldTransparency.setValue(100 - f.getTransparency());
                            }
                            var textField = menu.down('textfield');
                            if (f.getFillColor() === undefined) {
                                textField.setValue("");
                            } else {
                                textField.setValue(f.getFillColor().getValue());
                            }
                        }
                    }
                }
            }
        },
        items : [{
            xtype : 'colorpicker',
            width : 198,
            height : 198,
            value : 'FFFFFF',
            colors : JSG.colors,
            listeners : {
                select : function(colorPick, selectedColor) {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (!editor) {
                        return;
                    }
                    // get format of selected graph items
                    var f;
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                    }

                    // assign new color to format map
                    var formatmap = new JSG.commons.Map();
                    formatmap.put(JSG.graph.attr.FormatAttributes.FILLCOLOR, "#" + selectedColor);
                    // change fill style, if current fill style is NONE
                    if (f !== undefined && f.getFillStyle() === JSG.graph.attr.FormatAttributes.FillStyle.NONE) {
                        formatmap.put(JSG.graph.attr.FormatAttributes.FILLSTYLE, JSG.graph.attr.FormatAttributes.FillStyle.SOLID);
                    }
                    editor.getInteractionHandler().applyFormatMap(formatmap);

                    // update color value
                    var cmp = colorPick.up('menu');
                    var textField = cmp.down('textfield');
                    textField.setValue("#" + selectedColor);
                }
            }
        }, {
            xtype : 'textfield',
            width : 180,
            enableKeyEvents : true,
            fieldLabel : JSGDemo.resourceProvider.getString("Custom:"),
            fieldStyle : {
                'fontSize' : '8pt'
            },
            style : {
                'margin' : '5px',
                'fontSize' : '8pt'
            },
            listeners : {
                'keyup' : function(textfield, event) {
                    // change fill color, if a new color value is entered
                    var v = textfield.getValue();
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (!editor) {
                        return;
                    }
                    var f;
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                    }

                    // assign new color to format map
                    var formatmap = new JSG.commons.Map();
                    formatmap.put(JSG.graph.attr.FormatAttributes.FILLCOLOR, v);
                    // change fill style, if current fill style is NONE
                    if (f !== undefined && f.getFillStyle() === JSG.graph.attr.FormatAttributes.FillStyle.NONE) {
                        formatmap.put(JSG.graph.attr.FormatAttributes.FILLSTYLE, JSG.graph.attr.FormatAttributes.FillStyle.SOLID);
                    }
                    editor.getInteractionHandler().applyFormatMap(formatmap);
                    textfield.focus();
                }
            }
        }, {
            text : JSGDemo.resourceProvider.getString("None"),
            handler : function() {
                // change fill style to none
                var editor = JSGDemo.viewport.getActiveEditor();
                if (!editor) {
                    return;
                }
                var formatmap = new JSG.commons.Map();
                formatmap.put(JSG.graph.attr.FormatAttributes.FILLSTYLE, JSG.graph.attr.FormatAttributes.FillStyle.NONE);
                editor.getInteractionHandler().applyFormatMap(formatmap);
            }
        }, '-', {
            text : JSGDemo.resourceProvider.getString("Gradient"),
            menu : {
                plain : true,
                items : [{
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Style:"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'buttongroup',
                    columns : 6,
                    style : {
                        backgroundColor : "transparent",
                        borderColor : "transparent"
                    },
                    items : [{
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear Left Right"),
                        style : {
                            background : "url(resources/icons/gradientlr.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(0);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear Right Left"),
                        style : {
                            background : "url(resources/icons/gradientrl.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(180);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear Top Bottom"),
                        style : {
                            background : "url(resources/icons/gradienttb.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(90);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear Bottom Top"),
                        style : {
                            background : "url(resources/icons/gradientbt.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(270);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear 45 degrees"),
                        style : {
                            background : "url(resources/icons/gradient45.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(45);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear 135 degrees"),
                        style : {
                            background : "url(resources/icons/gradient135.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 0px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(135);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear 225 degrees"),
                        style : {
                            background : "url(resources/icons/gradient225.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(225);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Linear 315 degrees"),
                        style : {
                            background : "url(resources/icons/gradient315.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setLinearGradient(315);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Radial Top Left"),
                        style : {
                            background : "url(resources/icons/gradientctl.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setRadialGradient(0, 0);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Radial Top Right"),
                        style : {
                            background : "url(resources/icons/gradientctr.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setRadialGradient(100, 0);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Radial Bottom Right"),
                        style : {
                            background : "url(resources/icons/gradientcrb.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setRadialGradient(100, 100);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Radial Bottom Left"),
                        style : {
                            background : "url(resources/icons/gradientcbl.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 0px 3px 3px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setRadialGradient(0, 100);
                        }
                    }, {
                        xtype : 'button',
                        width : 28,
                        height : 28,
                        tooltip : JSGDemo.resourceProvider.getString("Radial from Center"),
                        style : {
                            background : "url(resources/icons/gradientcout.png)",
                            backgroundRepeat : "no-repeat",
                            margin : "3px 3px 3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('menu').setRadialGradient(50, 50);
                        }
                    }]
                }, {
                    text : JSGDemo.resourceProvider.getString("No Gradient"),
                    style : {
                        margin : "3px 3px 3px 3px"
                    },
                    handler : function() {
                        // replace gradient style by fill style solid
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor) {
                            var formatmap = new JSG.commons.Map();
                            formatmap.put(JSG.graph.attr.FormatAttributes.FILLSTYLE, JSG.graph.attr.FormatAttributes.FillStyle.SOLID);
                            editor.getInteractionHandler().applyFormatMap(formatmap);
                        }
                    }
                }, {
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Target Color"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'colorpicker',
                    width : 198,
                    height : 198,
                    colors : JSG.colors,
                    listeners : {
                        select : function(colorPick, selectedColor) {
                            // set target color for gradient
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var formatmap = new JSG.commons.Map();
                                formatmap.put(JSG.graph.attr.FormatAttributes.GRADIENTCOLOR, "#" + selectedColor);
                                editor.getInteractionHandler().applyFormatMap(formatmap);
                            }
                        }
                    }
                }],
                setLinearGradient : function(angle) {
                    // assign a new linear gradient by setting the fill style, the gradient type and an angle.
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.FILLSTYLE, JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
                        formatmap.put(JSG.graph.attr.FormatAttributes.GRADIENTTYPE, JSG.graph.attr.FormatAttributes.GradientStyle.LINEAR);
                        formatmap.put(JSG.graph.attr.FormatAttributes.GRADIENTANGLE, angle);
                        editor.getInteractionHandler().applyFormatMap(formatmap);
                    }
                },
                setRadialGradient : function(x, y) {
                    // assign a radial gradient by setting the fill style to GRADIENT and settings the gradient type to RADIAL and defining a center for the gradient
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.FILLSTYLE, JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
                        formatmap.put(JSG.graph.attr.FormatAttributes.GRADIENTTYPE, JSG.graph.attr.FormatAttributes.GradientStyle.RADIAL);
                        formatmap.put(JSG.graph.attr.FormatAttributes.GRADIENTOFFSET_X, x);
                        formatmap.put(JSG.graph.attr.FormatAttributes.GRADIENTOFFSET_Y, y);
                        editor.getInteractionHandler().applyFormatMap(formatmap);
                    }
                }
            }
        }, '-', {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Transparency"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'slider',
            value : 20,
            increment : 10,
            minValue : 0,
            maxValue : 100,
            width : 198,
            style : {
                'margin' : '5px'
            },
            listeners : {
                change : function(slider, newValue, thumb, eOpts) {
                    // assign new transparency value
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (!editor || !JSG.Numbers.isNumber(newValue)) {
                        return;
                    }
                    var formatmap = new JSG.commons.Map();
                    newValue = Math.max(Math.min(newValue, 100), 0);
                    formatmap.put(JSG.graph.attr.FormatAttributes.TRANSPARENCY, 100 - newValue);
                    editor.getInteractionHandler().applyFormatMap(formatmap);
                }
            }
        }]
    }
});


/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to show a selection of available predefined shaoes. A menu with a button
 * group with the available shaoe types is build, when the button is clicked. If a line type is selected, the 
 * shape is created and an interaction to create the line is initialized and activated.
 *
 * @class JSGDemo.view.ShapesButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.ShapesButton', {
    extend : 'Ext.SplitButton',
    alias : 'widget.shapesbutton',
    cls : 'x-btn-icon',
    id : 'jsgshapesbtn',
    icon : 'resources/icons/shapes/polyedge4.png',
    iconAlign : 'right',
    arrowAlign : 'right',
    tooltip : JSGDemo.resourceProvider.getString("Create Shape"),
    createItem : function(btn) {
        // create item using name from button id and start create interaction
        var node = JSG.graphItemFactory.createItemFromString(btn.getId());
        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateItemInteraction(node));
        this.selectedItem = btn.getId();
        // set the selected shape as the icon for the button
        var icon = this.selectedItem; //to be removed...
        this.setIcon('resources/icons/shapes/' + icon + '.png');
        this.menu.hide();
    },
    selectedItem : "polyedge4",
    handler : function(button) {
        // if you click on the button the last selected shape type is created
        var node = JSG.graphItemFactory.createItemFromString(button.selectedItem);
        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateItemInteraction(node));
    },
    menu : {
        plain : true,
        items : [{
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("General"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            columns : 6,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            defaults : {
                scale : 'medium'
            },
            items : [{
                icon : 'resources/icons/shapes/polyedge4.png',
                id : 'polyedge4',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/polyedge5.png',
                id : 'polyedge5',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/polyedge6.png',
                id : 'polyedge6',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/polyedge8.png',
                id : 'polyedge8',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/polyedge10.png',
                id : 'polyedge10',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/polyedge12.png',
                id : 'polyedge12',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/triangleleft.png',
                id : 'triangleLeft',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/triangletop.png',
                id : 'triangleTop',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/triangleright.png',
                id : 'triangleRight',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/trianglebottom.png',
                id : 'triangleBottom',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/bracketsimpleboth.png',
                id : 'bracketSimpleBoth',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/bracketsimpleleft.png',
                id : 'bracketSimpleLeft',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/bracketsimpleright.png',
                id : 'bracketSimpleRight',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/bracketcurvedboth.png',
                id : 'bracketCurvedBoth',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/bracketcurvedleft.png',
                id : 'bracketCurvedLeft',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/bracketcurvedright.png',
                id : 'bracketCurvedRight',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/cube.png',
                id : 'cube',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/cylinder.png',
                id : 'cylinder',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Arrows"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            columns : 6,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            defaults : {
                scale : 'medium'
            },
            items : [{
                icon : 'resources/icons/shapes/arrowleft.png',
                id : 'arrowLeft',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/arrowright.png',
                id : 'arrowRight',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/arrowup.png',
                id : 'arrowUp',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/arrowdown.png',
                id : 'arrowDown',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/arrowdblvert.png',
                id : 'arrowDblVert',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/arrowdblhorz.png',
                id : 'arrowDblHorz',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Rectangles"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            columns : 6,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            defaults : {
                scale : 'medium'
            },
            items : [{
                icon : 'resources/icons/shapes/rect.png',
                id : 'rect',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/rectcornercut.png',
                id : 'rectCornerCut',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/rectcornercutsame.png',
                id : 'rectCornerCutSame',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/rectcornercutdiagonal.png',
                id : 'rectCornerCutDiagonal',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/roundrect.png',
                id : 'roundRect',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/roundrectcornercut.png',
                id : 'roundRectCornerCut',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/roundrectcornercutsame.png',
                id : 'roundRectCornerCutSame',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/roundrectcornercutdiagonal.png',
                id : 'roundRectCornerCutDiagonal',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Stars"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        },  {
            xtype : 'buttongroup',
            columns : 6,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            defaults : {
                scale : 'medium'
            },
            items : [{
                icon : 'resources/icons/shapes/star3.png',
                id : 'star3',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/star4.png',
                id : 'star4',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/star5.png',
                id : 'star5',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/star6.png',
                id : 'star6',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/star8.png',
                id : 'star8',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/star12.png',
                id : 'star12',
                handler : function() {
                    Ext.getCmp('jsgshapesbtn').createItem(this);
                }
            }]
        }]
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to show a selection of available predefined line types. A menu with a button
 * group with the available line types is build, when the button is clicked. If a line type is selected, the 
 * line is created and an interaction to create the line is initialized and activated.
 *
 * @class JSGDemo.view.LinesButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.LinesButton', {
    extend : 'Ext.SplitButton',
    alias : 'widget.linesbutton',
    cls : 'x-btn-icon',
    id : 'jsglinesbtn',
    icon : 'resources/icons/shapes/edge.png',
    iconAlign : 'right',
    arrowAlign : 'right',
    tooltip : JSGDemo.resourceProvider.getString("Create Line"),
    createItem : function(btn) {
        var label;
        var item;
        if (btn) {
            this.selectedItem = btn.getId();
        }
        // create item
        switch (this.selectedItem) {
            case "edgeLabel":
                label = JSGDemo.resourceProvider.getString('Label');
                item = JSG.graphItemFactory.createItemFromString('edge');
                break;
            case "orthogonalEdgeLabel":
                label = JSGDemo.resourceProvider.getString('Label');
                item = JSG.graphItemFactory.createItemFromString('orthogonalEdge');
                break;
            case "orthogonalRoundedEdgeLabel":
                label = JSGDemo.resourceProvider.getString('Label');
                item = JSG.graphItemFactory.createItemFromString('orthogonalRoundedEdge');
                break;
            default:
                item = JSG.graphItemFactory.createItemFromString(this.selectedItem);
                break;
        }

        // create and activate appropriate interaction
        if (item.getShape() instanceof JSG.graph.model.shapes.OrthoLineShape) {
            JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateOrthoEdgeInteraction(item, undefined, label));
        } else {
            JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateEdgeInteraction(item, label));
        }

        this.setIcon('resources/icons/shapes/' + this.selectedItem.toLowerCase() + '.png');
        this.menu.hide();
    },
    selectedItem : "edge",
    handler : function(button) {
        button.createItem();
    },
    menu : {
        plain : true,
        items : [{
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Straight"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            columns : 6,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            defaults : {
                scale : 'medium'
            },
            items : [{
                icon : 'resources/icons/shapes/edge.png',
                id : 'edge',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/edgearrow.png',
                id : 'edgeArrow',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/edgedoublearrow.png',
                id : 'edgeDoubleArrow',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/edgelabel.png',
                id : 'edgeLabel',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Orthogonal"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            columns : 4,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            defaults : {
                scale : 'medium'
            },
            items : [{
                icon : 'resources/icons/shapes/orthogonaledge.png',
                id : 'orthogonalEdge',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonaledgearrow.png',
                id : 'orthogonalEdgeArrow',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonaledgedoublearrow.png',
                id : 'orthogonalEdgeDoubleArrow',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonaledgelabel.png',
                id : 'orthogonalEdgeLabel',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonalroundededge.png',
                id : 'orthogonalRoundedEdge',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonalroundededgearrow.png',
                id : 'orthogonalRoundedEdgeArrow',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonalroundededgedoublearrow.png',
                id : 'orthogonalRoundedEdgeDoubleArrow',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }, {
                icon : 'resources/icons/shapes/orthogonalroundededgelabel.png',
                id : 'orthogonalRoundedEdgeLabel',
                handler : function() {
                    Ext.getCmp('jsglinesbtn').createItem(this);
                }
            }]
        }]
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to define the settings for the line. A button is created, which
 * initiates a menu containing a color picker to select the line color, a none menu item to hide the line,
 * a menu entries define line width, style and arrows. The handlers fill the a format map and call
 * the interaction handler to assign the new settings to the selection.
 *
 * @class JSGDemo.view.LineButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.LineButton', {

    extend : 'Ext.Button',
    alias : 'widget.linebutton',
    cls : 'x-btn-icon',
    tooltip : JSGDemo.resourceProvider.getString("Define Line"),
    // utility functions to set line width, style and arrows
    setLineWidth : function(width) {
        var editor = JSGDemo.viewport.getActiveEditor();
        if (editor) {
            var formatmap = new JSG.commons.Map();
            formatmap.put(JSG.graph.attr.FormatAttributes.LINEWIDTH, width);
            editor.getInteractionHandler().applyFormatMap(formatmap);
        }
    },
    setLineStyle : function(type) {
        var editor = JSGDemo.viewport.getActiveEditor();
        if (editor) {
            var formatmap = new JSG.commons.Map();
            formatmap.put(JSG.graph.attr.FormatAttributes.LINESTYLE, type);
            editor.getInteractionHandler().applyFormatMap(formatmap);
        }
    },
    setLineCap : function(type) {
        var editor = JSGDemo.viewport.getActiveEditor();
        if (editor) {
            var formatmap = new JSG.commons.Map();
            formatmap.put(JSG.graph.attr.FormatAttributes.LINECAP, type);
            editor.getInteractionHandler().applyFormatMap(formatmap);
        }
    },
    setStartArrow : function(type) {
        var editor = JSGDemo.viewport.getActiveEditor();
        if (editor) {
            var formatmap = new JSG.commons.Map();
            formatmap.put(JSG.graph.attr.FormatAttributes.LINEARROWSTART, type);
            editor.getInteractionHandler().applyFormatMap(formatmap);
        }
    },
    setEndArrow : function(type) {
        var editor = JSGDemo.viewport.getActiveEditor();
        if (editor) {
            var formatmap = new JSG.commons.Map();
            formatmap.put(JSG.graph.attr.FormatAttributes.LINEARROWEND, type);
            editor.getInteractionHandler().applyFormatMap(formatmap);
        }
    },
    menu : {
        plain : true,
        listeners : {
            show : function(menu, eOpts) {
                // initialize color field on menu show
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        var f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                        if (f !== undefined) {
                            var textField = menu.down('textfield');
                            if (f.getLineColor() === undefined) {
                                textField.setValue("");
                            } else {
                                textField.setValue(f.getLineColor().getValue());
                            }
                        }
                    }
                }
            }
        },
        items : [{
            xtype : 'colorpicker',
            width : 198,
            height : 198,
            value : 'FFFFFF',
            colors : JSG.colors,
            listeners : {
                select : function(colorPick, selectedColor) {
                    // change the line color
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (!editor) {
                        return;
                    }
                    var f;
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                    }
                    var formatmap = new JSG.commons.Map();
                    formatmap.put(JSG.graph.attr.FormatAttributes.LINECOLOR, "#" + selectedColor);
                    // show line, if color assigned
                    if (f !== undefined && f.getLineStyle() === JSG.graph.attr.FormatAttributes.LineStyle.NONE) {
                        formatmap.put(JSG.graph.attr.FormatAttributes.LINESTYLE, JSG.graph.attr.FormatAttributes.LineStyle.SOLID);
                    }
                    editor.getInteractionHandler().applyFormatMap(formatmap);

                    // update color value field
                    var cmp = colorPick.up('menu');
                    var textField = cmp.down('textfield');
                    textField.setValue("#" + selectedColor);
                }
            }
        }, {
            xtype : 'textfield',
            width : 180,
            enableKeyEvents : true,
            fieldLabel : JSGDemo.resourceProvider.getString("Custom:"),
            fieldStyle : {
                'fontSize' : '8pt'
            },
            style : {
                'margin' : '5px',
                'fontSize' : '8pt'
            },
            listeners : {
                'keyup' : function(textfield, event) {
                    var v = textfield.getValue();
                    // assign the color entered into the text field
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (!editor) {
                        return;
                    }
                    var f;
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                    }
                    var formatmap = new JSG.commons.Map();
                    formatmap.put(JSG.graph.attr.FormatAttributes.LINECOLOR, v);
                    if (f !== undefined && f.getLineStyle() === JSG.graph.attr.FormatAttributes.LineStyle.NONE) {
                        formatmap.put(JSG.graph.attr.FormatAttributes.LINESTYLE, JSG.graph.attr.FormatAttributes.LineStyle.SOLID);
                    }
                    editor.getInteractionHandler().applyFormatMap(formatmap);
                    textfield.focus();
                }
            }
        }, {
            text : JSGDemo.resourceProvider.getString("None"),
            handler : function() {
                var editor = JSGDemo.viewport.getActiveEditor();
                if (!editor)
                    return;
                var formatmap = new JSG.commons.Map();
                formatmap.put(JSG.graph.attr.FormatAttributes.LINESTYLE, JSG.graph.attr.FormatAttributes.LineStyle.NONE);
                editor.getInteractionHandler().applyFormatMap(formatmap);
            }
        }, '-', {
            text : JSGDemo.resourceProvider.getString("Width"),
            menu : {
                plain : true,
                width : 181,
                listeners : {
                    show : function(menu, eOpts) {
                        // initialize the slider with the line width
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor) {
                            var selection = editor.getGraphViewer().getSelection();
                            if (selection) {
                                var f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                                if (f !== undefined) {
                                    var sldWidth = menu.down('slider');
                                    if (f.getLineWidth().getValue() !== JSG.graph.attr.FormatAttributes.LineStyle.HAIRLINE) {
                                        sldWidth.setValue(f.getLineWidth().getValue());
                                    }
                                }
                            }
                        }
                    }
                },
                items : [{
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Predefined Width"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'buttongroup',
                    columns : 1,
                    style : {
                        backgroundColor : "transparent",
                        borderColor : "transparent"
                    },
                    items : [{
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidthhairline.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(JSG.graph.attr.FormatAttributes.LineStyle.HAIRLINE);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth05mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(50);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth1mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(100);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth15mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(150);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth2mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(200);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth25mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(250);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth3mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(300);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linewidth35mm.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineWidth(350);
                        }
                    }]
                }, '-', {
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Custom Width"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'slider',
                    style : {
                        'margin' : '5px'
                    },
                    value : 20,
                    increment : 10,
                    minValue : 0,
                    maxValue : 1000,
                    width : 198,
                    listeners : {
                        change : function(slider, newValue, thumb, eOpts) {
                            slider.up('button').setLineWidth(newValue);
                        }
                    }
                }]
            }
        }, {
            text : JSGDemo.resourceProvider.getString("Style"),
            menu : {
                plain : true,
                width : 181,
                items : [{
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Styles"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'buttongroup',
                    columns : 1,
                    style : {
                        backgroundColor : "transparent",
                        borderColor : "transparent"
                    },
                    listeners : {
                        afterrender : function(grp) {
                            this.doLayout();
                        }
                    },
                    items : [{
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linestylesolid.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.SOLID);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linestyledot.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.DOT);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linestyledash.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.DASH);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linestyledashdot.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.DASHDOT);
                        }
                    }]
                }]
            }
        }, {
            text : JSGDemo.resourceProvider.getString("Line Cap"),
            menu : {
                plain : true,
                width : 181,
                items : [{
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Line Cap"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'buttongroup',
                    columns : 1,
                    style : {
                        backgroundColor : "transparent",
                        borderColor : "transparent"
                    },
                    listeners : {
                        afterrender : function(grp) {
                            this.doLayout();
                        }
                    },
                    items : [{
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linecapbutt.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineCap(JSG.graph.attr.FormatAttributes.LineCap.BUTT);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linecapround.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineCap(JSG.graph.attr.FormatAttributes.LineCap.ROUND);
                        }
                    }, {
                        xtype : 'button',
                        width : 160,
                        height : 22,
                        style : {
                            background : "url(resources/icons/linecapsquare.png)",
                            margin : "3px 0px"
                        },
                        handler : function(btn) {
                            btn.up('button').setLineCap(JSG.graph.attr.FormatAttributes.LineCap.SQUARE);
                        }
                    }]
                }]
            }
        }, '-', {
            text : JSGDemo.resourceProvider.getString("Arrow Start"),
            menu : {
                plain : true,
                items : [{
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Arrow Styles"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'buttongroup',
                    columns : 6,
                    style : {
                        backgroundColor : "transparent",
                        borderColor : "transparent"
                    },
                    items : [{
                        icon : 'resources/icons/arrowNone.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.NONE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowFilled.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowHalfFilled.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWHALFFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowHalfFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWHALFFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowNarrowFilled.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWNNARROWFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowNarrowFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWNARROWFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDoubleFilled.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLEFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDoubleFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLEFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/Arrow.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROW);
                        }
                    }, {
                        icon : 'resources/icons/ArrowSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDouble.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDoubleSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLESMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowSingleSide.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWSINGLESIDE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseFilled.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSEFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSEFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverse.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSESMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseNarrow.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSENARROW);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseNarrowSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSENARROWSMALL);
                        }
                    }, {
                        icon : 'resources/icons/LineArrowReverse.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.LINEARROWREVERSE);
                        }
                    }, {
                        icon : 'resources/icons/CircleArrowReverse.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLEARROWREVERSE);
                        }
                    }, {
                        icon : 'resources/icons/Circle.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLE);
                        }
                    }, {
                        icon : 'resources/icons/CircleSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLESMALL);
                        }
                    }, {
                        icon : 'resources/icons/Diamond.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMOND);
                        }
                    }, {
                        icon : 'resources/icons/DiamondSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/DiamondNarrow.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDNARROW);
                        }
                    }, {
                        icon : 'resources/icons/DiamondNarrowSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDNARROWSMALL);
                        }
                    }, {
                        icon : 'resources/icons/CircleDoubleLine.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLEDOUBLELINE);
                        }
                    }, {
                        icon : 'resources/icons/DoubleLine.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DOUBLELINE);
                        }
                    }, {
                        icon : 'resources/icons/Square.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.SQUARE);
                        }
                    }, {
                        icon : 'resources/icons/SquareSmall.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.SQUARESMALL);
                        }
                    }, {
                        icon : 'resources/icons/DiamondLong.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDLONG);
                        }
                    }, {
                        icon : 'resources/icons/ArrowFilledLong.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDLONG);
                        }
                    }, {
                        icon : 'resources/icons/DiagonalLine.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAGONALLINE);
                        }
                    }, {
                        icon : 'resources/icons/CircleSmallAround.png',
                        handler : function(btn) {
                            btn.up('button').setStartArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLESMALLAROUND);
                        }
                    }]
                }]
            }
        }, {
            text : JSGDemo.resourceProvider.getString("Arrow End"),
            menu : {
                plain : true,
                items : [{
                    xtype : 'text',
                    text : JSGDemo.resourceProvider.getString("Arrow Styles"),
                    style : {
                        'font-size' : '8pt',
                        'padding' : '5px',
                        'margin' : '5px',
                        'backgroundColor' : '#DDDDDD'
                    }
                }, {
                    xtype : 'buttongroup',
                    columns : 6,
                    style : {
                        backgroundColor : "transparent",
                        borderColor : "transparent"
                    },
                    items : [{
                        icon : 'resources/icons/arrowNone.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.NONE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowFilled.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowHalfFilled.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWHALFFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowHalfFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWHALFFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowNarrowFilled.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWNNARROWFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowNarrowFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWNARROWFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDoubleFilled.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLEFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDoubleFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLEFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/Arrow.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROW);
                        }
                    }, {
                        icon : 'resources/icons/ArrowSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDouble.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowDoubleSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWDOUBLESMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowSingleSide.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWSINGLESIDE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseFilled.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSEFILLED);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseFilledSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSEFILLEDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverse.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSE);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSESMALL);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseNarrow.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSENARROW);
                        }
                    }, {
                        icon : 'resources/icons/ArrowReverseNarrowSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWREVERSENARROWSMALL);
                        }
                    }, {
                        icon : 'resources/icons/LineArrowReverse.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.LINEARROWREVERSE);
                        }
                    }, {
                        icon : 'resources/icons/CircleArrowReverse.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLEARROWREVERSE);
                        }
                    }, {
                        icon : 'resources/icons/Circle.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLE);
                        }
                    }, {
                        icon : 'resources/icons/CircleSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLESMALL);
                        }
                    }, {
                        icon : 'resources/icons/Diamond.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMOND);
                        }
                    }, {
                        icon : 'resources/icons/DiamondSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDSMALL);
                        }
                    }, {
                        icon : 'resources/icons/DiamondNarrow.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDNARROW);
                        }
                    }, {
                        icon : 'resources/icons/DiamondNarrowSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDNARROWSMALL);
                        }
                    }, {
                        icon : 'resources/icons/CircleDoubleLine.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLEDOUBLELINE);
                        }
                    }, {
                        icon : 'resources/icons/DoubleLine.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DOUBLELINE);
                        }
                    }, {
                        icon : 'resources/icons/Square.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.SQUARE);
                        }
                    }, {
                        icon : 'resources/icons/SquareSmall.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.SQUARESMALL);
                        }
                    }, {
                        icon : 'resources/icons/DiamondLong.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAMONDLONG);
                        }
                    }, {
                        icon : 'resources/icons/ArrowFilledLong.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDLONG);
                        }
                    }, {
                        icon : 'resources/icons/DiagonalLine.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.DIAGONALLINE);
                        }
                    }, {
                        icon : 'resources/icons/CircleSmallAround.png',
                        handler : function(btn) {
                            btn.up('button').setEndArrow(JSG.graph.attr.FormatAttributes.ArrowStyle.CIRCLESMALLAROUND);
                        }
                    }]
                }]
            }
        }]
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to define the settings for a shadow. A button is created, which
 * initiates a menu containing a UI for the shadow settings. The direction, color, depth and blur 
 * of the shadow can be defined. The handlers fill the a format map and call
 * the interaction handler to apply the new settings to the selection.
 *
 * @class JSGDemo.view.ShadowButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.ShadowButton', {
    extend : 'Ext.Button',
    alias : 'widget.shadowbutton',
    text : JSGDemo.resourceProvider.getString("Shadow"),
    cls : 'x-btn-icon',
    icon : 'resources/icons/shadow.png',
    menu : {
        plain : true,
        listeners : {
            show : function(menu, eOpts) {
                // initialize shadow settings
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    var selection = editor.getGraphViewer().getSelection();
                    if (selection) {
                        var f = JSG.graph.attr.FormatAttributes.retainFromSelection(selection);
                        if (f !== undefined) {
                            var sldWidth = Ext.getCmp('shadowdepth');
                            if (f.getShadowOffsetX() === undefined) {
                                sldWidth.setValue(0);
                            } else {
                                sldWidth.setValue(f.getShadowOffsetX().getValue());
                            }
                            var sldBlur = Ext.getCmp('shadowblur');
                            if (f.getShadowBlur() === undefined) {
                                sldBlur.setValue("");
                            } else {
                                sldBlur.setValue(f.getShadowBlur().getValue());
                            }
                        }
                    }
                }
            }
        },
        items : [{
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Direction"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            columns : 5,
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            items : [{
                style : {
                    background : "url(resources/icons/shadownone.png)",
                    backgroundRepeat : "no-repeat"
                },
                width : 34,
                height : 34,
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_X, 0);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_Y, 0);
                        editor.getInteractionHandler().applyFormatMap(formatmap);

                        var sldWidth = Ext.getCmp('shadowdepth');
                        sldWidth.setValue(0);
                    }
                }
            }, {
                style : {
                    background : "url(resources/icons/shadowrightbottom.png)",
                    backgroundRepeat : "no-repeat"
                },
                width : 34,
                height : 34,
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_X, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_Y, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWDIRECTION, JSG.graph.attr.FormatAttributes.ShadowDirection.RIGHTBOTTOM);
                        editor.getInteractionHandler().applyFormatMap(formatmap);

                        var sldWidth = Ext.getCmp('shadowdepth');
                        sldWidth.setValue(200);
                    }
                }
            }, {
                style : {
                    background : "url(resources/icons/shadowleftbottom.png)",
                    backgroundRepeat : "no-repeat"
                },
                width : 34,
                height : 34,
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_X, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_Y, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWDIRECTION, JSG.graph.attr.FormatAttributes.ShadowDirection.LEFTBOTTOM);
                        editor.getInteractionHandler().applyFormatMap(formatmap);

                        var sldWidth = Ext.getCmp('shadowdepth');
                        sldWidth.setValue(200);
                    }
                }
            }, {
                style : {
                    background : "url(resources/icons/shadowrighttop.png)",
                    backgroundRepeat : "no-repeat"
                },
                width : 34,
                height : 34,
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_X, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_Y, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWDIRECTION, JSG.graph.attr.FormatAttributes.ShadowDirection.RIGHTTOP);
                        editor.getInteractionHandler().applyFormatMap(formatmap);

                        var sldWidth = Ext.getCmp('shadowdepth');
                        sldWidth.setValue(200);
                    }
                }
            }, {
                style : {
                    background : "url(resources/icons/shadowlefttop.png)",
                    backgroundRepeat : "no-repeat"
                },
                width : 34,
                height : 34,
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_X, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_Y, 200);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWDIRECTION, JSG.graph.attr.FormatAttributes.ShadowDirection.LEFTTOP);
                        editor.getInteractionHandler().applyFormatMap(formatmap);

                        var sldWidth = Ext.getCmp('shadowdepth');
                        sldWidth.setValue(200);
                    }
                }
            }]
        }, '-', {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Depth"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'slider',
            value : 20,
            increment : 10,
            minValue : 0,
            maxValue : 500,
            id : 'shadowdepth',
            width : 198,
            style : {
                'margin' : '5px'
            },
            listeners : {
                change : function(slider, newValue, thumb, eOpts) {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_X, newValue);
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWOFFSET_Y, newValue);
                        editor.getInteractionHandler().applyFormatMap(formatmap);
                    }
                }
            }
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Blur"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'slider',
            value : 20,
            increment : 10,
            minValue : 0,
            maxValue : 100,
            id : 'shadowblur',
            width : 198,
            style : {
                'margin' : '5px'
            },
            listeners : {
                change : function(slider, newValue, thumb, eOpts) {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWBLUR, newValue);
                        editor.getInteractionHandler().applyFormatMap(formatmap);
                    }
                }
            }
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Shadow Color"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'colorpicker',
            width : 198,
            height : 198,
            colors : JSG.colors,
            listeners : {
                select : function(colorPick, selectedColor) {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.FormatAttributes.SHADOWCOLOR, "#" + selectedColor);
                        editor.getInteractionHandler().applyFormatMap(formatmap);
                    }
                }
            }
        }]
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to define the settings for the font. A button is created, which
 * initiates a menu containing UI items to define the font settings. These items include selector for the font name, size
 * and color as well as items to set the font style.
 *
 * @class JSGDemo.view.FontButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.FontButton', {
    extend : 'Ext.Button',
    alias : 'widget.fontbutton',
    icon : 'resources/icons/fontformat.png',
    cls : 'x-btn-icon',
    tooltip : JSGDemo.resourceProvider.getString("Define Font Format"),
    handler : function() {
        // initialize items in menu
        var editor = JSGDemo.viewport.getActiveEditor();
        if (!editor) {
            return;
        }
        
        // get text setting for selected item
        var selection = editor.getGraphViewer().getSelection();
		var tf = JSG.graph.attr.TextFormatAttributes.retainFromSelection(selection);
        var cmbFont = Ext.getCmp('fontname');
        var cmbSize = Ext.getCmp('fontsize');
        var btnBold = Ext.getCmp('FontBold');
        var btnItalic = Ext.getCmp('FontItalic');
        var btnUnderline = Ext.getCmp('FontUnderline');
        var btnWrap = Ext.getCmp('TextWrap');
        var btnHeight = Ext.getCmp('TextHeight');
        var btnRichText = Ext.getCmp('RichText');
       
        if (tf === undefined) {
            // not available
            cmbFont.setValue("");
            cmbSize.setValue("");
            btnBold.toggle(false);
            btnItalic.toggle(false);
            btnWrap.setValue(0);
            btnUnderline.toggle(false);
            btnRichText.setValue(0);
        } else {
            // initialize font name and size.
            // if the values are undefined, there is a multi selection with different values
            if (tf.getFontName() === undefined) {
                cmbFont.setValue("");
            } else {
                cmbFont.setValue(tf.getFontName().getValue());
            }
            if (tf.getFontSize() === undefined) {
                cmbSize.setValue("");
            } else {
                cmbSize.setValue(String(tf.getFontSize().getValue()));
            }

            // set the style buttons
            var style = tf.getFontStyle();
            if (style === undefined) {
                btnBold.toggle(false);
                btnItalic.toggle(false);
                btnUnderline.toggle(false);
            } else {
                var value = style.getValue();
                btnBold.toggle(value & JSG.graph.attr.TextFormatAttributes.FontStyle.BOLD);
                btnItalic.toggle(value & JSG.graph.attr.TextFormatAttributes.FontStyle.ITALIC);
                btnUnderline.toggle(value & JSG.graph.attr.TextFormatAttributes.FontStyle.UNDERLINE);
            }
            if (selection.length === 1) {
                var selItem = selection[0].getModel();
                if (!(selItem instanceof JSG.graph.model.TextNode)) {
                    selItem = selItem.getTextSubItem();                    
                }
                if (selItem) {
                    var mode = selItem.getItemAttributes().getSizeMode().getValue();
                    btnWrap.setValue((mode & JSG.graph.attr.TextNodeAttributes.SizeMode.WIDTH) ? 1 : 0);
                    btnHeight.setValue((mode & JSG.graph.attr.TextNodeAttributes.SizeMode.HEIGHT) ? 1 : 0);
                }
            } else {
                btnWrap.setValue(0);
                btnHeight.setValue(0);
            }

            if (tf.getRichText() === undefined) {
                btnRichText.setValue(0);
            } else {
                btnRichText.setValue(tf.getRichText().getValue() ? 1 : 0);
            }
        }
    },
    menu : {
        plain : true,
        items : [{
            xtype : 'combobox',
            anchor : '100%',
            id : 'fontname',
            fieldLabel : JSGDemo.resourceProvider.getString('Font Name:'),
            fieldStyle : {
                'fontSize' : '8pt'
            },
            labelWidth : 70,
            editable : false,
            margin : "5px",
            store : Ext.create('Ext.data.Store', {
                fields : ['name'],
                data : [{
                    "name" : "Arial"
                }, {
                    "name" : "Courier New"
                }, {
                    "name" : "Georgia"
                }, {
                    "name" : "Lucida"
                }, {
                    "name" : "Lucida Sans"
                }, {
                    "name" : "Palatino"
                }, {
                    "name" : "Tahoma"
                }, {
                    "name" : "Times New Roman"
                }, {
                    "name" : "Trebuchet MS"
                }, {
                    "name" : "Verdana"
                }]
            }),
            displayField : 'name',
            listeners : {
                select : function(combo, records, eOpts) {
                    // assign a new font name
					var formatmap = new JSG.commons.Map();
                    formatmap.put(JSG.graph.attr.TextFormatAttributes.FONTNAME, records[0].get('name'));
                    JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }
        }, {
            xtype : 'combobox',
            anchor : '100%',
            id : 'fontsize',
            fieldLabel : JSGDemo.resourceProvider.getString('Font Size:'),
            fieldStyle : {
                'fontSize' : '8pt'
            },
            labelWidth : 70,
            margin : "5px",
            store : Ext.create('Ext.data.Store', {
                fields : ['size'],
                data : [{
                    "size" : "8"
                }, {
                    "size" : "9"
                }, {
                    "size" : "10"
                }, {
                    "size" : "11"
                }, {
                    "size" : "12"
                }, {
                    "size" : "14"
                }, {
                    "size" : "18"
                }, {
                    "size" : "24"
                }, {
                    "size" : "30"
                }, {
                    "size" : "36"
                }, {
                    "size" : "48"
                }, {
                    "size" : "60"
                }, {
                    "size" : "72"
                }]
            }),
            displayField : 'size',
            editable : true,
            queryMode : 'local',
            listeners : {
                select : function(combo, records, eOpts) {
                    // assign a new font size
					var formatmap = new JSG.commons.Map();
                    formatmap.put(JSG.graph.attr.TextFormatAttributes.FONTSIZE, Number(records[0].get('size')));
                    JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Style"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            id : 'fontstyle',
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            setFontStyle : function() {
                // use the button states to set the font style
                var style = 0;
                var btnBold = Ext.getCmp('FontBold');
                var btnItalic = Ext.getCmp('FontItalic');
                var btnUnderline = Ext.getCmp('FontUnderline');
                if (btnBold.pressed) {
                    style += JSG.graph.attr.TextFormatAttributes.FontStyle.BOLD;
                }
                if (btnItalic.pressed) {
                    style += JSG.graph.attr.TextFormatAttributes.FontStyle.ITALIC;
                }
                if (btnUnderline.pressed) {
                    style += JSG.graph.attr.TextFormatAttributes.FontStyle.UNDERLINE;
                }
				var formatmap = new JSG.commons.Map();
                formatmap.put(JSG.graph.attr.TextFormatAttributes.FONTSTYLE, style);
                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
            },
            items : [{
                style : {
                    background : "url(resources/icons/bold.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'FontBold',
                enableToggle : true,
                width : 32,
                height : 32,
                handler : function() {
                    Ext.getCmp('fontstyle').setFontStyle();
                }
            }, {
                style : {
                    background : "url(resources/icons/italic.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'FontItalic',
                width : 32,
                height : 32,
                enableToggle : true,
                handler : function() {
                    Ext.getCmp('fontstyle').setFontStyle();
                }
            }, {
                style : {
                    background : "url(resources/icons/underline.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'FontUnderline',
                width : 32,
                height : 32,
                enableToggle : true,
                handler : function() {
                    Ext.getCmp('fontstyle').setFontStyle();
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Horizontal Alignment"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            items : [{
                style : {
                    background : "url(resources/icons/textleftalign.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'TextLeftAlign',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var align = JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALALIGN, align);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textcenteralign.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'TextCenterAlign',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var align = JSG.graph.attr.TextFormatAttributes.TextAlignment.CENTER;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALALIGN, align);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textrightalign.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'TextRightAlign',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var align = JSG.graph.attr.TextFormatAttributes.TextAlignment.RIGHT;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALALIGN, align);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Options"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            items : [{
                xtype: 'checkboxfield',
                anchor: '100%',
                id : 'TextWrap',
                boxLabel: '<span style="font-size: 8pt;">' + JSGDemo.resourceProvider.getString('Wrap Text') + '</span>',
                labelStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 80,
                listeners: {
                    change: function(field, value) {
                        // assign a text wrap mode. The text can either wrap on explicit line breaks and return or based on the width of the rectangle of the label.
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor) {
                            var selProvider = editor.getSelectionProvider();
                            var selection = selProvider.hasSingleSelection() ? selProvider.getFirstSelection().getModel() : undefined;
                            if (selection === undefined) {
                                return;
                            }
                            if (!(selection instanceof JSG.graph.model.TextNode)) {
                                selection = selection.getTextSubItem();                    
                            }
                            if (selection !== undefined) {
                                var currsizemode = selection.getItemAttributes().getSizeMode().getValue();
                                if (value) {
                                    if (!(currsizemode & JSG.graph.attr.TextNodeAttributes.SizeMode.WIDTH)) {
                                        editor.getInteractionHandler().execute(new JSG.graph.command.SetTextSizeModeCommand(selection, currsizemode | JSG.graph.attr.TextNodeAttributes.SizeMode.WIDTH));
                                    }
                                } else {
                                    if (currsizemode & JSG.graph.attr.TextNodeAttributes.SizeMode.WIDTH) {
                                        editor.getInteractionHandler().execute(new JSG.graph.command.SetTextSizeModeCommand(selection, currsizemode & ~JSG.graph.attr.TextNodeAttributes.SizeMode.WIDTH));
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                xtype: 'checkboxfield',
                anchor: '100%',
                id : 'TextHeight',
                boxLabel: '<span style="font-size: 8pt;">' + JSGDemo.resourceProvider.getString('Limit Height') + '</span>',
                labelStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 80,
                listeners: {
                    change: function(field, value) {
                        // assign a text wrap mode. The text can either wrap on explicit line breaks and return or based on the width of the rectangle of the label.
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor) {
                            var selProvider = editor.getSelectionProvider();
                            var selection = selProvider.hasSingleSelection() ? selProvider.getFirstSelection().getModel() : undefined;
                            if (selection === undefined) {
                                return;
                            }
                            if (!(selection instanceof JSG.graph.model.TextNode)) {
                                selection = selection.getTextSubItem();                    
                            }
                            if (selection !== undefined) {
                                var currsizemode = selection.getItemAttributes().getSizeMode().getValue();
                                if (value) {
                                    if (!(currsizemode & JSG.graph.attr.TextNodeAttributes.SizeMode.HEIGHT)) {
                                        editor.getInteractionHandler().execute(new JSG.graph.command.SetTextSizeModeCommand(selection, currsizemode | JSG.graph.attr.TextNodeAttributes.SizeMode.HEIGHT));
                                    }
                                } else {
                                    if (currsizemode & JSG.graph.attr.TextNodeAttributes.SizeMode.HEIGHT) {
                                        editor.getInteractionHandler().execute(new JSG.graph.command.SetTextSizeModeCommand(selection, currsizemode & ~JSG.graph.attr.TextNodeAttributes.SizeMode.HEIGHT));
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                xtype: 'checkboxfield',
                anchor: '100%',
                id : 'RichText',
                boxLabel: '<span style="font-size: 8pt;">' + JSGDemo.resourceProvider.getString('Allow rich text') + '</span>',
                labelStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 80,
                listeners: {
                    change: function(field, value) {
                        // set the rich text flag. If set to false, the format toolbar for the label will not appear
                        var formatmap = new JSG.commons.Map();
                        formatmap.put(JSG.graph.attr.TextFormatAttributes.RICHTEXT, value);
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                    }
                }
            }]            
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Font Color"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'colorpicker',
            width : 198,
            height : 198,
            colors : JSG.colors,
            listeners : {
                select : function(colorPick, selectedColor) {
                    // assign a new font color
					var formatmap = new JSG.commons.Map();
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.FONTCOLOR, "#" + selectedColor);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }
        }]
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext component to define the settings for a text. A button is created, which
 * initiates a menu, which allows you to change the vertical and horizontal text position.
 * The handlers fill the a format map and call assign it to the selected items.
 * the interaction handler to assign the new settings to the selection. There is also
 * a button to add an additional label to a graph item
 *
 * @class TextButton
 * @extends Ext.Button
 */
Ext.define('JSGDemo.view.TextButton', {
    extend : 'Ext.Button',
    alias : 'widget.textbutton',
    icon : 'resources/icons/textformat.png',
    text : "",
    cls : 'x-btn-icon',
    tooltip : JSGDemo.resourceProvider.getString("Define Text Format"),
    menu : {
        plain : true,
        items : [{
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Horizontal Position"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            items : [{
                style : {
                    background : "url(resources/icons/textpositionoutsideleft.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosOutsideLeft',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.TOLEFT;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositionleft.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosLeft',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.LEFT;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositioncenter.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosCenter',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.CENTER;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositionright.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosRight',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.RIGHT;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositionoutsideright.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosOutsideRight',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.TORIGHT;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.HORIZONTALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }]
        }, {
            xtype : 'text',
            text : JSGDemo.resourceProvider.getString("Vertical Position"),
            style : {
                'font-size' : '8pt',
                'padding' : '5px',
                'margin' : '5px',
                'backgroundColor' : '#DDDDDD'
            }
        }, {
            xtype : 'buttongroup',
            style : {
                backgroundColor : "transparent",
                borderColor : "transparent"
            },
            items : [{
                style : {
                    background : "url(resources/icons/textpositionoutsidetop.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosOutsideTop',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.VERTICALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositiontop.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosTop',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.TOP;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.VERTICALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositionmiddle.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosMiddle',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.CENTER;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.VERTICALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);					
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositionbottom.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosBottom',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BOTTOM;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.VERTICALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }, {
                style : {
                    background : "url(resources/icons/textpositionoutsidebottom.png)",
                    backgroundRepeat : "no-repeat"
                },
                id : 'PosOutsideBottom',
                width : 32,
                height : 32,
                handler : function() {
					var formatmap = new JSG.commons.Map();
					var pos = JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM;
	                formatmap.put(JSG.graph.attr.TextFormatAttributes.VERTICALPOSITION, pos);
	                JSGDemo.viewport.getActiveEditor().getInteractionHandler().applyTextFormatMap(formatmap);
                }
            }]
        }, '-', {
            xtype : 'button',
            text : JSGDemo.resourceProvider.getString("Add Label"),
            handler : function () {
                // add a label to the selected graph item
                var editor = JSGDemo.viewport.getActiveEditor();
                if (!editor) {
                    return;
                }
                var selection = editor.getGraphViewer().getSelection();
                editor.getInteractionHandler().execute(new JSG.graph.command.AddLabelCommand(selection[0].getModel(), "Label"));
            }
        }]
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");
/**
 * Template to define a Tabpanel and toolbars contained in it. Each tab of the
 * tab panel contains one of the toolbars. Mostly straightforward JS-Ext code, defining the toolbar layout, the buttons and
 * the handlers initiated when pressing a button or entering data. You can easily examine how to actions or settings are
 * transferred to the Graph Framework to derive your own implementation from that.
 * 
 * @class Toolbar
 * @extends Ext.tab.Panel
 * @constructor
 */
Ext.define('JSGDemo.view.Toolbar', {
    extend : 'Ext.tab.Panel',
    alias : 'widget.jsgtoolbar',
    id : 'jsgtoolbartabs',
    height : 97,
    layout : 'fit',
    plain : true,
    tbUpdate : false,
    listeners : {
        tabchange : function(tabPanel, newCard, oldCard, eOpts) {
            // update toolbar buttons for the activated tab
            JSGDemo.toolbar.updateToolbar();
        }
    },
    tabBar : {
        height : 23,
        items : [{
            xtype : 'tbfill'
        }, {
            src : 'resources/icons/languages/german.png',
            xtype : 'image',
            width : 16,
            margin : '3, 3, 3, 3',
            style : {
                'cursor' : 'pointer'
            },
            listeners : {
                render : function(c) {
                    // reload app with german UI
                    c.getEl().on('click', function(e) {
                        JSGDemo.toolbar.checkReload('language', 'de');
                    }, c);
                }
            }
        }, {
            src : 'resources/icons/languages/english.png',
            xtype : 'image',
            margin : '3, 3, 3, 3',
            style : {
                'cursor' : 'pointer'
            },
            width : 16,
            listeners : {
                render : function(c) {
                    // reload app with english UI
                    c.getEl().on('click', function(e) {
                        JSGDemo.toolbar.checkReload('language', 'en');
                    }, c);
                }
            }
        }]
    },
    /**
     * Checks to see, if files have to be saved before a reload can be executed. A dialog will be displayed, if files
     * need to be saved. Depending on the result of the user interaction, the application will be reload.
     * 
     * @method checkReload
     * @param {String} key Key to use for saving language info
     * @param {String} value Current language shortcut.
     */
    checkReload : function(key, value) {
        var tabs = Ext.getCmp('center');
        var self = this;

        var saveDlg = JSGDemo.viewport.hasAnyOpenEditorChanged();

        JSGDemo.utils.Storage.save(key, value);

        // give user a chance to save changes before reload
        if (saveDlg) {
            Ext.Msg.show({
                title : JSGDemo.resourceProvider.getString("Save Changes?"),
                msg : JSGDemo.resourceProvider.getString("The application has to be reloaded to change the language. There are unsaved changes. Would like to save these?"),
                buttons : Ext.Msg.YESNOCANCEL,
                icon : Ext.Msg.QUESTION,
                fn : function(btn) {
                    var tabs = Ext.getCmp('center');
                    if (btn === 'yes') {
                        tabs.items.each(function(tab) {
                            if (tab.getEditor().getGraph().isChanged()) {
                                tab.save();
                            }
                        });
                        window.location.reload();
                    } else if (btn === 'no') {
                        JSGDemo.ignoreChanges = true;
                        window.location.reload();
                    }
                }
            });
        } else {
            window.location.reload();
        }
    },
    // 菜单  begin
    items : [{
        title : JSGDemo.resourceProvider.getString("Start"),
        id : 'tbStart',
        style : {
            border : 'none'
        },
        items : [{
            xtype : 'toolbar',
            id : 'jsgtoolbar',
            enableOverflow : true,
            defaults : {
                scale : 'medium',
                minWidth : 40,
                iconAlign : 'top',
                arrowAlign : 'right',
                cls : 'x-btn-icon'
            },
            items : [{
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'splitbutton',
                icon : 'resources/icons/new.png',
                id : 'jsgnewlargebtn',
                text : JSGDemo.resourceProvider.getString("New"),
                tooltip : JSGDemo.resourceProvider.getString("New"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("New Drawing"),
                        icon : 'resources/icons/drawing.png',
                        id : 'jsgnewbtn',
                        handler : function() {
                            // create diagram
                            JSGDemo.modeltree.createModelItem("diagram");
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("New Organizational Chart"),
                        id : 'jsgneworgbtn',
                        icon : 'resources/icons/orgchart.png',
                        handler : function() {
                            // create diagram with special behaviour
                            JSGDemo.modeltree.createModelItem("orgchart");
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("New Folder"),
                        id : 'jsgnewfolderbtn',
                        icon : 'resources/icons/newfolder.png',
                        handler : function() {
                            // create folder in tree
                            JSGDemo.modeltree.createModelItem("folder");
                        }
                    }]
                },
                handler : function() {
                    // default is to create a diagram
                    JSGDemo.modeltree.createModelItem("diagram");
                }
            }, {
                icon : 'resources/icons/save.png',
                id : 'jsgsavebtn',
                text : JSGDemo.resourceProvider.getString("Save"),
                tooltip : JSGDemo.resourceProvider.getString("Save Drawing"),
                handler : function() {
                	console.log(JSGDemo.viewport.getActiveEditor().saveXML());
                    // save to local storage
                    var tab = JSGDemo.viewport.getActiveTab();
                    if (tab) {
                        tab.save();
                    }
                }
            }, {
                icon : 'resources/icons/print.png',
                id : 'jsgprintbtn',
                text : JSGDemo.resourceProvider.getString("Print"),
                tooltip : JSGDemo.resourceProvider.getString("Print Drawing"),
                handler : function() {
                    // print to PDF file
                    var tab = JSGDemo.viewport.getActiveTab();
                    if (tab) {
                        tab.print();
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/undo.png',
                id : 'jsgundobtn',
                text : JSGDemo.resourceProvider.getString("Undo"),
                tooltip : JSGDemo.resourceProvider.getString("Undo last command"),
                handler : function() {
                    // use undo of framework
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().undo();
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/redo.png',
                text : JSGDemo.resourceProvider.getString("Redo"),
                tooltip : JSGDemo.resourceProvider.getString("Redo last undo command"),
                id : 'jsgredobtn',
                handler : function() {
                    // use redo of framework
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().redo();
                    }
                }
            }, {
                xtype : 'splitbutton',
                id : 'jsgcopylargebtn',
                icon : 'resources/icons/copy.png',
                text : JSGDemo.resourceProvider.getString("Copy"),
                tooltip : JSGDemo.resourceProvider.getString("Copy Shapes"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("Copy"),
                        id : 'jsgcopybtn',
                        icon : 'resources/icons/copysmall.png',
                        handler : function() {
                            // copy selected items to private clipboard of JSG
                            if (JSGDemo.viewport.getActiveEditor()) {
                                JSGDemo.viewport.getActiveEditor().getInteractionHandler().copySelection();
                            }
                            JSGDemo.toolbar.updateToolbar();
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Copy Format"),
                        id : 'jsgcopyformatbtn',
                        icon : 'resources/icons/copyformatsmall.png',
                        handler : function() {
                            // copy format info of selected items to private clipboard of JSG
                            if (JSGDemo.viewport.getActiveEditor()) {
                                JSGDemo.viewport.getActiveEditor().getInteractionHandler().copySelectionFormat();
                            }
                            JSGDemo.toolbar.updateToolbar();
                        }
                    }]
                },
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().copySelection();
                    }
                    JSGDemo.toolbar.updateToolbar();
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/cut.png',
                text : JSGDemo.resourceProvider.getString("Cut"),
                tooltip : JSGDemo.resourceProvider.getString("Cut items"),
                id : 'jsgcutbtn',
                handler : function() {
                    // copy and delete
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().cutSelection();
                    }
                    JSGDemo.toolbar.updateToolbar();
                }
            }, {
                xtype : 'splitbutton',
                id : 'jsgpastelargebtn',
                icon : 'resources/icons/paste.png',
                text : JSGDemo.resourceProvider.getString("Paste"),
                tooltip : JSGDemo.resourceProvider.getString("Paste Shapes"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("Paste"),
                        icon : 'resources/icons/pastesmall.png',
                        id : 'jsgpastebtn',
                        handler : function() {
                            // paste from private clipoard
                            if (JSGDemo.viewport.getActiveEditor()) {
                                JSGDemo.viewport.getActiveEditor().getInteractionHandler().paste();
                            }
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Paste Format"),
                        icon : 'resources/icons/pasteformatsmall.png',
                        id : 'jsgpasteformatbtn',
                        handler : function() {
                            // apply previously copied format to selected items
                            if (JSGDemo.viewport.getActiveEditor()) {
                                JSGDemo.viewport.getActiveEditor().getInteractionHandler().pasteFormat();
                            }
                        }
                    }]
                },
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        // default is to paste items 
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().paste();
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/delete.png',
                text : JSGDemo.resourceProvider.getString("Delete"),
                tooltip : JSGDemo.resourceProvider.getString("Delete selected items"),
                id : 'jsgdeletebtn',
                handler : function() {
                    // delete selected items
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().deleteSelection();
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/rectangle.png',
                text : JSGDemo.resourceProvider.getString("Rectangle"),
                tooltip : JSGDemo.resourceProvider.getString("Create Rectangle"),
                id : 'jsgrectbtnstart',
                handler : function() {
                    // initiate create node interaction with rectangle shape
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape()));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/ellipse.png',
                id : 'jsgellipsebtnstart',
                text : JSGDemo.resourceProvider.getString("Ellipse"),
                tooltip : JSGDemo.resourceProvider.getString("Create Ellipse"),
                handler : function() {
                    // initiate create node interaction with ellipse shape
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.EllipseShape()));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/polygon.png',
                text : JSGDemo.resourceProvider.getString("Polygon"),
                tooltip : JSGDemo.resourceProvider.getString("Create Polygon"),
                id : 'jsgpolygonbtnstart',
                handler : function() {
                    // initiate create polyline interaction with polygon shape
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreatePolyLineInteraction(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape())));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/text.png',
                text : JSGDemo.resourceProvider.getString("Text"),
                tooltip : JSGDemo.resourceProvider.getString("Create Text"),
                id : 'jsgtextbtnstart',
                handler : function() {
                    // initiate create node interaction with rectangle shape and label
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape(), "Text"));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/polyline.png',
                text : JSGDemo.resourceProvider.getString("Polyline"),
                tooltip : JSGDemo.resourceProvider.getString("Create Polyline"),
                id : 'jsgpolylinebtnstart',
                handler : function() {
                    // initiate create polyline interaction with open polygon shape
                    if (JSGDemo.viewport.getActiveEditor()) {
                        var polynode = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
                        polynode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, false);
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreatePolyLineInteraction(polynode));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/bezier.png',
                text : JSGDemo.resourceProvider.getString("Curve"),
                tooltip : JSGDemo.resourceProvider.getString("Create Curved Polygon"),
                id : 'jsgbezierbtnstart',
                handler : function() {
                    // initiate create bezier interaction with open bezier shape
                    if (JSGDemo.viewport.getActiveEditor()) {
                        var beziernode = new JSG.graph.model.Node(new JSG.graph.model.shapes.BezierShape());
                        beziernode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, false);
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateBezierInteraction(beziernode));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/line.png',
                text : JSGDemo.resourceProvider.getString("Line"),
                tooltip : JSGDemo.resourceProvider.getString("Create Edge"),
                id : 'jsglinebtn',
                handler : function() {
                    // initiate create edge interaction with edge
                    if (JSGDemo.viewport.getActiveEditor()) {
                        var editor = JSGDemo.viewport.getActiveEditor();
                        editor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateEdgeInteraction(new JSG.graph.model.Edge()));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/hvline.png',
                text : JSGDemo.resourceProvider.getString("HV Line"),
                tooltip : JSGDemo.resourceProvider.getString("Create Orthogonal Edge"),
                id : 'jsghvlinebtn',
                handler : function() {
                    // initiate create orthogonal edge interaction with orthogonal line shape
                    if (JSGDemo.viewport.getActiveEditor()) {
                        var editor = JSGDemo.viewport.getActiveEditor();
                        var edge = new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape());
                        editor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateOrthoEdgeInteraction(edge));
                    }
                }
            }, {
                // here we set up a menu with edge types. If a menu is selected the default edge type is redefined. The next
                // edge that is created drawing a line from a port will be of the selected type
                xtype : 'button',
                icon : 'resources/icons/link.png',
                text : JSGDemo.resourceProvider.getString("Default Link"),
                tooltip : JSGDemo.resourceProvider.getString("Define Default Link"),
                overflowText : JSGDemo.resourceProvider.getString("Define Default Link"),
                id : 'jsglinkbtn',
                setItem : function(btn, icon) {
                    this.selectedItem = btn.getId();
                    this.setIcon(icon);
                },
                selectedItem : "defline",
                menu : {
                    items : [{
                        icon : 'resources/icons/shapes/edge.png',
                        text : JSGDemo.resourceProvider.getString("Straight Connection"),
                        id : 'defline',
                        handler : function() {
                            Ext.getCmp('jsglinkbtn').setItem(this, 'resources/icons/shapes/edge.png');
                            JSG.defaultEdgeType = "edge";
                        }
                    }, {
                        icon : 'resources/icons/shapes/edgearrow.png',
                        text : JSGDemo.resourceProvider.getString("Straight Connection with Arrow"),
                        id : 'deflinearrow',
                        handler : function() {
                            Ext.getCmp('jsglinkbtn').setItem(this, 'resources/icons/shapes/edgearrow.png');
                            JSG.defaultEdgeType = "edgeArrow";
                        }
                    }, {
                        icon : 'resources/icons/shapes/orthogonaledge.png',
                        text : JSGDemo.resourceProvider.getString("Orthogonal Connection"),
                        id : 'defhvline',
                        handler : function() {
                            Ext.getCmp('jsglinkbtn').setItem(this, 'resources/icons/shapes/orthogonaledge.png');
                            JSG.defaultEdgeType = "orthogonalEdge";
                        }
                    }, {
                        icon : 'resources/icons/shapes/orthogonaledgearrow.png',
                        text : JSGDemo.resourceProvider.getString("Orthogonal Connection with Arrow"),
                        id : 'defhvlineArrow',
                        handler : function() {
                            Ext.getCmp('jsglinkbtn').setItem(this, 'resources/icons/shapes/orthogonaledgearrow.png');
                            JSG.defaultEdgeType = "orthogonalEdgeArrow";
                        }
                    }, {
                        icon : 'resources/icons/shapes/orthogonalroundededge.png',
                        text : JSGDemo.resourceProvider.getString("Rounded Orthogonal Connection"),
                        id : 'defhvrline',
                        handler : function() {
                            Ext.getCmp('jsglinkbtn').setItem(this, 'resources/icons/shapes/orthogonalroundededge.png');
                            JSG.defaultEdgeType = "orthogonalRoundedEdge";
                        }
                    }, {
                        icon : 'resources/icons/shapes/orthogonalroundededgearrow.png',
                        text : JSGDemo.resourceProvider.getString("Rounded Orthogonal Connection with Arrow"),
                        id : 'defhvrlineArrow',
                        handler : function() {
                            Ext.getCmp('jsglinkbtn').setItem(this, 'resources/icons/shapes/orthogonalroundededgearrow.png');
                            JSG.defaultEdgeType = "orthogonalRoundedEdgeArrow";
                        }
                    }]
                }
            },{
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'linebutton',
                id : 'jsglinefmtbtnstart',
                icon : 'resources/icons/colorline.png',
                text : JSGDemo.resourceProvider.getString("Line Format"),
                tooltip : JSGDemo.resourceProvider.getString("Line"),
                overflowText : JSGDemo.resourceProvider.getString("Line")
            }, {
                xtype : 'fillbutton',
                id : 'jsgfillfmtbtnstart',
                icon : 'resources/icons/colorfill.png',
                text : JSGDemo.resourceProvider.getString("Fill Format"),
                tooltip : JSGDemo.resourceProvider.getString("Fill"),
                overflowText : JSGDemo.resourceProvider.getString("Fill")
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/editpoints.png',
                text : JSGDemo.resourceProvider.getString("Edit"),
                tooltip : JSGDemo.resourceProvider.getString("Edit Points"),
                id : 'editpointsstart',
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().editSelection();
                    }
                }
            }]
        }]
    }, {
        title : JSGDemo.resourceProvider.getString("Insert"),
        id : 'tbInsert',
        items : [{
            xtype : 'toolbar',
            enableOverflow : true,
            defaults : {
                scale : 'medium',
                iconAlign : 'top',
                arrowAlign : 'right',
                minWidth : 40,
                cls : 'x-btn-icon'
            },
            items : [{
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'linesbutton',
                text : JSGDemo.resourceProvider.getString('Lines')
            }, {
                xtype : 'button',
                icon : 'resources/icons/rectangle.png',
                text : JSGDemo.resourceProvider.getString("Rectangle"),
                tooltip : JSGDemo.resourceProvider.getString("Create Rectangle"),
                id : 'jsgrectbtn',
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape()));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/ellipse.png',
                id : 'jsgellipsebtn',
                text : JSGDemo.resourceProvider.getString("Ellipse"),
                tooltip : JSGDemo.resourceProvider.getString("Create Ellipse"),
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.EllipseShape()));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/polygon.png',
                text : JSGDemo.resourceProvider.getString("Polygon"),
                tooltip : JSGDemo.resourceProvider.getString("Create Polygon"),
                id : 'jsgpolygonbtn',
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreatePolyLineInteraction(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape())));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/text.png',
                text : JSGDemo.resourceProvider.getString("Text"),
                tooltip : JSGDemo.resourceProvider.getString("Create Text"),
                id : 'jsgtextbtn',
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape(), "Text"));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/polyline.png',
                text : JSGDemo.resourceProvider.getString("Polyline"),
                tooltip : JSGDemo.resourceProvider.getString("Create Polyline"),
                id : 'jsgpolylinebtn',
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        var polynode = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
                        polynode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, false);
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreatePolyLineInteraction(polynode));
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/bezier.png',
                text : JSGDemo.resourceProvider.getString("Curve"),
                tooltip : JSGDemo.resourceProvider.getString("Create Curved Polygon"),
                id : 'jsgbezierbtn',
                handler : function() {
                    if (JSGDemo.viewport.getActiveEditor()) {
                        var beziernode = new JSG.graph.model.Node(new JSG.graph.model.shapes.BezierShape());
                        beziernode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, false);
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateBezierInteraction(beziernode));
                    }
                }
            }, {
                xtype : 'shapesbutton',
                text : JSGDemo.resourceProvider.getString('Shapes')
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/container.png',
                text : JSGDemo.resourceProvider.getString("Container"),
                tooltip : JSGDemo.resourceProvider.getString("Create Scrollable Container"),
                id : 'jsgcontainerbtn',
                handler : function() {
                    // create a scrollable container, a scrollable container can container other objects and objects that are not visible in the client area of the
                    // container can be scrolled into the visible area
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateItemInteraction(new JSG.graph.model.ContentNode()));
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Image'),
                icon : 'resources/icons/image.png',
                id : 'jsgimagebtn',
                handler : function() {
                    // a dialog is shown to retrieve a URL for the image. The image is used to assign a pattern fill to the item that
                    // can be created by placing it with the mouse
                    Ext.getCmp('jsgtoolbartabs').getInput(JSGDemo.resourceProvider.getString('Image'),
                        JSGDemo.resourceProvider.getString('Please enter the URL of the image and then create the image by using the mouse:'), 
                        JSGDemo.resourceProvider.getString('URL'), 
                        JSGDemo.resourceProvider.getString('URL'), 
                        function(value) {
                            if (JSGDemo.viewport.getActiveEditor()) {
                                var node = new JSG.graph.model.Node();
                                node.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.PATTERN);
                                node.getFormat().setPattern(value);
                                JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateItemInteraction(node));                            }
                        });
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Hyperlink'),
                icon : 'resources/icons/hyperlink.png',
                id : 'jsghyperlinkbtn',
                handler : function() {
                    // a dialog is shown to retrieve a URL hyperlink. The URL is used to assign a value to the link attribute
                    // of the selected graph item 
                    Ext.getCmp('jsgtoolbartabs').getInput(JSGDemo.resourceProvider.getString('Hyperlink'),
                        JSGDemo.resourceProvider.getString('Please enter the URL and then create the hyperlink object by using the mouse:'), 
                        JSGDemo.resourceProvider.getString('URL'), 
                        JSGDemo.resourceProvider.getString('URL'), 
                        function(value) {
                            if (JSGDemo.viewport.getActiveEditor()) {
                                var node = new JSG.graph.model.Node();
                                node.setLink(value);
                                node.getTextFormat().setFontStyle(JSG.graph.attr.TextFormatAttributes.FontStyle.UNDERLINE);
                                node.getTextFormat().setFontColor('#0000FF');
                                JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateItemInteraction(node, value));
                            }
                        });
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Link'),
                icon : 'resources/icons/graphlink.png',
                id : 'jsglinkgraphbtn',
                handler : function() {
                    // a dialog is shown to retrieve an id of another graph. The graph is used to fill the link attribute
                    // of the selected item with a special file link value.
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var selection = editor.getGraphViewer().getSelection();
                        var item = selection[0].getModel();
                        Ext.getCmp('jsgtoolbartabs').getInput(JSGDemo.resourceProvider.getString('Link'),
                            JSGDemo.resourceProvider.getString('Please enter the id of the Graph you want to link to:'), 
                            JSGDemo.resourceProvider.getString('ID'), 
                            item.getLink().getValue().replace("file:", ""), 
                            function(value) {
                                var item = selection[0].getModel();
                                item.setLink("file:" + value);
                            });
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Watermark'),
                icon : 'resources/icons/watermark.png',
                id : 'jsgwatermarkbtn',
                handler : function() {
                    // a dialog is shown to retrieve the watermark text to display
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        var selection = editor.getGraphViewer().getSelection();
                        var item = selection[0].getModel();
                        Ext.getCmp('jsgtoolbartabs').getInput(JSGDemo.resourceProvider.getString('Watermark'),
                            JSGDemo.resourceProvider.getString('Please enter the watermark text:'), 
                            JSGDemo.resourceProvider.getString('Watermark'), 
                            item.getLink().getValue().replace("file:", ""), 
                            function(value) {
                                var item = selection[0].getModel();
                                item.addWatermark(value);
                            });
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button', 
                text : JSGDemo.resourceProvider.getString('Header'),
                icon : 'resources/icons/header.png',
                id : 'jsgheaderbtn',
                // a menu is shown when the button is clicked to allow the user to edit the header strings
                menu : {
                    plain : true,
                    width : 260,
                    listeners : {
                        show : function(menu, eOpts) {
                            // fill text items with header settings
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                Ext.getCmp("leftheader").setValue(editor.getGraphSettings().getPage().getHeaderLeft());
                                Ext.getCmp("centerheader").setValue(editor.getGraphSettings().getPage().getHeaderCenter());
                                Ext.getCmp("rightheader").setValue(editor.getGraphSettings().getPage().getHeaderRight());
                            }
                        }
                    },
                    items: [{
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'leftheader',
                        fieldLabel: JSGDemo.resourceProvider.getString('Left Header:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new header to page
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setHeaderLeft(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'centerheader',
                        fieldLabel: JSGDemo.resourceProvider.getString('Center Header:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new header to page
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setHeaderCenter(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'rightheader',
                        fieldLabel: JSGDemo.resourceProvider.getString('Right Header:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new header to page
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setHeaderRight(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }]
               }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Footer'),
                icon : 'resources/icons/footer.png',
                id : 'jsgfooterbtn',
                // a menu is shown when the button is clicked to allow the user to edit the footer strings
                menu : {
                    plain : true,
                    width : 260,
                    listeners : {
                        show : function(menu, eOpts) {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                Ext.getCmp("leftfooter").setValue(editor.getGraphSettings().getPage().getFooterLeft());
                                Ext.getCmp("centerfooter").setValue(editor.getGraphSettings().getPage().getFooterCenter());
                                Ext.getCmp("rightfooter").setValue(editor.getGraphSettings().getPage().getFooterRight());
                            }
                        }
                    },
                    items: [{
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'leftfooter',
                        fieldLabel: JSGDemo.resourceProvider.getString('Left Footer:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new footer to page
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFooterLeft(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'centerfooter',
                        fieldLabel: JSGDemo.resourceProvider.getString('Center Footer:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new footer to page
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFooterCenter(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'rightfooter',
                        fieldLabel: JSGDemo.resourceProvider.getString('Right Footer:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new footer to page
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFooterRight(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }]
               }
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Filter'),
                icon : 'resources/icons/filter.png',
                id : 'jsgfilterbtn',
                handler : function() {
                    // show the filter dialog. Filters can be used to group items logically.
                    // Items assigned to a filter (by settign the layer attribute) can be hidden or made unselectable
                    var editor = JSGDemo.viewport.getActiveEditor();
                    var panel = Ext.create('JSGDemo.view.FilterDialog');
                    panel.setEditor(editor);
                    panel.show();
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('SVG Import'),
                icon : 'resources/icons/svgimport.png',
                id : 'svgimportbtn',
				centerModels: function(models, editor) {
					//calc enclosing bounding bbox:
					var bbox = JSG.boxCache.get();
					var tmpbox = JSG.boxCache.get();
					models.forEach(function(model) {
						bbox.union(model.getBoundingBox(tmpbox));
					});
					//calc offset to center:
					var center = bbox.getCenter(JSG.ptCache.get(), true);
					var offset = JSG.graph.Utils.getVisibleCenter(editor, JSG.ptCache.get());
					offset.subtract(center);
					models.forEach(function(model) {
						model.setPinPointTo(model.getPinPoint(center).add(offset));
					});
					JSG.ptCache.release(center, offset);
					JSG.boxCache.release(bbox, tmpbox);
				},
                doImport: function(url) {
					var me = this;
					var editor = JSGDemo.viewport.getActiveEditor();
                    if (url && editor && JSG.SVG) {
				        Ext.getCmp('load-indicator').show();
							JSG.SVG.load(url, function(svg, error) {
							if (!error) {
								svg.includeRoot = false;
								var models = svg.toJSG(editor.getCoordinateSystem());
								models.forEach(function(model) {
									editor.getGraph().addItem(model);
								});
								me.centerModels(models, editor);
								editor.invalidate();
							} else {
								JSG.debug.logError("Failed to load svg '" + error.url + "' !!!", error);
							}
							Ext.getCmp('load-indicator').hide();				        
						});
                    }
                },
                handler : function() {
					//TODO add a file upload or url input dialog
					Ext.getCmp('jsgtoolbartabs').getInput(
						JSGDemo.resourceProvider.getString('SVG Import'),
						JSGDemo.resourceProvider.getString('Please enter the URL of the svg file to import.'),
						JSGDemo.resourceProvider.getString('SVG'),
						JSGDemo.resourceProvider.getString('Enter url of svg file...'),
						this.doImport.bind(this));
                 }
            }]
        }]
    }, {
        title : JSGDemo.resourceProvider.getString("Format"),
        id : 'tbFormat',
        items : [{
            xtype : 'toolbar',
            enableOverflow : true,
            defaults : {
                scale : 'medium',
                minWidth : 40,
                iconAlign : 'top',
                arrowAlign : 'right',
                cls : 'x-btn-icon'
            },
            items : [{
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'text',
                margin : "6px",
                style : {
                    fontWeight : "bold"
                },
                text : JSGDemo.resourceProvider.getString('Center (mm)'),
                minWidth : '20'
            }, {
                xtype: 'numberfield',
                anchor: '100%',
                id : 'posX',
                fieldLabel: JSGDemo.resourceProvider.getString('X:'),
                fieldStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 15,
                minValue : -1000,
                maxValue : 1000,
                step: 1,
                value: 1,
                validator : function (value) {
                    return value > -1000 && value < 1000 ? true : "Error";
                },
                width : 150,
                listeners: {
                    change: function(field, value) {
                        // reset the pin of the selected item. The pin normally defines the center of the item
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor && value > -1000 && value < 1000) {
                            var selection = editor.getGraphViewer().getSelection();
                            var item = selection[0].getModel();
                            var pin = item.getPin().copy();
                            pin.setX(value * 100);
                            var cmd = new JSG.graph.command.SetPinCommand(item, pin);
                            editor.getInteractionHandler().execute(cmd);
                            field.focus();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                anchor: '100%',
                id : 'posY',
                fieldLabel: JSGDemo.resourceProvider.getString('Y:'),
                fieldStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 15,
                minValue : -1000,
                maxValue : 1000,
                step: 1,
                value: 1,
                validator : function (value) {
                    return value > -1000 && value < 1000 ? true : "Error";
                },
                width : 150,
                listeners: {
                    change: function(field, value) {
                        // reset the pin of the selected item. The pin normally defines the center of the item
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor && value > -1000 && value < 1000) {
                            var selection = editor.getGraphViewer().getSelection();
                            var item = selection[0].getModel();
                            var pin = item.getPin().copy();
                            pin.setY(value * 100);
                            var cmd = new JSG.graph.command.SetPinCommand(item, pin);
                            editor.getInteractionHandler().execute(cmd);
                            field.focus();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                anchor: '100%',
                id : 'posWidth',
                fieldLabel: JSGDemo.resourceProvider.getString('Width:'),
                fieldStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 35,
                minValue : 2,
                maxValue : 1000,
                step: 1,
                value: 1,
                validator : function (value) {
                    return value > 0 && value < 1000 ? true : "Error";
                },
                width : 150,
                listeners: {
                    change: function(field, value) {
                        // set the width of the selected item by defining a new bounding box.
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor && value > 0 && value < 1000) {
                            var selection = editor.getGraphViewer().getSelection();
                            var item = selection[0].getModel();
                            var box = item.getBoundingBox();
                            box.setWidth(value * 100);
                            var cmd = new JSG.graph.command.ResizeItemCommand(item, box);
                            editor.getInteractionHandler().execute(cmd);
                            field.focus();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                anchor: '100%',
                id : 'posHeight',
                fieldLabel: JSGDemo.resourceProvider.getString('Height:'),
                fieldStyle : {
                    'fontSize' : '8pt'
                },
                margin : "5px",
                labelWidth : 40,
                minValue : 2,
                maxValue : 1000,
                step: 1,
                value: 1,
                validator : function (value) {
                    return value > 0 && value < 1000 ? true : "Error";
                },
                width : 150,
                listeners: {
                    change: function(field, value) {
                        // set the width of the selected item by defining a new bounding box.
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor && value > 0 && value < 1000) {
                            var selection = editor.getGraphViewer().getSelection();
                            var item = selection[0].getModel();
                            var box = item.getBoundingBox();
                            box.setHeight(value * 100);
                            var cmd = new JSG.graph.command.ResizeItemCommand(item, box);
                            editor.getInteractionHandler().execute(cmd);
                            field.focus();
                        }
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '30'
            }, {
                xtype : 'linebutton',
                id : 'jsglinefmtbtn',
                icon : 'resources/icons/colorline.png',
                text : JSGDemo.resourceProvider.getString("Line Format"),
                tooltip : JSGDemo.resourceProvider.getString("Line"),
                overflowText : JSGDemo.resourceProvider.getString("Line")
            }, {
                xtype : 'fillbutton',
                id : 'jsgfillfmtbtn',
                icon : 'resources/icons/colorfill.png',
                text : JSGDemo.resourceProvider.getString("Fill Format"),
                tooltip : JSGDemo.resourceProvider.getString("Fill"),
                overflowText : JSGDemo.resourceProvider.getString("Fill")
            }, {
                xtype : 'shadowbutton',
                id : 'jsgshadowfmtbtn',
                text : JSGDemo.resourceProvider.getString("Shadow")
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'fontbutton',
                id : 'jsgfontfmtbtn',
                text : JSGDemo.resourceProvider.getString("Font")
            }, {
                xtype : 'textbutton',
                id : 'jsgtextfmtbtn',
                text : JSGDemo.resourceProvider.getString("Text")
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button', 
                text : JSGDemo.resourceProvider.getString('Tooltip'),
                icon : 'resources/icons/tooltip.png',
                id : 'jsgtooltipbtn',
                // a menu is shown when the button is clicked to allow the user to edit the tooltip
                menu : {
                    plain : true,
                    width : 260,
                    listeners : {
                        show : function(menu, eOpts) {
                            // get tooltip value
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var selection = editor.getGraphViewer().getSelection();
                                var item = selection[0].getModel();
                                Ext.getCmp("jsgtooltip").setValue(item.getTooltip().getValue());
                            }
                        }
                    },
                    items: [{
                        xtype: 'textfield',
                        anchor: '100%',
                        id : 'jsgtooltip',
                        fieldLabel: JSGDemo.resourceProvider.getString('Tooltip:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        labelWidth : 80,
                        listeners: {
                            change: function(field, value) {
                                // assign new tooltip
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    var selection = editor.getGraphViewer().getSelection();
                                    var item = selection[0].getModel();
                                    item.setTooltip(value);
                                    editor.invalidate();                                
                                }
                            }
                        }
                    }]
               }
            }]
        }]
    }, {
        title : JSGDemo.resourceProvider.getString("Change"),
        id : 'tbChange',
        items : [{
            xtype : 'toolbar',
            enableOverflow : true,
            defaults : {
                scale : 'medium',
                minWidth : 40,
                iconAlign : 'top',
                arrowAlign : 'right',
                cls : 'x-btn-icon'
            },
            items : [{
                xtype : 'text',
                minWidth : '20'
            }, {
                xtype : 'button',
                icon : 'resources/icons/editpoints.png',
                text : JSGDemo.resourceProvider.getString("Edit"),
                tooltip : JSGDemo.resourceProvider.getString("Edit Points"),
                id : 'editpoints',
                handler : function() {
                    // active an editor for the selected item. This normally activates a bezier or polynode edit interaction
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().editSelection();
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '20'
            }, {
                xtype : 'button',
                icon : 'resources/icons/group.png',
                text : JSGDemo.resourceProvider.getString("Group"),
                tooltip : JSGDemo.resourceProvider.getString("Group"),
                id : 'group',
                handler : function() {
                    // group selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().groupSelection();
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/ungroup.png',
                text : JSGDemo.resourceProvider.getString("Ungroup"),
                tooltip : JSGDemo.resourceProvider.getString("Ungroup"),
                id : 'ungroup',
                handler : function() {
                    // ungroup selected item by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().ungroupSelection();
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '25'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Align:"),
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/alignleft.png',
                text : JSGDemo.resourceProvider.getString("Left"),
                tooltip : JSGDemo.resourceProvider.getString("Left"),
                id : 'jsgalignleftbtn',
                handler : function() {
                    // align selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.LEFT);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/aligncenter.png',
                text : JSGDemo.resourceProvider.getString("Center"),
                tooltip : JSGDemo.resourceProvider.getString("Center"),
                id : 'jsgaligncenterbtn',
                handler : function() {
                    // align selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.CENTER);
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString("Right"),
                tooltip : JSGDemo.resourceProvider.getString("Right"),
                icon : 'resources/icons/alignright.png',
                id : 'jsgalignrightbtn',
                handler : function() {
                    // align selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.RIGHT);
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString("Top"),
                tooltip : JSGDemo.resourceProvider.getString("Top"),
                icon : 'resources/icons/aligntop.png',
                id : 'jsgaligntopbtn',
                handler : function() {
                    // align selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.TOP);
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString("Middle"),
                tooltip : JSGDemo.resourceProvider.getString("Middle"),
                icon : 'resources/icons/alignmiddle.png',
                id : 'jsgalignmiddlebtn',
                handler : function() {
                    // align selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.MIDDLE);
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString("Bottom"),
                tooltip : JSGDemo.resourceProvider.getString("Bottom"),
                icon : 'resources/icons/alignbottom.png',
                id : 'jsgalignbottombtn',
                handler : function() {
                    // align selected items by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.BOTTOM);
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '25'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Space:"),
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/alignvdistribute.png',
                text : JSGDemo.resourceProvider.getString("Vertical"),
                tooltip : JSGDemo.resourceProvider.getString("Vertical"),
                id : 'jsgalignvdistributebtn',
                handler : function() {
                    // distribute selected item by calling utility function. Distribute means to move items so that their space in between is equal
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.VDISTRIBUTE);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/alignhdistribute.png',
                text : JSGDemo.resourceProvider.getString("Horizontal"),
                tooltip : JSGDemo.resourceProvider.getString("Horizontal"),
                id : 'jsgalignhdistributebtn',
                handler : function() {
                    // distribute selected item by calling utility function. Distribute means to move items so that their space in between is equal
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().alignSelection(JSG.graph.command.Alignment.HDISTRIBUTE);
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '25'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Resize:"),
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/vsizemax.png',
                text : JSGDemo.resourceProvider.getString("Highest"),
                tooltip : JSGDemo.resourceProvider.getString("Size to Max"),
                id : 'jsgvsizemaxbtn',
                handler : function() {
                    // assign the largest height of all selected items to all other items
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().sizeSelection(JSG.graph.command.SizeItems.VERTICALMAX);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/vsizemin.png',
                text : JSGDemo.resourceProvider.getString("Smallest"),
                tooltip : JSGDemo.resourceProvider.getString("Size to Min"),
                id : 'jsgvsizeminbtn',
                handler : function() {
                    // assign the smallest height of all selected items to all other items
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().sizeSelection(JSG.graph.command.SizeItems.VERTICALMIN);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/hsizemax.png',
                text : JSGDemo.resourceProvider.getString("Widest"),
                tooltip : JSGDemo.resourceProvider.getString("Widest"),
                id : 'jsghsizemaxbtn',
                handler : function() {
                    // assign the largest width of all selected items to all other items
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().sizeSelection(JSG.graph.command.SizeItems.HORIZONTALMAX);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/hsizemin.png',
                text : JSGDemo.resourceProvider.getString("Smallest"),
                tooltip : JSGDemo.resourceProvider.getString("Smallest"),
                id : 'jsghsizeminbtn',
                handler : function() {
                    // assign the smallest width of all selected items to all other items
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().sizeSelection(JSG.graph.command.SizeItems.HORIZONTALMIN);
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '25'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Order:"),
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/ordertop.png',
                text : JSGDemo.resourceProvider.getString("Top"),
                tooltip : JSGDemo.resourceProvider.getString("To Top"),
                id : 'jsgordertopbtn',
                handler : function() {
                    // change item order to top by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.TOTOP);
                    }
                }
            }, {
                xtype : 'button',
                id : 'jsgordertotopbtn',
                icon : 'resources/icons/ordertotop.png',
                text : JSGDemo.resourceProvider.getString("Up"),
                tooltip : JSGDemo.resourceProvider.getString("Move up"),
                handler : function() {
                    // change item order up by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.UP);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/orderbottom.png',
                text : JSGDemo.resourceProvider.getString("Bottom"),
                tooltip : JSGDemo.resourceProvider.getString("To Bottom"),
                id : 'jsgorderbottombtn',
                handler : function() {
                    // change item order to bottom by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.TOBOTTOM);
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/ordertobottom.png',
                text : JSGDemo.resourceProvider.getString("Down"),
                tooltip : JSGDemo.resourceProvider.getString("Move Down"),
                id : 'jsgordertobottombtn',
                handler : function() {
                    // change item order one step down by calling utility function
                    if (JSGDemo.viewport.getActiveEditor()) {
                        JSGDemo.viewport.getActiveEditor().getInteractionHandler().changeDrawingOrderSelection(JSG.graph.command.ChangeItemOrder.DOWN);
                    }
                }
            }]
        }]
    }, {
        title : JSGDemo.resourceProvider.getString("Layout"),
        id : 'tbLayout',
        style : {
            border : 'none'
        },
        items : [{
            xtype : 'toolbar',
            id : 'jsgtoolbarlayout',
            enableOverflow : true,
            defaults : {
                scale : 'medium',
                minWidth : 40,
                iconAlign : 'top',
                arrowAlign : 'right',
                cls : 'x-btn-icon'
            },
            cfgForce : ARAC.layout.defaultConfigStore.get('Force-CenterPoints').copy(),
//            cfgForce : ARAC.layout.defaultConfigStore.get('Force-CenterPoints-Anim').copy(),
            cfgTree : ARAC.layout.defaultConfigStore.get('Tree-CardinalPoints').copy(),
            cfgFlow : ARAC.layout.defaultConfigStore.get('Flow-CardinalPoints-Orth').copy(),
            cfgGrid : new ARAC.layout.grid.GridLayoutConfig({cellWidth : 1500, cellHeight : 1500}),
            createAracGraph : function(type, title, nodeCount, newEditor/*, randomSize*/) {
                var newEd = (newEditor === undefined ? true : newEditor);
                //var random = (randomSize == undefined ? false : randomSize);
                if (newEd) {
                    JSGDemo.modeltree.createModelItem("diagram", title);
                }
                var editor = JSGDemo.viewport.getActiveEditor();
                if (!editor) {
                    return;
                }
                
                var graph = editor.getGraph();    
                var generator = new ARAC.layout.tools.GraphGenerator();
                var support = new JSG.aracadapter.GraphGenSupport(graph);
                switch(type) {
                    case "force":
                        generator.genFlow(support, new ARAC.layout.tools.graphgen.FlowGenContext(
                            { nodeCount:nodeCount, endConCount:1/*,
                              nodePostProc:[ new ARAC.layout.tools.graphgen.proc.NodeSizeProc(1500, 0.0, 1500, 0.0) ]*/ }));
                        break;
                    case "tree":
                        generator.genTree(support, new ARAC.layout.tools.graphgen.TreeGenContext(
                            { nodeCount:nodeCount, levelAdd:nodeCount/3, leafAdd:2/*,
                              nodePostProc:[ new ARAC.layout.tools.graphgen.proc.NodeSizeProc(1500, 0.0, 1500, 0.0) ]*/ }));
                        break;
                    case "grid":
                        generator.genGrid(support, new ARAC.layout.tools.graphgen.GridGenContext(
                            { nodeCount:nodeCount,
                              nodePostProc:[ new ARAC.layout.tools.graphgen.proc.NodeSizeProc(500, 0.0, 500, 0.0) ] }));
                        break;
                    case "flow":
                        generator.genFlow(support, new ARAC.layout.tools.graphgen.FlowGenContext(
                            { nodeCount:nodeCount/*,
                              nodePostProc:[ new ARAC.layout.tools.graphgen.proc.NodeSizeProc(1500, 0.0, 1500, 0.0) ]*/ }));
                        break;
                }
                
                graph.markDirty();
                graph.setChanged(true);
                editor.invalidate();
            },
            executeAracLayout : function(config) {
                var editor = JSGDemo.viewport.getActiveEditor();
                var graph = editor.getGraph();
                var aracGraph = new JSG.aracadapter.AracGraphAdapter(graph);
                ARAC.layout.apply(aracGraph, config, ARAC.layout.defaultConfigStore.get('Edge-StoreData')/*, new ARAC.layout.LayoutWatch()*/);


//                ARAC.layout.apply(aracGraph, ARAC.layout.defaultConfigStore.get('EPC-Satellites'), ARAC.layout.defaultConfigStore.get('Edge-StoreData'), new JSG.aracadapter.AracWatch(editor));
//                ARAC.layout.apply(aracGraph, ARAC.layout.defaultConfigStore.get('EPC-Flow'), ARAC.layout.defaultConfigStore.get('Edge-StoreData'), new JSG.aracadapter.AracWatch(editor));
//                ARAC.layout.apply(aracGraph, ARAC.layout.defaultConfigStore.get('EPC'), ARAC.layout.defaultConfigStore.get('Edge-StoreData'), new JSG.aracadapter.AracWatch(editor));
//                editor.invalidate();
                // if (editor.aracwatch)
                // {
                  // editor.aracwatch.animAbort = true;
                  // delete editor.aracwatch;
                  // if (config !== this.cfgForce)
                  // {
                    // var aw = new JSG.aracadapter.AracWatch(editor);
                    // ARAC.layout.apply(aracGraph, config, ARAC.layout.defaultConfigStore.get('Edge-StoreData'), aw);
                    // editor.aracwatch = aw;
                  // }
                // }
                // else
                // {
                  // var aw = new JSG.aracadapter.AracWatch(editor);
                  // ARAC.layout.apply(aracGraph, config, ARAC.layout.defaultConfigStore.get('Edge-StoreData'), aw);
                  // editor.aracwatch = aw;
                // }
                 editor.invalidate();
            },
            executeAracLayoutFromStore : function(name) {
                var editor = JSGDemo.viewport.getActiveEditor();
                var graph = editor.getGraph();
                var aracGraph = new JSG.aracadapter.AracGraphAdapter(graph);
                ARAC.layout.applyFromStore(aracGraph, name, 'Edge-StoreData'/*, new JSG.aracadapter.AracWatch(editor)*/);
                editor.invalidate();
            },
            items : [{
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Force:"),
                style : {
                    fontWeight : "bold"
                },
                minWidth : '40'
            }, {
                xtype : 'button',
                icon : 'resources/icons/forcecreate.png',
                id : 'createForce',
                text : JSGDemo.resourceProvider.getString("Create"),
                tooltip : JSGDemo.resourceProvider.getString("Create Graph for Force Layout"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("Small Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("force", "Force Small", 64);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Medium Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("force", "Force Medium", 128);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Large Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("force", "Force Large", 256);
                        }
                    }]
                }
            }, {
                xtype : 'button',
                icon : /*TODO*/'resources/icons/force.png',
                id : 'executeForce',
                text : JSGDemo.resourceProvider.getString("Execute"),
                handler : function() {
                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                    cmp.executeAracLayout(cmp.cfgForce);
                }
            }, {
                xtype : 'button',
                icon : /*TODO*/'resources/icons/forcesettings.png',
                id : 'settingsForce',
                text : JSGDemo.resourceProvider.getString("Settings"),
                menu : {
                    plain : true,
                    width : 160,
                    listeners : {
                        show : function(menu, eOpts) {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                Ext.getCmp("forcerejection").setValue(cmp.cfgForce.rejection);
                                Ext.getCmp("forceattraction").setValue(cmp.cfgForce.attraction);
                                Ext.getCmp("forcegravitation").setValue(cmp.cfgForce.gravitation);
                            }
                        }
                    },
                    items : [{
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'forcerejection',
                        fieldLabel: JSGDemo.resourceProvider.getString('Rejection:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 200,
                        step: 1,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 200) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgForce.rejection = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'forceattraction',
                        fieldLabel: JSGDemo.resourceProvider.getString('Attraction:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 200,
                        step: 1,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 200) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgForce.attraction = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'forcegravitation',
                        fieldLabel: JSGDemo.resourceProvider.getString('Gravitation:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 200,
                        step: 1,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 200) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgForce.gravitation = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype : 'button',
                        text : JSGDemo.resourceProvider.getString("Apply"),
                        handler : function () {
                            var cmp = Ext.getCmp('jsgtoolbarlayout');
                            cmp.executeAracLayout(cmp.cfgForce);
                        }
                    }]
                }
            } , {
                xtype : 'text',
                minWidth : '20'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Tree:"),
                style : {
                    fontWeight : "bold"
                },
                minWidth : '35'
            }, {
                xtype : 'button',
                icon : 'resources/icons/treecreate.png',
                id : 'createTree',
                text : JSGDemo.resourceProvider.getString("Create"),
                tooltip : JSGDemo.resourceProvider.getString("Create Graph for Tree Layout"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("Small Tree"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("tree", "Tree Small", 64);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Medium Tree"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("tree", "Tree Medium", 256);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Large Tree"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("tree", "Tree Large", 512);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Two Trees"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("tree", "Double Tree", 64);
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("tree", "", 64, false/*, false*/);
                        }
                    }]
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/tree.png',
                id : 'executeTree',
                text : JSGDemo.resourceProvider.getString("Execute"),
                handler : function() {
                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                    cmp.executeAracLayout(cmp.cfgTree);
                }
            }, {
                text : JSGDemo.resourceProvider.getString("Tree Layouts"),
                icon : 'resources/icons/treeconfig.png',
                id : 'predefinedTree',
                tooltip : JSGDemo.resourceProvider.getString("Layout Tree using predefined configuration"),
                menu : {
                    plain : true,
                    items : [{
                        xtype : 'buttongroup',
                        columns : 5,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            xtype : 'button',
                            width : 80,
                            height : 80
                        },
                        items : [{
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Tree Left</br>Aligned"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-TTB-Head.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree top down (Left aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.TB-Pb.H');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-LTR-Head.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree left to right (Left aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.LR-Pb.H');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-BTT-Head.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree bottom up (Left aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.BT-Pb.H');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-RTL-Head.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree right to left (Left aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.RL-Pb.H');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Tree Center</br>Aligned"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-TTB-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree top down (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.TB');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-LTR-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree left to right (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.LR');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-BTT-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree bottom up (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.BT');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-RTL-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree right to left (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.RL');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Tree Right</br>Aligned"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-TTB-Tail.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree top down (Right aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.TB-Pb.T');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-LTR-Tail.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree left to right (Right aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.LR-Pb.T');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-BTT-Tail.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree bottom up (Right aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.BT-Pb.T');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-RTL-Tail.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree right to left (Right aligned)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('Tree-Lo.RL-Pb.T');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Single List"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListS-TTB-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("List top down (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListS-Lo.TB-Pb.HM');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListS-LTR-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("List left to right (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListS-Lo.LR-Pb.HM');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListS-BTT-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("List bottom up (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListS-Lo.BT-Pb.HM');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListS-RTL-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("List right to left (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListS-Lo.RL-Pb.HM');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Double List"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListD-TTB.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Double List top down (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListD-Lo.TB');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListD-LTR.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Double List left to right (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListD-Lo.LR');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListD-BTT.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Double List bottom up (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListD-Lo.BT');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeListD-RTL.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Double List right to left (Centered)"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('ListD-Lo.RL');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Horizontal</br>Vertical</br>Tree"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeHV-TTB-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("HV Tree top down"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('HV-Lo.TB-Pb.HM');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeHV-LTR-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("HV Tree left to right"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('HV-Lo.LR-Pb.HM');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeHV-BTT-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("HV Tree bottom up"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('HV-Lo.BT-Pb.HM');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeHV-RTL-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("HV Tree right to left"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('HV-Lo.RL-Pb.HM');
                            }
                        }]
                    }]
                }
            } , {
                text : JSGDemo.resourceProvider.getString("OrgChart Layouts"),
                icon : 'resources/icons/treeconfig.png',
                id : 'predefinedOrgChart',
                tooltip : JSGDemo.resourceProvider.getString("OrgCharts using predefined configuration"),
                menu : {
                    plain : true,
                    items : [{
                        xtype : 'buttongroup',
                        columns : 3,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            xtype : 'button',
                            width : 80,
                            height : 80
                        },
                        items : [{
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Tree (TB) combined</br>with List"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-TTB-Median-L2_TreeListS-TTB-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree top down / List top down"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('OrgChart-ListInTree-ToBottom4');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-TTB-Median-L2_TreeListS-LTR-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree top down / List left to right"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('OrgChart-ListInTree-ToBottom1');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Tree (LR) combined</br>with List"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-LTR-Median-L2_TreeListS-TTB-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree left to right / List top down"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('OrgChart-ListInTree-ToRight1');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-LTR-Median-L2_TreeListS-LTR-Median.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree left to right / List left to right"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('OrgChart-ListInTree-ToRight4');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Tree combined</br>with Double List"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-LTR-Median-L2_TreeListD-TTB.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree left to right / Double list top down"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('OrgChart-ListDInTree-ToRight1');
                            }

                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/TreeNormal-TTB-Median-L2_TreeListD-TTB.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Tree top down / Double list top down"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('OrgChart-ListDInTree-ToBottom4');
                            }
                        }]
                    }]
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/treesettings.png',
                id : 'settingsTree',
                text : JSGDemo.resourceProvider.getString("Settings"),
                menu : {
                    plain : true,
                    width : 200,
                    listeners : {
                        show : function(menu, eOpts) {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                Ext.getCmp("treestyle").setValue(cmp.cfgTree.treeStyle);
                                Ext.getCmp("treedirection").setValue(cmp.cfgTree.layoutOrientation);
                                Ext.getCmp("treeparentbalancing").setValue(cmp.cfgTree.parentBalancing);
                                Ext.getCmp("treelayerdistance").setValue(cmp.cfgTree.layerDistance);
                                Ext.getCmp("treenodedistance").setValue(cmp.cfgTree.nodeDistance);
                                Ext.getCmp("treeedgetype").setValue(cmp.cfgTree.edgeType);
                                Ext.getCmp("treelinecorners").setValue(cmp.cfgTree.edgeTypeDesc.lineCorners);
                                Ext.getCmp("treeelbowtype").setValue(cmp.cfgTree.edgeTypeDesc.elbow);
                                Ext.getCmp("treesrcslope").setValue(cmp.cfgTree.edgeTypeDesc.srcSlope);
                                Ext.getCmp("treetgtslope").setValue(cmp.cfgTree.edgeTypeDesc.tgtSlope);
                            }
                        }
                    },
                    items : [{
                        xtype: 'combobox',
                        anchor: '100%',
                        id : 'treestyle',
                        fieldLabel: JSGDemo.resourceProvider.getString('Style:'),
                        fieldStyle : { 'fontSize' : '8pt' },
                        labelWidth : 80,
                        editable : false,
                        margin : "5px",
                        store :  JSG.aracadapter.viewutil.TREE_STYLE_STORE,
                        displayField : 'name',
                        valueField : 'value',
                        listeners: {
                            select : function(combo, records, opts) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                cmp.cfgTree.treeStyle = records[0].get('value');
                            }
                        }
                    }, '-', {
                        xtype: 'combobox',
                        anchor: '100%',
                        id : 'treedirection',
                        fieldLabel: JSGDemo.resourceProvider.getString('Direction:'),
                        fieldStyle : { 'fontSize' : '8pt' },
                        labelWidth : 80,
                        editable : false,
                        margin : "5px",
                        store :  JSG.aracadapter.viewutil.LAYOUT_ORIENTATION_STORE,
                        displayField : 'name',
                        valueField : 'value',
                        listeners: {
                            select : function(combo, records, opts) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                cmp.cfgTree.layoutOrientation = records[0].get('value');
                            }
                        }
                    }, '-', {
                        xtype: 'combobox',
                        anchor: '100%',
                        id : 'treeparentbalancing',
                        fieldLabel: JSGDemo.resourceProvider.getString('Parent Balancing:'),
                        fieldStyle : { 'fontSize' : '8pt' },
                        labelWidth : 80,
                        editable : false,
                        margin : "5px",
                        store :  JSG.aracadapter.viewutil.PARENT_BALANCING_STORE,
                        displayField : 'name',
                        valueField : 'value',
                        listeners: {
                            select : function(combo, records, opts) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                cmp.cfgTree.parentBalancing = records[0].get('value');
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'treelayerdistance',
                        fieldLabel: JSGDemo.resourceProvider.getString('Layer Distance:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 10000,
                        step: 100,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgTree.layerDistance = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'treenodedistance',
                        fieldLabel: JSGDemo.resourceProvider.getString('Node Distance:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 10000,
                        step: 100,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgTree.nodeDistance = value;
                                }
                            }
                        }
                    }, '-', {
                      xtype: 'combobox',
                      anchor: '100%',
                      id : 'treeedgetype',
                      fieldLabel: JSGDemo.resourceProvider.getString('Edge Type:'),
                      fieldStyle : {
                          'fontSize' : '8pt'
                      },
                      labelWidth : 80,
                      editable : false,
                      margin : "5px",
                      store :  JSG.aracadapter.viewutil.EDGE_TYPE_STORE,
                      displayField : 'name',
                      valueField : 'value',
                      listeners: {
                          select : function(combo, records, opts) {
                              var cmp = Ext.getCmp('jsgtoolbarlayout');
                              cmp.cfgTree.edgeType = records[0].get('value');
                              switch (cmp.cfgTree.edgeType) {
                              case ARAC.layout.config.EdgeType.STRAIGHT:
                                Ext.getCmp("treeelbowtype").disable();
                                Ext.getCmp("treesrcslope").disable();
                                Ext.getCmp("treetgtslope").disable();
                                break;
                              case ARAC.layout.config.EdgeType.ELBOW:
                                Ext.getCmp("treeelbowtype").enable();
                                Ext.getCmp("treesrcslope").enable();
                                Ext.getCmp("treetgtslope").enable();
                                break;
                              case ARAC.layout.config.EdgeType.ORTHOGONAL:
                                Ext.getCmp("treeelbowtype").disable();
                                Ext.getCmp("treesrcslope").disable();
                                Ext.getCmp("treetgtslope").disable();
                                break;
                              }
                          }
                      }
                  }, {
                      xtype: 'numberfield',
                      anchor: '100%',
                      id : 'treelinecorners',
                      fieldLabel: JSGDemo.resourceProvider.getString('Line Corners:'),
                      fieldStyle : { 'fontSize' : '8pt' },
                      labelWidth : 80,
                      margin : "5px",
                      minValue : 0,
                      maxValue : 10000,
                      step: 50,
                      value: 1,
                        validator : function (value) {
                          return value >= 0 && value <= 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value >= 0 && value <= 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgTree.edgeTypeDesc.lineCorners = value;
                                }
                            }
                        }
                    }, {
                      xtype: 'combobox',
                      anchor: '100%',
                      id : 'treeelbowtype',
                      fieldLabel: JSGDemo.resourceProvider.getString('Elbow Type:'),
                      fieldStyle : {
                          'fontSize' : '8pt'
                      },
                      labelWidth : 80,
                      editable : false,
                      margin : "5px",
                      store :  JSG.aracadapter.viewutil.ELBOW_TYPE,
                      displayField : 'name',
                      valueField : 'value',
                      listeners: {
                          select : function(combo, records, opts) {
                              var cmp = Ext.getCmp('jsgtoolbarlayout');
                              cmp.cfgTree.edgeTypeDesc.elbow = records[0].get('value');
                          }
                      }
                  }, {
                      xtype: 'numberfield',
                      anchor: '100%',
                      id : 'treesrcslope',
                      fieldLabel: JSGDemo.resourceProvider.getString('Source Slope:'),
                      fieldStyle : { 'fontSize' : '8pt' },
                      labelWidth : 80,
                      margin : "5px",
                      minValue : 0,
                      maxValue : 10000,
                      step: 50,
                      value: 1,
                        validator : function (value) {
                          return value >= 0 && value <= 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value >= 0 && value <= 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgTree.edgeTypeDesc.srcSlope = value;
                                }
                            }
                        }
                    }, {
                      xtype: 'numberfield',
                      anchor: '100%',
                      id : 'treetgtslope',
                      fieldLabel: JSGDemo.resourceProvider.getString('Target Slope:'),
                      fieldStyle : { 'fontSize' : '8pt' },
                      labelWidth : 80,
                      margin : "5px",
                      minValue : 0,
                      maxValue : 10000,
                      step: 50,
                      value: 1,
                        validator : function (value) {
                          return value >= 0 && value <= 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value >= 0 && value <= 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgTree.edgeTypeDesc.tgtSlope = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype : 'button',
                        text : JSGDemo.resourceProvider.getString("Apply"),
                        handler : function () {
                            var cmp = Ext.getCmp('jsgtoolbarlayout');
                            cmp.executeAracLayout(cmp.cfgTree);
                        }
                    }]
                }
            }, {
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Hierarchical:"),
                style : {
                    fontWeight : "bold"
                },
                minWidth : '70'
            }, {
                xtype : 'button',
                icon : 'resources/icons/flowcreate.png',
                id : 'createFlow',
                text : JSGDemo.resourceProvider.getString("Create"),
                tooltip : JSGDemo.resourceProvider.getString("Create Hierchical Graph"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("Small Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("flow", "Flow Small", 64);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Medium Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("flow", "Flow Medium", 256);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Large Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("flow", "Flow Large", 512);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Two Graphs"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("flow", "Flow Double", 64);
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("flow", "", 64, false/*, false*/);
                        }
                    }]
                }
            }, {
                xtype : 'button',
                cls : 'x-btn-icon',
                icon : 'resources/icons/flow.png',
                id : 'executeFlow',
                text : JSGDemo.resourceProvider.getString("Execute"),
                tooltip : JSGDemo.resourceProvider.getString("Apply Flow Layout"),
                handler : function() {
                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                    cmp.executeAracLayout(cmp.cfgFlow);
                }

            }/*, {
                xtype : 'button',
                cls : 'x-btn-icon',
                icon : 'resources/icons/flow.png',
                id : 'executeEPC',
                text : JSGDemo.resourceProvider.getString("EPC Layout"),
                tooltip : JSGDemo.resourceProvider.getString("Apply EPC Layout"),
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    var graph = editor.getGraph();
                    var aracGraph = new JSG.aracadapter.AracGraphAdapter(graph);
                    ARAC.layout.apply(aracGraph, ARAC.layout.defaultConfigStore.get('EPC'), ARAC.layout.defaultConfigStore.get('Edge-StoreData'), new ARAC.layout.LayoutWatch());
                    editor.invalidate();
                }

            } */, {
                text : JSGDemo.resourceProvider.getString("Flow Layouts"),
                icon : 'resources/icons/flowconfig.png',
                id : 'predefinedFlow',
                tooltip : JSGDemo.resourceProvider.getString("Flow layouts using predefined configuration"),
                menu : {
                    plain : true,
                    items : [{
                        xtype : 'buttongroup',
                        columns : 5,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            xtype : 'button',
                            width : 80,
                            height : 80
                        },
                        items : [{
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Generic Flow"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/Flow-TTB-Normal.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Flow top down"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-TTB-N");
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/Flow-LTR-Normal.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Flow left to right"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-LTR-N");
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/Flow-BTT-Normal.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Flow bottom up"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-BTT-N");
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/Flow-RTL-Normal.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Flow right left"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-RTL-N");
                            }
                        },{
                          xtype : 'box',
                          html : JSGDemo.resourceProvider.getString("Generic Flow (LongestPath)"),
                          style : {
                              fontSize : '8pt',
                              textAlign : 'center',
                              display: 'table-cell',
                              verticalAlign: 'middle'
                          }
                      },  {
                          style : {
                            background : "#FAFAFA url(resources/icons/layout/Flow-TTB-LongestPath.png) no-repeat",
                            margin : "3px"
                        },
                        tooltip : JSGDemo.resourceProvider.getString("Flow top down"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-TTB-LP");
                        }
                      }, {
                          style : {
                              background : "#FAFAFA url(resources/icons/layout/Flow-LTR-LongestPath.png) no-repeat",
                              margin : "3px"
                          },
                          tooltip : JSGDemo.resourceProvider.getString("Flow left to right"),
                          handler : function() {
                              Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-LTR-LP");
                          }
                      }, {
                          style : {
                              background : "#FAFAFA url(resources/icons/layout/Flow-BTT-LongestPath.png) no-repeat",
                              margin : "3px"
                          },
                          tooltip : JSGDemo.resourceProvider.getString("Flow bottom up"),
                          handler : function() {
                              Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-BTT-LP");
                          }
                      }, {
                          style : {
                              background : "#FAFAFA url(resources/icons/layout/Flow-RTL-LongestPath.png) no-repeat",
                              margin : "3px"
                          },
                          tooltip : JSGDemo.resourceProvider.getString("Flow right left"),
                          handler : function() {
                              Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore("Flow-RTL-LP");
                          }
                      }]
                    }]
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/flowsettings.png',
                id : 'settingsFlow',
                text : JSGDemo.resourceProvider.getString("Settings"),
                menu : {
                    plain : true,
                    width : 200,
                    listeners : {
                        show : function(menu, eOpts) {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                Ext.getCmp("flowdirection").setValue(cmp.cfgFlow.layoutOrientation);
                                Ext.getCmp("flowlayerdistance").setValue(cmp.cfgFlow.layerDistance);
                                Ext.getCmp("flownodedistance").setValue(cmp.cfgFlow.nodeDistance);
                                Ext.getCmp("flowedgestyle").setValue(cmp.cfgFlow.edgeType);
                                Ext.getCmp("flowlinecorners").setValue(cmp.cfgFlow.edgeTypeDesc.lineCorners);
                                Ext.getCmp("flowelbowtype").setValue(cmp.cfgFlow.edgeTypeDesc.elbow);
                                Ext.getCmp("flowsrcslope").setValue(cmp.cfgFlow.edgeTypeDesc.srcSlope);
                                Ext.getCmp("flowtgtslope").setValue(cmp.cfgFlow.edgeTypeDesc.tgtSlope);
                            }
                        }
                    },
                    items : [{
                        xtype: 'combobox',
                        anchor: '100%',
                        id : 'flowdirection',
                        fieldLabel: JSGDemo.resourceProvider.getString('Direction:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        editable : false,
                        margin : "5px",
                        store :  JSG.aracadapter.viewutil.LAYOUT_ORIENTATION_STORE,
                        displayField : 'name',
                        valueField : 'value',
                        listeners: {
                            select : function(combo, records, opts) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                cmp.cfgFlow.layoutOrientation = records[0].get('value');
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'flowlayerdistance',
                        fieldLabel: JSGDemo.resourceProvider.getString('Layer Distance:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 10000,
                        step: 100,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgFlow.layerDistance = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'flownodedistance',
                        fieldLabel: JSGDemo.resourceProvider.getString('Node Distance:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 1,
                        maxValue : 10000,
                        step: 100,
                        value: 1,
                        validator : function (value) {
                            return value > 0 && value < 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 0 && value < 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgFlow.nodeDistance = value;
                                }
                            }
                        }
                    }, '-', {
                      xtype: 'combobox',
                      anchor: '100%',
                      id : 'flowedgestyle',
                      fieldLabel: JSGDemo.resourceProvider.getString('Edge Type:'),
                      fieldStyle : {
                          'fontSize' : '8pt'
                      },
                      labelWidth : 80,
                      editable : false,
                      margin : "5px",
                      store :  JSG.aracadapter.viewutil.EDGE_TYPE_STORE,
                      displayField : 'name',
                      valueField : 'value',
                      listeners: {
                          select : function(combo, records, opts) {
                              var cmp = Ext.getCmp('jsgtoolbarlayout');
                              cmp.cfgFlow.edgeType = records[0].get('value');
                              switch (cmp.cfgFlow.edgeType) {
                              case ARAC.layout.config.EdgeType.STRAIGHT:
                                Ext.getCmp("flowelbowtype").disable();
                                Ext.getCmp("flowsrcslope").disable();
                                Ext.getCmp("flowtgtslope").disable();
                                break;
                              case ARAC.layout.config.EdgeType.ELBOW:
                                Ext.getCmp("flowelbowtype").enable();
                                Ext.getCmp("flowsrcslope").enable();
                                Ext.getCmp("flowtgtslope").enable();
                                break;
                              case ARAC.layout.config.EdgeType.ORTHOGONAL:
                                Ext.getCmp("flowelbowtype").disable();
                                Ext.getCmp("flowsrcslope").disable();
                                Ext.getCmp("flowtgtslope").disable();
                                break;
                              }
                          }
                      }
                  }, {
                    xtype: 'numberfield',
                    anchor: '100%',
                    id : 'flowlinecorners',
                    fieldLabel: JSGDemo.resourceProvider.getString('Line Corners:'),
                    fieldStyle : { 'fontSize' : '8pt' },
                    labelWidth : 80,
                    margin : "5px",
                    minValue : 0,
                    maxValue : 10000,
                    step: 50,
                    value: 1,
                      validator : function (value) {
                        return value >= 0 && value <= 10000 ? true : "Error";
                      },
                      listeners: {
                          change: function(field, value) {
                              if (value >= 0 && value <= 10000) {
                                  var cmp = Ext.getCmp('jsgtoolbarlayout');
                                  cmp.cfgFlow.edgeTypeDesc.lineCorners = value;
                              }
                          }
                      }
                  }, {
                    xtype: 'combobox',
                    anchor: '100%',
                    id : 'flowelbowtype',
                    fieldLabel: JSGDemo.resourceProvider.getString('Elbow Type:'),
                    fieldStyle : {
                        'fontSize' : '8pt'
                    },
                    labelWidth : 80,
                    editable : false,
                    margin : "5px",
                    store :  JSG.aracadapter.viewutil.ELBOW_TYPE,
                    displayField : 'name',
                    valueField : 'value',
                    listeners: {
                        select : function(combo, records, opts) {
                            var cmp = Ext.getCmp('jsgtoolbarlayout');
                            cmp.cfgFlow.edgeTypeDesc.elbow = records[0].get('value');
                        }
                    }
                }, {
                    xtype: 'numberfield',
                    anchor: '100%',
                    id : 'flowsrcslope',
                    fieldLabel: JSGDemo.resourceProvider.getString('Source Slope:'),
                    fieldStyle : { 'fontSize' : '8pt' },
                    labelWidth : 80,
                    margin : "5px",
                    minValue : 0,
                    maxValue : 10000,
                    step: 50,
                    value: 1,
                      validator : function (value) {
                        return value >= 0 && value <= 10000 ? true : "Error";
                      },
                      listeners: {
                          change: function(field, value) {
                              if (value >= 0 && value <= 10000) {
                                  var cmp = Ext.getCmp('jsgtoolbarlayout');
                                  cmp.cfgFlow.edgeTypeDesc.srcSlope = value;
                              }
                          }
                      }
                  }, {
                    xtype: 'numberfield',
                    anchor: '100%',
                    id : 'flowtgtslope',
                    fieldLabel: JSGDemo.resourceProvider.getString('Target Slope:'),
                    fieldStyle : { 'fontSize' : '8pt' },
                    labelWidth : 80,
                    margin : "5px",
                    minValue : 0,
                    maxValue : 10000,
                    step: 50,
                    value: 1,
                      validator : function (value) {
                        return value >= 0 && value <= 10000 ? true : "Error";
                      },
                      listeners: {
                          change: function(field, value) {
                              if (value >= 0 && value <= 10000) {
                                  var cmp = Ext.getCmp('jsgtoolbarlayout');
                                  cmp.cfgFlow.edgeTypeDesc.tgtSlope = value;
                              }
                          }
                      }
                  }, '-', {
                        xtype : 'button',
                        text : JSGDemo.resourceProvider.getString("Apply"),
                        handler : function () {
                            var cmp = Ext.getCmp('jsgtoolbarlayout');
                            cmp.executeAracLayout(cmp.cfgFlow);
                        }
                    }]
                }

            }, {
                xtype : 'text',
                minWidth : '20'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Grid:"),
                style : {
                    fontWeight : "bold"
                },
                minWidth : '40'
            }, {
                xtype : 'button',
                icon : 'resources/icons/gridcreate.png',
                text : JSGDemo.resourceProvider.getString("Create"),
                tooltip : JSGDemo.resourceProvider.getString("Create Grid"),
                menu : {
                    items : [{
                        text : JSGDemo.resourceProvider.getString("Small Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("grid", "Grid Small", 64, true/*, true*/);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Medium Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("grid", "Grid Medium", 128, true/*, true*/);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Large Graph"),
                        handler : function() {
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("grid", "Grid Large", 256, true/*, true*/);
                        }
                    }, {
                        text : JSGDemo.resourceProvider.getString("Two Graphs"),
                        handler : function() {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("grid", editor, 64);
                            Ext.getCmp('jsgtoolbarlayout').createAracGraph("grid", editor, 64, false/*, true*/);
                        }
                    }]
                }
            }, {
                xtype : 'button',
                cls : 'x-btn-icon',
                icon : 'resources/icons/grid.png',
                id : 'createGrid',
                text : JSGDemo.resourceProvider.getString("Execute"),
                tooltip : JSGDemo.resourceProvider.getString("Apply Grid Layout"),
                handler : function() {
                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                    cmp.executeAracLayout(cmp.cfgGrid);
                }

            } , {
                text : JSGDemo.resourceProvider.getString("Grid Layouts"),
                icon : 'resources/icons/gridconfig.png',
                id : 'predefinedGrid',
                tooltip : JSGDemo.resourceProvider.getString("Grid layouts using predefined configuration"),
                menu : {
                    plain : true,
                    items : [{
                        xtype : 'buttongroup',
                        columns : 5,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            xtype : 'button',
                            width : 80,
                            height : 80
                        },
                        items : [{
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("n Items per row"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-RowPxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("n Items per row, x/y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-RowPxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-RowPxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("n Items per row, x ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-RowPxNy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-RowNxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("n Items per row, y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-RowNxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-RowNxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("n Items per row"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-RowNxNy');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("n Items per column"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-ColPxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("x Items per column, x/y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-ColPxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-ColPxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("x Items per column, x ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-ColPxNy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-ColNxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("x Items per column, y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-ColNxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridDistance-ColNxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("x Items per column"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridDistance-ColNxNy');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Matrix Align by Row"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-RowPxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Row x/y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-RowPxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-RowPxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Row, x ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-RowPxNy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-RowNxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Row, y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-RowNxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-RowNxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Row"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-RowNxNy');
                            }
                        }, {
                            xtype : 'box',
                            html : JSGDemo.resourceProvider.getString("Matrix Align by Column"),
                            style : {
                                fontSize : '8pt',
                                textAlign : 'center',
                                display: 'table-cell',
                                verticalAlign: 'middle'
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-ColPxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Column, x/y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-ColPxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-ColPxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Column, x ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-ColPxNy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-ColNxPy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Column, y ascending"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-ColNxPy');
                            }
                        }, {
                            style : {
                                background : "#FAFAFA url(resources/icons/layout/GridRaster-ColNxNy.png) no-repeat",
                                margin : "3px"
                            },
                            tooltip : JSGDemo.resourceProvider.getString("Align by Column"),
                            handler : function() {
                                Ext.getCmp('jsgtoolbarlayout').executeAracLayoutFromStore('GridRaster-ColNxNy');
                            }
                        }]
                    }]
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/gridsettings.png',
                id : 'settingsGrid',
                text : JSGDemo.resourceProvider.getString("Settings"),
                menu : {
                    plain : true,
                    width : 200,
                    listeners : {
                        show : function(menu, eOpts) {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                Ext.getCmp("gridtype").setValue(cmp.cfgGrid.type);
                                Ext.getCmp("griddirection").setValue(cmp.cfgGrid.direction);
                                Ext.getCmp("gridcellcount").setValue(cmp.cfgGrid.cellCount);
                                Ext.getCmp("gridcolgap").setValue(cmp.cfgGrid.colGap);
                                Ext.getCmp("gridrowgap").setValue(cmp.cfgGrid.rowGap);
                            }
                        }
                    },
                    items : [{
                        xtype: 'combobox',
                        anchor: '100%',
                        id : 'gridtype',
                        fieldLabel: JSGDemo.resourceProvider.getString('Type:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        editable : false,
                        margin : "5px",
                        store :  Ext.create('Ext.data.Store', {
                            fields: ['value', 'name'],
                            data : [
                                {"value": 1, "name": "Flow"},
                                {"value": 2, "name": "Matrix"},
                                {"value": 3, "name": "Back"}
                                //...
                            ]
                        }),
                        displayField : 'name',
                        valueField : 'value',
                        listeners: {
                            select : function(combo, records, opts) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                cmp.cfgGrid.type = records[0].get('value');
                            }
                        }
                    }, '-', {
                        xtype: 'combobox',
                        anchor: '100%',
                        id : 'griddirection',
                        fieldLabel: JSGDemo.resourceProvider.getString('Direction:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        editable : false,
                        margin : "5px",
                        store :  Ext.create('Ext.data.Store', {
                            fields: ['value', 'name'],
                            data : [
                                {"value": 1, "name":"By Row"},
                                {"value": 2, "name":"By Column"}
                                //...
                            ]
                        }),
                        displayField : 'name',
                        valueField : 'value',
                        listeners: {
                            select : function(combo, records, opts) {
                                var cmp = Ext.getCmp('jsgtoolbarlayout');
                                cmp.cfgGrid.direction = records[0].get('value');
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'gridcellcount',
                        fieldLabel: JSGDemo.resourceProvider.getString('Items per Line:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 0,
                        maxValue : 1000,
                        step: 1,
                        value: 0,
                        validator : function (value) {
                            return value >= 0 && value < 1000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value >= 0 && value < 1000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgGrid.cellCount = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'gridrowgap',
                        fieldLabel: JSGDemo.resourceProvider.getString('Row Gap:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 0,
                        maxValue : 10000,
                        step: 100,
                        value: 0,
                        validator : function (value) {
                            return value >= 0 && value < 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value >= 0 && value < 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgGrid.rowGap = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'gridcolgap',
                        fieldLabel: JSGDemo.resourceProvider.getString('Column Gap:'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 0,
                        maxValue : 10000,
                        step: 100,
                        value: 0,
                        validator : function (value) {
                            return value >= 0 && value < 10000 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value >= 0 && value < 10000) {
                                    var cmp = Ext.getCmp('jsgtoolbarlayout');
                                    cmp.cfgGrid.colGap = value;
                                }
                            }
                        }
                    }, '-', {
                        xtype : 'button',
                        text : JSGDemo.resourceProvider.getString("Apply"),
                        handler : function () {
                            var cmp = Ext.getCmp('jsgtoolbarlayout');
                            cmp.executeAracLayout(cmp.cfgGrid);
                        }
                    }]
                }
            }]
        }]
    }, {
        title : JSGDemo.resourceProvider.getString("View"),
        id : 'tbView',
        style : {
            border : 'none'
        },
        items : [{
            xtype : 'toolbar',
            id : 'jsgtoolbarview',
            enableOverflow : true,
            defaults : {
                scale : 'medium',
                minWidth : 40,
                iconAlign : 'top',
                arrowAlign : 'right',
                cls : 'x-btn-icon'
            },
            items : [{
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'button',
                icon : 'resources/icons/pagesize.png',
                text : JSGDemo.resourceProvider.getString('Page Size'),
                id : 'jsgviewpagesize',
                menu : {
                    plain : true,
                    width : 175,
                    listeners : {
                        show : function(menu, eOpts) {
                            // initialize page size by toggling the appropriate button
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                switch (editor.getGraphSettings().getPage().getFormat()) {
                                    case JSG.graph.model.settings.PageSize.A0:
                                        Ext.getCmp("sizea0").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.A1:
                                        Ext.getCmp("sizea1").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.A2:
                                        Ext.getCmp("sizea2").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.A3:
                                        Ext.getCmp("sizea3").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.A4:
                                        Ext.getCmp("sizea4").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.A5:
                                        Ext.getCmp("sizea5").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.B3:
                                        Ext.getCmp("sizeb3").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.B4:
                                        Ext.getCmp("sizeb4").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.B5:
                                        Ext.getCmp("sizeb5").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.LETTER:
                                        Ext.getCmp("sizeletter").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.LEGAL:
                                        Ext.getCmp("sizelegal").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageSize.LEDGER:
                                        Ext.getCmp("sizeledger").toggle(true, true);
                                        break;
                                }
                                Ext.getCmp("pagewidth").setValue(editor.getGraphSettings().getPage().getWidth() / 100);
                                Ext.getCmp("pageheight").setValue(editor.getGraphSettings().getPage().getHeight() / 100);
                            }
                        }
                    },
                    items : [{
                        xtype : 'buttongroup',
                        columns : 4,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            scale : 'large',
                            iconAlign : 'top'
                        },
                        items : [{
                            icon : 'resources/icons/pagea0.png',
                            id : 'sizea0',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.A0);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pagea1.png',
                            id : 'sizea1',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.A1);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pagea2.png',
                            id : 'sizea2',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.A2);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pagea3.png',
                            id : 'sizea3',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.A3);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pagea4.png',
                            id : 'sizea4',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.A4);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pagea5.png',
                            id : 'sizea5',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.A5);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pageb3.png',
                            id : 'sizeb3',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.B3);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pageb4.png',
                            id : 'sizeb4',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.B4);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pageb5.png',
                            id : 'sizeb5',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.B5);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pageletter.png',
                            id : 'sizeletter',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.LETTER);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pagelegal.png',
                            id : 'sizelegal',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.LEGAL);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            icon : 'resources/icons/pageledger.png',
                            id : 'sizeledger',
                            toggleGroup : 'pagesize',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setFormat(JSG.graph.model.settings.PageSize.LEDGER);
                                    editor.invalidate();
                                }
                            }
                        }]
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'pagewidth',
                        fieldLabel: JSGDemo.resourceProvider.getString('Width (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 50,
                        maxValue : 2000,
                        step: 1,
                        value: 0,
                        validator : function (value) {
                            return value > 50 && value < 2000 ? true : "Error";
                              
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 50 && value < 2000) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setWidth(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'pageheight',
                        fieldLabel: JSGDemo.resourceProvider.getString('Height (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        labelWidth : 80,
                        margin : "5px",
                        minValue : 50,
                        maxValue : 2000,
                        step: 1,
                        value: 0,
                        validator : function (value) {
                            return value > 50 && value < 2000 ? true : "Error";
                              
                        },
                        listeners: {
                            change: function(field, value) {
                                if (value > 50 && value < 2000) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setHeight(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }]
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/pageorientation.png',
                id : 'jsgviewpageorientation',
                text : JSGDemo.resourceProvider.getString('Orientation'),
                menu : {
                    plain : true,
                    listeners : {
                        show : function(menu, eOpts) {
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                switch (editor.getGraphSettings().getPage().getOrientation()) {
                                    case JSG.graph.model.settings.PageOrientation.PORTRAIT:
                                        Ext.getCmp("portrait").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.PageOrientation.LANDSCAPE:
                                        Ext.getCmp("landscape").toggle(true, true);
                                        break;
                                }
                            }
                        }
                    },
                    items : [{
                        xtype : 'buttongroup',
                        columns : 1,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            scale : 'large',
                            iconAlign : 'left'
                        },
                        items : [{
                            icon : 'resources/icons/pageportrait.png',
                            text : JSGDemo.resourceProvider.getString("Portrait"),
                            id : 'portrait',
                            width : 120,
                            toggleGroup : 'pageorientation',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setOrientation(JSG.graph.model.settings.PageOrientation.PORTRAIT);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            text : JSGDemo.resourceProvider.getString("Landscape"),
                            icon : 'resources/icons/pagelandscape.png',
                            id : 'landscape',
                            width : 120,
                            toggleGroup : 'pageorientation',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().getPage().setOrientation(JSG.graph.model.settings.PageOrientation.LANDSCAPE);
                                    editor.invalidate();
                                }
                            }
                        }]
                    }]
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/pageborders.png',
                id : 'jsgviewpagemargins',
                text : JSGDemo.resourceProvider.getString('Margins'),
                menu : {
                    plain : true,
                    width : 160,
                    listeners : {
                        show : function(menu, eOpts) {
                            // initialize page margin settings
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                Ext.getCmp("leftmargin").setValue(editor.getGraphSettings().getPage().getLeftMargin() / 100);
                                Ext.getCmp("topmargin").setValue(editor.getGraphSettings().getPage().getTopMargin() / 100);
                                Ext.getCmp("rightmargin").setValue(editor.getGraphSettings().getPage().getRightMargin() / 100);
                                Ext.getCmp("bottommargin").setValue(editor.getGraphSettings().getPage().getBottomMargin() / 100);
                                Ext.getCmp("headermargin").setValue(editor.getGraphSettings().getPage().getHeaderMargin() / 100);
                                Ext.getCmp("footermargin").setValue(editor.getGraphSettings().getPage().getFooterMargin() / 100);
                            }
                        }
                    },
                    items: [{
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'leftmargin',
                        fieldLabel: JSGDemo.resourceProvider.getString('Left (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        minValue : 0,
                        step: 5,
                        value: 0,
                        labelWidth : 80,
                        validator : function (value) {
                            return value >= 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                // assign new page margin value
                                if (value >= 0 && value < 200) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setLeftMargin(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'topmargin',
                        fieldLabel: JSGDemo.resourceProvider.getString('Top (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        minValue : 0,
                        step: 5,
                        value: 0,
                        labelWidth : 80,
                        validator : function (value) {
                            return value >= 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                // assign new page margin value
                                if (value >= 0 && value < 200) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setTopMargin(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'rightmargin',
                        fieldLabel: JSGDemo.resourceProvider.getString('Right (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        minValue : 0,
                        step: 5,
                        value: 0,
                        labelWidth : 80,
                        validator : function (value) {
                            return value >= 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                // assign new page margin value
                                if (value >= 0 && value < 200) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setRightMargin(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'bottommargin',
                        fieldLabel: JSGDemo.resourceProvider.getString('Bottom (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        minValue : 0,
                        step: 5,
                        value: 0,
                        labelWidth : 80,
                        validator : function (value) {
                            return value >= 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                // assign new page margin value
                                if (value >= 0 && value < 200) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setBottomMargin(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'headermargin',
                        fieldLabel: JSGDemo.resourceProvider.getString('Header (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        minValue : 0,
                        step: 5,
                        value: 0,
                        labelWidth : 80,
                        validator : function (value) {
                            return value >= 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                // assign new page margin value
                                if (value >= 0 && value < 200) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setHeaderMargin(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }, '-', {
                        xtype: 'numberfield',
                        anchor: '100%',
                        id : 'footermargin',
                        fieldLabel: JSGDemo.resourceProvider.getString('Footer (mm):'),
                        fieldStyle : {
                            'fontSize' : '8pt'
                        },
                        margin : "5px",
                        minValue : 0,
                        step: 5,
                        value: 0,
                        labelWidth : 80,
                        validator : function (value) {
                            return value >= 0 && value < 200 ? true : "Error";
                        },
                        listeners: {
                            change: function(field, value) {
                                // assign new page margin value
                                if (value >= 0 && value < 200) {
                                    var editor = JSGDemo.viewport.getActiveEditor();
                                    if (editor) {
                                        editor.getGraphSettings().getPage().setFooterMargin(value * 100);
                                        editor.invalidate();                                
                                    }
                                }
                            }
                        }
                    }]
                }                
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Grid Style'),
                id : 'jsggridstyle',
                icon : 'resources/icons/grid.png',
                menu : {
                    plain : true,
                    listeners : {
                        show : function(menu, eOpts) {
                            // select current page mode
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                switch (editor.getGraphSettings().getGridStyle()) {
                                    case JSG.graph.model.settings.GridStyle.GRID:
                                        Ext.getCmp("gridstylegrid").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.GridStyle.CROSSES:
                                        Ext.getCmp("gridstylecrosses").toggle(true, true);
                                        break;
                                    case JSG.graph.model.settings.GridStyle.DOT:
                                        Ext.getCmp("gridstyledot").toggle(true, true);
                                        break;
                                }
                            }
                        }
                    },
                    items : [{
                        xtype : 'buttongroup',
                        columns : 1,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            scale : 'large',
                            iconAlign : 'left'
                        },
                        items : [{
                            icon : 'resources/icons/grid.png',
                            text : JSGDemo.resourceProvider.getString("Grid"),
                            id : 'gridstylegrid',
                            width : 120,
                            toggleGroup : 'gridstyle',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().setGridStyle(JSG.graph.model.settings.GridStyle.GRID);
                                    editor.invalidate();                                
                                }
                            }
                        }, {
                            text : JSGDemo.resourceProvider.getString("Crosses"),
                            icon : 'resources/icons/gridstylecrosses.png',
                            id : 'gridstylecrosses',
                            width : 120,
                            toggleGroup : 'gridstyle',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().setGridStyle(JSG.graph.model.settings.GridStyle.CROSSES);
                                    editor.invalidate();
                                }
                            }
                        }, {
                            text : JSGDemo.resourceProvider.getString("Dots"),
                            icon : 'resources/icons/gridstyledots.png',
                            id : 'gridstyledots',
                            width : 120,
                            toggleGroup : 'gridstyle',
                            toggleHandler : function() {
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().setGridStyle(JSG.graph.model.settings.GridStyle.DOTS);
                                    editor.invalidate();
                                }
                            }
                        }]
                    }]
                }
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('View Mode'),
                id : 'jsgviewmode',
                icon : 'resources/icons/viewmode.png',
                menu : {
                    plain : true,
                    listeners : {
                        show : function(menu, eOpts) {
                            // select current page mode
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                switch (editor.getGraphSettings().getDisplayMode()) {
                                    case JSG.ui.graphics.DisplayMode.ENDLESS:
                                        Ext.getCmp("viewmodeendless").toggle(true, true);
                                        break;
                                    case JSG.ui.graphics.DisplayMode.PAGE:
                                        Ext.getCmp("viewmodepage").toggle(true, true);
                                        break;
                                }
                            }
                        }
                    },
                    items : [{
                        xtype : 'buttongroup',
                        columns : 1,
                        style : {
                            backgroundColor : "transparent",
                            borderColor : "transparent"
                        },
                        defaults : {
                            scale : 'large',
                            iconAlign : 'left'
                        },
                        items : [{
                            icon : 'resources/icons/viewmodeendless.png',
                            text : JSGDemo.resourceProvider.getString("Endless Paper"),
                            id : 'viewmodeendless',
                            width : 120,
                            toggleGroup : 'viewmode',
                            toggleHandler : function() {
                                // assign new page mode
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().setDisplayMode(JSG.ui.graphics.DisplayMode.ENDLESS);
                                    editor.invalidate();                                
                                }
                            }
                        }, {
                        text : JSGDemo.resourceProvider.getString("Show Pages"),
                            icon : 'resources/icons/viewmodepage.png',
                            id : 'viewmodepage',
                            width : 120,
                            toggleGroup : 'viewmode',
                            toggleHandler : function() {
                                // assign new page mode
                                var editor = JSGDemo.viewport.getActiveEditor();
                                if (editor) {
                                    editor.getGraphSettings().setDisplayMode(JSG.ui.graphics.DisplayMode.PAGE);
                                    editor.invalidate();
                                }
                            }
                        }]
                    }]
                }
            }, {
                text : JSGDemo.resourceProvider.getString('Read Only Mode'),
                icon : 'resources/icons/readonlymode.png',
                id : 'jsgreadonlybtn',
				enableToggle : true,
                toggleHandler : function(btn, state) {
                    // activate view mode. The view mode disables the editing capabilities of the editor.
					var tab = JSGDemo.viewport.getActiveTab();
					var editor = JSGDemo.viewport.getActiveEditor();
					if(editor) {
						var mode = state === true ? JSG.graph.model.settings.ViewMode.READ_ONLY : JSG.graph.model.settings.ViewMode.DEFAULT;
						editor.activateViewMode(mode);
						editor.repaint();
						if (tab) {
							tab.updateLibraryPanel(editor);							
						}
					}
				}
            }, {
                xtype : 'text',
                minWidth : '35'
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Zoom'),
                icon : 'resources/icons/zoom.png',
                id : 'jsgviewzoom',
                menu : {
                    plain : true,
                    width : 181,
                    listeners : {
                        show : function(menu, eOpts) {
                            // initialize zoom status
                            var editor = JSGDemo.viewport.getActiveEditor();
                            if (editor) {
                                var sldZoom = menu.down('slider');
                                var zoom = editor.getZoom();
                                sldZoom.setValue(zoom * 100);

                                if (zoom === 0.25) {
                                    Ext.getCmp("zoom25").setChecked(true);
                                } else if (zoom === 0.5) {
                                    Ext.getCmp("zoom50").setChecked(true);
                                } else if (zoom === 0.75) {
                                    Ext.getCmp("zoom75").setChecked(true);
                                } else if (zoom === 1) {
                                    Ext.getCmp("zoom100").setChecked(true);
                                } else if (zoom === 1.5) {
                                    Ext.getCmp("zoom150").setChecked(true);
                                } else if (zoom === 2) {
                                    Ext.getCmp("zoom200").setChecked(true);
                                } else if (zoom === 4) {
                                    Ext.getCmp("zoom400").setChecked(true);
                                }
                            }
                        }
                    },
                    setZoom : function (value) {
                        // assign new zoom factor to editor
                        var editor = JSGDemo.viewport.getActiveEditor();
                        if (editor) {
                            editor.setZoom(value / 100);
                        }
                        
                    },
                    items : [{
                        xtype : 'menucheckitem',
                        text : '25 %',
                        id : 'zoom25',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(25);
                        }
                    }, {
                        xtype : 'menucheckitem',
                        text : '50 %',
                        id : 'zoom50',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(50);
                        }
                    }, {
                        text : '75 %',
                        xtype : 'menucheckitem',
                        id : 'zoom75',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(75);
                        }
                    }, {
                        xtype : 'menucheckitem',
                        text : '100 %',
                        id : 'zoom100',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(100);
                        }
                    }, {
                        xtype : 'menucheckitem',
                        text : '150 %',
                        id : 'zoom150',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(150);
                        }
                    }, {
                        xtype : 'menucheckitem',
                        text : '200 %',
                        id : 'zoom200',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(200);
                        }
                    }, {
                        xtype : 'menucheckitem',
                        text : '400 %',
                        id : 'zoom400',
                        group : 'pagezoom',
                        handler : function(btn) {
                            btn.up('menu').setZoom(400);
                        }
                    }, '-', {
                        xtype : 'text',
                        text : JSGDemo.resourceProvider.getString("Custom Zoom"),
                        style : {
                            'font-size' : '8pt',
                            'padding' : '5px',
                            'margin' : '5px',
                            'backgroundColor' : '#DDDDDD'
                        }
                    }, {
                        xtype : 'slider',
                        style : {
                            'margin' : '5px'
                        },
                        value : 20,
                        increment : 5,
                        minValue : 10,
                        maxValue : 400,
                        width : 198,
                        listeners : {
                            change : function(slider, newValue, thumb, eOpts) {
                                slider.up('menu').setZoom(newValue);
                            }
                        }
                    }]
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString('Zoom to Fit'),
                icon : 'resources/icons/zoomtofit.png',
                id : 'jsgviewzoomtofit',
                handler : function() {
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.setZoom(JSG.ui.GraphEditor.ZOOM_FIT);
                    }
                }
            }, {
                xtype : 'text',
                minWidth : '25'
            }, {
                xtype : 'text',
                text : JSGDemo.resourceProvider.getString("Show:"),
                minWidth : '35'
            }, {
                xtype : 'text',
                minWidth : '10'
            }, {
                xtype : 'button',
                icon : 'resources/icons/grid.png',
                text : JSGDemo.resourceProvider.getString('Grid'),
                id : 'jsgviewgrid',
                enableToggle : true,
                toggleHandler : function(btn, state) {
                    // switch grid visibility
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.getGraphSettings().setGridVisible(state);
                        editor.invalidate();
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/scalevisible.png',
                text : JSGDemo.resourceProvider.getString('Scales'),
                id : 'jsgviewscale',
                enableToggle : true,
                toggleHandler : function(btn, state) {
                    // switch scale visibility
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.getGraphSettings().setScaleVisible(state);
                        editor.invalidate();
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/portsvisible.png',
                text : JSGDemo.resourceProvider.getString('Ports'),
                id : 'jsgviewports',
                enableToggle : true,
                toggleHandler : function(btn, state) {
                    // defines, whether used or explicitly defined ports are visible
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.getGraphSettings().setPortsVisible(state);
                        editor.invalidate();
                    }
                }
            }, {
                xtype : 'button',
                icon : 'resources/icons/showpageborders.png',
                text : JSGDemo.resourceProvider.getString('Page Borders'),
                id : 'jsgpageborders',
                enableToggle : true,
                toggleHandler : function(btn, state) {
                    // defines, whether used or explicitly defined ports are visible
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.getGraphSettings().setPageBorderVisible(state);
                        editor.invalidate();
                    }
                }
            }, {
                xtype : 'button',
                text : JSGDemo.resourceProvider.getString("Names"),
                icon : 'resources/icons/shownames.png',
                id : 'viewnames',
                enableToggle : true,
                toggleHandler : function(btn, state) {
                    // shows the name of an GraphItem
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.getGraphSettings().setNamesVisible(state);
                        editor.invalidate();
                    }
                }
            }]
        }]
    }],
    /**
     * Displays a user input dialog to retrieve a single text entry.
     * 
     * @method getInput
     * @param {String} title Title to display on dialog caption.
     * @param {String} infotext Text to describe desired input.
     * @param {String} label Label shown before edit control.
     * @param {String} emptyText The text to show on empty input field.
     * @param {function} callback Callback that is called, if a user entered a value and pushed return.
     * The function gets the entered value passed as the first argument.
     */
    getInput : function(title, infotext, label, emptyText, callback) {
        var win = Ext.create('Ext.window.Window', {
            title : title,
            width : 450,
            height : 150,
            layout : 'fit',
            modal : true,
    
            items : [{
                plain : true,
                border : 0,
                bodyPadding : 5,
                fieldDefaults : {
                    labelWidth : 55,
                    anchor : '100%'
                },
                layout : {
                    type : 'vbox',
                    align : 'stretch' // Child items are stretched to full width
                },
                items : [{
                    xtype : 'label',
                    text : infotext,
                    margin : '0, 0, 20, 0'   
                }, {
                    xtype : 'textfield',
                    fieldLabel : label,
                    //value : initialValue,
                    emptyText: emptyText,
                    id : 'dlginput',
                    name : 'subject'
                }]
            }],
            dockedItems : [{
                xtype : 'toolbar',
                dock : 'bottom',
                ui : 'footer',
                layout : {
                    pack : 'center'
                },
                items : [{
                    minWidth : 80,
                    text : JSGDemo.resourceProvider.getString('OK'),
                    handler : function() {
                        var value = Ext.getCmp('dlginput').getValue();
                        this.up('window').close();
                        callback(value);
                    }
                }, {
                    minWidth : 80,
                    text : JSGDemo.resourceProvider.getString('Cancel'),
                    handler : function() {
                        this.up('window').close();
                    }
                }]
            }]
        });
        win.show();
    },
    /**
     * Handler, called, if the selection has changed. Only a flag is set to update the toolbar on the next idle run.
     * 
     * @method onSelectionChanged
     * @param {Object} notification Notification Object.
     */
    onSelectionChanged : function(notification) {
        this.tbUpdate = true;
    },
    /**
     * Idle handler called every 500ms. Updates the toolbar status, if necessary.
     * 
     * @method updateToolbarIdle
     * @return {boolean} Always true.
     */
    updateToolbarIdle : function() {
        if (this.tbUpdate) {
            this.updateToolbarWorker();
        }
        return true;
    },
    /**
     * Set the toolbar update flag to true. In consequence the next time the idle handler is called, the toolbar is updated.
     * 
     * @method updateToolbar
     */
    updateToolbar : function() {
        this.tbUpdate = true;
    },
    /**
     * Update the toolbar state by retrieving the selection state and setting the UI controls in the toolbar appropriately.
     * 
     * @method updateToolbarWorker
     */
    updateToolbarWorker : function() {
        if (!this.tbUpdate) {
            return;
        }

        // initialize status flags for later use            
        var editor = JSGDemo.viewport.getActiveEditor();
        var anyEditor = editor ? true : false;
        var selection = editor ? editor.getGraphViewer().getSelection() : undefined;
        var singleSelection = (selection !== undefined) && (selection.length === 1) && anyEditor;
        var anySelection = (selection !== undefined) && (selection.length > 0) && anyEditor;
        var multiSelection = (selection !== undefined) && (selection.length > 1) && anyEditor;
		var isReadOnlyMode = editor ? editor.isInViewMode(JSG.graph.model.settings.ViewMode.READ_ONLY) : false;  
        var enabled;
        var btn, cmp;
        
        var tabs = Ext.getCmp('jsgtoolbartabs');
        var tab = tabs.getActiveTab();

        // only update the visible toolbar part
        switch (tab.id) {
            case 'tbStart':
                btn = Ext.getCmp('jsgsavebtn');
                if (btn !== undefined) {
                    if (anyEditor) {
                        var graph = editor.getGraph();
                        if (graph) {
                            btn.setDisabled(!graph.isChanged());
                        }
                    } else { 
                        btn.setDisabled(true);
                    }
                }  
                btn = Ext.getCmp('jsgprintbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                }  
                btn = Ext.getCmp('jsgundobtn');
                if (btn !== undefined) {
                    enabled = anyEditor && editor.getInteractionHandler().isUndoAvailable();
                    btn.setDisabled(!enabled || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgredobtn');
                if (btn !== undefined) {
                    enabled = anyEditor && editor.getInteractionHandler().isRedoAvailable();
                    btn.setDisabled(!enabled || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgcopylargebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgcopybtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgcopyformatbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgcutbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpastelargebtn');
                if (btn !== undefined) {
                    enabled = anyEditor && (editor.getInteractionHandler().isPasteAvailable() || editor.getInteractionHandler().isPasteFormatAvailable());
                    btn.setDisabled(!enabled || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpastebtn');
                if (btn !== undefined) {
                    enabled = anyEditor && editor.getInteractionHandler().isPasteAvailable();
                    btn.setDisabled(!enabled || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpasteformatbtn');
                if (btn !== undefined) {
                    enabled = anyEditor && editor.getInteractionHandler().isPasteFormatAvailable();
                    btn.setDisabled(!enabled || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgdeletebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsglinebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsghvlinebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgellipsebtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgrectbtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpolygonbtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpolylinebtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgbezierbtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgtextbtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsglinefmtbtnstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgfillfmtbtnstart');
                if (btn !== undefined) {
                    if (editor) {
                        btn.setDisabled(!editor.getInteractionHandler().canApplyAttributes() || isReadOnlyMode);
                    } else {
                        btn.setDisabled(true);
                    }
                }  
                btn = Ext.getCmp('editpointsstart');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                break;
            case 'tbInsert':
                btn = Ext.getCmp('jsglinesbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgellipsebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgrectbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpolygonbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgpolylinebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgbezierbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgtextbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgtextbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgshapessbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  

                btn = Ext.getCmp('jsgcontainerbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgimagebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsghyperlinkbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsglinkgraphbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!singleSelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgwatermarkbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!singleSelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgheaderbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgfooterbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  

                btn = Ext.getCmp('jsgfilterbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }
				btn = Ext.getCmp('svgimportbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }
                break;
            case 'tbFormat':
                if (singleSelection) {
                    var model = selection[0].getModel();
                    var bbox = model.getBoundingBox();
                    cmp = Ext.getCmp('posX');
                    var id;
                    try {
                        var activeComponent = Ext.get(Ext.Element.getActiveElement());
                        if (activeComponent) {
                            id = activeComponent.id;
                        }
                    } catch (e) {
                    }
                    if (cmp) {
                        if (id.indexOf('posX') === -1) {
                            var x = model.getPin().getX();
                            cmp.setRawValue(x.getValue() / 100);
                            cmp.setDisabled(isReadOnlyMode);
                        }
                    }
                    cmp = Ext.getCmp('posY');
                    if (cmp) {
                        if (id.indexOf('posY') === -1) {
                            var y = model.getPin().getY();
                            cmp.setRawValue(y.getValue() / 100);
                            cmp.setDisabled(isReadOnlyMode);
                        }
                    }
                    cmp = Ext.getCmp('posWidth');
                    if (cmp) {
                        cmp.setRawValue(bbox.getWidth() / 100);
                        cmp.setDisabled(isReadOnlyMode);
                    }
                    cmp = Ext.getCmp('posHeight');
                    if (cmp) {
                        cmp.setRawValue(bbox.getHeight() / 100);
                        cmp.setDisabled(isReadOnlyMode);
                    }
                } else {
                    cmp = Ext.getCmp('posX');
                    cmp.setRawValue("");
                    cmp.setDisabled(true);
                    cmp = Ext.getCmp('posY');
                    cmp.setRawValue("");
                    cmp.setDisabled(true);
                    cmp = Ext.getCmp('posWidth');
                    cmp.setRawValue("");
                    cmp.setDisabled(true);
                    cmp = Ext.getCmp('posHeight');
                    cmp.setRawValue("");
                    cmp.setDisabled(true);
                }
                btn = Ext.getCmp('jsglinefmtbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgfillfmtbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgshadowfmtbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgfontfmtbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgtextfmtbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgtooltipbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!singleSelection || isReadOnlyMode);
                }  
                break;
            case 'tbChange':
                btn = Ext.getCmp('editpoints');
                if (btn !== undefined) {
                    // btn.setDisabled(!singleSelection || isReadOnlyMode);
                    //don't allow to change group shape...
                    btn.setDisabled(multiSelection || isReadOnlyMode || JSG.isGroup(selection[0].getModel()));
                }  
                btn = Ext.getCmp('group');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }  
                btn = Ext.getCmp('ungroup');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }
                  
                btn = Ext.getCmp('jsgalignleftbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgaligncenterbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgalignrightbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgaligntopbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgalignmiddlebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgalignbottombtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                
                btn = Ext.getCmp('jsgalignvdistributebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgalignhdistributebtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                
                btn = Ext.getCmp('jsgvsizemaxbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgvsizeminbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsghsizemaxbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsghsizeminbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!multiSelection || isReadOnlyMode);
                }

                btn = Ext.getCmp('jsgordertopbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgordertotopbtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgorderbottombtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgordertobottombtn');
                if (btn !== undefined) {
                    btn.setDisabled(!anySelection || isReadOnlyMode);
                }
                break;
            case 'tbLayout':
                btn = Ext.getCmp('executeForce');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('settingsForce');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('predefinedTree');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('predefinedOrgChart');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('executeTree');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('settingsTree');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('predefinedFlow');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('executeFlow');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('settingsFlow');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('predefinedGrid');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('executeGrid');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('settingsGrid');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                break;
            case 'tbView':
                btn = Ext.getCmp('jsgviewpagesize');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgviewpageorientation');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgviewpagemargins');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }  
                btn = Ext.getCmp('jsgviewmode');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor || isReadOnlyMode);
                }
                btn = Ext.getCmp('jsgreadonlybtn');
                if (btn) {
					btn.toggle(isReadOnlyMode);
                    btn.setDisabled(!anyEditor);
                }
                btn = Ext.getCmp('jsgviewzoom');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                }  
                btn = Ext.getCmp('jsgviewzoomtofit');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                }  
                btn = Ext.getCmp('jsgviewgrid');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                    if (editor) {
                        btn.toggle(editor.getGraphSettings().getGridVisible());
                    }
                }  
                btn = Ext.getCmp('jsggridstyle');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                }  
                btn = Ext.getCmp('jsgviewscale');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                    if (editor) {
                        btn.toggle(editor.getGraphSettings().getScaleVisible());
                    }
                }  
                btn = Ext.getCmp('jsgviewports');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                    if (editor) {
                        btn.toggle(editor.getGraphSettings().getPortsVisible());
                    }
                }  
                btn = Ext.getCmp('viewnames');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                    if (editor) {
                        btn.toggle(editor.getGraphSettings().getNamesVisible());
                    }
                }  
                btn = Ext.getCmp('jsgpageborders');
                if (btn !== undefined) {
                    btn.setDisabled(!anyEditor);
                    if (editor) {
                        btn.toggle(editor.getGraphSettings().getPageBorderVisible());
                    }
                }  

                break;
        }

        this.tbUpdate = false;
        
    },
    /**
     * Handler called upon creation of this component. We start a recurring task to update the toolbar, if necessary.
     * 
     * @method initComponent
     */
    initComponent : function() {
        this.callParent(arguments);

        if (!JSG.touchDevice) {
            Ext.TaskManager.start({
                run : this.updateToolbarIdle,
                interval : 500, // every half second
                scope : this
            });
        }
    }
});


/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template to define the model tree for the JSGDemo Application. It is simply a Ext JS TreePanel derived class. The ModelTree
 * contains all models organized by folders. Here we also handle creating, deleting, loading and saving of items within the
 * tree store and the local storage. 
 *
 * @class ModelTree
 * @extends Ext.tree.Panel
 * @constructor
 */
Ext.define('JSGDemo.view.ModelTree', {
    extend : 'Ext.tree.Panel',
    alias : 'widget.modeltree',
    anchor : '100% 66%',
    layout : 'fit',
    id : 'modeltree',
    useArrows : true,
    hideHeaders : true,
    rootVisible : true,
    folderSort : true,
    store : Ext.create('graphitemstore'),
    plugins : Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit : 2,
        pluginId : 'cellplugin',
        listeners : {
            edit : function(editor, e, eOpts) {
                // in case a name is changed -> save to local storage, sort tree and update tab title
                JSGDemo.modeltree.save();
                JSGDemo.modeltree.getStore().sort([{
                    property : 'leaf',
                    direction : 'ASC'
                }, {
                    property : 'name',
                    direction : 'ASC'
                }]);
                if (e.record.tab) {
                    e.record.tab.updateTitle(e.value, true);
                }
            }
        }
    }),
    viewConfig : {
        plugins : {
            ptype : 'treeviewdragdrop',
            sortOnDrop : true,
            appendOnly : true
        },
        listeners : {
            drop : function(node, data, overModel, dropPosition) {
                // update local storage if items were moved
                JSGDemo.modeltree.validateTree();
                JSGDemo.modeltree.save();
            }
        }
    },
    contextMenu : new Ext.menu.Menu({
        items : [{
            id : 'createDiagramCX',
            text : JSGDemo.resourceProvider.getString("New Diagram "),
            icon : 'resources/icons/drawing.png'
        }, {
            id : 'createOrgChartCX',
            text : JSGDemo.resourceProvider.getString("New Organizational Chart"),
            icon : 'resources/icons/orgchart.png'
        }, '-', {
            id : 'createFolderCX',
            text : JSGDemo.resourceProvider.getString("New Folder"),
            icon : 'resources/icons/newfolder.png'
        }, '-', {
            id : 'deleteItem',
            text : JSGDemo.resourceProvider.getString("Delete"),
            icon : 'resources/icons/deletesmall.png'
        }, '-', {
            id : 'getGraphId',
            text : JSGDemo.resourceProvider.getString("Show Graph Id")
        }],
        listeners : {
            click : function(menu, item) {
                // context menu handler to create and remove items in the tree
                if (item === undefined) {
                    return;
                }

                switch (item.id) {
                case 'deleteItem':
                    JSGDemo.modeltree.deleteModelItem();
                    break;
                case 'createFolderCX':
                    JSGDemo.modeltree.createModelItem("folder");
                    break;
                case 'createDiagramCX':
                    JSGDemo.modeltree.createModelItem("diagram");
                    break;
                case 'createOrgChartCX':
                    JSGDemo.modeltree.createModelItem("orgchart");
                    break;
                case 'getGraphId':
                    var selection = JSGDemo.modeltree.getSelectionModel().getSelection()[0];
                    Ext.Msg.show({
                        title : JSGDemo.resourceProvider.getString("Graph Id"),
                        msg : selection.get('id'),
                        buttons : Ext.Msg.OK,
                        icon : Ext.Msg.WARNING
                    });
                    break;
                }
            }
        }
    }),
    listeners : {
        itemcontextmenu : function(tree, record, item, index, e, eOpts) {
            var c = tree.panel.contextMenu;
            var deleteItem = c.items.get("deleteItem");
            var root = tree.panel.getRootNode();
            deleteItem.setDisabled(record === root);
            c.showAt(e.getXY());
            e.stopEvent();
        },
        selectionchange : function(tree, selected, eOpts) {
            JSGDemo.toolbar.updateToolbar();
        },
        itemclick : function(tree, record, item, index, e, eOpts) {
            // load editor on tree click
            if (record.get('leaf')) {
                if (record.tab) {
                    Ext.getCmp('center').setActiveTab(record.tab);
                } else {
                    var tab = JSGDemo.modeltree.createEditor(record);
                    if (tab) {
                        //performance test on alt-click open...
                        tab.load(record, !!e.altKey);
                    }
                }
            }
        }
    },
    columns : [{
        xtype : 'treecolumn', // this is so we know which column will show the tree
        text : JSGDemo.resourceProvider.getString("Name"),
        flex : 1,
        editor : {
            xtype : 'textfield',
            selectOnFocus : true
        },
        sortable : true,
        dataIndex : 'name'
    }],
    /**
     * Create a new model item or folder by adding it to the tree and creating a new editor for it, if the new
     * item is not a folder. The editor is then opened.
     *
     * @method createModelItem
     * @param {String} type Method to use for the new item or 'folder' to create a new folder.
     * @param {String} name Label to use to tree item
     */
    createModelItem : function(type, name) {
        var self = this;
        var selection = this.getSelectionModel().getSelection()[0];
        var node;
        var tab;

        this.focus();

        // find parent
        if (selection) {
            if (selection.get('leaf')) {
                node = selection.parentNode;
            } else {
                node = selection;
            }
        } else {
            node = this.getRootNode();
        }

        if (node) {
            node.set("expandable", true);
            var childNode;
            var label;

            // assign label based on type
            switch (type) {
            case 'diagram':
                label = JSGDemo.resourceProvider.getString(name === undefined ? "New Diagram" : name);
                break;
            case 'orgchart':
                label = JSGDemo.resourceProvider.getString(name === undefined ? "New Orgchart" : name);
                break;
            case 'folder':
                label = JSGDemo.resourceProvider.getString(name === undefined ? "New Folder" : name);
                break;
            }

            // add to tree
            if (type === "folder") {
                childNode = node.appendChild({
                    name : label,
                    id : JSGDemo.getNewId(),
                    expandable : false,
                    leaf : false
                });
            } else {
                childNode = node.appendChild({
                    name : label,
                    id : JSGDemo.getNewId(),
                    expandable : false,
                    leaf : true
                });
            }

            // show item in tree
            node.bubble(function(cnode) {
                cnode.expand();
            });

            // sort tree alphabetically
            this.getStore().sort([{
                property : 'leaf',
                direction : 'ASC'
            }, {
                property : 'name',
                direction : 'ASC'
            }]);
            this.getSelectionModel().select(childNode, false);
            
            // update local storage
            this.save();

            if (type !== "folder") {
                // create tab and editor
                var record = this.getStore().getNodeById(childNode.get('id'));
                if (record) {
                    tab = this.createEditor(record);
                }
                tab.setCustomType(type);
            }
        }

        return tab;
    },
    /**
     * Create an editor tab containing a canvas with a graph and attach it to a tree record.
     * The tab is added to the tab panel and activated.
     *
     * @method createEditor
     * @param {Ext.data.Record} record Record or tree item to attach the tab to.
     * @return {Ext.tab.Tab} Tab, that has been created.
     */
    createEditor : function(record) {
        // create editor tab including a canvas element
        var tabs = Ext.getCmp('center');
        var tab = tabs.add({
            title : record.get('name'),
            xtype : 'editor',
            id : 'drawing' + JSGDemo.viewport.editorCount,
            html : '<canvas id="canvas' + JSGDemo.viewport.editorCount + '" height="300" width="300" tabindex="0" style="cursor: auto;"> </canvas>'
        });

        tab.show();
        tabs.doLayout();

        // create graph and attach it to the record
        var graph = new JSG.graph.model.Graph();
        tab.jsgEditor = new JSG.ui.GraphEditor("canvas" + JSGDemo.viewport.editorCount);
        tab.jsgEditor.setInteractionHandler(new JSGDemo.graph.interaction.InteractionHandler(tab.jsgEditor.getGraphViewer()));
        tab.jsgEditor.setGraph(graph);
        tab.jsgEditor.resizeContent(tab.el.getWidth(), tab.el.getHeight());

        tab.record = record;
        record.tab = tab;

        // activate tab
        // will not send tab.activate() event because of tab.show() but we still need to inform toolbar!
        tabs.setActiveTab(tab);

        // register notifications to update toolbar
        JSG.graph.notifications.NotificationCenter.getInstance().register(tab, JSG.graph.controller.GraphItemController.ITEM_CHANGED_NOTIFICATION, "onItemChanged");
        JSG.graph.notifications.NotificationCenter.getInstance().register(tab, JSG.graph.controller.GraphController.GRAPH_CHANGED_NOTIFICATION, "onItemChanged");

        JSGDemo.viewport.editorCount++;

        // update local storage
        this.save();

        // update toolbar, statusbar and set editor to navigator
        JSGDemo.toolbar.updateToolbar();
        JSGDemo.statusbar.onNotification();
        JSGDemo.navigator.setGraphEditor(tab.jsgEditor);
        tab.jsgEditor.invalidate();

        return tab;
    },
    /**
     * Delete the selected items in the tree. If a folder is selected all children are removed.
     * If any of the items, that will be deleted are opened, they must be closed before removing them. 
     * 
     * @method deleteModelItem
     */
    deleteModelItem : function() {
        var selection = this.getSelectionModel().getSelection()[0];
        var allow = true;

        // check to see, if any item is currently open
        if (!selection.get('leaf')) {
            selection.cascadeBy(function(node) {
                if (node.get('leaf')) {
                    var tab = node.tab;
                    if (tab && tab.getEditor()) {
                        allow = false;
                    }
                }
            });
        }

        // if so show a warning and return
        if (!allow) {
            this.showWarning("Please close the open diagrams within this folder windows before deleting the folder!");
            return;
        }

        this.getSelectionModel().deselectAll(true);

        // check intention
        Ext.Msg.show({
            title : JSGDemo.resourceProvider.getString("Warning"),
            msg : JSGDemo.resourceProvider.getString("The selected diagrams will permanently deleted. Continue anyway?"),
            buttons : Ext.Msg.YESNO,
            icon : Ext.Msg.QUESTION,
            fn : function(btn) {
                if (btn === 'yes') {
                    if (selection.get('leaf')) {
                        var tab = selection.tab;
                        if (tab && tab.getEditor()) {
                            var tabs = Ext.getCmp('center');
                            tabs.remove(selection.tab);
                            var id = selection.get('id');
                            if (id) {
                                JSGDemo.utils.Storage.remove(id);
                            }
                        }
                    } else {
                        selection.cascadeBy(function(node) {
                            if (node.get('leaf')) {
                                var id = node.get('id');
                                if (id) {
                                    JSGDemo.utils.Storage.remove(id);
                                }
                            }
                        });
                    }

                    selection.remove(false);
                    
                    // check tree and save
                    JSGDemo.modeltree.validateTree();
                    JSGDemo.modeltree.save();
                }
            }
        });
    },
    /**
     * Save the model tree to the local storage. The tree is saved automatically after any change.
     * The storage info is automatically updated.
     *
     * @method save
     */
    save : function() {
        var root = this.getRootNode();
        if (!root) {
            return;
        }
        var json = root.serialize();
        if (json) {
            JSGDemo.utils.Storage.save('repository', JSON.stringify(json));
        }
    },
    /**
     * Save all changed model items.
     *
     * @method saveAll
     */
    saveAll : function() {
        var tabs = Ext.getCmp('center');

        tabs.items.each(function(tab) {
            if (tab.getEditor().getGraph().isChanged()) {
                tab.save();
            }
        });
    },
    /**
     * Load all model items from the localStorage, if any information is present.
     *
     * @method load
     */
    load : function() {
        var data = localStorage.getItem('repository');
        var store = this.getStore();
        var json;

        // if data in local storage put into tree
        if (data) {
            try {
                json = JSON.parse(data);
                store.getProxy().data = json;
                store.load();
                this.validateTree();
            } catch(err) {
                JSGDemo.viewport.showWarning("Error reading Diagram Tree: " + err);
                return;
            }
        }

        // update root node name
        var root = this.getRootNode();
        if (root) {
            if (json) {
                root.set('name', json.name);
            } else {
                root.set('name', "Diagrams");
            }
        } else {
            store.load();
            root = this.getRootNode();
            if (root) {
                root.set('name', "Diagrams");
            }
        }
    },
    /**
     * Validates the model tree by iterating through the complete tree checking for expandable folders and
     * updating the expandable flag. This is necessary, because if an expandable node without children is expanded
     * Ext JS creates and shows invalid trees.
     *
     * @method validateTree
     */
    validateTree : function() {
        var root = this.getRootNode();

        if (!root) {
            return;
        }

        root.cascadeBy(function(node) {
            node.set("expandable", node.hasChildNodes());
            if (!node.hasChildNodes()) {
                node.set("expanded", false);
            }
        });
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template for an Ext Panel component containing the canvas, which is the user interface element containing the Graph.
 * 
 * @class Editor
 * @extends Ext.panel.Panel
 */
Ext.define('JSGDemo.view.Editor', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.editor',
    deferredRender : false,
    layout : 'fit',
    closable : true,
    listeners : {
        resize : function(tab, w, h) {
            if (tab.getEditor() !== undefined) {
                tab.getEditor().resizeContent(w, h);
            }
        },
        activate : function(tab) {
			var editor = tab.getEditor();
            if (editor) {
                // tell navigator to use this graph
                JSGDemo.navigator.setGraphEditor(editor);

                // select graph in repository tree
                tab.record.bubble(function(cnode) {
                    cnode.expand();
                });
                JSGDemo.modeltree.getSelectionModel().select(tab.record);
                
                //update toolbar and status bar
                JSGDemo.toolbar.updateToolbar();
                JSGDemo.statusbar.onNotification();
                
                this.updateLibraryPanel(editor);
            }
        },
        beforeclose : function(tab) {
            // check, if there is a change and warn user
            if (tab.getEditor().getGraph().isChanged()) {
                Ext.Msg.show({
                    title : JSGDemo.resourceProvider.getString("Save Changes?"),
                    msg : JSGDemo.resourceProvider.getString("You are closing a Diagram that has unsaved changes. Would you like to save your changes?"),
                    buttons : Ext.Msg.YESNOCANCEL,
                    icon : Ext.Msg.QUESTION,
                    fn : function(btn) {
                        var tabs = Ext.getCmp('center');
                        if (btn === 'yes') {
                            tab.save();
                            tabs.remove(tab);
                        } else if (btn === 'no') {
                            tabs.remove(tab);
                        }
                    }
                });
                return false;
            }
            return true;
        },
        destroy : function(tab, opts) {
            // remove editor and unregister notifications
            if (tab.getEditor() !== undefined) {
                tab.getEditor().destroy();
                var nc = JSG.graph.notifications.NotificationCenter.getInstance();
                nc.unregister(tab, JSG.graph.controller.GraphItemController.ITEM_CHANGED_NOTIFICATION);
                nc.unregister(tab, JSG.graph.controller.GraphController.GRAPH_CHANGED_NOTIFICATION);
                var tabs = Ext.getCmp('center');
                if (!tabs.items.items.length) { //last tab closed?
                    JSGDemo.navigator.clear();
                    JSGDemo.modeltree.getSelectionModel().deselectAll();
                    JSGDemo.toolbar.updateToolbar();
                }
                tab.record.tab = undefined;
            }
        }
    },
    /**
     * Get the GraphEditor used in this tab.
     * 
     * @return {JSG.ui.GraphEditor} Editor attached to the tab. 
     */
    getEditor : function () {
        return this.jsgEditor;
    },
    setCustomType : function(type) {
        switch (type) {
            case "orgchart":
                var graph = this.getEditor().getGraph();
                graph.setType(type);
                graph.getLayoutAttributes().setAutoLayout(true);
                graph.getLayoutAttributes().setLayout("OrgChart");
                break;
        }
    },
    updateLibraryPanel: function(editor) {
        var libPanel = Ext.getCmp('librarycategories');
		if (libPanel && editor) {
			var readonly = editor.isInViewMode(JSG.graph.model.settings.ViewMode.READ_ONLY);
			libPanel.setDisabled(readonly);
		}
    },
    /**
     * Loads the item from the local storage. The data is fetched the local storage using the id that is
     * a data member of the record. The record is the node with the process, which has been selected for loading.
     * The data is received as a compressed XML String. The string will be decompressed, parsed and passed to the JS-Graph
     * Library for reading the process. 
     * 
     * @method load
     * @param {Ext.tab.Panel} tab Tab with the editor containing the process to be saved.
     */
    load : function(record, testperf) {
        Ext.getCmp('load-indicator').show();        
        Ext.defer(function() {
            var data = JSGDemo.utils.Storage.load(record.get('id'));
            if (data) {
                var ddata = LZString.decompressFromUTF16(data);
                if (ddata) {
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(ddata, "text/xml");
                    if (xml) {        
                        record.tab.jsgEditor.readXML(xml, testperf);
                        record.tab.setCustomType(record.tab.jsgEditor.getGraph().getType().getValue());
                        record.tab.jsgEditor.invalidate();
                    } else {
                        this.showWarning("Diagram File does not contain a valid XML Structure!");
                    }
                } else {
                    this.showWarning("File could not be decompressed!");
                }
            } else if(!RELEASE && record.data.name === "SVG" && (typeof JSG.SVG !== "undefined")) {
				var editor = record.tab.jsgEditor;
				if(editor) {
					record.tab.loadTestSVGs(editor);
				}
            }
            record.tab.updateLibraryPanel(record.tab.jsgEditor);
            Ext.getCmp('load-indicator').hide();
        }, 200);
    },
    //for testing purpose only!!
	loadTestSVGs: function(editor) {
		var svgsdir = "../jsgsvg/testsvgs/";
		var svgprefix = "_svg";
		var filename = function(url) {
			var cut = url.lastIndexOf("/");
			return (cut > -1) ? url.substring(cut + 1) : url; 
		};
		var cs = editor.getCoordinateSystem();
		var graph = editor.getGraph();
		var n_svgs = 19;
		var svgfiles = ["circle.svg", "ellipse.svg", "line.svg", "lines2.svg", "path.svg", "polyline.svg", "polygon.svg", "rect.svg", "roundrect.svg", "text.svg", "units.svg"];
		// var n_svgs = 0;
		// var svgfiles = ["path.svg"];
		// var svgsdir = "../../svg/";
		// var svgfiles = ["angel.svg", "butterfly.svg", "lion.svg", "matrix.svg", "rect.svg", "scim.svg", "tiger.svg", "usa.svg", "worldmap.svg"];
		// var svgfiles = ["tiger.svg"];
		var x = 2000, y = 500;
		var i, n, pending;
		var origin = new JSG.geometry.Point(0, 0);
		for ( i = 1; i <= n_svgs; i++) {
			svgfiles.push((svgprefix + i) + ".svg");
		}
		pending = svgfiles.length;
		svgfiles.forEach(function(file) {
			JSG.SVG.load(svgsdir + file, function(svg, error) {
				pending--;
				if (error) {
					JSG.debug.logError("Failed to load svg '" + filename(error.url) + "' !!!", error);
					return;
				}
				var model = svg.toJSG(cs)[0];
				var tn = model.addLabel(filename(svg.url));
				tn.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.TOP);
				tn.getTextFormat().setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.LEFT);
				model.setOrigin(x, y);
				y = model.getOrigin().add(model.getSizeAsPoint()).y;
				graph.addItem(model);
				if (pending === 0) {
					editor.invalidate();
				}
			});
		});
	},
    /**
     * Save the given item to the local storage. The data is fetched from the editor 
     * in the JS-Graph XML Format. Then the XML String is compressed and put into the local storage
     * using the id of the process. The visible storage info in the status bar is automatically updated.
     * 
     * @method save
     * @param {Ext.tab.Panel} tab Tab with the editor containing the process to be saved.
     */
    save : function() {
        var xml = this.jsgEditor.saveXML();
        if (xml) {
            var cxml = LZString.compressToUTF16(xml);
            JSGDemo.utils.Storage.save(this.record.get('id'), cxml);
            console.log("liukedong-save: " + xml);
            this.updateTitle(this.title, true);
        }
    },
    /**
     * Print the given process to a PDF file. The graph is saved to the server pagewise as SVG-files. The the SVG's are
     * converted to PDF and the resulting PDF pages are merged to one PDF Document. Using this function a progress indicator is shown.
     * 
     * @method print
     */
    print : function() {
        var self = this;
        Ext.getCmp('load-indicator').show();        
        Ext.defer(function() {
            self.printRun();
            Ext.getCmp('load-indicator').hide();        
        }, 200);
    },
    /**
     * Print the given process to a PDF file. The graph is saved to the server pagewise as SVG-files. The the SVG's are
     * converted to PDF and the resulting PDF pages are merged to one PDF Document.
     * 
     * @method printRun
     */
    printRun : function() {
        function zeroPad(nr, base) {
            base = base || 10;
            var len = (String(base).length - String(nr).length) + 1;
            return len > 0 ? new Array(len).join('0') + nr : nr;
        }

        function showPDF(directory) {
            var httpRequestObject = new XMLHttpRequest();
            httpRequestObject.open("post", "php/createPDF.php", false);
            httpRequestObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequestObject.send("directory=" + directory);

            var res = httpRequestObject.responseText;
            // Show pdf
            var url = location.href;
            var baseURL = url.substring(0, url.lastIndexOf('/'));
            var pdfwin = window.open(baseURL + "/" + "php/" + res, "_blank", "width=800, height=800, scrollbars=yes");
        }
    
        function printGraphDocumentPages(editor, name, directory) {
            // save one svg per page to folder
            var pagesDone = 0;
            var graph = editor.getGraph();
            var vpages = graph.getVerticalPrintPages();
            var hpages = graph.getHorizontalPrintPages();
            var totalPages = hpages * vpages;
            var i, j;
            
            for (j = 0; j < hpages; j++) {
                for (i = 0; i < vpages; i++) {
                    var file = editor.saveSVGPage(j, i, true);
                    var httpRequestObject = new XMLHttpRequest();
                    httpRequestObject.open("post", "php/saveFile.php", false);
                    httpRequestObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
                    httpRequestObject.onreadystatechange = function() {
                        if (httpRequestObject.readyState === 4 && httpRequestObject.status === 200) {
                            if (++pagesDone >= totalPages) {
                                // call converter and show PDF
                                showPDF(directory);
                            }
                        }
                    };
                    httpRequestObject.send("name=" + directory + "/SVGPage" + zeroPad(j * vpages + i, 100) + ".svg&data=" + encodeURIComponent(file));
                }
            }
        }

        try {
            // create a temporary directory so save the SVG files in, which are the prerequisite for the PDF generator
            var httpRequestObject = new XMLHttpRequest();
            httpRequestObject.open("post", "php/createTmpDirectory.php", false);
            httpRequestObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequestObject.send("name=print");

            // save pages to SVG a create PDF
            printGraphDocumentPages(this.getEditor(), this.record.get('name'), httpRequestObject.responseText);
        } catch(err) {
            JSGDemo.viewport.showOfflineWarning();
        }
    },
    /**
     * Export the graphic of the current tab to a PNG file. It will be provided for download. The user can select, if the complete graph
     * will be visualized or just the selected items.
     * 
     * @method exportToPNG 
     */
    exportToPNG : function() {
        var self = this;
        var selection = this.getEditor().getSelectionProvider().getSelection();
        if (selection.length > 0) {
            Ext.Msg.show({
                title : JSGDemo.resourceProvider.getString("Process"),
                msg : JSGDemo.resourceProvider.getString("Should the image only contain the selection objects?"),
                buttons : Ext.Msg.YESNO,
                icon : Ext.Msg.QUESTION,
                fn : function(btn) {
                    if (btn === 'yes') {
                        self.exportToPNGInit(true);
                    } else if (btn === 'no') {
                        self.exportToPNGInit(false);
                    } 
                }
            });
        } else {
            this.exportToPNGInit(false);
        }
    },
    /**
     * Export the graphic to a PNG file. It will be provided for download. The complete graph
     * will be visualized or just the selected items based on the selected flag. A progress indicator will be shown.
     * 
     * @method exportToPNGInit 
     * @param {boolean} selected Export complete graph or only selected items.
     */
    exportToPNGInit : function(selected) {
        var self = this;
        Ext.getCmp('load-indicator').show();        
        Ext.defer(function() {
            self.exportToPNGRun(selected);
            Ext.getCmp('load-indicator').hide();        
        }, 200);
    },
    /**
     * Export the graphic to a PNG file. It will be provided for download. The complete graph
     * will be visualized or just the selected items based on the selected flag. No progress indicator will be shown.
     * 
     * @method exportToPNGRun
     * @param {boolean} selected Export complete graph or only selected items.
     */
    exportToPNGRun : function(selected) {
        if (!JSGDemo.viewport.checkOnlineStatus()) {
            JSGDemo.viewport.showOfflineWarning();
            return;
        }

        try {
            var self = this;
            var graph; 
            var selection = this.getEditor().getSelectionProvider().getSelection();

            // create graph with items to draw
            if (selected) {
                graph = new JSG.graph.model.Graph();
                var xml = JSG.copyItems(selection);
                //we simply paste selection to graph :)
                JSGDemo.Utils.paste(xml, graph);
            } else {
                graph = this.getEditor().getGraph().copy();
                graph.evaluate();
            }

            // create temporary canvas
            var canvas = document.createElement("canvas");
            canvas.id = "exportcanvas";
            canvas.getContext("2d").imageSmoothingEnabled = false;
    
            // create editor
            var editor = new JSG.ui.GraphEditor(canvas);
            editor.setGraph(graph);

            // hide grid, scrollbars and scales
            var settings = editor.getGraphSettings();
            settings.setDisplayMode(JSG.ui.graphics.DisplayMode.ENDLESS);
            settings.setGridVisible(false);
            settings.setScaleVisible(false);
            
            editor.getGraphViewer().getScrollPanel().setScrollBarsMode(JSG.ui.scrollview.ScrollBar.Mode.HIDDEN); 

            // evaluate a zoom factor, so that the graph fits completely into the canvas, which has a maximum size
            var rectGraph = graph.getUsedRect();
            rectGraph.expandBy(500, 500);               // frame for shadows
            var ratioGraph = rectGraph.width / rectGraph.height;
            var cs = editor.getCoordinateSystem();
            var zoom = 1;
            var logToImageFactor = 300 / cs.logToDeviceX(2540);
            var pageWidth;
            var pageHeight;
            
            if (selected) {
                pageWidth = 15000;
                pageHeight = pageWidth / ratioGraph;
            } else {
                if (ratioGraph > 1) {
                    pageWidth = 25000;
                    pageHeight = 15000;
                } else {
                    pageWidth = 15000;
                    pageHeight = 21000;
                }
            }

            var targetPageWidth = pageWidth / 2540 * 300;
            var targetPageHeight = pageHeight / 2540 * 300;
            var ratioPage = pageWidth / pageHeight;
            
            if (ratioPage > ratioGraph) {
                zoom = pageHeight / rectGraph.height;
                editor.resizeContent(targetPageHeight * ratioGraph, targetPageHeight);
            } else {
                zoom = pageWidth / rectGraph.width;
                editor.resizeContent(targetPageWidth, targetPageWidth / ratioGraph);
            }               
            if (!selected) {
                zoom = Math.min(zoom, 1);
            }
            zoom *= logToImageFactor;

            // initialize editor to show the used content by scrolling to the top left corner of the used rect and zoomin to show all objects from there
            editor.getGraphViewer().getScrollPanel().getViewPort().getFormat().setFillColor("#FFFFFF");
            editor.getGraphViewer().getCoordinateSystem().setZoom(zoom);
            editor.invalidate();
            editor.setScrollPosition(rectGraph.x, rectGraph.y);
            editor.invalidate();

            // create directory and submit images to server
            var httpRequestObject = new XMLHttpRequest();
            httpRequestObject.open("post", "php/createTmpDirectory.php", false);
            httpRequestObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequestObject.send("name=export");
        
            var directory = httpRequestObject.responseText;

            JSGDemo.ignoreChanges = true;

            var xhttp = new XMLHttpRequest();
            xhttp.open("post", "php/saveImage.php", false);
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

            var image = canvas.toDataURL("image/png");
            var output = encodeURIComponent(image);

            xhttp.send("name=" + directory + "/image.png" + "&data=" + output);

            var name = this.record.get('name') + ".png";

            // show download link
            JSGDemo.provideLink(directory, "image.png", name, "png");
        } catch(err) {
            JSGDemo.viewport.showWarning("Failed to create graphic!");
            return;
        }
    },
    /**
     * Event listener. It is called, if an item within the graph changes
     * 
     * @param notification 
     */
    onItemChanged : function(notification) {
        this.updateTitle(this.title, false);
        var btn = Ext.getCmp('undobtn');
        if (btn !== undefined) {
            var editor = this.getEditor();
            var enabled = editor.getInteractionHandler().isUndoAvailable();
            btn.setDisabled(!enabled);
        }  
        JSGDemo.toolbar.updateToolbar();
    },
    /**
     * Update the title of the editor. The title is displayed as the tab text. If the graph is changed
     * and not saved, an asterisk is placed before the title name to indicate, that is needs to be saved.  
     * @param {String} title New title name.
     * @param {Boolean} invalidate Flag, to indicate, if the editor content shall be repainted. This is necessary, if the 
     * title changes and the header of the graph needs to be repainted.
     */
    updateTitle : function(title, invalidate) {

        if (title[0] === '*') { 
            title = title.substring(1, title.length);
        }

        var editor = this.getEditor();
        if (editor) {
            var graph = editor.getGraph();
            if (graph) {
                if (graph.isChanged()) { 
                    title = '*'+ title;
                }
                if (invalidate) {
                    editor.repaint();
                }    
            }
        }
        
        this.setTitle(title);        
    }
});

/**
 * @module JSGDemo.view
 * @namespace JSGDemo.view
 */
JSG.namespace("JSGDemo.view");

/**
 * Template to define the status bar for the demo. Mostly straightforward JS-Ext code, defining the status bar layout. 
 * The status bar contains controls to manage zooming and to show the storage status.
 *
 * @class Statusbar
 * @extends Ext.panel.Panel
 * @constructor
 */
Ext.define('JSGDemo.view.Statusbar', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.statusbar',
    height : 26,
    dockedItems : [{
        xtype : 'toolbar',
        id : 'statustoolbar',
        dock : 'bottom',
        items : [JSGDemo.resourceProvider.getString("Ready"), '->', {
            id : 'zoominfo',
            text : "100 %"   
        }, {
            xtype : 'button',
            cls : 'x-btn-icon',
            icon : 'resources/icons/zoomminus.png',
            id : 'jsgzoomminusbtn',
            handler : function(button) {
                // reduce zoom factor
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    editor.setZoom(editor.getZoom() - 0.1);
                }
            }
        }, {
            xtype : 'slider',
            value : 100,
            id : 'jsgzoomslider',
            increment : 10,
            minValue : 20,
            maxValue : 400,
            width : 100,
            listeners : {
                changecomplete : function(slider, newValue, thumb, eOpts) {
                    // change zoom to selected value
                    var editor = JSGDemo.viewport.getActiveEditor();
                    if (editor) {
                        editor.setZoom(newValue / 100);
                    }
                }
            }
        }, {
            xtype : 'button',
            cls : 'x-btn-icon',
            icon : 'resources/icons/zoomplus.png',
            id : 'jsgzoomplusbtn',
            handler : function(button) {
                // enlarge zoom factor
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    editor.setZoom(editor.getZoom() + 0.1);
                }
            }
        }, {
            xtype : 'button',
            cls : 'x-btn-icon',
            id : 'jsgzoom100btn',
            icon : 'resources/icons/zoom100.png',
            handler : function(button) {
                // zoom to 100%
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    editor.setZoom(1.0);
                }
            }
        }, {
            xtype : 'button',
            cls : 'x-btn-icon',
            icon : 'resources/icons/zoomfit.png',
            id : 'jsgzoomtofitbtn',
            handler : function(button) {
                // fit zoom to used area
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    editor.setZoom(JSG.ui.GraphEditor.ZOOM_FIT);
//                    JSGDemo.statusbar.onNotification();
                }
            }
        }, {
            xtype : 'button',
            cls : 'x-btn-icon',
            icon : 'resources/icons/zoomrect.png',
            id : 'jsgzoomrectbtn',
            handler : function(button) {
                // fit zoom to selected area
                var editor = JSGDemo.viewport.getActiveEditor();
                if (editor) {
                    JSGDemo.viewport.getActiveEditor().getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.ZoomInteraction());
                }
            }
        }, '-',  {
            xtype : 'button',
            icon : 'resources/icons/viewmodeendlesss.png',
            enableToggle : true,
            toggleGroup : 'pagemode',
            disabled : false,
            toggleHandler : function(btn, state) {
                // switch view mode to endless mode
                if (state) {
                    var tabs = Ext.getCmp('center');
                    tabs.items.each(function(tab) {
                        tab.jsgEditor.setDisplayMode(JSG.ui.graphics.DisplayMode.ENDLESS);
                    });
                }
            }
        }, {
            xtype : 'button',
            icon : 'resources/icons/viewmodepages.png',
            enableToggle : true,
            toggleGroup : 'pagemode',
            disabled : false,
            toggleHandler : function(btn, state) {
                // switch view mode to page mode
                if (state) {
                    var tabs = Ext.getCmp('center');
                    tabs.items.each(function(tab) {
                        tab.jsgEditor.setDisplayMode(JSG.ui.graphics.DisplayMode.PAGE);
                    });
                }
            }
        }]
    }],
    initComponent : function() {
        Ext.QuickTips.init();
        this.callParent(arguments);
        var nc = JSG.graph.notifications.NotificationCenter.getInstance();
        nc.register(this, JSG.ui.GraphEditor.ZOOM_NOTIFICATION);
    },
    onNotification : function(notification) {
        // if zoom has changed (from toolbar or else) update statusbar
        var editor = JSGDemo.viewport.getActiveEditor();
        if (editor) {
            var slider = Ext.getCmp('jsgzoomslider');
            slider.setValue(editor.getZoom() * 100);
            var text = Ext.getCmp('zoominfo');
            text.setText(Math.round(editor.getZoom() * 100) + " %");
        }
    }
});


/**
 * @module BICDesign.view
 * @namespace BICDesign.view
 */
JSG.namespace("BICDesign.view");

/**
 * Template to define the topmost viewport for the Demo Application. It is
 * simply a Ext JS Viewport derived class. The Viewport contains all visible
 * panels like the Diagram Tree, the Navigator, the Toolbars, the library panels
 * and the Status Bar.
 *
 * @class Viewport
 * @extends Ext.Viewport
 * @constructor
 */
Ext.define('JSGDemo.view.Viewport', {
    extend : 'Ext.Viewport',
    alias : 'widget.jsgviewport',
    layout : 'border',
    id : 'jsgViewPort',
    editorCount : 0,
    items : [{
        id : 'north',
        xtype : 'panel',
        region : 'north',
        height : 105,
        items : [{
            xtype : "panel",
            height : 27,
            layout : {
                type : 'hbox',
                align : 'middle',
                pack : 'center'
            },
            bodyStyle : {
                background : '#404040'
            },
            items : [{
                xtype : 'text',
                width : 50,
                text : ""
            }, {
                xtype : 'label',
                flex : 1,
                text : "Tensegrity Software - JS Graph Demo",
                style : 'display:inline-block;text-align:center;color:white;font-weight:bold;'
            }, {
                xtype : 'text',
                width : 50,
                text : ""
            }]

        }, {
            xtype : 'jsgtoolbar'
        }]
    }, {
        xtype : 'panel',
        region : 'west',
        split : true,
        width : JSG.touchDevice ? 250 : 350,
        layout : 'anchor',
        title : JSGDemo.resourceProvider.getString("Drawings"),
        collapsible : true,
        items : [{
            split : true,
            anchor : '100% 66%',
            layout : 'fit',
            items : [{
                xtype : 'modeltree',
                id : 'jsgmodeltree'
            }]
        }, {
            xtype : 'panel',
            anchor : '100% 33%',
            layout : 'fit',
            title : JSGDemo.resourceProvider.getString("Navigator"),
            items : [{
                xtype : 'box',
                layout : 'fit',
                html : '<canvas id="navigatorCanvas" style="cursor: auto;"></canvas>',
                id : 'navigatorContainer',
                listeners : {
                    resize : {
                        fn : function(el) {
                            if (JSGDemo.navigator) {
                                JSGDemo.navigator.resize(el.getWidth(), el.getHeight());
                            }
                        }
                    }
                }
            }]
        }]
    }, {
        xtype : 'tabpanel',
        id : 'center',
        region : 'center',
        deferredRender : false,
        enableTabScroll : true,
        width : 600,
        height : 250,
        tabPosition : 'bottom',
        layout : 'fit'
    }, {
        xtype : 'panel',
        region : 'east',
        split : true,
        width : 300,
        layout : 'fit',
        title : JSGDemo.resourceProvider.getString("Libraries"),
        collapsible : true,
        items : [{
            xtype : 'panel',
            split : true,
            id : 'librarycategories',
            layout : 'accordion',
            activeItem : 0
        }]
    }, {
        region : 'south',
        id : 'statusbar',
        xtype : 'statusbar'
    }, {
        xtype : 'loadmask',
        id : 'load-indicator',
        msg : JSGDemo.resourceProvider.getString("Please Wait..."),
        target : this,
        indicator : true,
        hidden : true
    }],
    /**
     * Handler called on creation. We initialize the quick tips.
     * 
     * @method initComponent
     */
    initComponent : function() {
        Ext.QuickTips.init();
        this.callParent(arguments);
    },
    /**
     * Creates the navigator using a given canvasId. The canvas object must have
     * been created prior. The navigator automatically attaches to the active
     * editor and display the current overview.
     *
     * @method initNavigator
     * @param {String} canvasId Id of the canvas HTML element to contain the navigator.
     */
    initNavigator : function(canvasId) {
        var container = document.getElementById("navigatorContainer");
        var width = container ? container.clientWidth : undefined;
        var height = container ? container.clientHeight : undefined;
        JSGDemo.navigator = new JSG.ui.navigator.JSGNavigator(canvasId, width, height);
    },
    /**
     * Startup routine to create and attach the navigator, the property panel
     * and to load the diagram tree from the local storage. The keys maps are
     * initialized and the existing libraries are loaded into the library panel
     *
     * @method initApplication
     */
    initApplication : function() {
        JSGDemo.toolbar = Ext.getCmp('jsgtoolbartabs');
        JSGDemo.statusbar = Ext.getCmp('statusbar');
        this.initNavigator("navigatorCanvas");

        JSG.graph.notifications.NotificationCenter.getInstance().register(JSGDemo.toolbar, JSG.graph.view.SelectionProvider.SELECTION_CHANGED_NOTIFICATION, "onSelectionChanged");

        JSGDemo.modeltree = Ext.getCmp('jsgmodeltree');
        JSGDemo.modeltree.load();

        JSGDemo.toolbar.updateToolbar();

        this.initKeys();
    },
    /**
     * Initialize global keys.
     *
     * @method initKeys
     */
    initKeys : function() {
        var map = new Ext.util.KeyMap({
            target : Ext.getBody(),
            binding : [{
                key : 83,
                ctrl : true,
                handler : function(key, event) {
                    var tab = JSGDemo.viewport.getActiveTab();
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopEvent();
                    if (tab) {
                        tab.save();
                    }
                },
                scope : this,
                defaultEventAction : "stopEvent"
            }, {
                key : 80,
                ctrl : true,
                handler : function(key, event) {
                    var tab = JSGDemo.viewport.getActiveTab();
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopEvent();
                    if (tab) {
                        tab.print();
                    }
                },
                scope : this,
                defaultEventAction : "stopEvent"
            }, {
                key : 65,
                ctrl : true,
                handler : function(key, event) {
                    if (event.target.type !== "textarea" && event.target.type !== "text") {
                        event.stopEvent();
                    }
                    // do nothing intentionally
                },
                scope : this
            }, {
                key : 27,
                handler : function(key, event) {
                    var activeEditor = this.getActiveEditor();
                    if (activeEditor !== undefined) {
                        var ev = event.browserEvent;
                        var canvas = activeEditor.getGraphicSystem().getCanvas();
                        var type = ev.type === "keydown" ? JSG.ui.events.KeyEventType.DOWN : JSG.ui.events.KeyEventType.UP;
                        var keyEvent = JSG.ui.events.KeyEvent.fromEvent(canvas, ev, type);
                        activeEditor.getInteractionHandler().handleKeyEvent(keyEvent);
                        if (keyEvent.doRepaint === true) {
                            activeEditor.repaint();
                        }
                        //ARGH, THIS IS IMPORTANT!! OTHERWISE ALL SUBSEQUENT MOUSEEVENTs HAVE KEY CODE ESC!!!
                        JSG.ui.events.currentKey = undefined;
                    }
                },
                scope : this,
                defaultEventAction : "stopEvent"
            }, {
                key : 81, // q
                ctrl : true,
                handler : function(key, event) {
                    JSGDemo.utils.Storage.clear();
                    JSGDemo.samples.General.createRepository();
                },
                scope : this
            }]
        });
    },
    /**
     * Creates a panel for each existing library in the library store. The panels
     * are added to the library panel.
     * 
     * @method initLibraries
     */
    initLibraries : function() {
        var libPanel = Ext.getCmp('librarycategories');
        JSGDemo.libraries.libraries.iterate(function(key, library) {
            var panel = Ext.create('Ext.panel.Panel', {
                layout : 'fit',
                title : library.name,
                html : '<canvas id="libCanvas' + library.name + '" tabindex="0" style="cursor: auto;"></canvas>',
                listeners : {
                    resize : {
                        fn : function(el) {
                            if (!el.lib) {
                                // create a framework library graph component. Its a canvas that displays the library items as icons
                                // you can drag and drop items from the to the graph.
                                el.lib = new JSG.ui.shapelibrary.ShapeLibrary("libCanvas" + library.name, 0, 0);
                                //define interactions:
                                var dndActivator = el.lib.getInteractionActivator(JSG.graph.interaction.DragDropActivator.KEY);
                                dndActivator.getTargetEditor = function() {
                                    return JSGDemo.viewport.getActiveEditor();
                                };

                                var i, n, section, j, m, item, symbol, items;

                                // add the sections of the library to the view
                                for (i = 0, n = library.sections.length; i < n; i++) {
                                    section = library.sections[i];
                                    el.lib.addCategory(section.label);

                                    items = library.items.elements();
                                    for (j = 0, m = items.length; j < m; j++) {
                                        item = items[j];
                                        // add all symbols to the section
                                        symbol = JSGDemo.libraries.symbols.get(item.type);
                                        if (symbol && item.section === section.type) {
                                            JSG.imagePool.add(symbol.icon, symbol.type);
                                            JSG.imagePool.add(symbol.iconsmall, symbol.type + "small");
                                            el.lib.addShape(item.type, symbol.label, symbol.type, "");
                                        }
                                    }
                                }
                            }
                            var content = el.getContentTarget();
                            el.lib.resize(content.getWidth(), content.getHeight());
                        }
                    }
                }
            });
            libPanel.add(panel);
            if (JSGDemo.activeRepository && library.type === JSGDemo.activeRepository) {
                panel.expand();
            }
        });
    },
    /**
     * Get the active or visible tab.
     *
     * @method getActiveTab
     * @return {Ext.tab.Tab} Active Tab.
     */
    getActiveTab : function() {
        var tabs = Ext.getCmp('center');
        return tabs.getActiveTab();
    },
    /**
     * Get the active graph editor, which is the editor of the active tab.
     *
     * @method getActiveEditor
     * @param {type} param_name param_description.
     * @return {JSG.ui.GraphEditor} Currently active GraphEditor.
     */
    getActiveEditor : function() {
        var tabs = Ext.getCmp('center');
        var tab = tabs.getActiveTab();
        if (tab) {
            return tab.getEditor();
        }
    },
    /**
     * Search the tree for a name and return the corresponding id.
     *
     * @param {String} name Record name.
     * @return {String} Id of the record containing the name.
     */
    getIdByName : function(name) {
        var tree = JSGDemo.modeltree;
        var root = tree.getRootNode();
        var record;
        var self = this;

        if (!root) {
            return;
        }

        root.cascadeBy(function(node) {
            if (node.get("name") === name) {
                record = node;
                return false;
            }
        });

        if (record) {
            return record.get('id');
        }
    },
    /**
     * Checks to see if any open editor has user changes.
     *
     * @method hasAnyOpenEditorChanged
     * @return {boolean} True, if any process changed, otherwise false.
     */
    hasAnyOpenEditorChanged : function() {
        var ret = false;
        var tabs = Ext.getCmp('center');
        tabs.items.each(function(tab) {
            if (tab.getEditor().getGraph().isChanged()) {
                ret = true;
            }
        });

        return ret;
    },
    /**
     * Activate an editor identified by the item id. If the editor does not exist yet, it is automatically created and then activated.
     *
     * @param {String} id Editor id.
     */
    setActiveEditorById : function(id) {
        var tree = JSGDemo.modeltree;
        var root = tree.getRootNode();
        var record;
        var self = this;

        if (!root) {
            return;
        }

        root.cascadeBy(function(node) {
            if (node.get("id") === id) {
                record = node;
                return false;
            }
        });

        if (record) {
            if (record.tab) {
                Ext.getCmp('center').setActiveTab(record.tab);
            } else {
                var tab = tree.createEditor(record);
                if (tab) {
                    tab.load(record);
                }
                record.bubble(function(cnode) {
                    cnode.expand();
                });

                tree.getSelectionModel().select(record, false);
            }
        }
    },
    /**
     * Displays a special warning, if the browser is not connected to the internet. This 
     * is necessary, if a feature is not available, that needs a server connection like 
     * creating a PDF during printing.
     * 
     * @method showOfflineWarning
     */
    showOfflineWarning : function() {
        this.showWarning("This option is currently not available. You have to be online, to execute this option. The browser restricts this option to ensure system security!");
    },
    /**
     * Shows a message box with a warning message.
     *
     * @method showWarning
     * @param {String} msg Warning message to be used.
     * @param {String} [title] An optional title for the warning dialog.
     * @param {Function} [func] An optional function to call after warning dialog was confirmed.
     */
    showWarning : function(msg, title, func) {
        Ext.Msg.show({
            title : JSGDemo.resourceProvider.getString(title || "Warning"),
            msg : JSGDemo.resourceProvider.getString(msg),
            buttons : Ext.Msg.OK,
            icon : Ext.Msg.WARNING,
            fn : func
        });
    }
});


JSGDemo.namespace("JSGDemo.samples");

/**
 * This class provides methods to create the sample repository.   
 *
 * @class JSGDemo.samples.General
 * @constructor
 */
JSGDemo.samples.General = function() {
};

/**
 * Creates all sample graphs and builds the initial repository tree.
 * 
 * @method createRepository
 * @static
 */
JSGDemo.samples.General.createRepository = function() {
    var tree = JSGDemo.modeltree;

    var root = tree.getRootNode();
    root.removeAll();

    this.createGeneral(root);
    this.createProcess(root);
    this.createLayout(root);
    this.createOrgChart(root);

    tree.validateTree();
    tree.save();
};

JSGDemo.samples.General.createGeneral = function(root) {
	var CONSTS = JSG.graph.attr.consts;
	var ATTR = JSG.graph.attr.ItemAttributes;
	var i, j, k, m, n, item, edge, label, color, diagram, graph, node;

    function addOverviewItem(graphOverview, diagram, column, row, label) {
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graphOverview.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
        item.getPin().setCoordinate(3000 + column * 4000, 2000 + row * 2250);
        item.setLink("file:" + diagram.get('id'));
        item.addLabel(label);
        item.getFormat().setFillColor("#99CCFF");
        item.getFormat().setLineColor("#444444");
        item.getFormat().setShadowBlur(20);
        item.getFormat().setShadowOffsetX(100);
        item.getFormat().setShadowOffsetY(100);
        item.getFormat().setShadowColor("#999999");
        item.setItemAttribute(ATTR.PORTMODE, CONSTS.PortMode.NONE);
    }

    function addOverviewLabel(graph, row, label) {
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
        item.getPin().setCoordinate(3500, 2000 + row * 2250);
        item.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.NONE);
        item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.NONE);
        item.setItemAttribute(ATTR.PORTMODE, CONSTS.PortMode.NONE);
        label = item.addLabel(label);
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontStyle(JSG.graph.attr.TextFormatAttributes.FontStyle.BOLD);
        label.getTextFormat().setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.LEFT);
    }
    
    function addBackItem(graph, id) {
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 1200));
        item.getPin().setCoordinate(25300, 1000);
        item.setLink("file:" + id);
        item.getFormat().setFillColor("#404040");
        item.getFormat().setLineColor("#404040");
        item.getTextFormat().setFontColor("#FFFFFF");
        item.setItemAttribute(ATTR.PORTMODE, CONSTS.PortMode.NONE);
        var label = item.addLabel("Back to\nOverview");
    }

    function addServer(parent, position, title, color) {
        var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        parent.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 1000));
        item.getPin().setCoordinate(3500, position);
        var label = item.addLabel(title);
        var signal = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        item.addItem(signal);
        signal.setBoundingBoxTo(new JSG.geometry.BoundingBox(400, 400));
        signal.setLayer("signal");
        signal.getPin().setCoordinate(5500, 500);
        signal.getFormat().setFillColor(color);
    }

    var parentfolder = root.appendChild({name : "Functional Samples", id : JSGDemo.getNewId(), expandable : true, leaf : false});
    var overviewDiagram = parentfolder.appendChild({name : "Overview", id : JSGDemo.getNewId(), expandable : false, leaf : true});
    var overviewId = overviewDiagram.get('id');

        var graphOverview = new JSG.graph.model.Graph();
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());

        graphOverview.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(22500, 1000));
        item.getPin().setCoordinate(13250, 1000);
        item.getFormat().setFillColor("#404040");
        item.getTextFormat().setFontColor("#FFFFFF");
        item.getFormat().setLineColor("#333333");
        item.getFormat().setGradientColor("#F3F3F3");
        label = item.addLabel("JS Graph Demo Overview : Click on an item to view a sample");
        label.getTextFormat().setFontSize(16);
        label.getTextFormat().setFontStyle(JSG.graph.attr.TextFormatAttributes.FontStyle.BOLD);
        label.getTextFormat().setHorizontalPosition(JSG.graph.attr.TextFormatAttributes.HorizontalTextPosition.CENTER);

    var childFolder = parentfolder.appendChild({name : "Formatting", id : JSGDemo.getNewId(), expandable : true, leaf : false});
    
    addOverviewLabel(graphOverview, 1, "Formatting");
        
    diagram = childFolder.appendChild({name : "Line Format", id : JSGDemo.getNewId(), expandable : false, leaf : true});
        
        graph = this.createGraph();
        for (i = 1; i <= JSG.graph.attr.FormatAttributes.LineStyle.DASHDOTDOT; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge());
            edge.setStartPointTo(new JSG.geometry.Point(1000, 1000 * i));
            edge.setEndPointTo(new JSG.geometry.Point(6000, 1000 * i));
            edge.getFormat().setLineStyle(i);
        }
        for (i = 1; i < 5; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(5000, 2000));
            item.getPin().setCoordinate(3500, 5000 + i * 2000);

            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0.4));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0.4));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1));

            item.getFormat().setLineWidth(20 + i * 10);
            item.getFormat().setLineCorner(100 * i);
            item.setItemAttribute(ATTR.CLOSED, false);
            item.getFormat().setLineStyle(i);
            item.addLabel("Corner Rounding = " + 100 * i);
        }
        for (i = 1; i < 8; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge());
            edge.setStartPointTo(new JSG.geometry.Point(7000, 1000 * i));
            edge.setEndPointTo(new JSG.geometry.Point(12000, 1000 * i));
            edge.getFormat().setLineWidth(50 * i);
        }
        for (i = 8; i <= 8 + JSG.graph.attr.FormatAttributes.LineStyle.DASHDOTDOT; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge());
            edge.setStartPointTo(new JSG.geometry.Point(7000, 1000 * i));
            edge.setEndPointTo(new JSG.geometry.Point(12000, 1000 * i));
            edge.getFormat().setLineStyle(i - 8);
            edge.getFormat().setLineWidth(10 * i);
        }

        // line caps
        edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(7000, 14500));
        edge.setEndPointTo(new JSG.geometry.Point(12000, 14500));
        edge.getFormat().setLineWidth(400);
        edge.getFormat().setLineCap(JSG.graph.attr.FormatAttributes.LineCap.BUTT);

        edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(7000, 15500));
        edge.setEndPointTo(new JSG.geometry.Point(12000, 15500));
        edge.getFormat().setLineWidth(400);
        edge.getFormat().setLineCap(JSG.graph.attr.FormatAttributes.LineCap.ROUND);

        edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(7000, 16500));
        edge.setEndPointTo(new JSG.geometry.Point(12000, 16500));
        edge.getFormat().setLineWidth(400);
        edge.getFormat().setLineCap(JSG.graph.attr.FormatAttributes.LineCap.SQUARE);

        for (i = 0; i < 360; i+=4) {
            edge = graph.addItem(new JSG.graph.model.Edge());
            edge.setStartPointTo(new JSG.geometry.Point(13000, 1000 + 20 * i));
            edge.setEndPointTo(new JSG.geometry.Point(18000, 1000 + 40 * i));
            color = JSGDemo.samples.General.hsl2rgb(i, 50, 50);
            edge.getFormat().setLineColorRGB(color.r, color.g, color.b);
            edge.getFormat().setLineWidth(40);
        }
        for (i = 0; i < 30; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
            item.getPin().setCoordinate(20500 + i * 150, 2000 + i * 400);

            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0));
            item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH - 300"), new JSG.graph.expr.Expression(0)));
            item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "0.5 * HEIGHT")));
            item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH - 300"), new JSG.graph.expr.Expression(0, "HEIGHT")));
            item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 1));
            item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(300), new JSG.graph.expr.Expression(0, "0.5 * HEIGHT")));

            color = JSGDemo.samples.General.hsl2rgb(i * 8, 50, 50);
            item.getFormat().setLineColorRGB(color.r, color.g, color.b);
            item.getFormat().setLineWidth(20 + i * 2);
            item.getFormat().setLineStyle(Math.max(1, i % 5));
            item.setAngle(Math.PI / 30 * i);
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 1, 1, "Line Formats");

    diagram = childFolder.appendChild({name : "Line Arrows", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        graph = this.createGraph();
        n = JSG.graph.attr.FormatAttributes.ArrowStyle.SQUARESMALL;
        for (i = 0; i < n; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge());
            edge.setStartPointTo(new JSG.geometry.Point(10000, 8000));
            edge.setEndPointTo(new JSG.geometry.Point(10000 + 7500 * Math.cos(Math.PI * 2 * i / n),  
                                                      8000 + 7500 * Math.sin(Math.PI * 2 * i / n)));
            color = JSGDemo.samples.General.hsl2rgb(i * 20, 50, 50);
            edge.getFormat().setLineColorRGB(color.r, color.g, color.b);
            color = JSGDemo.samples.General.hsl2rgb(180 - i * 20, 50, 50);
            edge.getFormat().setFillColorRGB(color.r, color.g, color.b);
            edge.getFormat().setLineArrowEnd(i);
            edge.getFormat().setLineWidth(i * 3);
        }
        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 2, 1, "Line Arrows");

    diagram = childFolder.appendChild({name : "Fill Format", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with fill formats
        graph = this.createGraph();
        for (i = 0; i < 360; i+=10) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(1000, 1000));
            item.getPin().setCoordinate(9000 + 3000 * Math.cos(Math.PI * i / 180),  
                                        6000 + 3000 * Math.sin(Math.PI * i / 180));
            color = JSGDemo.samples.General.hsl2rgb(i, 50, 50);
            item.getFormat().setFillColorRGB(color.r, color.g, color.b);
            item.getFormat().setGradientColor("#FFFFFF");
            item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
            item.getFormat().setLineColor("#666666");
            item.getFormat().setGradientAngle(i);

            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(1000, 1000));
            item.getPin().setCoordinate(6000 + 1500 * Math.cos(Math.PI * i / 180),  
                                        6000 + 1500 * Math.sin(Math.PI * i / 180));
            color = JSGDemo.samples.General.hsl2rgb(i, 50, 50);
            item.getFormat().setFillColorRGB(color.r, color.g, color.b);
            item.getFormat().setLineColor("#666666");
            item.getFormat().setGradientColor("#FFFFFF");
        }
        for (i = 0; i < 360; i+=30) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(1500, 1500));
            item.getPin().setCoordinate(20000 + 3000 * Math.cos(Math.PI * i / 180),  
                                        6000 + 3000 * Math.sin(Math.PI * i / 180));
            color = JSGDemo.samples.General.hsl2rgb(i, 50, 50);
            item.getFormat().setFillColorRGB(color.r, color.g, color.b);
            item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
            item.getFormat().setLineColor("#666666");
            item.getFormat().setGradientColor("#FFFFFF");
            item.getFormat().setGradientType(JSG.graph.attr.FormatAttributes.GradientStyle.RADIAL);
            item.getFormat().setGradientOffsetX(i / 360 * 100);
            item.getFormat().setGradientOffsetY(i / 360 * 50);
        }
        for (i = 0; i < 4; i++) {
            item = JSG.graphItemFactory.createItemFromString("arrowDblHorz");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 3000));
            item.getPin().setCoordinate(3500 + 7000 * i, 13000);
            item.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.PATTERN);
            item.getFormat().setPattern("resources/logosmall.png");
            item.getFormat().setPatternStyle(JSG.graph.attr.FormatAttributes.PatternStyle.STRETCH + i);
            item.getFormat().setLineColor("#666666");
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 3, 1, "Fill Formats");

    diagram = childFolder.appendChild({name : "Shadows", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with shadows
        graph = this.createGraph();
        for (i = 0; i < 4; i++) {
            item = JSG.graphItemFactory.createItemFromString("star5");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
            item.getPin().setCoordinate(4000 * (i + 1), 2000);
            item.getFormat().setShadowDirection(JSG.graph.attr.FormatAttributes.ShadowDirection.LEFTTOP + i);
            item.getFormat().setShadowOffsetX(200);
            item.getFormat().setShadowOffsetY(200);
            item.getFormat().setShadowColor("#777777");
        }
        for (i = 0; i < 6; i++) {
            item = JSG.graphItemFactory.createItemFromString("star6");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
            item.getPin().setCoordinate(4000 * (i + 1), 5000);
            item.getFormat().setShadowOffsetX(200);
            item.getFormat().setShadowOffsetY(200);
            color = JSGDemo.samples.General.hsl2rgb(i * 40, 50, 50);
            item.getFormat().setShadowColorRGB(color.r, color.g, color.b);
        }
        for (i = 0; i < 6; i++) {
            item = JSG.graphItemFactory.createItemFromString("polyedge5");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
            item.getPin().setCoordinate(4000 * (i + 1), 8000);
            item.getFormat().setShadowOffsetX(50 * (i + 1));
            item.getFormat().setShadowOffsetY(50 * (i + 1));
            item.getFormat().setShadowColor("#777777");
        }
        for (i = 0; i < 6; i++) {
            item = JSG.graphItemFactory.createItemFromString("polyedge6");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
            item.getPin().setCoordinate(4000 * (i + 1), 11000);
            item.getFormat().setShadowBlur(i * 8);
            item.getFormat().setShadowOffsetX(300);
            item.getFormat().setShadowOffsetY(300);
            item.getFormat().setShadowColor("#777777");
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 4, 1, "Shadows");

    diagram = childFolder.appendChild({name : "Text Format", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with text formats
        graph = this.createGraph();
        var data = [{
            "name" : "Arial"}, {"name" : "Courier New"}, {"name" : "Georgia"}, {"name" : "Lucida"}, {
            "name" : "Lucida Sans"}, {"name" : "Palatino"}, {"name" : "Tahoma"}, {"name" : "Times New Roman"}, {"name" : "Trebuchet MS"}, {"name" : "Verdana"
        }];
        
        for (i = 0; i < 7; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
            item.getPin().setCoordinate(2000 + 3500 * i, 2000);
            label = item.addLabel(data[i].name);
            label.getTextFormat().setFontSize(14);
            label.getTextFormat().setFontName(data[i].name);
        }
        for (i = 0; i < 7; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
            item.getPin().setCoordinate(2000 + 3500 * i, 5000);
            label = item.addLabel("Size " + (10 + i * 2));
            label.getTextFormat().setFontSize((10 + i * 2));
        }
        for (i = 0; i < 7; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
            item.getPin().setCoordinate(2000 + 3500 * i, 8000);
            label = item.addLabel("Styles");
            label.getTextFormat().setFontStyle(i);
        }
        for (i = 0; i < 7; i++) {
            item = JSG.graphItemFactory.createItemFromString("polyedge5");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
            item.getPin().setCoordinate(2000 + 3500 * i, 11000);
            label = item.addLabel("Color");
            color = JSGDemo.samples.General.hsl2rgb(i * 30, 50, 50);
            label.getTextFormat().setFontColor(JSG.graph.Utils.colorFromRGB(color.r, color.g, color.b));
        }
        for (i = 0; i < 3; i++) {
            item = JSG.graphItemFactory.createItemFromString("polyedge6");
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
            item.getPin().setCoordinate(2000 + 3500 * i, 14000);
            label = item.addLabel("Align\nHorizontal");
            label.getTextFormat().setHorizontalAlignment(i);
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 5, 1, "Text Format");


    diagram = childFolder.appendChild({name : "Rich Text\nFormat", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with text formats
        graph = this.createGraph();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(8000, 5000));
        item.getPin().setCoordinate(5000, 4000);
        label = item.addLabel();
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontName("Verdana");
        label.setText("<p style='text-align:left;'>This is a rich text<br>with linebreak left aligned</p><p style='text-align:center;'>and paragraph<br>that is nicely centered</p><p style='text-align:right;'>and paragraph<br>right aligned</p>");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(8000, 5000));
        item.getPin().setCoordinate(15000, 4000);
        label = item.addLabel();
        label.setText("<p style='text-align:left;'>This is a <b>bold text</b> with linebreak and <i>italic</i> text</p><p>changing <span style='font-family:Georgia;font-size:14pt'>font name and size</span> within text</p><p>or changing <span style='font-family:Georgia;font-size:12pt;color:#FF0000'>font color</span> within text</p>");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(8000, 5000));
        item.getPin().setCoordinate(5000, 12000);
        label = item.addLabel();
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontName("Verdana");
        label.getTextFormat().setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT);
        label.setText("<p>You can also have:</p><ol><li>an ordered list</li><li>with one item</li><li>or another</li><li>or another</li></ol>");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(8000, 5000));
        item.getPin().setCoordinate(15000, 12000);
        label = item.addLabel();
        label.getTextFormat().setFontSize(10);
        label.getTextFormat().setFontName("Verdana");
        label.getTextFormat().setHorizontalAlignment(JSG.graph.attr.TextFormatAttributes.TextAlignment.LEFT);
        label.setText("<p>You can also have:</p><ul><li>an unordered list</li><li>with one item</li><li>or another</li><li>or another</li></ul>");

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 1, 2, "Rich Text\nFormat");


    diagram = childFolder.appendChild({name : "Watermarks", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with text formats
        graph = this.createGraph();

        for (i = JSG.graph.attr.WatermarkAttributes.HorizontalPosition.LEFT; i <= JSG.graph.attr.WatermarkAttributes.HorizontalPosition.REPEAT; i++) {
            for (j = JSG.graph.attr.WatermarkAttributes.VerticalPosition.TOP; j <= JSG.graph.attr.WatermarkAttributes.VerticalPosition.REPEAT; j++) {
                item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
                graph.addItem(item);
                item.setBoundingBoxTo(new JSG.geometry.BoundingBox(5000, 3500));
                item.getPin().setCoordinate(3000 + 5500 * (i - 1), 2500 + 4000 * (j - 1));
        
                var mark = item.addWatermark("Demo");
                mark.setFontSize(6);
                mark.setHorizontalPosition(i);
                mark.setVerticalPosition(j);
                mark.setHorizontalDistance(2000);
                mark.setVerticalDistance(1000);
            }
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 2, 2, "Watermarks");


    addOverviewLabel(graphOverview, 3, "Labels");

    childFolder = parentfolder.appendChild({name : "Labels", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    // graph with node labels
    diagram = childFolder.appendChild({name : "Node Labels", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        graph = this.createGraph();
        
        for (i = 1; i < 6; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
            item.getPin().setCoordinate(3500 * i, 2000);
            label = item.addLabel("H Pos");
            label.getTextFormat().setHorizontalPosition(i);
        }

        for (i = 1; i < 6; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
            item.getPin().setCoordinate(3500 * i, 5500);
            label = item.addLabel("V Pos");
            label.getTextFormat().setVerticalPosition(i);
        }
        for (k = 1; k < 4; k++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 5000));
            item.getPin().setCoordinate(5000 + (k - 1) * 9000, 12000);
            item.setAngle((k - 1) * Math.PI / 5);
            for (i = 1; i < 6; i++) {
                for (j = 1; j < 6; j++) {
                    var text = "Here";
                    if (i === 3 && j === 3) {
                        text = "Multiple Labels\nper Graphical\nObject";
                    }
                    label = item.addLabel(text);
                    label.getTextFormat().setVerticalPosition(i);
                    label.getTextFormat().setHorizontalPosition(j);
                    color = JSGDemo.samples.General.hsl2rgb(j * i * 10, 50, 50);
                    label.getTextFormat().setFontColor(JSG.graph.Utils.colorFromRGB(color.r, color.g, color.b));
                }
            }
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 1, 3, "Node Labels");

    // graph with edge labels
    diagram = childFolder.appendChild({name : "Edge Labels", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        graph = this.createGraph();
        
        for (i = 1; i < 6; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge());
            edge.setStartPointTo(new JSG.geometry.Point(2000, 1000 * i));
            edge.setEndPointTo(new JSG.geometry.Point(8000, 2000 + 1000 * i));
            label = edge.addLabel("Label");
            label.getTextFormat().setVerticalPosition(i);
        }
        for (i = 1; i < 6; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
            edge.init(new JSG.geometry.Point(12000, 1000 * i), new JSG.geometry.Point(26000 - 1500 * i, 2000 + 1000 * i));
            label = edge.addLabel("Label");
            label.getTextFormat().setVerticalPosition(i);
        }

        edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(2000, 10000));
        edge.setEndPointTo(new JSG.geometry.Point(10000, 16000));

        for (i = 1; i < 6; i++) {
            label = edge.addLabel("Label");
            label.getTextFormat().setVerticalPosition(i);
        }

        edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
        edge.init(new JSG.geometry.Point(12000, 10000), new JSG.geometry.Point(24000, 16000));

        for (i = 1; i < 6; i++) {
            label = edge.addLabel("Label");
            label.getTextFormat().setVerticalPosition(i);
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 2, 3, "Edge Labels");

    // graph with tooltips on nodes
    diagram = childFolder.appendChild({name : "Tooltips", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        graph = this.createGraph();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(5000, 5000));
        item.getPin().setCoordinate(6000, 5000);
        item.setTooltip("Simple Tooltip");
        label = item.addLabel("Simple Tooltip");
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(5000, 4000));
        item.getPin().setCoordinate(14000, 6000);
        item.setTooltip("<p>Multiline Tooltip</p>This is a sample<br>for a multiline tooltip");
        label = item.addLabel("Multiline Tooltip");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(8000, 3000));
        item.getPin().setCoordinate(7000, 12000);
        item.setTooltip("<p style='color:red; font-size:10pt;'>Formatted Tooltip</p>This is a sample<br>for a <b>formatted</b> tooltip");
        label = item.addLabel("Formatted Tooltip");

        edge = graph.addItem(new JSG.graph.model.Edge());
        edge.setStartPointTo(new JSG.geometry.Point(14000, 11000));
        edge.setEndPointTo(new JSG.geometry.Point(19000, 15000));
        edge.setTooltip("Edge with Tooltip");
        label = edge.addLabel("Edge with Tooltip");

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 3, 3, "Tooltips");

    addOverviewLabel(graphOverview, 4, "Shapes");

    childFolder = parentfolder.appendChild({name : "Shapes", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    diagram = childFolder.appendChild({name : "Build In Shapes", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with built in shapes
        graph = this.createGraph();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
        item.getPin().setCoordinate(2000, 3000);
        item.addLabel("Rectangle");
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
        item.getPin().setCoordinate(5700, 3000);
        item.addLabel("Ellipse");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
        item.getPin().setCoordinate(9500, 3000);
        item.addLabel("Text");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
        item.getPin().setCoordinate(13250, 3000);
        item.addLabel("Polyline");
        item.setItemAttribute(ATTR.CLOSED, false);

        var size = 0.4;
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5 - size, 0.5));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 1 - size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(size, 1));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0.5 + size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1 - size, 1));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1 - size));

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
        item.getPin().setCoordinate(17000, 3000);
        item.addLabel("Polygon");
        item.setItemAttribute(ATTR.CLOSED, true);

        size = 0.3;
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5 - size, 0.5));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 1 - size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(size, 1));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0.5 + size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1 - size, 1));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 1 - size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5 + size, 0.5));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1 - size, 0));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.5, 0.5 - size));
        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(size, 0));

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.BezierShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
        item.getPin().setCoordinate(20750, 3000);
        item.addLabel("Bezier Curve\nclosed");
        item.setItemAttribute(ATTR.CLOSED, true);

        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.225"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.1")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.5"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.0")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.775"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.3")));
    
        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.225")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.5")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.775")));
    
        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.775"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.8")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.5"), new JSG.graph.expr.Expression(0, "HEIGHT")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.225"), new JSG.graph.expr.Expression(0, "HEIGHT * 1.2")));
    
        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.0"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.775")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.0"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.5")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.0"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.225")));

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.BezierShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 1500));
        item.getPin().setCoordinate(24500, 3000);
        item.addLabel("Bezier Curve");
        item.setItemAttribute(ATTR.CLOSED, false);

        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.225"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.1")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.5"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.0")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.775"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.3")));
    
        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.225")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.5")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.775")));
    
        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.775"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.8")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.5"), new JSG.graph.expr.Expression(0, "HEIGHT")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.225"), new JSG.graph.expr.Expression(0, "HEIGHT * 1.2")));
    
        item.getShape().addCpFromCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.0"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.775")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.0"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.5")));
        item.getShape().addCpToCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH * 0.0"), new JSG.graph.expr.Expression(0, "HEIGHT * 0.225")));

        var data1 = [{"name" : "roundRect"}, {"name" : "roundRectCornerCut"}, {"name" : "roundRectCornerCutSame"}, {"name" : "roundRectCornerCutDiagonal"}, {
                     "name" : "rectCornerCut"}, {"name" : "rectCornerCutSame"}, {"name" : "rectCornerCutDiagonal"}];
        var data2 = [{"name" : "cylinder"}, {"name" : "cube"}, {"name" : "bracketSimpleBoth"}, {"name" : "bracketSimpleLeft"}, {
                     "name" : "bracketSimpleRight"}, {"name" : "bracketCurvedBoth"}, {"name" : "bracketCurvedRight"}];
        var data3 = [{"name" : "arrowLeft"}, {"name" : "arrowUp"}, {"name" : "arrowRight"}, {"name" : "arrowDown"}, {
                     "name" : "arrowDblHorz"}, {"name" : "triangleRight"}, {"name" : "triangleLeft"}];
        var data4 = [{"name" : "polyedge4"}, {"name" : "polyedge5"}, {"name" : "polyedge10"}, {"name" : "arrowDown"}, {
                     "name" : "star3"}, {"name" : "star6"}, {"name" : "star12"}];

        for (i = 0; i < 7; i++) {
            item = JSG.graphItemFactory.createItemFromString(data1[i].name);
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
            item.getPin().setCoordinate(2000 + 3750 * i, 6000);
            item.addLabel(data1[i].name);

            item = JSG.graphItemFactory.createItemFromString(data2[i].name);
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
            item.getPin().setCoordinate(2000 + 3750 * i, 9000);
            item.addLabel(data2[i].name);

            item = JSG.graphItemFactory.createItemFromString(data3[i].name);
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
            item.getPin().setCoordinate(2000 + 3750 * i, 12000);
            item.addLabel(data3[i].name);

            item = JSG.graphItemFactory.createItemFromString(data4[i].name);
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 2000));
            item.getPin().setCoordinate(2000 + 3750 * i, 15000);
            item.addLabel(data4[i].name);
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 1, 4, "BuiltIn\nShapes");

            
    diagram = childFolder.appendChild({name : "Library Shapes", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with library shapes
        var shapes1 = [{"name" : "function"}, {"name" : "event"}, {"name" : "decision"}, {"name" : "position"}, {
                     "name" : "or"}, {"name" : "document"}, {"name" : "datastore"}];
        var shapes2 = [{"name" : "bpmntask"}, {"name" : "bpmngatewayparallel"}, {"name" : "bpmnstartevent"}, {"name" : "bpmnstarttimeevent"}, {
                     "name" : "bpmnintermediatelinkthrowingevent"}, {"name" : "bpmndataobject"}, {"name" : "bpmnsubprocess"}];
        graph = this.createGraph();

        for (i = 0; i < 7; i++) {
            var items = JSG.graphItemFactory.createShape(shapes1[i].name);
            item = items[0];
            graph.addItem(item);
            item.getPin().setCoordinate(2000 + 3750 * i, 5000);

            items = JSG.graphItemFactory.createShape(shapes2[i].name);
            item = items[0];
            graph.addItem(item);
            item.getPin().setCoordinate(2000 + 3750 * i, 9000);
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 2, 4, "Library\nShapes");

    diagram = childFolder.appendChild({name : "Layers", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with layers
        graph = this.createGraph();

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 2000));
        item.getPin().setCoordinate(4000, 4000);
        item.getTextFormat().setFontColor("#FF0000");
        item.addLabel("Click on the items below to\nshow or hide a layer.");

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 1000));
        item.getPin().setCoordinate(4000, 7000);
        item.addLabel("Hide Status");
        item.setLink(new JSG.graph.expr.StringExpression(0, "\"code:" + 
                                    "var graph = item.getGraph();\n" +
                                    "var layer = graph.getLayer('signal');\n" +
                                    "layer.visible = false;\""));
        item.setItemAttribute(ATTR.PORTMODE, CONSTS.PortMode.NONE);

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 1000));
        item.getPin().setCoordinate(4000, 8500);
        item.addLabel("Show Status");
        item.setLink(new JSG.graph.expr.StringExpression(0, "\"code:" + 
                                    "var graph = item.getGraph();\n" +
                                    "var layer = graph.getLayer('signal');\n" +
                                    "layer.visible = true;\""));
        item.setItemAttribute(ATTR.PORTMODE, CONSTS.PortMode.NONE);

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(7000, 10000));
        item.getPin().setCoordinate(13000, 8000);
        item.getFormat().setFillColor("#DDDDDD");
        label = item.addLabel("Server Rack");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        addServer(item, 1500, "Server 1", "#FF0000");
        addServer(item, 3000, "Server 2", "#FFFF00");
        addServer(item, 4500, "Server 3", "#00FF00");
        addServer(item, 6000, "Server 4", "#00FF00");
        addServer(item, 7500, "Server 5", "#00FF00");
        addServer(item, 9000, "Server 6", "#FFFF00");
        
        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 3, 4, "Layer");

    diagram = childFolder.appendChild({name : "Container", id : JSGDemo.getNewId(), expandable : false, leaf : true});
        // graph with containers
        graph = this.createGraph();
        
        // create container sample...
        // create rectangular node
        var container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        container.setSize(6000, 6000);
        container.getPin().setCoordinate(5000, 4000);
        container.getFormat().setFillColor("#DDDDDD");
        
        // add label to container
        label = container.addLabel("Container");
        // align it to the bottom
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
    
        node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.setSize(3500, 1500);
        node.getPin().setCoordinate(2500, 3000);
        label = node.addLabel("Node part of Container");

        for (i = 0; i < 2; i++) {
            // create polygon node
            container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape()));
            // define polygon points (as factor of node dimensions)
            container.setSize(6000, 6000);
            container.getPin().setCoordinate(13000, 4000 + i * 8000);
            container.getFormat().setFillColor("#DDAADD");
            if (i) {
                container.setItemAttribute(ATTR.CLIPCHILDREN, true);
                container.setAngle(0.3);
                container.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.GRADIENT);
            }
            container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.15, 0));
            container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0.15));
            container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(1, 0.8));
            container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0.3, 1));
            container.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0.45));
        
            if (i) {
                label = container.addLabel("Rotated Polygon Container with clipping");
            } else {
                label = container.addLabel("Polygon Container");
                label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
            }
            
            // add node to container
            node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
            node.setSize(4000, 1000);
            node.getPin().setCoordinate(5000, 1500);
            label = node.addLabel("Simple Node, not resizing");
        
            // add node to container using formulas
            node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
            node.setSize(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.4"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT * 0.2"));
            node.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.4"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT * 0.7"));
            label = node.addLabel("Node resizes\nwith Container");
        }
        
        // create elliptical node in container
        container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
        container.setSize(6000, 6000);
        container.getPin().setCoordinate(5000, 12000);
        container.getFormat().setFillColor("#CCEDEE");
        container.setItemAttribute(ATTR.COLLAPSEDBUTTON, CONSTS.ButtonPosition.TOPCENTER);
        container.setItemAttribute(ATTR.COLLAPSABLE, CONSTS.Direction.BOTH);
        
        // add label to container
        label = container.addLabel("Collapsable Container");
        // align it to the bottom
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
    
        node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        node.setSize(3500, 1000);
        node.getPin().setCoordinate(2500, 3500);
        label = node.addLabel("Node part of Container");

        // create scrollable container
        container = graph.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape()));
        container.setSize(6000, 1000);
        container.getPin().setCoordinate(21500, 4500);
        label = container.addLabel("Scrollable Container");

        container = graph.addItem(new JSG.graph.model.ContentNode());
        container.setSize(6000, 6000);
        container.getPin().setCoordinate(21500, 8500);

        for (i = 1; i < 10; i++) {
            for (j = 1; j < 10; j++) {
                node = container.addItem(new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape()));
                node.setSize(1000, 1000);
                node.getPin().setCoordinate(1500 * i, 1500 * j);
            }            
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 4, 4, "Container");

    addOverviewLabel(graphOverview, 5, "Attributes");

    childFolder = parentfolder.appendChild({name : "Attributes", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    diagram = childFolder.appendChild({name : "Node Attributes", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with node attributes
        graph = this.createGraph();

        for (i = 0; i < 12; i++) {
            item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
            graph.addItem(item);
            item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 4000));
            item.getPin().setCoordinate(3000 + i % 6 * 4000, i > 5 ? 11000 : 4000);
            item.getFormat().setFillColor("#FFCCCC");
            switch (i) {
                case 0:
                    item.setItemAttribute(ATTR.CLIPCHILDREN, true);
                    label = item.addLabel("Clip Children");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BOTTOM);
                    var subitem = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
                    item.addItem(subitem);
                    subitem.setBoundingBoxTo(new JSG.geometry.BoundingBox(1000, 1000));
                    subitem.getPin().setCoordinate(2800, 1800);
                    subitem.getFormat().setFillColor("#DDAA44");
                    break;
                case 1:
                    item.setItemAttribute(ATTR.COLLAPSABLE, CONSTS.Direction.BOTH);
                    label = item.addLabel("Collapsable\nNode");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 2:
                    item.setItemAttribute(ATTR.DELETEABLE, false);
                    label = item.addLabel("Not deletable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 3:
                    item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.NONE);
                    label = item.addLabel("Not moveable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 4:
                    item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.VERTICAL);
                    label = item.addLabel("Only vertically moveable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 5:
                    item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.HORIZONTAL);
                    label = item.addLabel("Only horizontally moveable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 6:
                    item.setItemAttribute(ATTR.PORTMODE, CONSTS.PortMode.SHAPE);
                    label = item.addLabel("PortMode\nShape");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 7:
                    item.setItemAttribute(ATTR.ROTATABLE, false);
                    label = item.addLabel("Not rotatable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 8:
                    item.setItemAttribute(ATTR.SELECTIONMODE, CONSTS.SelectionMode.NONE);
                    label = item.addLabel("Not selectable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 9:
                    item.setItemAttribute(ATTR.SIZEABLE, false);
                    label = item.addLabel("Not resizable");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 10:
                    item.setItemAttribute(ATTR.SNAPTO, false);
                    label = item.addLabel("No snap target");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    break;
                case 11:
                    label = item.addLabel("Limit Moving of children\nto Container");
                    label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
                    subitem = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
                    item.addItem(subitem);
                    subitem.setBoundingBoxTo(new JSG.geometry.BoundingBox(1000, 1000));
                    subitem.getPin().setCoordinate(1500, 2000);
                    subitem.getFormat().setFillColor("#DDAA44");
                    subitem.setItemAttribute(ATTR.MOVEABLE, CONSTS.Moveable.LIMITTOCONTAINER | CONSTS.Moveable.BOTH);
                    break;
            }
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 1, 5, "Node Attributes");

    diagram = childFolder.appendChild({name : "Edge Attributes", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // graph with edge attributes
        graph = this.createGraph();

        for (i = 0; i < 5; i++) {
            edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
            edge.init(new JSG.geometry.Point(2000, 1000 + 2000 * i), new JSG.geometry.Point(5000 + 1500 * i, 2500 + 2000 * i));
            switch (i) {
                case 0:
                    edge.setItemAttribute(ATTR.DELETEABLE, false);
                    edge.addLabel("Not deletable");
                    break;
                case 1:
                    edge.setItemAttribute(ATTR.MOVEABLE, CONSTS.Direction.NONE);
                    edge.addLabel("Not moveable");
                    break;
                case 2:
                    edge.setItemAttribute(ATTR.SELECTIONMODE, CONSTS.SelectionMode.NONE);
                    edge.addLabel("Not selectable");
                    break;
                case 3:
                    edge.setItemAttribute(ATTR.SIZEABLE, false);
                    edge.addLabel("Not resizable");
                    break;
                case 4:
                    edge.getLayoutAttributes().setLineBehavior(JSG.graph.attr.consts.LineBehavior.MANUAL);
                    edge.addLabel("Auto Layout off");
                    break;
            }
        }

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 2, 5, "Edge Attributes");


    addOverviewLabel(graphOverview, 6, "Formulas");

    childFolder = parentfolder.appendChild({name : "Formulas", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    diagram = childFolder.appendChild({name : "Formula Coordinates", id : JSGDemo.getNewId(), expandable : false, leaf : true});

        // create Graph with formula samples...       
        graph = this.createGraph();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(4000, 3000));
        item.getPin().setCoordinate(5000, 5000);
        label = item.addLabel("Move this Object\nand the Object to\nthe right will also be moved\nas they are linked\nby Formulas");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        item.getFormat().setFillColor("#DDEEFF");
        var id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
        item.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Item." + id + "!PIN_X + 6000"), 
                                    new JSG.graph.expr.NumberExpression(0, "Item." + id + "!PIN_Y"));
        item.getFormat().setFillColor("#DDEEFF");
        item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Direction.NONE);
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(4000, 3000));
        item.getPin().setCoordinate(5000, 12000);
        label = item.addLabel("Rotate this Object\nand the Object to\nthe right will also be rotated\nas they are linked\nby Formulas");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.BELOWBOTTOM);
        item.getFormat().setFillColor("#AAEEEE");
        id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(3000, 3000));
        item.getPin().setCoordinate(11000, 12000);
        item.setAngle(new JSG.graph.expr.NumberExpression(0, "Item." + id + "!ANGLE"));
        item.getFormat().setFillColor("#AAEEEE");
        item.setItemAttribute(ATTR.ROTATABLE, false);

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.getPin().setCoordinate(20000, 5000);
        item.setSize(4000, 2000);
        label = item.addLabel("Size this Object and the Object below will\n also be resized as they are linked by Formulas");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        item.getFormat().setFillColor("#EECCEE");
        id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(20000, 8000);
        item.setSize(new JSG.graph.expr.NumberExpression(0, "Item." + id + "!WIDTH"), new JSG.graph.expr.NumberExpression(0, "Item." + id + "!HEIGHT"));
        item.getFormat().setFillColor("#EECCEE");
        item.setItemAttribute(ATTR.SIZEABLE, false);

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.getPin().setCoordinate(17000, 13000);
        item.setSize(1000, 1000);
        label = item.addLabel("Move this Object and an attached polygon point\nwill move accordingly");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        item.getFormat().setFillColor("#55AAEE");
        id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(5000, 2000));
        item.getPin().setCoordinate(22000, 17000);
        item.getFormat().setFillColor("#55AAEE");

        item.getShape().addCoordinate(JSG.graph.Coordinate.fromRelativeXY(0, 0));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "Item." + id + "!PIN_X - 19000"), 
                                                                  new JSG.graph.expr.Expression(0, "Item." + id + "!PIN_Y - 16000")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH - 300"), new JSG.graph.expr.Expression(0)));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH"), new JSG.graph.expr.Expression(0, "0.5 * HEIGHT")));
        item.getShape().addCoordinate(new JSG.graph.Coordinate(new JSG.graph.expr.Expression(0, "WIDTH - 300"), new JSG.graph.expr.Expression(0, "HEIGHT")));

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 1, 6, "Formula\nCoordinates");

    diagram = childFolder.appendChild({name : "Formula Formats", id : JSGDemo.getNewId(), expandable : false, leaf : true});
    
        // create Graph with formula samples...       
        graph = this.createGraph();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
        item.getPin().setCoordinate(5000, 5000);
        label = item.addLabel("Change the LINECOLOR of this Object\nand the Object to\nthe right will change its fill color");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        item.getFormat().setFillColor("#DDEEFF");
        id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
        item.getPin().setCoordinate(10000, 5000);
        item.getFormat().setFillColor(new JSG.graph.expr.StringExpression("#FFFFFF", "Item." + id + "!LINECOLOR"));
        item.setItemAttribute(ATTR.MOVEABLE, CONSTS.Direction.NONE);
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
        item.getPin().setCoordinate(5000, 12000);
        label = item.addLabel("Move this Object vertically\nand the Object to\nthe right will change its line width");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        item.getFormat().setFillColor("#AAEEEE");
        id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.setBoundingBoxTo(new JSG.geometry.BoundingBox(2000, 2000));
        item.getPin().setCoordinate(10000, 12000);
        item.getFormat().setLineWidth(new JSG.graph.expr.NumberExpression(10, "Item." + id + "!PIN_Y / 50"));
        item.setItemAttribute(ATTR.ROTATABLE, false);

        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.EllipseShape());
        graph.addItem(item);
        item.getPin().setCoordinate(20000, 5000);
        item.setSize(2000, 2000);
        label = item.addLabel("Change the width of this Object and\nthe Label below will change its font size");
        label.getTextFormat().setVerticalPosition(JSG.graph.attr.TextFormatAttributes.VerticalTextPosition.ONTOP);
        item.getFormat().setFillColor("#EECCEE");
        id = item.getId();
        
        item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
        graph.addItem(item);
        item.getPin().setCoordinate(20000, 9000);
        item.setSize(2000, 2000);
        item.getFormat().setFillColor("#EECCEE");
        label = item.addLabel("Label");
        label.setTextInfoCache(false);
        label.getTextFormat().setFontSize(new JSG.graph.expr.NumberExpression(10, "Item." + id + "!WIDTH / 250"));
        label.setText(new JSG.graph.expr.Expression("", "FONTSIZE +  pt"));
        item.setItemAttribute(ATTR.SIZEABLE, false);

        addBackItem(graph, overviewId);
        this.saveGraph(diagram.get('id'), graph);
        addOverviewItem(graphOverview, diagram, 2, 6, "Formula\nFormats");

    this.saveGraph(overviewDiagram.get('id'), graphOverview);
};

JSGDemo.samples.General.createProcess = function(root) {
    var CONSTS = JSG.graph.attr.consts;
    var ATTR = JSG.graph.attr.ItemAttributes;

    function attach(graph, type, parentItem, position) {
        var newItem = JSG.graphItemFactory.createShape(type)[0];
        graph.addItem(newItem);

        var box = parentItem.getBoundingBox();
        var org = parentItem.getOrigin();
        var portTarget, portSource;

        switch (position) {
            case "lt":
                newItem.getPin().setCoordinate(org.x - box.getWidth(), org.y - box.getHeight() / 2);
                
                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 1));    
                portSource = parentItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0, 0.25));
                break;
            case "lb":
                newItem.getPin().setCoordinate(org.x - box.getWidth(), org.y + box.getHeight() * 1.5);

                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 0));    
                portSource = parentItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0, 0.75));
                break;
            case "rt":
                newItem.getPin().setCoordinate(org.x + box.getWidth() * 2, org.y - box.getHeight() / 2);
                
                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 1));    
                portSource = parentItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(1, 0.25));
                break;
            case "rb":
                newItem.getPin().setCoordinate(org.x + box.getWidth() * 2, org.y + box.getHeight() * 1.5);

                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 0));    
                portSource = parentItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(1, 0.75));
                break;
            case "bl":
                newItem.getPin().setCoordinate(org.x, org.y + box.getHeight() * 2.5);

                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 0));    
                portSource = parentItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.25, 1));
                break;
            case "br":
                newItem.getPin().setCoordinate(org.x + box.getWidth(), org.y + box.getHeight() * 2.5);

                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 0));    
                portSource = parentItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.75, 1));
                break;
        }

        var edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
        edge.setSourcePort(portSource);
        edge.setTargetPort(portTarget);
        edge.getFormat().setLineCorner(200);
        
        return newItem;
    }

    function append(graph, type, previousItem, offsetX, offsetY, portLocSource, portLocTarget) {
        if (offsetX === undefined) {
            offsetX = 0;
        }
        if (offsetY === undefined) {
            offsetY = 0;
        }

        var newItem = JSG.graphItemFactory.createShape(type)[0];
        graph.addItem(newItem);

        if (previousItem) {
            var box = previousItem.getBoundingBox();
            var org = previousItem.getOrigin();
            newItem.getPin().setCoordinate(org.x + box.getCenter().x + offsetX, org.y + box.getCenter().y + offsetY);
        } else {
            newItem.getPin().setCoordinate(13000, 2000);
        }        

        if (previousItem) {
            var portSource, portTarget;
            if (portLocSource === "right") {
                portSource = previousItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(1, 0.5));
            } else if (portLocSource === "left") {
                portSource = previousItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0, 0.5));
            } else {
                portSource = previousItem.addCenterPort();    
            }
            if (portLocTarget === "right") {
                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(1, 0.5));
            } else if (portLocTarget === "left") {
                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0, 0.5));
            } else if (portLocTarget === "top") {
                portTarget = newItem.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0.5, 0));
            } else {
                portTarget = newItem.addCenterPort();
            }    
    
            var edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
            edge.setSourcePort(portSource);
            edge.setTargetPort(portTarget);
            edge.getFormat().setLineCorner(200);
            edge.getFormat().setLineArrowEnd(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDSMALL);
            edge.getFormat().setFillColor("#000000");
        }        
        
        return newItem;
    }
    
JSG.connectionRestorer = new JSG.graph.model.ConnectionRestorer();

    var parentfolder = root.appendChild({name : "Business Process Samples", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    var epcDiagram = parentfolder.appendChild({name : "EPC Diagram", id : JSGDemo.getNewId(), expandable : false, leaf : true});

    // create Graph with event process chain...       
    var graph = this.createGraph();

    var item = append(graph, "interface");
    
    item = append(graph, "function", item, 0, 3000);
    item = append(graph, "function", item, 0, 3000);
    attach(graph, "person", item, "lt");
    attach(graph, "document", item, "lb");

    item = append(graph, "event", item, 0, 3000);

    var or = append(graph, "or", item, 0, 3000);

    // left branch
    var iteml = append(graph, "function", or, -3000, 3000, "left");
    attach(graph, "person", iteml, "lt");
    attach(graph, "document", iteml, "lb");

    item = append(graph, "function", iteml, 0, 3000);
    attach(graph, "person", item, "lb");
    item = append(graph, "event", item, 0, 3000);
    var last = append(graph, "function", item, 0, 3000);

    // right branch 
    var itemr = append(graph, "function", or, 3000, 3000, "right");
    attach(graph, "person", itemr, "rt");
    attach(graph, "document", itemr, "rb");
    item = append(graph, "event", itemr, 0, 3000);
    item = append(graph, "function", item, 0, 3000);
    item = append(graph, "function", item, 0, 3000);

    // join
    item = append(graph, "or", item, -3000, 3000, "center", "right");

    var portTarget = item.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0, 0.5));
    var portSource = last.addCenterPort();    
    var edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
    edge.setSourcePort(portSource);
    edge.setTargetPort(portTarget);
    edge.getFormat().setLineCorner(200);
    edge.getFormat().setLineArrowEnd(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDSMALL);
    edge.getFormat().setFillColor("#000000");

    item = append(graph, "function", item, 0, 3000);
    or = append(graph, "or", item, 0, 3000);
    item = append(graph, "interface", or, 0, 3000);
    item = append(graph, "interface", or, 4000, 3000, "center", "top");
    item = append(graph, "interface", or, 8000, 3000, "center", "top");
    
    this.saveGraph(epcDiagram.get('id'), graph);

    // create Graph with bpmn diagram...       
    var diagram = parentfolder.appendChild({name : "BPMN Diagram", id : JSGDemo.getNewId(), expandable : false, leaf : true});

    graph = this.createGraph();

    var pool = JSG.graphItemFactory.createShape("bpmnpool")[0];
    pool.getPin().setCoordinate(13000, 8500);
    pool.setSize(25500, 15000);
    graph.addItem(pool);
  
    var lane1 = JSG.graphItemFactory.createShape("bpmnlane")[0];
    lane1.setSize(25000, 4000);
    pool.getItemAt(2).addItem(lane1);
    var lanecontainer = lane1.getItemAt(2);

    item = JSG.graphItemFactory.createShape("bpmnstartevent")[0];
    item.getPin().setCoordinate(2000, 2000);
    lanecontainer.addItem(item);
    item = append(lanecontainer, "bpmntask", item, 3500, 0);
    var gate = append(lanecontainer, "bpmngatewayexclusive", item, 3500, 0);
    item = append(lanecontainer, "bpmntask", gate, 3500, 0);
    item = append(lanecontainer, "bpmnendevent", item, 10500, 0);
    
    var lane2 = JSG.graphItemFactory.createShape("bpmnlane")[0];
    lane2.setSize(25000, 7000);
    pool.getItemAt(2).addItem(lane2);
    lanecontainer = lane2.getItemAt(2);

    item = append(lanecontainer, "bpmntask", gate, 3500, 500, "center", "left");
    
    attach(lanecontainer, "bpmndataobject", item, "bl");
    attach(lanecontainer, "bpmndataobject", item, "br");

    var gate2 = append(lanecontainer, "bpmngatewayinclusive", item, 3500, 0);
    item = append(lanecontainer, "bpmntask", gate2, 3500, 0);
    item = append(lanecontainer, "bpmnendmessageevent", item, 3500, 0);

    var lane3 = JSG.graphItemFactory.createShape("bpmnlane")[0];
    lane3.setSize(25000, 4000);
    pool.getItemAt(2).addItem(lane3);
    lanecontainer = lane3.getItemAt(2);

    item = append(lanecontainer, "bpmnstarttimeevent", gate2, 0, -500);
    item = append(lanecontainer, "bpmntask", item, 3500, 0);
    item = append(lanecontainer, "bpmnendescalationevent", item, 3500, 0);

    this.saveGraph(diagram.get('id'), graph);

    // create Graph with flowchart...       
    diagram = parentfolder.appendChild({name : "Flowchart", id : JSGDemo.getNewId(), expandable : false, leaf : true});

    graph = this.createGraph();
    item = append(graph, "flowstart");
    item.getPin().setCoordinate(9000, 2000);
    item = append(graph, "flowprocess", item, 0, 2500);
    item = append(graph, "flowdelay", item, 0, 2500);
    var dec = append(graph, "flowdecision", item, 0, 2500);

    // right branch    
    item = append(graph, "flowprocess", dec, 3000, 2500, "right");
    attach(graph, "flowdocument", item, "rt");
    attach(graph, "flowstoreddata", item, "rb");
    item = append(graph, "flowpreparation", item, 0, 2500);
    item = append(graph, "flowsubprocess", item, 0, 2500);
    var join = append(graph, "flowjoin", item, -3000, 2500, "cemter", "right");

    // left branch    
    item = append(graph, "flowprocess", dec, -3000, 2500, "left");
    or = append(graph, "flowor", item, 0, 2500);
    
    item = append(graph, "flowprocess", or, -4000, 2500, "left");
    item = append(graph, "flowoffpage", item, 0, 2500);

    item = append(graph, "flowprocess", or, 0, 2500);

    portTarget = join.addPortAtRelativeLocation(new JSG.graph.model.Port(), new JSG.geometry.Point(0, 0.5));
    portSource = item.addCenterPort();    
    edge = graph.addItem(new JSG.graph.model.Edge(new JSG.graph.model.shapes.OrthoLineShape()));
    edge.setSourcePort(portSource);
    edge.setTargetPort(portTarget);
    edge.getFormat().setLineCorner(200);
    edge.getFormat().setLineArrowEnd(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROWFILLEDSMALL);
    edge.getFormat().setFillColor("#000000");

    item = append(graph, "flowprocess", join, 0, 2500);
    item = append(graph, "flowterminator", item, 0, 2500);

    var page = graph.getSettings().getPage();
    page.setOrientation(JSG.graph.model.settings.PageOrientation.PORTRAIT);
    
    this.saveGraph(diagram.get('id'), graph);

};

JSGDemo.samples.General.createLayout = function(root) {
    var CONSTS = JSG.graph.attr.consts;
    var ATTR = JSG.graph.attr.ItemAttributes;

    JSG.connectionRestorer = new JSG.graph.model.ConnectionRestorer();

    var parentfolder = root.appendChild({name : "Layout Samples", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    // create Graph with flow layout       
    var flowDiagram = parentfolder.appendChild({name : "Flow Layout", id : JSGDemo.getNewId(), expandable : false, leaf : true});
    var graph = this.createGraph();
    
    var generator = new ARAC.layout.tools.GraphGenerator();
    var support = new JSG.aracadapter.GraphGenSupport(graph, "function");
    
    generator.genFlow(support, new ARAC.layout.tools.graphgen.FlowGenContext(
                        { 
                            nodeCount: 50 
                        }));

    ARAC.layout.apply(new JSG.aracadapter.AracGraphAdapter(graph),
      ARAC.layout.defaultConfigStore.get('Flow-CardinalPoints-Orth'),
      ARAC.layout.defaultConfigStore.get('Edge-StoreData'));

    this.saveGraph(flowDiagram.get('id'), graph);

    // graph with tree layout
    var treeDiagram = parentfolder.appendChild({name : "Tree Layout", id : JSGDemo.getNewId(), expandable : false, leaf : true});
    graph = this.createGraph();
    
    generator = new ARAC.layout.tools.GraphGenerator();
    support = new JSG.aracadapter.GraphGenSupport(graph, "orgperson");
    
    generator.genTree(support, new ARAC.layout.tools.graphgen.TreeGenContext(
                        { 
                            nodeCount: 150 
                        }));

    ARAC.layout.apply(new JSG.aracadapter.AracGraphAdapter(graph),
        ARAC.layout.defaultConfigStore.get('Tree-CardinalPoints-Orth'),
        ARAC.layout.defaultConfigStore.get('Edge-StoreData'));

    this.saveGraph(treeDiagram.get('id'), graph);

    // graph with force layout
    var forceDiagram = parentfolder.appendChild({name : "Force Directed Layout", id : JSGDemo.getNewId(), expandable : false, leaf : true});
    graph = this.createGraph();
    
    generator = new ARAC.layout.tools.GraphGenerator();
    support = new JSG.aracadapter.GraphGenSupport(graph, "person");
    
    generator.genTree(support, new ARAC.layout.tools.graphgen.TreeGenContext(
                        { 
                            nodeCount: 100 
                        }));

    ARAC.layout.apply(new JSG.aracadapter.AracGraphAdapter(graph),
        ARAC.layout.defaultConfigStore.get('Force-CenterPoints'),
        ARAC.layout.defaultConfigStore.get('Edge-StoreData'));

    this.saveGraph(forceDiagram.get('id'), graph);
};

JSGDemo.samples.General.createOrgChart = function(root) {
    var CONSTS = JSG.graph.attr.consts;
    var ATTR = JSG.graph.attr.ItemAttributes;

    var parentfolder = root.appendChild({name : "OrgChart Samples", id : JSGDemo.getNewId(), expandable : true, leaf : false});

    var treeDiagram = parentfolder.appendChild({name : "Company", id : JSGDemo.getNewId(), expandable : false, leaf : true});

    // create Graph with company orgchart...       
    var graph = this.createGraph();
    graph.setType("orgchart");

    var newItem = JSG.graphItemFactory.createShape("orgmanager")[0];
    graph.addItem(newItem);
    newItem.getPin().setCoordinate(13000, 2000);

    var item = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape());
    item.setBoundingBoxTo(new JSG.geometry.BoundingBox(6000, 1000));
    item.getPin().setCoordinate(23250, 1000);
    item.getFormat().setFillColor("#404040");
    item.getTextFormat().setFontColor("#FFFFFF");
    item.getFormat().setLineColor("#333333");
    item.getFormat().setGradientColor("#F3F3F3");
    var label = item.addLabel("Click on the manager and use the\nbuttons to create employees or assistants");
    graph.addItem(item);

    this.saveGraph(treeDiagram.get('id'), graph);
};

JSGDemo.samples.General.createGraph = function() {
    JSG.connectionRestorer = new JSG.graph.model.ConnectionRestorer();

    return new JSG.graph.model.Graph();
};

JSGDemo.samples.General.saveGraph = function(id, graph) {
    if (JSG.connectionRestorer !== undefined) {
        JSG.connectionRestorer.updateIds(graph);
        JSG.connectionRestorer = undefined;
    }

    graph.evaluate();
    graph._restoreConnections(graph);
    
    var file = new JSG.commons.XMLWriter( 'UTF-8', '1.0' );
    
    file.writeStartDocument();

    file.writeStartElement("document");
    file.writeAttributeString("version", "1.0.0");

    file.writeEndElement();
    
    graph.saveXML(file);
    file.writeEndDocument();

    var xml = file.flush();
    var cxml = LZString.compressToUTF16(xml);
    JSGDemo.utils.Storage.save(id, cxml);
};

JSGDemo.samples.General.hsl2rgb = function(h, s, l) {
    var m1, m2, hue;
    var r, g, b;

    function hueToRgb(m1, m2, hue) {
        var v;
        if (hue < 0) {
            hue += 1;
        } else if (hue > 1) {
            hue -= 1;
        }
    
        if (6 * hue < 1) {
            v = m1 + (m2 - m1) * hue * 6;
        } else if (2 * hue < 1) {
            v = m2;
        } else if (3 * hue < 2) {
            v = m1 + (m2 - m1) * (2/3 - hue) * 6;
        } else {
            v = m1;
        }   
        return 255 * v;
    }

    s /=100;
    l /= 100;
    if (s === 0) {
        r = g = b = (l * 255);
    } else {
        if (l <= 0.5) {
            m2 = l * (s + 1);
        } else {
            m2 = l + s - l * s;
        }
        m1 = l * 2 - m2;
        hue = h / 360;
        r = Math.round(hueToRgb(m1, m2, hue + 1/3));
        g = Math.round(hueToRgb(m1, m2, hue));
        b = Math.round(hueToRgb(m1, m2, hue - 1/3));
    }

    return {r: r, g: g, b: b};
};
    


/**
 * A Demo for the JS-Graph Library
 * @author Tensegrity Software GmbH
 * @link   http://www.js-graph.com/
 * @license Copyright Tensegrity Software GmbH. Use and distribution currently only with the consent of Tensegrity Software GmbH! Please read and
 * follow the license agreement provided with this distribution. If there are any questions regarding the software license, please contact us.
 */

/**
 * Handler, called when EXT is initialized. Here we initialize the application.
 * 
 * @method Ext.onReady
 * @static
 */
Ext.onReady(function() {
    // initialize derived factories
    JSG.graphItemFactory = new JSGDemo.graph.model.GraphItemFactory();
    JSG.layoutFactory = new JSGDemo.graph.layout.LayoutManager();

    // create, show and initialize EXT Viewport
    JSGDemo.viewport = Ext.create('JSGDemo.view.Viewport', {
        renderTo : Ext.getBody()
    });

    // intialize and load library from library.xml
    JSGDemo.libraries = new JSGDemo.model.Libraries();
    JSGDemo.libraries.load();

    JSGDemo.viewport.show();
    JSGDemo.viewport.initApplication();

    // load a file from local storage, if given as URL parameter
    var file = JSGDemo.getURLParameters('drawing');
    if (file !== undefined) {
        var id = JSGDemo.viewport.getIdByName(file);
        if (id) {
            JSGDemo.viewport.setActiveEditorById(id);
        }
    }
    
    // remove intro screen
    var element = document.getElementById('loading');
    element.parentNode.removeChild(element);
});

/**
 * Unload handler to check, if a document has changed before closing the browser. If so show a warning.
 * 
 * @method onbeforeunload
 * @return {String} Warning message to show, if a document has changed. 
 * @static
 */
onbeforeunload = function() {
    var ret;

    var tabs = Ext.getCmp('center');
    if (!tabs) {
        return;
    }

    tabs.items.each(function(tab) {
        if (tab.jsgEditor.getGraph().isChanged()) {
            ret = JSGDemo.resourceProvider.getString("You are about to leave this page. There are unsaved Changes. These will be lost, if you leave the page without saving.");
        }
    });

    return ret;
};

