define(
[
  'angular',
  'angular-mocks',
  './../../../js/services/_module'
],
function(angular, mocks) {

describe('booleanSearchEngine.test.js', function() { 'use strict';
	
	var engine;
	beforeEach(mocks.module('dewey.services'));

	beforeEach(inject(function (booleanSearchEngine) {
		engine = booleanSearchEngine;
	}));

	xit('Should have a filterBookmark function', function(){
		expect(engine).to.not.be.undefined;
		expect(engine.filterBookmark).to.be.a('function');
	});

	xit('Should have a generateExpressionTree function', function(){
		expect(engine).to.not.be.undefined;
		expect(engine.generateExpressionTree).to.be.a('function');
	});

	xit('When search empty - result should be true', function(){
		var isFiltered = engine.filterBookmark(null, '');
		expect(isFiltered).to.be.true;
	});

	xdescribe('Check generate expression:', function(){

		it('When search null - result should be empty', function(){

			var result = engine.generateExpressionTree(null);
			expect(result).to.be.an('array');
			expect(result.length).to.equal(0);
		});

		it('When search is empty - result should be empty', function(){

			var result = engine.generateExpressionTree('');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(0);
		});

		it('When search is whitespace - result should be empty', function(){

			var result = engine.generateExpressionTree('   ');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(0);
		});

		it('When search contains whitespaces - result should trim it', function(){

			var result = engine.generateExpressionTree('   asdf   ');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(1);
		});

		it('When search contains pattern - result should have two items', function(){

			var result = engine.generateExpressionTree(' asdf tag: qwerty  ');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(2);
			expect(result[0]).to.equal('asdf');
			expect(result[1]).to.equal('tag:qwerty');

			result = engine.generateExpressionTree(' asdf tag:qwerty  ');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(2);
			expect(result[0]).to.equal('asdf');
			expect(result[1]).to.equal('tag:qwerty');
		});

		it('When seach contains expression - result should have one item', function(){

			var result = engine.generateExpressionTree('title: 0 AND 1');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(1);
			expect(result[0]).to.equal('title:0 and 1');
		});

		it('When seach contains pattern and expression - result should have two items', function(){

			var result = engine.generateExpressionTree(' asdf tag: qwerty and 123 ');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(2);
			expect(result[0]).to.equal('asdf');
			expect(result[1]).to.equal('tag:qwerty and 123');
		});
	});

	xdescribe('When search "string" - will try to find a match in any object field.', function(){	
		var bookmark, searchText;
		
		beforeEach(function(){
			
			searchText = 'string';
			bookmark = {
				title: 'asdf QstringQ',
				url: 'http://127:0:0:1'
			};
		});

		it('When title contains string - result should be true', function(){			
			
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When title does not contain - result should be false', function(){
			
			searchText = 'notString';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When url contains string - result should be true', function(){			
			
			searchText = ':0:0';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When url does not contain - result should be false', function(){
			
			searchText = ':1:0';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});
	});

	xdescribe('When search "tag:string" - will try to find a match only in object tag property.', function(){
		var bookmark, searchText;
		
		beforeEach(function(){
			
			searchText = 'tag:tag2';
			bookmark = {
				title: 'title',
				url: 'http://127:0:0:1',
				tag:[{text: 'tag1'}, {text: 'tag2'}, {text: 'tag2'}]
			};
		});

		it('When tag contains string - result should be true', function(){
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When tag does not contain - result should be false', function(){
			
			searchText = 'tag:tag4';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});
	});

	xdescribe('When search "string1 tag:string2" - will try to find a match for search2 in object "tag" property an search1 title field.', function(){
		var bookmark, searchText;
		
		beforeEach(function(){
			
			searchText = 'itl tag:tag2';
			bookmark = {
				title: 'title',
				url: 'http://127:0:0:1',
				tag:[{text: 'tag1'}, {text: 'tag2'}, {text: 'tag2'}]
			};
		});

		it('When title contains - result should be true', function(){
			
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When title does not contan and tag contains - result should be false', function(){

			searchText = 'nottitle tag:tag2';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When title contans and tag does not - result should be false', function(){

			searchText = 'tl tag:tag4';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});
	});

	xdescribe('When search pattern contains whitespace - will try to find a match the same as without it', function(){
		var bookmark, searchText;
		
		beforeEach(function(){
			
			searchText = 'tag: tag2';
			bookmark = {
				title: 'title',
				url: 'http://127:0:0:1',
				tag:[{text: 'tag1'}, {text: 'tag2'}, {text: 'tag2'}]
			};
		});

		it('When tag pattern contains whitespace - result should be true', function(){

			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When title pattern contains whitespace - result should be true', function(){

			searchText = 'title: itl';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When url pattern contains whitespace - result should be true', function(){

			searchText = 'url: 127';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});
	});

	xdescribe('When search title pattern contains AND expression - will try to find both of the search', function(){
		var bookmark, searchText;
		
		beforeEach(function(){

			searchText = 'title: ti AND le';
			bookmark = {
				title: 'title',
				url: 'http://127:0:0:1',
				tag:[{text: 'tag1'}, {text: 'tag2'}, {text: 'tag3'}]
			};
		});

		it('When pattern contains both items - result should be true', function(){

			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When pattern does not contain first item - result should be false', function(){

			searchText = 'title: notitle AND le';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When pattern does not contain second item - result should be false', function(){

			searchText = 'title: le AND notitle';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When pattern contains only first item without whitespace - result should be true', function(){

			searchText = 'title: le AND';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When pattern contains only first item with whitespace - result should be true', function(){

			searchText = 'title: le AND ';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});
	});

	xdescribe('When search url pattern contains AND expression - will try to find both of the search', function(){
		var bookmark, searchText;
		
		beforeEach(function(){

			searchText = 'url: 27 AND 0:1';
			bookmark = {
				title: 'title',
				url: 'http://127:0:0:1',
				tag:[{text: 'tag1'}, {text: 'tag2'}, {text: 'tag3'}]
			};
		});

		it('When pattern contains both items - result should be true', function(){

			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When pattern does not contain first item - result should be false', function(){

			searchText = 'url: noturl AND 27';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When pattern does not contain second item - result should be false', function(){

			searchText = 'url: 27 AND noturl';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});
	});

	xdescribe('When search tag pattern contains AND expression - will try to find both of the search', function(){
		var bookmark, searchText;
		
		beforeEach(function(){

			searchText = 'tag: tag2 AND tag1';
			bookmark = {
				title: 'title',
				url: 'http://127:0:0:1',
				tag:[{text: 'tag1'}, {text: 'tag2'}, {text: 'tag3'}]
			};
		});

		it('When pattern contains both items - result should be true', function(){

			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.true;
		});

		it('When pattern does not contain first item - result should be false', function(){

			searchText = 'tag: nottag AND tag2';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});

		it('When pattern does not contain second item - result should be false', function(){

			searchText = 'tag: tag2 AND nottag';
			var isFiltered = engine.filterBookmark(bookmark, searchText);
			expect(isFiltered).to.be.false;
		});
	});


	// ----------------------------------

	it('Should have a generate function', function(){
		expect(engine).to.not.be.undefined;
		expect(engine.generate).to.be.a('function');
	});

	describe('Check generate expression tree like an object:', function(){

		it('When search null - result should be undefined', function(){

			var result = engine.generate(null);
			expect(result).to.be.undefined;
		});

		it('When search is empty - result should be empty', function(){

			var result = engine.generate('');
			expect(result).to.be.undefined;
		});

		it('When search is whitespace - result should be empty', function(){

			var result = engine.generate('   ');
			expect(result).to.be.undefined;
		});

		it('When search is text - result should be same', function(){

			var searchText = 'asdf';
			var node = engine.generate(searchText);
			
			expect(node).to.not.be.undefined;
			expect(node).to.be.an('array');
			expect(node.length).to.equal(1);

			expect(node[0].pattern).to.be.a('string');
			expect(node[0].pattern).to.equal('none');

			expect(node[0].literals).to.be.an('array');
			expect(node[0].literals.length).to.equal(1);

			expect(node[0].literals[0].text).to.equal(searchText);
			expect(node[0].literals[0].expression).to.equal('none');
		});

		it('When search contains whitespaces - result should trim it', function(){

			var node = engine.generate('   asdf   ');

			expect(node).to.not.be.undefined;
			expect(node).to.be.an('array');
			expect(node.length).to.equal(1);

			expect(node[0].pattern).to.be.a('string');
			expect(node[0].pattern).to.equal('none');

			expect(node[0].literals).to.be.an('array');
			expect(node[0].literals.length).to.equal(1);

			expect(node[0].literals[0].text).to.equal('asdf');
			expect(node[0].literals[0].expression).to.equal('none');
		});

		it('When search contains pattern - result should have one node with literals', function(){

			var node = engine.generate(' tag:qwerty  ');

			expect(node).to.not.be.undefined;
			expect(node).to.be.an('array');
			expect(node.length).to.equal(1);

			expect(node[0].pattern).to.be.a('string');
			expect(node[0].pattern).to.equal('tag:');

			expect(node[0].literals).to.be.an('array');
			expect(node[0].literals.length).to.equal(1);

			expect(node[0].literals[0].text).to.equal('qwerty');
			expect(node[0].literals[0].expression).to.equal('none');
		});

		it('When seach contains expression - result should have one node with two literals', function(){

			var node = engine.generate('title:asdf AND qwerty');

			expect(node).to.not.be.undefined;
			expect(node).to.be.an('array');
			expect(node.length).to.equal(1);

			expect(node[0].pattern).to.be.a('string');
			expect(node[0].pattern).to.equal('title:');

			expect(node[0].literals).to.be.an('array');
			expect(node[0].literals.length).to.equal(1);

			expect(node[0].literals[0].text).to.equal('asdf');
			expect(node[0].literals[0].expression).to.equal('and');

			expect(node[0].literals[1].text).to.equal('qwerty');
			expect(node[0].literals[1].expression).to.equal('none');
		});

		xit('When seach contains pattern and expression - result should have two items', function(){

			var result = engine.generateExpressionTree(' asdf tag: qwerty and 123 ');
			expect(result).to.be.an('array');
			expect(result.length).to.equal(2);
			expect(result[0]).to.equal('asdf');
			expect(result[1]).to.equal('tag:qwerty and 123');
		});
	});
});














});