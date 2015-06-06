module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    blanket: {
      coverage: {
        src: ['src'],
        dest: 'coverage/src'
      }
    },

    clean: {
      coverage: ['coverage'],
      dist: ['dist', 'docs']
    },

    copy: {
      coverage: {
        expand: true,
        src: ['test/**'],
        dest: 'coverage/'
      },
      dist: {
        src: ['src/phony.js'],
        dest: 'dist/phony.js'
      }
    },

    coveralls: {
      options: {
        force: true
      },
      coverage: {
        src: ['coverage/results.info']
      }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    jsdoc: {
      dist: {
        options: {
          destination: 'docs'
        },
        src: ['src/**/*.js']
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*-test.js']
      },
      coverage: {
        options: {
          captureFile: 'coverage/results.html',
          quiet: true,
          reporter: 'html-cov'
        },
        src: ['coverage/test/**/*-test.js']
      },
      lcov: {
        options: {
          captureFile: 'coverage/lcov.info',
          quiet: true,
          reporter: 'mocha-lcov-reporter'
        },
        src: ['coverage/test/**/*-test.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['coverage/test/**/*-test.js']
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/phony.min.js': 'dist/phony.js'
        },
        options: {
          banner: [
            '/*! phony v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %>',
            ' <%= pkg.author.name %> | <%= pkg.licenses[0].type %> License\n',
            '*/'
          ].join(''),
          report: 'min',
          sourceMap: true,
          sourceMapName: 'dist/phony.min.map'
        }
      }
    },

    watch: {
      test: {
        files: 'src/**/*.js',
        tasks: ['test']
      }
    }

  });

  grunt.loadNpmTasks('grunt-blanket');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['test', 'clean:dist', 'copy:dist', 'uglify', 'jsdoc']);
  grunt.registerTask('test', ['eslint', 'clean:coverage', 'blanket', 'copy:coverage', 'mochaTest']);
};
