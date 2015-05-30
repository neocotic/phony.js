'use strict';

var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var q = require('q');

var phony = require('../phony');

/**
 * The regular expression used to find and replace EOL characters.
 *
 * @type {RegExp}
 */
var rEOL = /[\n\r]+/g;

/**
 * Loads the contents of a test fixture asynchronously.
 *
 * @param {String} filePath - the path to the file of the test fixture to be loaded
 * @returns {q.Promise} A promise to track the file loading.
 */
function loadFixture(filePath) {
  filePath = path.join('test', 'fixtures', filePath);

  return q.nfcall(fs.readFile, filePath, {encoding: 'utf8'})
  .then(function(fixture) {
    return fixture.trim();
  });
}

describe('phony', function() {
  it('should be exported as an object', function() {
    expect(phony).to.be.an(Object);
  });

  describe('.alphabets', function() {
    afterEach(function() {
      delete phony.alphabets.foo;
    });

    it('should return a map of available alphabets', function() {
      expect(phony.alphabets).to.be.an(Object);
      expect(phony.alphabets).to.only.have.keys([
        'ansi',
        'faa',
        'icao',
        'itu'
      ]);
    });

    it('should have the "ansi" alphabet correctly defined', function() {
      var alphabet = phony.alphabets.ansi;

      expect(alphabet).to.be.an(Object);
      expect(alphabet.characters).to.be.an(Object);
      expect(alphabet.characters).not.to.be.empty();
      expect(alphabet.fallback).to.be('itu');
    });

    it('should have the "faa" alphabet correctly defined', function() {
      var alphabet = phony.alphabets.faa;

      expect(alphabet).to.be.an(Object);
      expect(alphabet.characters).to.be.an(Object);
      expect(alphabet.characters).not.to.be.empty();
      expect(alphabet.fallback).to.be('itu');
    });

    it('should have the "icao" alphabet correctly defined', function() {
      var alphabet = phony.alphabets.icao;

      expect(alphabet).to.be.an(Object);
      expect(alphabet.characters).to.be.an(Object);
      expect(alphabet.characters).not.to.be.empty();
      expect(alphabet.fallback).to.be('faa');
    });

    it('should have the "itu" alphabet correctly defined', function() {
      var alphabet = phony.alphabets.itu;

      expect(alphabet).to.be.an(Object);
      expect(alphabet).not.to.have.property('fallback');
      expect(alphabet.characters).to.be.an(Object);
      expect(alphabet.characters).not.to.be.empty();
    });

    it('should be exensible', function() {
      var options = {alphabet: 'foo'};

      expect(phony.alphabets).not.to.have.key('foo');

      phony.alphabets.foo = {
        fallback: 'itu',
        characters: {
          'F': 'feck',
          'O': 'off'
        }
      };

      expect(phony.to('FOO', options)).to.be('Feck Off Off');

      expect(phony.from('Feck Off Off', options)).to.be('FOO');
    });
  });

  describe('.defaults', function() {
    it('should be defined correctly', function() {
      expect(phony.defaults).to.be.an(Object);
      expect(phony.defaults).to.have.property('alphabet', 'itu');
      expect(phony.defaults).to.have.property('letterSplitter', ' ');
      expect(phony.defaults).to.have.property('wordSplitter', 'space');
    });
  });

  describe('.from', function() {
    it('should return an empty string if no message is provided', function() {
      expect(phony.from('')).to.be('');
    });

    it('should return an empty string if the message is empty', function() {
      expect(phony.from('')).to.be('');
      expect(phony.from('   ')).to.be('');
      expect(phony.from('  \n  \r  ')).to.be('');
    });

    it('should return an empty string if the alphabet does not exist', function() {
      expect(phony.from('Echo', {alphabet: 'foo'})).to.be('');
    });

    it('should ignore case', function() {
      expect(phony.from('iNdIa SpAcE cHaRlIe')).to.be('I C');
    });

    it('should ignore case for alphabet option', function() {
      expect(phony.from('Alpha Bravo Charlie', {alphabet: 'ANSI'})).to.be('ABC');
    });

    it('should throw an error if message is not a string', function() {
      expect(phony.from).withArgs(true).to.throwError();
    });

    it('should translate using the splitter options', function() {
      var options = {letterSplitter: '_', wordSplitter: '\\+'};

      expect(phony.from([
        'Alfa_Juliett_Zulu',
        'Nadazero_Dash_Novenine'
      ].join('_+_'), options)).to.be('AJZ 0-9');
    });

    it('should translate using "itu" alphabet by default', function() {
      expect(phony.from([
        'Alfa Juliett Zulu',
        'Nadazero Dash Novenine'
      ].join(' Space '))).to.be('AJZ 0-9');
    });

    it('should translate using "ansi" alphabet correctly', function(done) {
      var options = {alphabet: 'ansi'};

      expect(phony.from([
        'Alpha Juliet Zulu',
        'Nadazero Dash Novenine'
      ].join(' Space '), options)).to.be('AJZ 0-9');

      q.spread([loadFixture('ansi.txt'), loadFixture('characters.txt')], function(source, target) {
        expect(phony.from(source, options)).to.be(target.replace(rEOL, ' '));
      })
      .then(done)
      .done();
    });

    it('should translate using "faa" alphabet correctly', function(done) {
      var options = {alphabet: 'faa'};

      expect(phony.from([
        'Alfa Juliett Zulu',
        'Zero Dash Nine'
      ].join(' Space '), options)).to.be('AJZ 0-9');

      q.spread([loadFixture('faa.txt'), loadFixture('characters.txt')], function(source, target) {
        expect(phony.from(source, options)).to.be(target.replace(rEOL, ' '));
      })
      .then(done)
      .done();
    });

    it('should translate using "icao" alphabet correctly', function(done) {
      var options = {alphabet: 'icao'};

      expect(phony.from([
        'Alfa Juliett Zulu',
        'Zero Dash Niner'
      ].join(' Space '), options)).to.be('AJZ 0-9');

      q.spread([loadFixture('icao.txt'), loadFixture('characters.txt')], function(source, target) {
        expect(phony.from(source, options)).to.be(target.replace(rEOL, ' '));
      })
      .then(done)
      .done();
    });

    it('should translate using "itu" alphabet correctly', function(done) {
      var options = {alphabet: 'itu'};

      expect(phony.from([
        'Alfa Juliett Zulu',
        'Nadazero Dash Novenine'
      ].join(' Space '), options)).to.be('AJZ 0-9');

      q.spread([loadFixture('itu.txt'), loadFixture('characters.txt')], function(source, target) {
        expect(phony.from(source, options)).to.be(target.replace(rEOL, ' '));
      })
      .then(done)
      .done();
    });
  });

  describe('.to', function() {
    it('should return an empty string if no message is provided', function() {
      expect(phony.to('')).to.be('');
    });

    it('should return an empty string if the message is empty', function() {
      expect(phony.to('')).to.be('');
      expect(phony.to('   ')).to.be('');
      expect(phony.to('  \n  \r  ')).to.be('');
    });

    it('should return an empty string if the alphabet does not exist', function() {
      expect(phony.to('foo', {alphabet: 'foo'})).to.be('');
    });

    it('should ignore case', function() {
      expect(phony.to('i C')).to.be('India Space Charlie');
    });

    it('should ignore case for alphabet option', function() {
      expect(phony.to('abc', {alphabet: 'ANSI'})).to.be('Alpha Bravo Charlie');
    });

    it('should throw an error if message is not a string', function() {
      expect(phony.to).withArgs(true).to.throwError();
    });

    it('should translate using the splitter options', function() {
      var options = {letterSplitter: '_', wordSplitter: '+'};

      expect(phony.to('AJZ 0-9', options)).to.be([
        'Alfa_Juliett_Zulu',
        'Nadazero_Dash_Novenine'
      ].join('_+_'));
    });

    it('should translate using "itu" alphabet by default', function() {
      expect(phony.to('AJZ 0-9')).to.be([
        'Alfa Juliett Zulu',
        'Nadazero Dash Novenine'
      ].join(' Space '));
    });

    it('should translate using "ansi" alphabet correctly', function(done) {
      var options = {alphabet: 'ansi'};

      expect(phony.to('AJZ 0-9', options)).to.be([
        'Alpha Juliet Zulu',
        'Nadazero Dash Novenine'
      ].join(' Space '));

      q.spread([loadFixture('characters.txt'), loadFixture('ansi.txt')], function(source, target) {
        expect(phony.to(source, options)).to.be(target.replace(rEOL, ' Space '));
      })
      .then(done)
      .done();
    });

    it('should translate using "faa" alphabet correctly', function(done) {
      var options = {alphabet: 'faa'};

      expect(phony.to('AJZ 0-9', options)).to.be([
        'Alfa Juliett Zulu',
        'Zero Dash Nine'
      ].join(' Space '));

      q.spread([loadFixture('characters.txt'), loadFixture('faa.txt')], function(source, target) {
        expect(phony.to(source, options)).to.be(target.replace(rEOL, ' Space '));
      })
      .then(done)
      .done();
    });

    it('should translate using "icao" alphabet correctly', function(done) {
      var options = {alphabet: 'icao'};

      expect(phony.to('AJZ 0-9', options)).to.be([
        'Alfa Juliett Zulu',
        'Zero Dash Niner'
      ].join(' Space '));

      q.spread([loadFixture('characters.txt'), loadFixture('icao.txt')], function(source, target) {
        expect(phony.to(source, options)).to.be(target.replace(rEOL, ' Space '));
      })
      .then(done)
      .done();
    });

    it('should translate using "itu" alphabet correctly', function(done) {
      var options = {alphabet: 'itu'};

      expect(phony.to('AJZ 0-9', options)).to.be([
        'Alfa Juliett Zulu',
        'Nadazero Dash Novenine'
      ].join(' Space '));

      q.spread([loadFixture('characters.txt'), loadFixture('itu.txt')], function(source, target) {
        expect(phony.to(source, options)).to.be(target.replace(rEOL, ' Space '));
      })
      .then(done)
      .done();
    });
  });

  describe('.noConflict', function() {
    it('should return a reference to itself', function() {
      expect(phony.noConflict()).to.be(phony);
    });
  });

  describe('.VERSION', function() {
    it('should match version in bower.json', function(done) {
      q.nfcall(fs.readFile, 'bower.json', {encoding: 'utf8'})
      .then(function(data) {
        expect(phony.VERSION).to.be(JSON.parse(data).version);
      })
      .then(done)
      .done();
    });

    it('should match version in package.json', function(done) {
      q.nfcall(fs.readFile, 'package.json', {encoding: 'utf8'})
      .then(function(data) {
        expect(phony.VERSION).to.be(JSON.parse(data).version);
      })
      .then(done)
      .done();
    });
  });
});
