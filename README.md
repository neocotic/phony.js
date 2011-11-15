# [phony.js](http://forchoon.com/projects/javascript/phony-js/)

A pure JavaScript library for translating to/from the [NATO phonetic
alphabet](http://en.wikipedia.org/wiki/NATO_phonetic_alphabet).

## Standard Usage

### Translate From...

```
phony.from(data[, callback])
```

### Translate To...

```
phony.to(data[, callback])
```

### Data Object

* *{String}* **[alphabet]** - Optional: The phonetic alphabet to be used to
  translate the message (defaults to `ITU`).
* *{Boolean}* **[caseSensitive]** - Optional: Whether or not the translation
  should be case sensitive (defaults to `true`).
* *{String}* **message** - The message to be translated.
* *{Boolean}* **[omitSpace]** - Optional: Whether or not words should be split
  up by "Space" (defaults to `false`).
  * This property is only used by `phony.to`.


## Customization

### Define Character

```
phony.defineChar(character, translation[, callback])
```

## Miscellaneous

```
phony.noConflict()
```

```
phony.ALPHABETS
```

```
phony.VERSION
```

## Further Information

If you want more information or examples of using this library please visit the
project's homepage;

<http://forchoon.com/projects/javascript/phony-js/>