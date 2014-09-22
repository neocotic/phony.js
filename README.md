           __
          /\ \                                   __
     _____\ \ \___     ___    ___   __  __      /\_\    ____
    /\ '__`\ \  _ `\  / __`\/' _ `\/\ \/\ \     \/\ \  /',__\
    \ \ \L\ \ \ \ \ \/\ \L\ \\ \/\ \ \ \_\ \  __ \ \ \/\__, `\
     \ \ ,__/\ \_\ \_\ \____/ \_\ \_\/`____ \/\_\_\ \ \/\____/
      \ \ \/  \/_/\/_/\/___/ \/_/\/_/`/___/> \/_/\ \_\ \/___/
       \ \_\                            /\___/  \ \____/
        \/_/                            \/__/    \/___/

[phony.js][0] is a pure JavaScript library for translating to/from the [NATO phonetic alphabet][3] that supports
extensible characters.

[![Build Status](https://travis-ci.org/neocotic/phony.js.svg?branch=develop)][1]
[![Dependency Status](https://gemnasium.com/neocotic/phony.js.svg)][4]
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)][5]

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

| Option        | Description                                              | Default |
| ------------- | -------------------------------------------------------- | ------- |
| alphabet      | Name of the alphabet to be used to translate the message | `"ITU"` |
| caseSensitive | Whether the translation should be case sensitive         | `true`  |
| omitSpace     | Whether words should be split up by `"Space"`            | `false` |
| round         | Whether hundreds and thousands should be rounded         | `true`  |

It's important to note that the same options should be used in order for bidirectional translations to work.

### `to(message[, options])`

Translates the `message` parameter *to* the phonetic alphabet.

``` javascript
console.log(phony.to('SOS')); // "Sierra Oscar Sierra"
```

### `from(message[, options])`

Translates the `message` parameter *from* the phonetic alphabet.

``` javascript
console.log(phony.from('Sierra Oscar Sierra')); // "SOS"
```

### Customization

#### `ALPHABETS`

TODO: Document

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
console.log(phony.VERSION); // "1.0.1"
```

## Bugs

If you have any problems with this library or would like to see changes currently in development you can do so
[here][6].

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in [CONTRIBUTING.md][8]. We
want your suggestions and pull requests!

A list of [phony.js][0] contributors can be found in [AUTHORS.md][7].

## License

Copyright (c) 2011 Alasdair Mercer

See [LICENSE.md][9] for more information on our MIT license.

[0]: http://neocotic.com/phony.js
[1]: https://travis-ci.org/neocotic/phony.js
[2]: https://twitter.com/neocotic
[3]: https://en.wikipedia.org/wiki/NATO_phonetic_alphabet
[4]: https://gemnasium.com/neocotic/phony.js
[5]: http://gruntjs.com
[6]: https://github.com/neocotic/phony.js/issues
[7]: https://github.com/neocotic/phony.js/blob/master/AUTHORS.md
[8]: https://github.com/neocotic/phony.js/blob/master/CONTRIBUTING.md
[9]: https://github.com/neocotic/phony.js/blob/master/LICENSE.md