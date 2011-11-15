/*!
 * phony.js v1.0.0
 * http://forchoon.com/projects/javascript/phony-js/
 *
 * Copyright 2011, Alasdair Mercer
 * Licensed under the GPL Version 3 license.
 */

/*jslint
    sloppy: true, vars: true, plusplus: true, maxerr: 50, maxlen: 80, indent: 4
*/

(function (root) {

    /**
     * <p>The indices used to map phonetic alphabets to supported
     * characters.</p>
     * @private
     * @type Object
     */
    var ALPHABETS = {
            ANSI : 3,
            FAA  : 2,
            ICAO : 1,
            ITU  : 0
        },

        /**
         * <p>The mapping of supported characters to their phonetic alphabet
         * counterparts.</p>
         * <p>This is a multi-dimensional array and should be treated as
         * such.</p>
         * @private
         * @type Array[]
         */
        chars = [
            /* Letters */
            ['\u0041', ['Alfa', null, null, 'Alpha']],     // A
            ['\u0042', 'Bravo'],                           // B
            ['\u0043', 'Charlie'],                         // C
            ['\u0044', 'Delta'],                           // D
            ['\u0045', 'Echo'],                            // E
            ['\u0046', 'Foxtrot'],                         // F
            ['\u0047', 'Golf'],                            // G
            ['\u0048', 'Hotel'],                           // H
            ['\u0049', 'India'],                           // I
            ['\u004A', ['Juliett', null, null, 'Juliet']], // J
            ['\u004B', 'Kilo'],                            // K
            ['\u004C', 'Lima'],                            // L
            ['\u004D', 'Mike'],                            // M
            ['\u004E', 'November'],                        // N
            ['\u004F', 'Oscar'],                           // O
            ['\u0050', 'Papa'],                            // P
            ['\u0051', 'Quebec'],                          // Q
            ['\u0052', 'Romeo'],                           // R
            ['\u0053', 'Sierra'],                          // S
            ['\u0054', 'Tango'],                           // T
            ['\u0055', 'Uniform'],                         // U
            ['\u0056', 'Victor'],                          // V
            ['\u0057', 'Whiskey'],                         // W
            ['\u0058', 'X-ray'],                           // X
            ['\u0059', 'Yankee'],                          // Y
            ['\u005A', 'Zulu'],                            // Z
            /* Numbers */
            /*
             * TODO: Need to determine when to use 1000, 100 or break them up.
             * Look at the following for examples;
             * 
             * - http://www.faa.gov/air_traffic/publications/atpubs/aim/Chap4/aim0402.html#aim0402.html.6
             * - http://www.faa.gov/air_traffic/publications/atpubs/ATC/atc0204.html#atc0204.html.5
             * 
             * Probably best to use regex (e.g. "/^\d\d?,?\d{3}$/").
             */
            ['\u0030', ['Nadazero', null, 'Zero']],        // 0
            ['\u0031', ['Unaone', null, 'One']],           // 1
            ['\u0032', ['Bissotwo', null, 'Two']],         // 2
            ['\u0033', ['Terrathree', null, 'Three']],     // 3
            ['\u0034', ['Kartefour', null, 'Four']],       // 4
            ['\u0035', ['Pantafive', null, 'Five']],       // 5
            ['\u0036', ['Soxisix', null, 'Six']],          // 6
            ['\u0037', ['Setteseven', null, 'Seven']],     // 7
            ['\u0038', ['Oktoeight', null, 'Eight']],      // 8
            ['\u0039', ['Novenine', 'Niner', 'Nine']],     // 9
            /* Punctuation */
            /*
             * TODO: Need to determine when to use Decimal.
             * 
             * Probably best to use regex (e.g. "/\d+\.\d+$/").
             */
            ['\u002E', 'Stop'],                            // Full stop
            ['\u002E', 'Decimal'],                         // Full stop
            ['\u002D', 'Dash']                             // Hyphen-minus
        ],

        // TODO: JSDoc
        CHAR_GAP = '\u0020',

        /**
         * <p>The name of the alphabet to be used if none is specified or could
         * not be found.</p>
         * @private
         * @type String
         */
        DEFAULT_ALPHABET = 'ITU',

        // TODO: JSDoc
        HUNDRED = 'Hundred',

        /**
         * <p>The previous version of the global <code>phony</code>
         * variable.</p>
         * @private
         * @type Object
         */
        previousPhony = root.phony,

        // TODO: JSDoc
        THOUSAND = 'Thousand',

        // TODO: JSDoc
        WORD_GAP = 'Space';

    // TODO: JSDoc
    function compareCase(str) {
        if (str === str.toLowerCase()) {
            return -1;
        } else if (str === str.toUpperCase()) {
            return 1;
        }
        return 0;
    }

    // TODO: JSDoc
    function findAlphabet(name) {
        if (typeof name === 'string') {
            name = name.toUpperCase();
            if (typeof ALPHABETS[name] === 'number') {
                return ALPHABETS[name];
            }
        }
        return ALPHABETS[DEFAULT_ALPHABET];
    }

    /**
     * <p>Attempts to find a character mapping that matches the query
     * provided.</p>
     * @param {String} query The query string to be matched.
     * @param {Integer} index The index of the character mapping to be queried.
     * @returns {String[]} The character mapping matching the query or
     * <code>undefined</code> if none was found.
     * @private
     */
    function findChar(query, index) {
        query = query.toUpperCase();
        for (var i = 0; i < chars.length; i++) {
            if (typeof chars[i][index] === 'string') {
                if (chars[i][index].toUpperCase() === query) {
                    return chars[i];
                }
            } else {
                for (var j = 0; j < chars[i][index].length; j++) {
                    if (chars[i][index][j] &&
                            chars[i][index][j].toUpperCase() === query) {
                        return chars[i];
                    }
                }
            }
        }
    }

    /**
     * <p>Prepares the message to so that it can be easily translated.</p>
     * <p>The returned value is a multi-dimensional array and should be treated
     * as such.</p>
     * @param {String} str The user-defined message.
     * @param {RegExp|String} wordSplitter The selector to be used to separate
     * words.
     * @param {RegExp|String} letterSplitter The selector to be used to
     * separate letters.
     * @returns {Array} The character to word mapping ([word][char]).
     * @throws {TypeError} If <code>str</code> is not a string.
     * @private
     */
    function prepare(str, wordSplitter, letterSplitter) {
        if (typeof str !== 'string') {
            throw new TypeError('Invalid value type: ' + typeof str);
        }
        // Splits words
        var ret = str.trim().split(wordSplitter);
        for (var i = 0; i < ret.length; i++) {
            // Splits letters
            ret[i] = ret[i].split(letterSplitter);
        }
        return ret;
    }

    /**
     * <p>Safely handles cases where synchronisation methodology may vary.</p>
     * <p>In cases where a callback function was specified it should be used to
     * pass the return value of the function provided or any errors that were
     * thrown during the process. Either the return value of the callback
     * function or the error encountered will be returned here.</p>
     * <p>Otherwise; errors will be thrown as normal and the return value of
     * the function will simply be returned.</p>
     * @param {Function} fn The function to be ran safely.
     * @param {Function} [cb] The function to be called with the resulting
     * value or any errors that were thrown.
     * @returns The return value of the function provided or an error if one
     * was thrown during the process while a callback function was specified.
     * @throws Any error that occurs while no callback function was specified.
     * @private
     */
    function syncSafe(fn, cb) {
        // Check if callback was provided
        var hasCallback = typeof cb === 'function';
        try {
            var ret = fn();
            // All went, handle response
            if (hasCallback) {
                return cb(null, ret);
            } else {
                return ret;
            }
        } catch (e) {
            // Something went wrong, notify the user
            if (hasCallback) {
                return cb(e);
            } else {
                throw e;
            }
        }
    }

    // TODO: JSDoc
    function toTitleCase(str) {
        return str[0].toUpperCase() + str.substring(1).toLowerCase();
    }

    // TODO: JSDoc
    function translate(str1, str2, caseSensitive, alphabet) {
        if (typeof str2 === 'string') {
            if (caseSensitive && compareCase(str1) === -1) {
                str2 = str2.toLowerCase();
            }
            return str2;
        }
        var str3 = (str2.length > alphabet) ? str2[alphabet] : str2[0];
        str3 = str3 || str2[0];
        return translate(str1, str3 || '', caseSensitive);
    }

    // TODO: JSDoc
    function validateTranslation(translation, nullCheck) {
        // Translation can only be a single word string
        if (typeof translation === 'string') {
            translation = toTitleCase(translation.trim());
            if (!translation || !/\s+/.test(translation)) {
                throw new Error('Invalid translation: ' + translation);
            }
        } else if (nullCheck && translation !== null) {
            throw new TypeError('Invalid translation: ' + translation);
        }
        return translation;
    }

    /**
     * <p>Pure JavaScript library for translating to/from the phonetic
     * alphabet.</p>
     * <p>The default translation is based on the International
     * Telecommunication Union (ITU) alphabet but others are supported.</p>
     * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
     * @version 1.0.0
     * @public
     * @namespace
     */
    var phony = {

        // TODO: JSDoc
        ALPHABETS: (function () {
            var ret = [];
            for (var prop in ALPHABETS) {
                if (ALPHABETS.hasOwnProperty(prop)) {
                    ret.push(prop);
                }
            }
            return ret;
        }()),

        /**
         * <p>Translates the message provided from the phonetic alphabet.</p>
         * <p>If no alphabet is specified then the default alphabetic will be
         * used.</p>
         * <p>Optionally, a callback function can be provided which will be
         * called with the result as the second argument. If an error occurs it
         * will be passed as the first argument to this function, otherwise
         * this argument will be <code>null</code>.</p>
         * @param {Object} data The information for translating.
         * @param {String} [data.alphabet] The name of the phonetic alphabet
         * variation to be used to translate the message.
         * @param {Boolean} [data.caseSensitive] Indicates whether or not the
         * translation should be case sensitive.
         * @param {String} data.message The string to be translated.
         * @param {Function} [callback] The function to be called with the
         * translated message or any errors.
         * @returns The translated message or, where a callback function was
         * specified, the return value of the callback function or any error
         * that occurred while translating the message.
         * @throws {TypeError} If <code>data.message</code> is not a string and
         * no callback function was specified.
         * @public
         */
        from: function (data, callback) {
            return syncSafe(function () {
                data = data || {};
                var alphabet = findAlphabet(data.alphabet),
                    caseSensitive = (typeof data.caseSensitive ===
                            'undefined') ? true : data.caseSensitive,
                    charGap = caseSensitive ? CHAR_GAP.toLowerCase() :
                            CHAR_GAP,
                    ret = '',
                    value = data.message || '',
                    wordGap = caseSensitive ? WORD_GAP.toLowerCase() :
                            WORD_GAP;
                value = prepare(value, new RegExp(wordGap, 'i'),
                        new RegExp(charGap, 'i'));
                // Check message was prepared
                if (value) {
                    // Iterate over each word
                    for (var i = 0; i < value.length; i++) {
                        // Insert space between each word
                        if (i > 0) {
                            ret += ' ';
                        }
                        // Iterate over each character of word
                        for (var j = 0; j < value[i].length; j++) {
                            // Retrieve first matching character
                            var ch = findChar(value[i][j], 1);
                            // Check if character is supported
                            if (ch) {
                                ret += translate(value[i][j], ch[0],
                                        caseSensitive, alphabet);
                            }
                        }
                    }
                }
                return ret;
            }, callback);
        },

        /**
         * <p>Maps a new translation to the character provided.</p>
         * <p>If a mapping already exists for the specified character, that
         * mapping will be modified.</p>
         * <p>If <code>translation</code> is an array, its elements should be
         * specified in the following order;
         *   <ol start="0">
         *     <li>ITU</li>
         *     <li>ICAO</li>
         *     <li>FAA</li>
         *     <li>ANSI</li>
         *   </ol>
         * Use <code>null</code> to fill the gaps and feel free to leave off
         * any unused alphabet translations from the end.</p>
         * <p>Optionally, a callback function can be provided which will be
         * called when the character has been defined. If an error occurs it
         * will be passed as the first argument to this function, otherwise
         * this argument will be <code>null</code>.</p>
         * @param {String} character The character whose mapping is being
         * defined. Must be a single character.
         * @param {String|String[]} translation The translation(s) to be
         * mapped.
         * @param {Function} [callback] The function to be called once the
         * defined.
         * @returns The return value of the callback function or any error that
         * occurred while defining the character if a callback function was
         * specified; otherwise <code>undefined</code>.
         * @throws {Error} If <code>character</code> is contains more than a
         * single character.
         * @throws {Error} If <code>translation</code> either is a string of
         * more than one word or contains a string which has more than one
         * word.
         * @throws {Error} If <code>translation</code> is an array and the
         * first element is <code>null</code>.
         * @throws {TypeError} If <code>character</code> is not a string.
         * @throws {TypeError} If <code>translation</code> is not a string or
         * array of strings.
         * @public
         */
        defineChar: function (character, translation, callback) {
            return syncSafe(function () {
                // Type-check arguments provided
                if (typeof character !== 'string') {
                    throw new TypeError('Invalid character type: ' +
                            typeof character);
                } else if (typeof translation !== 'string' ||
                        (typeof translation !== 'object' ||
                        typeof translation.length !== 'number')) {
                    throw new TypeError('Invalid translation type: ' +
                            typeof translation);
                }
                // Character must be singular
                if (character.length > 1) {
                    throw new Error('Invalid character length: ' +
                            character.length);
                }
                // Translation must be single word or contain only single words
                if (typeof translation === 'string') {
                    translation = validateTranslation(translation);
                } else {
                    for (var i = 0; i < translation.length; i++) {
                        translation[i] = validateTranslation(translation[i],
                                true);
                        if (i === 0 && !translation[i]) {
                            throw new Error('Invalid default translation: ' +
                                    transation[i]);
                        }
                    }
                }
                // Update existing character mapping or create new one
                character = character.toUpperCase();
                var existingChar = findChar(character, 0);
                if (existingChar) {
                    existingChar[1] = translation;
                } else {
                    chars.push([character, translation]);
                }
            }, callback);
        },

        /**
         * <p>Translates the message provided to the phonetic alphabet.</p>
         * <p>If no alphabet is specified then the default alphabet will be
         * used.</p>
         * <p>Optionally, a callback function can be provided which will be
         * called with the result as the second argument. If an error occurs it
         * will be passed as the first argument to this function, otherwise
         * this argument will be <code>null</code>.</p>
         * @param {Object} data The information for translating.
         * @param {String} [data.alphabet] The name of the phonetic alphabet
         * variation to be used to translate the message.
         * @param {Boolean} [data.caseSensitive] Indicates whether or not the
         * translation should be case sensitive.
         * @param {String} data.message The string to be translated.
         * @param {Boolean} [data.omitSpace] Indicates whether or not words
         * should be split up by "Space".
         * @param {Function} [callback] The function to be called with the
         * translated message or any errors.
         * @returns The translated message or, where a callback function was
         * specified, the return value of the callback function or any error
         * that occurred while translating the message.
         * @throws {TypeError} If <code>data.message</code> is not a string and
         * no callback function was specified.
         * @public
         */
        to: function (data, callback) {
            return syncSafe(function () {
                data = data || {};
                var alphabet = findAlphabet(data.alphabet),
                    caseSensitive = (typeof data.caseSensitive ===
                            'undefined') ? true : data.caseSensitive,
                    charGap = caseSensitive ? CHAR_GAP.toLowerCase() :
                            CHAR_GAP,
                    omitSpace = !!data.omitSpace,
                    ret = '',
                    value = prepare(data.message || '', /\s+/, ''),
                    wordGap = caseSensitive ? WORD_GAP.toLowerCase() :
                            WORD_GAP;
                // Check message was prepared
                if (value) {
                    // Iterate over each word
                    for (var i = 0; i < value.length; i++) {
                        // Insert word gap where appropriate
                        if (i > 0) {
                            ret += charGap;
                            if (!omitSpace) {
                                ret += wordGap + charGap;
                            }
                        }
                        // Iterate over each character of word
                        for (var j = 0; j < value[i].length; j++) {
                            // Insert character gap where appropriate
                            if (j > 0) {
                                ret += charGap;
                            }
                            // Retrieve first character matching the character
                            var ch = findChar(value[i][j], 0);
                            // Check if character is supported and translate it
                            if (ch) {
                                ret += translate(value[i][j], ch[1],
                                        caseSensitive, alphabet);
                            }
                        }
                    }
                }
                return ret;
            }, callback);
        },

        /**
         * <p>Run phony.js in <em>noConflict</em> mode, returning the
         * <code>phony</code> variable to its previous owner.</p>
         * @returns {Object} The <code>phony</code> object.
         * @public
         */
        noConflict: function () {
            root.phony = previousPhony;
            return this;
        },

        /**
         * <p>The current version of phony.js.</p>
         * @public
         * @type String
         */
        VERSION: '1.0.0'

    };

    // Export phony.js for Node.js and CommonJS
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = phony;
        }
        exports.phony = phony;
    } else if (typeof define === 'function' && define.amd) {
        define('phony', function () {
            return phony;
        });
    } else {
        root.phony = phony;
    }

}(this));