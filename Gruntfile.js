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

    jshint: {
      main: [
        'Gruntfile.js',
        'phony.js'
      ],
      test: {
        files: {
          src: ['test/**/*.js']
        },
        options: {
          globals:      {
            after:      true,
            afterEach:  true,
            before:     true,
            beforeEach: true,
            describe:   true,
            it:         true
          },
          globalstrict: true,
          strict:       false
        }
      },
      options: {
        boss:      true,
        browser:   true,
        camelcase: true,
        curly:     true,
        devel:     false,
        eqeqeq:    true,
        expr:      true,
        globals:   {
          define: true
        },
        immed:     true,
        latedef:   true,
        laxcomma:  false,
        maxlen:    120,
        newcap:    true,
        noarg:     true,
        node:      true,
        nonew:     true,
        quotmark:  'single',
        strict:    true,
        undef:     true,
        unused:    true
      }
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
          banner: (
            '/*! phony v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %>' +
            ' <%= pkg.author.name %> | <%= pkg.licenses[0].type %> License\n' +
            '*/'
          ),
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('dist', [ 'test', 'uglify', 'docco' ]);
  grunt.registerTask('test', [ 'jshint', 'mochaTest' ]);

};
