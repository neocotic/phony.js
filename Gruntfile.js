module.exports = function(grunt) {
  'use strict';

  // Configuration
  // -------------

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    docco: {
      all: {
        options: {
          output: 'docs'
        },
        src: 'phony.js'
      }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'phony.js',
        'test/**/*.js'
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*-test.js']
      }
    },

    uglify: {
      all: {
        files: {
          'phony.min.js': 'phony.js'
        },
        options: {
          banner: [
            '/*! phony v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %>',
            ' <%= pkg.author.name %> | <%= pkg.licenses[0].type %> License\n',
            '*/'
          ].join(''),
          report: 'min',
          sourceMap: true,
          sourceMapName: 'phony.min.map'
        }
      }
    },

    watch: {
      all: {
        files: '**/*.js',
        tasks: ['test']
      }
    }
  });

  // Tasks
  // -----

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['test', 'uglify', 'docco']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
};
