```
       __
      /\ \
 _____\ \ \___     ___    ___   __  __
/\ '__`\ \  _ `\  / __`\/' _ `\/\ \/\ \
\ \ \L\ \ \ \ \ \/\ \L\ \\ \/\ \ \ \_\ \
 \ \ ,__/\ \_\ \_\ \____/ \_\ \_\/`____ \
  \ \ \/  \/_/\/_/\/___/ \/_/\/_/`/___/> \
   \ \_\                            /\___/
    \/_/                            \/__/
```

[phony.js][0] is a pure JavaScript library for translating to/from the [NATO phonetic alphabet][3] that supports
extensible characters.

[![Build Status](https://img.shields.io/travis/neocotic/phony.js/develop.svg?style=flat-square)][1]
[![Code Climate](https://img.shields.io/codeclimate/github/neocotic/phony.js.svg?style=flat-square)][10]
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/neocotic/phony.js.svg?style=flat-square)][11]
[![Dependency Status](https://img.shields.io/david/dev/neocotic/phony.js.svg?style=flat-square)][4]
[![License](https://img.shields.io/github/license/neocotic/phony.js.svg?style=flat-square)][9]
[![Release](https://img.shields.io/github/tag/neocotic/phony.js.svg?style=flat-square)][5]

## Install

Install using the package manager for your desired environment(s):

``` bash
# for node.js:
$ npm install node-phony
# OR; for the browser:
$ bower install phony
```

This library has no dependencies on any other library.

## Usage

The API has been completely redesigned to simplify translating to and from the phonetic alphabet by simply passing a
string to the `to` and `from` functions respectively.

Both of which also accept an optional `options` parameter which can currently contain the following (all of which are
optional themselves):

| Option         | Description                                              | Default   |
| -------------- | -------------------------------------------------------- | --------- |
| alphabet       | Name of the alphabet to be used to translate the message | `"itu"`   |
| letterSplitter | Sequence of characters to split letters                  | `" "`     |
| wordSplitter   | Sequence of characters to split words                    | `"space"` |

It's important to note that the same options should be used in order for bidirectional translations to work. Some of
these strings are used to build regular expressions (or can be regular expressions), so it's recommended to
familiarized yourself with the usage of the options before change them, just so you know on which you need to escape
any `RegExp` special characters.

### `to(message[, options])`

Translates the `message` parameter *to* the phonetic alphabet.

``` javascript
phony.to('SOS');
//=> "Sierra Oscar Sierra"
```

### `from(message[, options])`

Translates the `message` parameter *from* the phonetic alphabet.

``` javascript
phony.from('Sierra Oscar Sierra');
//=> "SOS"
```

### Customization

#### `alphabets`

Alphabets are key to translating messages to and from the phonetic alphabet as they contain characters use to find and
replace phonetic representations in the message. Alphabets can declare fallback alphabets so that, if it does not
contain a matching character or phonetic representation, it will attempt to look it up from the fallback alphabet, and
so on. For this reason, if you plan on creating a custom alphabet, it's recommended that you always specify a fallback
alphabet.

Here's a list of the built in alphabets:

- ansi
- faa
- icao
- itu (default)

Adding a new alphabet is as simple as the following:

``` javascript
phony.alphabets.foo = {
  fallback: 'itu',
  characters: {
    'H': 'hello',
    'W': 'world'
  }
};

var options = {alphabet: 'foo'};

phony.to('how', options);
//=> "Hello Oscar World"
phony.from('Hello Oscar World', options);
//=> "HOW"
```

#### `defaults`

This is a hash of default values to be applied to the optional `options` parameter and exposed to allow you to override
any of them.

``` javascript
phony.defaults.alphabet = 'ANSI';

phony.to('A');
//=> "Alpha"
```

### Miscellaneous

#### `noConflict()`
Returns `phony` in a no-conflict state, reallocating the `phony` global variable name to its previous owner, where
possible.

This is really just intended for use within a browser.

``` html
<script src="/path/to/conflict-lib.js"></script>
<script src="/path/to/phony.min.js"></script>
<script>
  var phonyNC = phony.noConflict();
  // Conflicting lib works again and use phonyNC for this library onwards...
</script>
```

#### `VERSION`
The current version of `phony`.

``` javascript
phony.VERSION;
//=> "1.2.0"
```

## Bugs

If you have any problems with this library or would like to see changes currently in development you can do so
[here][6].

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in [CONTRIBUTING.md][8]. We
want your suggestions and pull requests!

A list of [phony.js][0] contributors can be found in [AUTHORS.md][7].

## License

Copyright (c) 2015 Alasdair Mercer

See [LICENSE.md][9] for more information on our MIT license.

[0]: http://neocotic.com/phony.js
[1]: https://travis-ci.org/neocotic/phony.js
[2]: https://twitter.com/neocotic
[3]: https://en.wikipedia.org/wiki/NATO_phonetic_alphabet
[4]: https://david-dm.org/neocotic/phony.js
[5]: https://github.com/neocotic/phony.js
[6]: https://github.com/neocotic/phony.js/issues
[7]: https://github.com/neocotic/phony.js/blob/master/AUTHORS.md
[8]: https://github.com/neocotic/phony.js/blob/master/CONTRIBUTING.md
[9]: https://github.com/neocotic/phony.js/blob/master/LICENSE.md
[10]: https://codeclimate.com/github/neocotic/phony.js
[11]: https://codeclimate.com/github/neocotic/phony.js/coverage
