/**
 * Library for translating to/from the phonetic alphabet.
 *
 * @module phony
 * @version 1.2.0
 * @copyright Alasdair Mercer 2015
 * @license MIT
 */
(function(factory) {
  'use strict';

  /**
   * The root object that has been determined for the current environment (browser, server, <code>WebWorker</code>).
   *
   * @access private
   * @type {*}
   */
  var root = (typeof self === 'object' && self.self === self && self) ||
      (typeof global === 'object' && global.global === global && global);

  if (typeof define === 'function' && define.amd) {
    // Defines for AMD but also exports to root for those expecting global phony
    define(function() {
      root.phony = factory(root);

      return root.phony;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    // Supports Node.js and the CommonJS patterns
    exports = module.exports = factory(root);
  } else {
    // Falls back on browser support
    root.phony = factory(root);
  }
}(function(root) {
  'use strict';

  /**
   * A phonetic alphabet configuration.
   *
   * @typedef {Object} PhoneticAlphabet
   * @property {Object.<String, String>} characters - The map of characters and their phonetic counterparts.
   * @property {String} [fallback] - The name of the fallback alphabet.
   */

  /**
   * Options to be passed to the primary {@linkcode phony} methods.
   *
   * @typedef {Object} PhonyOptions
   * @property {String} [alphabet="itu"] - The default name of the alphabet to be used for the translation.
   * @property {String} [letterSplitter=" "] - The default string to be used to split alphabetic letters (may be passed
   * to <code>RegExp</code> constructor).
   * @property {String} [wordSplitter="space"] - The default string to be used to split words (may be passed to
   * <code>RegExp</code> constructor).
   */

  /**
   * The main <code>phony</code> object to be exported.
   *
   * @access public
   * @type {Object}
   * @alias module:phony
   */
  var phony = {};

  /**
   * The previous value of the <code>phony</code> variable.
   *
   * @access private
   * @type {*}
   */
  var previousPhony = root.phony;

  /**
   * Populates the specified <code>target</code> mapping with key/value pairs extracted from the character mapping from
   * the named alphabet those from the fallback chain, where applicable.
   * <p/>
   * The key/value pairs are determined by the return value of the <code>iterator</code> provided, which should provide
   * a simple two-element array where the first element will be used as the key and the second as the value. However,
   * that key/value pair will only be set on <code>target</code> if a previous alphabet hasn't already set the same
   * key.
   *
   * @param {String} name - the name of the alphabet to be built
   * @param {Function} iterator - iterator which will be passed a character and phonetic mapping and needs to return a
   * two-element array for the key/value mapping to be set on <code>target</code>
   * @param {Object.<String, String>} target - the mapping to be populated
   * @returns {Object.<String, String>} The populated <code>target</code>.
   * @access private
   */
  function buildAlphabet(name, iterator, target) {
    var alphabet = phony.alphabets[name];

    if (!alphabet) {
      return target;
    }

    each(alphabet.characters, function(character, phonetic) {
      var keyValue = iterator(character, phonetic);
      var key = keyValue[0];
      var value = keyValue[1];

      if (!target.hasOwnProperty(key)) {
        target[key] = value;
      }
    });

    buildAlphabet(alphabet.fallback, iterator, target);

    return target;
  }

  /**
   * Iterates over a given <code>object</code>.
   * <p/>
   * If <code>object</code> is an array, each element is yielded in turn to the specified <code>iterator</code>
   * function; otherwise this is done for the key/value mapping of the hash.
   *
   * @param {Array|Object} [object] - the object or array to be iterated over
   * @param {Function} iterator - the iterator function to be passed index/element if <code>object</code> is an array
   * or key/value if it is a hash
   * @returns {Array|Object} The specified <code>object</code>.
   * @access private
   */
  function each(object, iterator) {
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
  }

  /**
   * Returns the given <code>options</code> with all of the <code>defaults</code> applied.
   * <p/>
   * This function <i>will change</i> the specified <code>options</code>.
   *
   * @param {PhonyOptions} [options={}] - the options to be extended
   * @param {PhonyOptions} defaults - the default options
   * @returns {PhonyOptions} The specified <code>options</code> with modifications.
   * @access private
   */
  function getOptions(options, defaults) {
    options = options || {};

    for (var key in defaults) {
      if (typeof options[key] === 'undefined') {
        options[key] = defaults[key];
      }
    }

    options.alphabet = options.alphabet.toLocaleLowerCase();
    options.wordSplitter = options.wordSplitter.toLocaleLowerCase();

    return options;
  }

  /**
   * Prepares a given string to simplify translation.
   *
   * @param {String} str - the string to prepare
   * @param {String} [transformer] - the name of a <code>String.prototype</code> method to be used to transform
   * <code>str</code> prior to preparation
   * @param {String} wordSplitter - the string used to split words (will be passed to <code>RegExp</code> constructor)
   * @param {String} letterSplitter - the string used to split alphabetic letters
   * @returns {Array.<Array.<String>>} A multi-dimensional array of words and their alphabetic letters contained
   * within.
   * @access private
   */
  function prepare(str, transformer, wordSplitter, letterSplitter) {
    if (typeof str !== 'string') {
      throw new TypeError('Invalid value type: ' + typeof str);
    }

    if (transformer && typeof str[transformer] === 'function') {
      str = str[transformer]();
    }

    var rWordSplitter = new RegExp(wordSplitter + '|[\\n\\r]+', 'gi');
    var result = str.trim().split(rWordSplitter);

    each(result, function(word, i) {
      result[i] = word.split(letterSplitter);
    });

    return result;
  }

  /**
   * Transforms a given string in to title case.
   *
   * @param {String} str - the string to be transformed
   * @returns {String} <code>str</code> in title case form.
   * @access private
   */
  function toTitleCase(str) {
    return str[0].toLocaleUpperCase() + str.substring(1).toLocaleLowerCase();
  }

  /**
   * The current version of {@linkcode phony}.
   *
   * @access public
   * @static
   * @constant
   * @type {String}
   */
  phony.VERSION = '1.2.0';

  /**
   * The configurations for the initially supported phonetic alphabets.
   *
   * @access public
   * @static
   * @type {Object.<String, PhoneticAlphabet>}
   * @property {PhoneticAlphabet} ansi - The American National Standards Institute (ANSI) phonetic alphabet
   * configuration.
   * @property {PhoneticAlphabet} faa - The Federal Aviation Administration (FAA) phonetic alphabet configuration.
   * @property {PhoneticAlphabet} icao - The International Civil Aviation Organization (ICAO) phonetic alphabet
   * configuration.
   * @property {PhoneticAlphabet} itu - The International Telecommunication Union (ITU) phonetic alphabet
   * configuration.
   */
  phony.alphabets = {
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

  /**
   * The default values to be used when options are not specified or incomplete.
   *
   * @access public
   * @static
   * @type {PhonyOptions}
   */
  phony.defaults = {
    alphabet: 'itu',
    letterSplitter: ' ',
    wordSplitter: 'space'
  };

  /**
   * Translates the <code>message</code> provided <i>from</i> the phonetic alphabet.
   * <p/>
   * The message may not be translated correctly if the some of the options used to translate the message originally
   * are not the same as those in <code>options</code>.
   *
   * @param {String} [message=""] - the string to be translated from the phonetic alphabet
   * @param {PhonyOptions} [options={}] - the options to be used
   * @returns {String} The translation from the specified phonetic alphabet <code>message</code>.
   * @access public
   * @static
   */
  phony.from = function(message, options) {
    message = message || '';
    options = getOptions(options, phony.defaults);

    var result = '';
    var value = prepare(message, 'toLocaleLowerCase', options.wordSplitter, options.letterSplitter);

    // Ensures message was prepared successfully and that a valid alphabet was specified
    if (!value || !phony.alphabets[options.alphabet]) {
      return result;
    }

    var alphabet = buildAlphabet(options.alphabet, function(character, phonetic) {
      return [phonetic, character];
    }, {});

    // Iterates over each word
    each(value, function(word, i) {
      // Inserts space between each word
      if (i > 0) {
        result += ' ';
      }

      // Iterates over each phonetic representation in the word
      each(word, function(phonetic) {
        // Reverse engineers character from phonetic representation
        var character = alphabet[phonetic];

        // Checks if character is supported
        if (typeof character === 'string') {
          result += character;
        }
      });
    });

    return result;
  };

  /**
   * Translates the <code>message</code> provided <i>to</i> the phonetic alphabet.
   *
   * @param {String} [message=""] - the string to be translated to the phonetic alphabet
   * @param {PhonyOptions} [options={}] - the options to be used
   * @returns {String} The phonetic alphabet translation of the specified <code>message</code>.
   * @access public
   * @static
   */
  phony.to = function(message, options) {
    message = message || '';
    options = getOptions(options, phony.defaults);

    var letterSplitter = options.letterSplitter;
    var result = '';
    var value = prepare(message, 'toLocaleUpperCase', '\\s+', '');
    var wordSplitter = letterSplitter + toTitleCase(options.wordSplitter) + letterSplitter;

    // Ensures message was prepared successfully and that a valid alphabet was specified
    if (!value || !phony.alphabets[options.alphabet]) {
      return result;
    }

    var alphabet = buildAlphabet(options.alphabet, function(character, phonetic) {
      return [character, phonetic];
    }, {});

    // Iterates over each word
    each(value, function(word, i) {
      // Inserts wordSplitter option between each word
      if (i > 0) {
        result += wordSplitter;
      }

      // Iterates over each character in the word
      each(word, function(character, j) {
        // Reverse engineers character from phonetic representation
        var phonetic = alphabet[character];

        // Checks if phonetic representation is supported
        if (typeof phonetic === 'string') {
          // Inserts letterSplitter option between each character
          if (j > 0) {
            result += letterSplitter;
          }

          result += toTitleCase(phonetic);
        }
      });
    });

    return result;
  };

  /**
   * Runs phony in <i>no conflict</i> mode, returning the <code>phony</code> global variable to it's previous owner, if
   * any.
   *
   * @returns {Object} A reference to this {@linkcode phony}.
   * @access public
   * @static
   */
  phony.noConflict = function() {
    root.phony = previousPhony;

    return this;
  };

  return phony;
}));
