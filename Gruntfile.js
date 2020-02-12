module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.js',
        fix: true,
      },
      target: ['./js/script.js'],
    },
    sass: {
      dist: {
        files: {
          './css/style.css': './css/style.scss',
        },
      },
    },
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({overrideBrowserslist: 'last 2 versions'}), // add vendor prefixes
          require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: 'css/*.css'
      }
    },
    watch: {
      css: {
        files: ['./css/style.scss'],
        tasks: ['sass'],
      },
      js: {
        files: ['./js/script.js'],
        tasks: ['eslint'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['watch', 'eslint', 'sass', 'postcss']);
};
