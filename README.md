           __                                                 
          /\ \                                   __           
     _____\ \ \___     ___    ___   __  __      /\_\    ____  
    /\ '__`\ \  _ `\  / __`\/' _ `\/\ \/\ \     \/\ \  /',__\ 
    \ \ \L\ \ \ \ \ \/\ \L\ \\ \/\ \ \ \_\ \  __ \ \ \/\__, `\
     \ \ ,__/\ \_\ \_\ \____/ \_\ \_\/`____ \/\_\_\ \ \/\____/
      \ \ \/  \/_/\/_/\/___/ \/_/\/_/`/___/> \/_/\ \_\ \/___/ 
       \ \_\                            /\___/  \ \____/      
        \/_/                            \/__/    \/___/       

[Phony][] is a pure JavaScript library for translating to/from the [NATO
phonetic alphabet][].

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

* `[alphabet]` - *Optional:* The phonetic alphabet to be used to translate the
  message (defaults to `"ITU"`).
  * This property is only used by `phony.to`.
* `[caseSensitive]` - *Optional:* Whether or not the translation should be case
  sensitive (defaults to `true`).
* `message` - The string to be translated.
* `[omitSpace]` - *Optional:* Whether or not words should be split up by
  "Space" (defaults to `false`).
  * This property is only used by `phony.to`.
* `[round]` - *Optional:* Whether or not hundreds and thousands should be
  rounded (defaults to `true`).


## Customization

### Define Character

```
phony.defineChar(character, translation[, callback])
```

## Miscellaneous

```
phony.noConflict([callback])
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

http://forchoon.com/projects/javascript/phony-js/

[phony]: http://forchoon.com/projects/javascript/phony-js/
[nato phonetic alphabet]: http://en.wikipedia.org/wiki/NATO_phonetic_alphabet