module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      docs: ['docs']
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'phony.js',
        'test/**/*.js'
      ]
    },

    jsdoc: {
      all: {
        options: {
          destination: 'docs'
        },
        src: ['phony.js']
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('dist', ['test', 'uglify', 'docs']);
  grunt.registerTask('docs', ['clean:docs', 'jsdoc']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
};
