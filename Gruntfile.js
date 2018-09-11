var path = require('path');
var timer = require("grunt-timer");

module.exports = function(grunt){
  timer.init(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      myconfig: function() {
        return {
          entry: './app/js/App.jsx',
          output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'app')
          },
          watch: false,
          mode: 'production',
          devtool: "source-map"
        };
      }
    },

    browserSync: {
      dev : {
        bsFiles: {
          src : ['app/**/*', '!app/src/js/**/*', '!**/*.scss']
        },
        options: {
          server: {
            baseDir: "./app"
          },
          watchTask: true,
          notify: false

        }
      },

      build : {
        bsFiles: {
          src : 'dist/**/*'
        },
        options: {
          server: {
            baseDir: "./dist"
          },
          notify: false

        }
      }
    },

    sass: {
      dist: {
        options:{
        },
        files: [
        {
          expand: true,
          cwd: 'app/scss/',
          src: ['main.scss'],
          dest: 'app',
          ext: '.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['app/src/js/**/*', 'app/**/*.scss'],
        tasks: [],
        options: {
          spawn: false
        },
      },
    },

    useminPrepare: {
      html: 'app/**/index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html:['dist/**/*.html']
    },

    copy: {
      build: {
        cwd: 'app',
        src: ['**/*', '!vendors/**', '!scss/**', '!js/**', '!**/*.map'],
        dest: 'dist',
        expand: true,
      },
      vendors: {
        files: [
          {
            expand: true,
            src: ['app/vendors/**/*.ttf','app/vendors/**/*.otf','app/vendors/**/*.eot','app/vendors/**/*.svg','app/vendors/**/*.woff','app/vendors/**/*.woff2'],
            dest: 'dist/vendors',
            flatten: true
          }
        ]
      }
    },

    clean: {
      rebuild: {
        src: [ 'dist/**/*']
      },

      finishbuild: {
        src: ['dist/src/vendors', 'dist/src/scss', 'dist/src/js','dist/src/api/APIWrapper2004.js','dist/src/api/SCOFunctions2004.js', 'dist/dir/media/fonts/*','!dist/dir/media/fonts/*.woff']
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['main.css'],
          dest: 'dist',
          ext: '.css'
        },
        {
          'dist/vendors.min.css': ['dist/vendors/**/*.min.css']
        }]
      }
    },

    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'dist/vendors.min.js': ['app/vendors/jquery/jquery-3.2.1.min.js', 'app/vendors/bootstrap/js/bootstrap.min.js', 'app/vendors/**/*.min.js']
        }
      }
    },

    imagemin: {
      build: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{removeViewBox: false}],
        },
        files: [{
          expand: true,
          cwd: 'dist/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/img/'
        }]
      }
    },

  });

  grunt.registerTask('size', ['size_report:dist']);

  grunt.registerTask('dev', ['sass', 'browserSync:dev', 'watch']);

  grunt.registerTask('build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['version', 'clean:rebuild', 'copy:build', 'uglify', 'cssmin', 'imagemin', 'useminPrepare', 'usemin', 'copy:vendors', 'browserSync:build']
  );


  grunt.registerTask('version', function(key, value) {
    var settingsFile = "app/settings.json";
    if (!grunt.file.exists(settingsFile)) {
      grunt.log.error("file " + settingsFile + " not found");
      return true; //return false to abort the execution
    }

    var json = grunt.file.readJSON(settingsFile); //get file as json object
    currentVersion = json.version;
    grunt.log.oklns("VERSION: " + (parseFloat(currentVersion)+0.1));

    json.version = (parseFloat(currentVersion)+0.1).toFixed(1).toString();
    //grunt.log.oklns("VERSION: " + json.settings.version);

    grunt.file.write(settingsFile, JSON.stringify(json, null, 2));
  });


  grunt.event.on('watch', function(action, filepath, target) {
    var filetype = filepath.substring(filepath.indexOf('.'), filepath.length);
    grunt.log.oklns(filetype);

    if(filetype == '.scss'){
      grunt.task.run('sass');
    }
    else{
      grunt.task.run('webpack');
    }
  });
}
