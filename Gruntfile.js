module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.js',
      },
      target: ['./js/script.js'],
    },
  });

  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['eslint']);
};
