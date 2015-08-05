var os = require('os'),
    expect = require('chai').expect,
    btoa = require('btoa'),
    SourceMapGenerator = require('source-map').SourceMapGenerator,
    SourceMapConsumer = require('source-map').SourceMapConsumer,

    utils = require('../lib/utils');

describe('Utils', function() {
    var SOURCE_MAP_GENERATOR = new SourceMapGenerator(),
        SOURCE_MAP_CONSUMER = new SourceMapConsumer(JSON.parse(SOURCE_MAP_GENERATOR.toString())),
        SOURCE_MAP_LINE = '//# sourceMappingURL=data:application/json;base64,' + btoa(SOURCE_MAP_GENERATOR.toString());

    describe('getSourceMap()', function() {
        it('should return source map for bunch of lines', function() {
            var sourceMap = utils.getSourceMap(['line1', 'line2', SOURCE_MAP_LINE]);
            sourceMap.should.be.deep.equal(SOURCE_MAP_CONSUMER);
        });

        it('should return source map for string content', function() {
            var sourceMap = utils.getSourceMap(['line1', 'line2', SOURCE_MAP_LINE].join(os.EOL));
            sourceMap.should.be.deep.equal(SOURCE_MAP_CONSUMER);
        });

        it('should return null if no sourcemap in lines', function() {
            var sourceMap = utils.getSourceMap(['line1', 'line2']);
            expect(sourceMap).to.be.equal(null);
        });

        it('should return null if no sourcemap in content', function() {
            var sourceMap = utils.getSourceMap(['line1', 'line2'].join(os.EOL));
            expect(sourceMap).to.be.equal(null);
        });

        it('should return null if sourcemap is not the last line', function() {
            var sourceMap = utils.getSourceMap(['line1', 'line2', SOURCE_MAP_LINE, 'some-line']);
            expect(sourceMap).to.be.equal(null);
        });

        it('should return null if sourcemap is not the last line in content', function() {
            var sourceMap = utils.getSourceMap(['line1', 'line2', SOURCE_MAP_LINE, 'some-line'].join(os.EOL));
            expect(sourceMap).to.be.equal(null);
        });
    });

    describe('removeBuiltInSourceMap()', function() {
        it('should return lines without source map line', function() {
            var lines = utils.removeBuiltInSourceMap(['line1', 'line2', SOURCE_MAP_LINE]);
            lines.should.be.deep.equal(['line1', 'line2']);
        });

        it('should return content without source map line', function() {
            var content = utils.removeBuiltInSourceMap(['line1', 'line2', SOURCE_MAP_LINE].join(os.EOL));
            content.should.be.deep.equal(['line1', 'line2'].join(os.EOL));
        });

        it('should return same lines if no source map line', function() {
            var lines = utils.removeBuiltInSourceMap(['line1', 'line2']);
            lines.should.be.deep.equal(['line1', 'line2']);
        });

        it('should return same content if no source map line', function() {
            var content = utils.removeBuiltInSourceMap(['line1', 'line2'].join(os.EOL));
            content.should.be.deep.equal(['line1', 'line2'].join(os.EOL));
        });

        it('should return same lines if source map line is not the last one', function() {
            var expectedLines = ['line1', 'line2', SOURCE_MAP_LINE, 'some-line'];
            var lines = utils.removeBuiltInSourceMap(expectedLines);
            lines.should.be.deep.equal(expectedLines);
        });

        it('should return same content if source map line is not the last one', function() {
            var expectedContent = ['line1', 'line2', SOURCE_MAP_LINE, 'some-line'].join(os.EOL);
            var content = utils.removeBuiltInSourceMap(expectedContent);
            content.should.be.deep.equal(expectedContent);
        });
    });

    describe('joinContentAndSourceMap()', function() {
        it('should join content and source map', function() {
            var result = utils.joinContentAndSourceMap(['line1', 'line2'].join(os.EOL), SOURCE_MAP_GENERATOR);
            result.should.be.equal(['line1', 'line2', SOURCE_MAP_LINE].join(os.EOL));
        });

        it('should throw if not a SourceMapGenerator passed', function() {
            (function() {
                return utils.joinContentAndSourceMap('some-content', SOURCE_MAP_CONSUMER);
            }).should.throw();
        });

        it('should throw if source map not passed', function() {
            (function() {
                return utils.joinContentAndSourceMap('some-content');
            }).should.throw();
        });
    });
});