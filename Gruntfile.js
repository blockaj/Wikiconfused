module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		coffee: {
			compile: {
				options: {
					bare: true
				},
				files: {
					'main.js': "main.coffee"
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'<%= pkg.name %>.min.js': ['main.js']
				}
			}
		},
		execute: {
			target: {
				src: ['main.js']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-execute');
	grunt.registerTask('default', ['uglify', 'coffee']);
	grunt.registerTask('test', ['coffee', 'execute']);
};
