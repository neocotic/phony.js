// [phony.js](http://neocotic.com/phony.js) 1.0.1
//
// (c) 2011 Alasdair Mercer
//
// Freely distributable under the MIT license.
//
// For all details and documentation:
//
// <http://neocotic.com/phony.js>

(function(root) {

  'use strict';

  // Private variables
  // -----------------

  // Save the previous value of the `phony` variable.
  var previousPhony = root.phony;

  // Private functions
  // -----------------
  // Iterator over a given `object`.
  // If `object` is an array, yield each element in turn to an `iterator` function; otherwise do so for the key/value
  // mapping of the hash.
  var each = function(object, iterator) {
    if (!object) {
      return object;
    }

    var key;
    var index;
    var length = object.length;

    if (length === +length) {
      for (index = 0; index < length; index++) {
        iterator(object[index], index, object);
      }
    } else {
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          iterator(key, object[key], object);
        }
      }
    }

    return object;
  };

  // Return the character mapped to the specified `phonetic` from the alphabet with the given `name` where possible.
  // If the named alphabet does not contain a mapping for the phonetic but has a fallback alphabet, that alphabet will
  // be checked.
  var getAlphabetCharacter = function(name, phonetic) {
    var alphabet = alphabets[name];
    var character;

    if (alphabet) {
      each(alphabet.characters, function(ch, ph) {
        if (ph === phonetic) {
          character = ch;
        }
      });

      if (typeof character === 'undefined' && typeof alphabet.fallback !== 'undefined') {
        character = getAlphabetCharacter(alphabet.fallback, phonetic);
      }
    }

    return character;
  };

  // Return the phonetic mapped to the specified `character` from the alphabet with the given `name` where possible.
  // If the named alphabet does not contain a mapping for the character but has a fallback alphabet, that alphabet will
  // be checked.
  var getAlphabetPhonetic = function(name, character) {
    var alphabet = alphabets[name];
    var phonetic = alphabet[character];

    if (typeof phonetic === 'undefined' && alphabet && typeof alphabet.fallback !== 'undefined') {
      phonetic = getAlphabetPhonetic(alphabet.fallback, character);
    }

    return phonetic;
  };

  // Return the given `options` with all of the `defaults` applied.
  var getOptions = function(options, defaults) {
    options = options || {};

    for (var key in defaults) {
      if (typeof options[key] === 'undefined') {
        options[key] = defaults[key];
      }
    }

    options.alphabet      = options.alphabet.toLocaleLowerCase();
    options.wordDelimiter = options.wordDelimiter.toLocaleLowerCase();

    return options;
  };

  // Prepare the string to simplify translation.
  // The return value is a multi-dimensional array and should be treated as such.
  var prepare = function(str, wordSplitter, letterSplitter) {
    if (typeof str !== 'string') {
      throw new TypeError('Invalid value type: ' + typeof str);
    }

    var rWordSplitter = new RegExp(wordSplitter + '|[\\n\\r]+', 'g');
    var result        = str.trim().toLocaleLowerCase().split(rWordSplitter);

    each(result, function(word, i) {
      result[i] = word.split(letterSplitter);
    });

    return result;
  };

  // Transform a string in to title case.
  var toTitleCase = function(str) {
    return str[0].toLocaleUpperCase() + str.substring(1).toLocaleLowerCase();
  };

  // Alphabets
  // ---------

  // Map of characters supported initially and their phonetic alphabet counterparts.
  var alphabets = {
    ansi: {
      fallback: 'itu',
      characters: {
        'A': 'alpha',
        'J': 'juliet'
      }
    },

    faa: {
      fallback: 'itu',
      characters: {
        '0': 'zero',
        '1': 'one',
        '2': 'two',
        '3': 'three',
        '4': 'four',
        '5': 'five',
        '6': 'six',
        '7': 'seven',
        '8': 'eight',
        '9': 'nine'
      }
    },

    icao: {
      fallback: 'faa',
      characters: {
        '9': 'niner'
      }
    },

    itu: {
      characters: {
        'A': 'alfa',
        'B': 'bravo',
        'C': 'charlie',
        'D': 'delta',
        'E': 'echo',
        'F': 'foxtrot',
        'G': 'golf',
        'H': 'hotel',
        'I': 'india',
        'J': 'juliett',
        'K': 'kilo',
        'L': 'lima',
        'M': 'mike',
        'N': 'november',
        'O': 'oscar',
        'P': 'papa',
        'Q': 'quebec',
        'R': 'romeo',
        'S': 'sierra',
        'T': 'tango',
        'U': 'uniform',
        'V': 'victor',
        'W': 'whiskey',
        'X': 'x-ray',
        'Y': 'yankee',
        'Z': 'zulu',
        '0': 'nadazero',
        '1': 'unaone',
        '2': 'bissotwo',
        '3': 'terrathree',
        '4': 'kartefour',
        '5': 'pantafive',
        '6': 'soxisix',
        '7': 'setteseven',
        '8': 'oktoeight',
        '9': 'novenine',
        '.': 'stop',
        '-': 'dash'
      }
    }
  };

  // Phony setup
  // -----------

  // Build the publicly exposed API.
  var phony = {

    // Constants
    // ---------

    // Current version of `phony`.
    VERSION: '1.0.1',

    // Variables
    // ---------

    // Expose the available alphabets.
    alphabets: alphabets,

    // Default values to be used if no options are specified or are incomplete.
    defaults: {
      alphabet:       'itu',
      letterSplitter: ' ',
      wordSplitter:   'space'
    },

    // Primary functions
    // -----------------

    // Translate the `message` provided *from* the phonetic alphabet.
    // The message may not be translated correctly if the some of the options used to translate the message originally
    // are not the same as those in `options`.
    // If the `alphabet` option is not specified, the default alphabet will be used.
    from: function(message, options) {
      message = message || '';
      options = getOptions(options, phony.defaults);

      var result = '';
      var value  = prepare(message, options.wordSplitter, options.letterSplitter);

      // Ensure message was prepared successfully.
      if (!value) {
        return result;
      }

      // Iterate over each word.
      each(value, function(word, i) {
        // Insert space between each word.
        if (i > 0) {
          result += ' ';
        }

        // Iterate over each phonetic representation in the word.
        each(word, function(phonetic) {
          // Reverse engineer character from phonetic representation.
          var character = getAlphabetCharacter(options.alphabet, phonetic);

          // Check if character is supported.
          if (typeof character === 'string') {
            result += character;
          }
        });
      });

      return result;
    },

    // Translate the `message` provided *to* the phonetic alphabet.
    // If the `alphabet` option is not specified, the default alphabet will be used.
    to: function(message, options) {
      message = message || '';
      options = getOptions(options, phony.defaults);

      var result       = '';
      var value        = prepare(message, '\\s+', '');
      var wordSplitter = toTitleCase(options.wordSplitter);

      // Ensure message was prepared successfully.
      if (!value) {
        return result;
      }

      // Iterate over each word.
      each(value, function(word, i) {
        // Insert `wordSplitter` option between each word.
        if (i > 0) {
          result += wordSplitter;
        }

        // Iterate over each character in the word.
        each(word, function(character, j) {
          // Insert `letterSplitter` option between each character.
          if (j > 0) {
            result += options.letterSplitter;
          }

          // Reverse engineer character from phonetic representation.
          var phonetic = getAlphabetPhonetic(options.alphabet, character);

          // Check if phonetic representation is supported.
          if (typeof phonetic === 'string') {
            result += toTitleCase(phonetic);
          }
        });
      });

      return result;
    },

    // Utility functions
    // -----------------

    // Run phony.js in *noConflict* mode, returning the `phony` variable to its previous owner.
    // Returns a reference to `phony`.
    noConflict: function() {
      root.phony = previousPhony;

      return this;
    }

  };

  // Export `phony` for NodeJS and CommonJS.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = phony;
    }

    exports.phony = phony;
  } else if (typeof define === 'function' && define.amd) {
    define('phony', function() {
      return phony;
    });
  } else {
    root.phony = phony;
  }

})(this);