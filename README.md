# [phony.js](http://forchoon.com/projects/javascript/phony-js/)

A pure JavaScript library for translating to/from the [NATO phonetic
alphabet](http://en.wikipedia.org/wiki/NATO_phonetic_alphabet).

## Standard Usage

### Decode

```
phony.decode(data[, callback])
```

### Encode

```
phony.encode(data[, callback])
```

### Data Object

* *{String}* **message** - The message to be decoded/encoded.
* *{String}* **[mode]** - Optional: The mode to be used to decode/encode the
  message.

## Customization

### Define Character

```
phony.defineChar(character, pattern[, callback])
```

### Define Mode

```
phony.defineMode(name, characters[, callback])
```

## Miscellaneous

```
phony.noConflict()
```

```
phony.VERSION
```

## Further Information

If you want more information or examples of using this library please visit the
project's homepage;

<http://forchoon.com/projects/javascript/phony-js/>