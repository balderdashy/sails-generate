/**
 * Module dependencies
 */
var expect = require('./helpers/expectHandler');
var assert = require('./helpers/fileAssertions');

var Generator = require('root-require')('lib/helpers/jsonfile');


describe('jsonfile generator', function () {

	before(function () {
		this.fn = Generator;
	});


	describe('with missing `data`', function () {

		before(function () {
			this.options = { rootPath: this.heap.alloc() };
		});

		it('should trigger `invalid`',expect('invalid'));
	});


	describe('with missing `rootPath', function () {

		before(function () {
			this.options = { data: {foo: 'bar'} };
		});

		it('should trigger `invalid`',expect('invalid'));
	});





	describe('with empty data', function () {

		before(function () {
			this.options = {
				rootPath: this.heap.alloc(),
				data: {}
			};
		});

		it('should trigger `success`', expect('success'));
		it('should create a file', assert.fileExists);

	});


  describe('with `data` specified as function', function() {
    before(function () {
      this.options = {
        rootPath: this.heap.alloc(),
        data: function() {
          return {foo: 'bar'};
        }
      }
    });

    it('should trigger `success`', expect('success'));
    it('should put function result into file', assert.fileIsExactly('{"foo":"bar"}'));
  });


  describe('if file already exists', function () {

		before(function (cb) {
			this.options = {
				rootPath: this.heap.alloc(),
				data: { foo: 'bar' }
			};

			// Create an extra file beforehand to simulate a collision
			this.heap.touch(this.options.rootPath, cb);
		});

		it(	'should trigger "alreadyExists" handler', expect({ alreadyExists: true, success: 'Should not override existing file without `options.force`!' }));

	});





	describe('if file already exists and `force` option is true', function () {

		before(function(cb) {
			this.options = {
				rootPath: this.heap.alloc(),
				data: { foo: 'bar' },
				force: true
			};

			// Create an extra file beforehand to simulate a collision
			this.heap.touch(this.options.rootPath, cb);
		});

		it('should trigger `success`', expect('success'));

	});


});

