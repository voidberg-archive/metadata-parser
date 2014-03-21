'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        watch: {
            all: {
                files: ['src/**/*.*', 'test/**/*.*'],
                tasks: ['default']
            },
        },
        jasmine_node: {
            specNameMatcher: "Spec",
            specFolders: ["test/spec/common"],
            projectRoot: "test/spec/node",
            forceExit: true,
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
            }
        },
        browserify: {
            src: {
                src: ['src/common/metadata-parser.js'],
                dest: 'dist/metadata-parser.js',
                options: {
                    alias: ["./src/common/metadata-parser.js:metadata-parser"],
                }
            },
            test: {
                src: ['test/spec/common/**/*.js', 'test/spec/browser/**/*.js'],
                dest: 'dist/test_bundle.js',
                options: {
                    external: ['./src/**/*.js'],
                    ignore: ['./node_modules/underscore/underscore.js'],
                }
            },
        },
        connect: {
          server: {
            options: {
              port : 18081,
              base : './test/images'
            }
          }
        },
        jasmine : {
            src : 'dist/app_bundle.js',
            options : {
                specs : 'dist/test_bundle.js',
                vendor : ['libs/jquery-1.9.1.js', 'libs/underscore.js'],
                '--web-security' : false,
                '--local-to-remote-url-access' : true,
                '--ignore-ssl-errors' : true
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/metadata-parser_min.js': ['dist/metadata-parser.js']
                }
            },
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // Default task.
    // grunt.registerTask('default', ['jshint', 'jasmine_node', 'browserify',  'connect', 'jasmine', 'uglify']);
    grunt.registerTask('default', ['jshint', 'browserify:src', 'uglify']);
};
