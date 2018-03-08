var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');

  // concats all the third party libs.
  grunt.loadNpmTasks('grunt-contrib-concat');
  // minimize JS.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // minimize CSS.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Watch Backend.
    watch: {
      backend: {
        files: ['app/routes/**/*.js'],
        tasks: ['']
      },
      frontend: {
        files: ['fe/**/*.js', 'fe/**/*.vue'],
        tasks: ['webpack']
      }
    },
    // Webpack.
    webpack: {
      frontend: {
        entry: './fe/main.js',
        output: {
          path: path.resolve(__dirname, './public/'),
          filename: 'javascripts/build.js'
        },
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                loaders: {
                  css: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'vue-style-loader'
                  }),
                  scss: ExtractTextPlugin.extract({
                    use: 'css-loader!sass-loader',
                    fallback: 'vue-style-loader'
                  }),
                }
                // other vue-loader options go here
              }
            },
            {
              test: /\.js$/,
              loader: 'babel-loader',
              exclude: /node_modules/
            },
            {
              test: /\.(png|jpg|gif|svg)$/,
              loader: 'file-loader',
              options: {
                name: '/images/[name].[ext]?[hash]'
              }
            }
          ]
        },
        plugins: [
            new ExtractTextPlugin("stylesheets/style.css")
        ],
        resolve: {
          alias: {
            'vue$': 'vue/dist/vue.esm.js'
          }
        },
        devServer: {
          historyApiFallback: true,
          noInfo: true
        },
        performance: {
          hints: false
        },
        devtool: '#eval-source-map'
      }
    },
    // concat, moves third parties library to public directory.
    concat: {
      options: {
        separator: ';',
      },
      js: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.min.js'
        ],
        dest: path.resolve(__dirname, './public/javascripts') + '/libs.js',
      },
      css: {
        src: [
          'node_modules/bootstrap/dist/css/bootstrap.min.css'
        ],
        dest: path.resolve(__dirname, './public/stylesheets') + '/lib.css',
      }
    },
    // uglify, minimize js.
    uglify: {
      target: {
        files: {
          'public/javascripts/all.min.js': [
            'public/javascripts/libs.js',
            'public/javascripts/build.js',
          ]
        }
      }
    },
    //cssmin, minimize css.
    cssmin: {
      target: {
        files: {
          'public/stylesheets/all.min.css': [
            'public/stylesheets/lib.css',
            'public/stylesheets/style.css'
          ]
        }
      }
    },
  });

  grunt.registerTask('compile', 'Compile the project',
                        ['webpack','concat','uglify','cssmin']);
};
