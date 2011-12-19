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

``` javascript
phony.from([data|message][, callback(error, result)])
phony.to([data|message][, callback(error, result)])
```

### First Argument

[Phony][] allows either a `data` object or string `message` to be passed as the
first argument. If a string is used all options will use their default value;
otherwise they can be set using the following properties;

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

``` javascript
phony.defineChar(character, translation[, callback(error)])
```

## Miscellaneous

``` javascript
phony.noConflict([callback(error)])
phony.ALPHABETS
phony.VERSION
```

## Bugs

If you have any problems with this library or would like to see the changes
currently in development you can do so here;

https://github.com/neocotic/phony.js/issues

Developers should run all tests in `test/index.html` and ensure they pass
before submitting a pull request.

## Questions?

Take a look at `docs/phony.html` to get a better understanding of what the code
is doing.

If that doesn't help, feel free to follow me on Twitter, [@neocotic][].

However, if you want more information or examples of using this library please
visit the project's homepage;

http://neocotic.com/phony.js

[@neocotic]: https://twitter.com/#!/neocotic
[phony]: http://neocotic.com/phony.js
[nato phonetic alphabet]: http://en.wikipedia.org/wiki/NATO_phonetic_alphabet