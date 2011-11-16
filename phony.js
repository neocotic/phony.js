// [phony.js](http://forchoon.com/projects/javascript/phony-js/) 1.0.0
// (c) 2011 Alasdair Mercer
// Licensed under the GPL Version 3 license.
// For all details and documentation:
// http://neocotic.github.com/phony.js

(function (root) {

  // Private constants
  // ---------

  var
    // Indices used to map phonetic alphabets to supported characters.
    ALPHABETS        = { ANSI : 3, FAA  : 2, ICAO : 1, ITU  : 0 },

    // Separator inserted between phonetic representations.
    CHAR_GAP         = '\u0020',

    // Default alphabet used if not specified or found is International
    // Telecommunication Union (ITU).
    DEFAULT_ALPHABET = 'ITU',

    // Easy access to the rounded representation of a number in the hundreds.
    HUNDRED          = 'Hundred',

    // Regular expression used to match decimal numbers.
    // If a decimal number is found rounding should not be performed.
    R_DECIMAL        = /([\d,]+)\.(\d+)$/,

    // Regular expression used to match numbers in their hundreds for
    // rounding.
    R_HUNDRED        = /^([1-9])0{2}$/,

    // Regular expression used to match numbers in their thousands for
    // rounding.
    R_THOUSAND       = /^([1-9]\d{0,2}),?(\d{3})$/,

    // Easy access to the rounded representation of a number in the
    // thousands.
    THOUSAND         = 'Thousand',

    // Separator inserted between a grouping of phonetic representations that
    // form a word.
    WORD_GAP         = 'Space';

  // Private variables
  // ---------

  var
    // Map of supported characters to their phonetic alphabet counterparts.
    // This is a multi-dimensional array and should be treated as such
    chars         = [
    /* Char(s) | ITU         | ICAO   | FAA    | ANSI                      */
    /* Letters                                                             */
      ['\u0041', ['Alfa',       null,    null,    'Alpha' ]], /* A         */
      ['\u0042',  'Bravo'                                  ], /* B         */
      ['\u0043',  'Charlie'                                ], /* C         */
      ['\u0044',  'Delta'                                  ], /* D         */
      ['\u0045',  'Echo'                                   ], /* E         */
      ['\u0046',  'Foxtrot'                                ], /* F         */
      ['\u0047',  'Golf'                                   ], /* G         */
      ['\u0048',  'Hotel'                                  ], /* H         */
      ['\u0049',  'India'                                  ], /* I         */
      ['\u004A', ['Juliett',    null,    null,    'Juliet']], /* J         */
      ['\u004B',  'Kilo'                                   ], /* K         */
      ['\u004C',  'Lima'                                   ], /* L         */
      ['\u004D',  'Mike'                                   ], /* M         */
      ['\u004E',  'November'                               ], /* N         */
      ['\u004F',  'Oscar'                                  ], /* O         */
      ['\u0050',  'Papa'                                   ], /* P         */
      ['\u0051',  'Quebec'                                 ], /* Q         */
      ['\u0052',  'Romeo'                                  ], /* R         */
      ['\u0053',  'Sierra'                                 ], /* S         */
      ['\u0054',  'Tango'                                  ], /* T         */
      ['\u0055',  'Uniform'                                ], /* U         */
      ['\u0056',  'Victor'                                 ], /* V         */
      ['\u0057',  'Whiskey'                                ], /* W         */
      ['\u0058',  'X-ray'                                  ], /* X         */
      ['\u0059',  'Yankee'                                 ], /* Y         */
      ['\u005A',  'Zulu'                                   ], /* Z         */
    /* Numbers                                                             */
      ['\u0030', ['Nadazero',   null,    'Zero'           ]], /* 0         */
      ['\u0031', ['Unaone',     null,    'One'            ]], /* 1         */
      ['\u0032', ['Bissotwo',   null,    'Two'            ]], /* 2         */
      ['\u0033', ['Terrathree', null,    'Three'          ]], /* 3         */
      ['\u0034', ['Kartefour',  null,    'Four'           ]], /* 4         */
      ['\u0035', ['Pantafive',  null,    'Five'           ]], /* 5         */
      ['\u0036', ['Soxisix',    null,    'Six'            ]], /* 6         */
      ['\u0037', ['Setteseven', null,    'Seven'          ]], /* 7         */
      ['\u0038', ['Oktoeight',  null,    'Eight'          ]], /* 8         */
      ['\u0039', ['Novenine',   'Niner', 'Nine'           ]], /* 9         */
    /* Rounding                                                            */
      ['\u0030'+
       '\u0030',  'Hundred'                                ], /* 00        */
      ['\u0030'+
       '\u0030'+
       '\u0030',  'Thousand'                               ], /* 000       */
    /* Punctuation                                                         */
      ['\u002E',  'Stop'                                   ], /* Full stop */
      ['\u002E', ['Decimal',    null,    'Point'          ]], /* Full stop */
      ['\u002D',  'Dash'                                   ]  /* Hyphen    */
    ],

    // Save the previous value of the `phony` variable.
    previousPhony = root.phony;

  // Private functions
  // -----------------

  // Determine the case of a string through comparison.
  // Possible return values:
  // * `-1` - Lower case
  // * `0` - N/A (use title case)
  // * `1` - Upper case
  function compareCase(str) {
    switch (str) {
    case str.toLowerCase(): return -1;
    case str.toUpperCase(): return 1;
    default               : return 0;
    }
  }

  // Return the index of the specified alphabet.
  // If no alphabet is specified, or no matching alphabet could be found, the
  // index of `DEFAULT_ALPHABET` will be returned.
  function findAlphabet(name) {
    if (typeof name === 'string') {
      // `name` is case-insensitive.
      name = name.toUpperCase();
      if (typeof ALPHABETS[name] === 'number') return ALPHABETS[name];
    }
    return ALPHABETS[DEFAULT_ALPHABET];
  }

  // Return the character mapping that matches the query provided.
  function findChar(query, index, ignores) {
    // Setup the the number of results to be ignored before a match should be
    // returned.
    var ignored = 0;
    if (typeof ignores !== 'number' || ignores < 0) ignores = 0;
    // `query` is case-insensitive.
    query = query.toUpperCase();
    for (var i = 0; i < chars.length; i++) {
      // If element is string simply compare against query.
      if (typeof chars[i][index] === 'string') {
        if (chars[i][index].toUpperCase() === query) {
          // Return if ignored necessary matches; otherwise skip.
          if (ignored >= ignores) return chars[i];
          ignored++;
        }
      } else {
        // If element is array compare query against all elements.
        for (var j = 0; j < chars[i][index].length; j++) {
          if (chars[i][index][j] &&
              chars[i][index][j].toUpperCase() === query) {
            // Return if ignored necessary matches; otherwise skip.
            if (ignored >= ignores) return chars[i];
            ignored++;
            break;
          }
        }
      }
    }
  }

  // Prepare the string to simplify translation.
  // The return value is a multi-dimensional array and should be treated as
  // such.
  function prepare(str, wordSplitter, letterSplitter) {
    if (typeof str !== 'string') {
      throw new TypeError('Invalid value type: ' + typeof str);
    }
    var ret = str.trim().split(wordSplitter);
    for (var i = 0; i < ret.length; i++) {
      ret[i] = ret[i].split(letterSplitter);
    }
    return ret;
  }

  // Safely handle cases where synchronization methodology may vary.
  // In cases where a callback function was specified it should be used to pass
  // the return value of the function provided or any errors that were thrown
  // during the process. Either the return value of the callback function or
  // the error encountered will be returned here.
  // Otherwise; errors will be thrown as normal and the return value of the
  // function will simply be returned.
  // When the function provided is called the specified context will be
  // applied.
  function syncSafe(fn, ctx, cb) {
    try {
      var ret = fn.apply(ctx);
      // All went OK, so handle result.
      if (typeof cb === 'function') return cb(null, ret);
      return ret;
    } catch (e) {
      // Something went wrong, so bubble the error.
      if (typeof cb === 'function') return cb(e);
      throw e;
    }
  }

  // Transform a string in to title case.
  function toTitleCase(str) {
    return str[0].toUpperCase() + str.substring(1).toLowerCase();
  }

  // Translate a matched string to/from the phonetic alphabet.
  // If a specific alphabet is provided an attempt will be made to use its
  // variation but will fall back on the default representation if not found.
  function translate(original, matched, caseSensitive, alphabet) {
    // Single translation found so just check case and return it.
    if (typeof matched === 'string') {
      if (caseSensitive && compareCase(original) === -1) {
        matched = matched.toLowerCase();
      }
      return matched;
    }
    // Multiple translations found so determine best match and use that.
    var str = (matched.length > alphabet) ? matched[alphabet] : matched[0];
        str = str || matched[0];
    return translate(original, str || '', caseSensitive);
  }

  // Validate a translation included in a user-defined character mapping.
  // The return value will be the normalised version of the translation and any
  // problems with the validation will be thrown as errors.
  function validateTranslation(translation, nullCheck) {
    // `translation` can only be a single word string.
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

  // Phony setup
  // -----------

  // Build the publicly exposed API.
  var phony = {

    // Constants
    // ----------------

    // Acronyms of the supported phonetic alphabets.
    ALPHABETS: (function () {
      var ret = [];
      for (var prop in ALPHABETS) {
        if (ALPHABETS.hasOwnProperty(prop)) ret.push(prop);
      }
      return ret;
    }()),

    // Current version of `phony`.
    VERSION: '1.0.0',

    // Translation functions
    // ---------------------

    // Translate the message from the phonetic alphabet.
    // No specific alphabet is required by this function as it will search all
    // possible translations for a match.
    // Optionally, a callback function can be provided which will be called
    // with the result as the second argument. If an error occurs it will be
    // passed as the first argument to this function, otherwise this argument
    // will be `null`.
    from: function (data, callback) {
      return syncSafe(function () {
        data = data || {};
        var
          alphabet      = findAlphabet(),
          caseSensitive = (typeof data.caseSensitive === 'undefined') ? true :
                              data.caseSensitive,
          charGap       = caseSensitive ? CHAR_GAP.toLowerCase() : CHAR_GAP,
          ret           = '',
          round         = (typeof data.round === 'undefined') ? true :
                              data.round,
          value         = data.message || '',
          wordGap       = caseSensitive ? WORD_GAP.toLowerCase() : WORD_GAP;
        value = prepare(value, new RegExp(wordGap, 'i'), new RegExp(charGap,
            'i'));
        // Ensure message was prepared successfully.
        if (value) {
          // Iterate over each word.
          for (var i = 0; i < value.length; i++) {
            // Insert space between each word.
            if (i > 0) ret += ' ';
            // Iterate over each character of word.
            for (var j = 0; j < value[i].length; j++) {
              // Retrieve first matching character.
              var ch = findChar(value[i][j], 1);
              // Check if character is supported.
              if (ch) {
                if (!round ||
                   (ch[1] !== THOUSAND || j === value[i].length - 1)) {
                  ret += translate(value[i][j], ch[0], caseSensitive,
                      alphabet);
                }
              }
            }
          }
        }
        return ret;
      }, this, callback);
    },

    // Translate the message provided to the phonetic alphabet.
    // If no alphabet is specified then the default alphabet will be used.
    // Optionally, a callback function can be provided which will be called
    // with the result as the second argument. If an error occurs it will be
    // passed as the first argument to this function, otherwise this argument
    // will be `null`.
    to: function (data, callback) {
      return syncSafe(function () {
        data = data || {};
        var
          alphabet      = findAlphabet(data.alphabet),
          caseSensitive = (typeof data.caseSensitive === 'undefined') ? true :
                              data.caseSensitive,
          charGap       = caseSensitive ? CHAR_GAP.toLowerCase() : CHAR_GAP,
          omitSpace     = !!data.omitSpace,
          ret           = '',
          round         = (typeof data.round === 'undefined') ? true :
                              data.round,
          value         = prepare(data.message || '', /\s+/, ''),
          wordGap       = caseSensitive ? WORD_GAP.toLowerCase() : WORD_GAP;

        // Translate the word while providing special treatment for certain
        // cases (e.g. decimal and/or round numbers).
        function handleWord(word, ignoreSpecials) {
          // Check for special cases.
          if (!ignoreSpecials) {
            var
              matches = [],
              str     = (typeof word === 'string') ? word : word.join('');
            // Handle decimal numbers as expected. We wouldn't want "one stop
            // zero" (i.e. kamikaze) now would we? We'd want "one point zero".
            if (R_DECIMAL.test(str)) {
              matches = str.match(R_DECIMAL);
              if (matches && matches.length === 3) {
                handleWord(matches[1].replace(/,/g, ''), true);
                ret += charGap;
                ret += translate('\u002E', findChar('\u002E', 0, 1)[1],
                    caseSensitive, alphabet);
                ret += charGap;
                handleWord(matches[2], true);
                return;
              }
            }
            if (round) {
              // Handle rounded hundreds, but only when exact (e.g. `100`,
              // `900` but not `101` or `880`). Also, "zero hundred" wouldn't
              // make any sense so it's ignored.
              if (R_HUNDRED.test(str)) {
                matches = str.match(R_HUNDRED);
                if (matches && matches.length === 2) {
                  handleWord(matches[1], true);
                  ret += charGap;
                  ret += translate(HUNDRED.toLowerCase(), HUNDRED,
                      caseSensitive, alphabet);
                  return;
                }
              }
              // Handle rounded thousands, but millions can forget about it.
              // Like hundreds, rounded thousands can't begin with zero, it
              // just wouldn't make any sense.
              // Comma-separated thousands are supported the comma position
              // must be valid or it won't be rounded.
              if (R_THOUSAND.test(str)) {
                matches = str.match(R_THOUSAND);
                if (matches && matches.length === 3) {
                  handleWord(matches[1]);
                  ret += charGap;
                  ret += translate(THOUSAND.toLowerCase(), THOUSAND,
                      caseSensitive, alphabet);
                  if (matches[2] !== '000') {
                    ret += charGap;
                    handleWord(matches[2]);
                  }
                  return;
                }
              }
            }
          }
          // Iterate over each character of word.
          for (var j = 0; j < word.length; j++) {
            // Retrieve first character matching the character.
            var ch = findChar(word[j], 0);
            // Check if character is supported and translate it.
            if (ch) {
              // Insert character separator where appropriate.
              if (j > 0) ret += charGap;
              ret += translate(word[j], ch[1], caseSensitive, alphabet);
            }
          }
        }

        // Ensure message was prepared successfully.
        if (value) {
          // Iterate over each word grouping.
          for (var i = 0; i < value.length; i++) {
            // Insert word-grouping separator where appropriate.
            if (i > 0) {
              ret += charGap;
              if (!omitSpace) ret += wordGap + charGap;
            }
            handleWord(value[i]);
          }
        }
        return ret;
      }, this, callback);
    },

    // Customization functions
    // -----------------------

    // Map a new translation to the character provided.
    // If a mapping already exists for the specified character, that mapping
    // will be modified.
    // If `translation` is an array, its elements should be specified in the
    // following order;
    // * ITU
    // * ICAO
    // * FAA
    // * ANSI
    // Use `null` to fill the gaps and feel free to leave off any unused
    // alphabet translations from the end.
    // Optionally, a callback function can be provided which will be called
    // when the character has been defined. If an error occurs it will be
    // passed as the first argument to this function, otherwise this argument
    // will be `null`.
    defineChar: function (character, translation, callback) {
      return syncSafe(function () {
        // Type-check arguments provided.
        if (typeof character !== 'string') {
          throw new TypeError('Invalid character type: ' + typeof character);
        } else if (typeof translation !== 'string' ||
                  (typeof translation !== 'object' ||
                          typeof translation.length !== 'number')) {
          throw new TypeError('Invalid translation type: ' +
              typeof translation);
        }
        // `character` must be singular.
        if (character.length > 1) {
          throw new Error('Invalid character length: ' + character.length);
        }
        // `translation` must be single word or contain only single words.
        if (typeof translation === 'string') {
          translation = validateTranslation(translation);
        } else {
          for (var i = 0; i < translation.length; i++) {
            translation[i] = validateTranslation(translation[i], true);
            if (i === 0 && !translation[i]) {
              throw new Error('Invalid default translation: ' + transation[i]);
            }
          }
        }
        // Update existing character mapping or create new one.
        character = character.toUpperCase();
        var existingChar = findChar(character, 0);
        if (existingChar) {
          existingChar[1] = translation;
        } else {
          chars.push([character, translation]);
        }
      }, this, callback);
    },

    // Utility functions
    // -----------------

    // Run phony.js in *noConflict* mode, returning the `phony` variable to its
    // previous owner.
    // Returns a reference to `phony`.
    // Optionally, a callback function can be provided which will be called
    // when the character has been defined. If an error occurs it will be
    // passed as the first argument to this function, otherwise this argument
    // will be `null`.
    noConflict: function (callback) {
      return syncSafe(function () {
        root.phony = previousPhony;
        return this;
      }, this, callback);
    }

  };

  // Export `phony` for Node.js and CommonJS.
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