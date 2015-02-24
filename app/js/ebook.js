/**
 *	Parse ebook EPub file and render contents
*/
function readEBook(bookName) {
	var EPub = require('epub');
	var ebook = new EPub(bookName, '/imagewebroot/', '/articlewebroot/');
	ebook.on('error', function (err) {
		throw err;
	});
	ebook.on('end', function () {
		ebook.getChapter(ebook.spine.contents[0].id, function (err, data) {
			if (err) throw err;
			// Do something with 'data'..
		});
	});
	ebook.parse();
}

/**
 *	Determine file type of an ebook and convert to EPub format
*/
function convertToEPub(file) {
	if (file.name.indexOf('epub') >= 0) {
		// Read EPub
	} else if (file.name.indexOf('pdf')) {
		// Read PDF
	} else if (file.name.indexOf('mobi')) {
		// Read Mobi
	}
}

/**
 *	Convert PDF file into EPub ebook file format
*/
function convertPDF(fileName) {
	convert('pdf', fileName, 'epub', 'book.epub');
}

/**
 *	Convert Mobi file into EPub ebook file format
*/
function convertMobi() {
	convert('mobi', fileName, 'epub', 'book.epub');
}

/**
 *	Convert any file format into another format
*/
function convert(inputFormat, inputFile, outputFormat, outputFile) {
	var request = require('request');
	var fs = require('fs');
	var options = {
		'apikey': '8eswGxfnuPuysM4YGx9zIofLxywOZaG6bsl1WARlPGSVMSkGc2gKGPz_ZgG0sUspFppzyZO2uiLHClEqO7zYQg',
		'input': 'upload',
		'inputformat': inputFormat,
    'outputformat': outputFormat,
		'download': 'inline'
	};
	convertOperation(options, inputFile, outputFile, function(err, result) {
		if (err)
			return console.error(err);
		if (result) console.log('Success: ', result);
		else console.log('Success');
	});
}

/**
 *	True conversion operator method
*/
function convertOperation(options, inputFile, outputFile, callback) {
	var apiRequest = request.post({
		url: 'https://api.cloudconvert.com/convert',
		followAllRedirects: true,
		qs: options
	})
	.on('error', function (err) {
		callback(err);
	})
	.on('response', function (res) {
		// If response is json
		if (res.headers['content-type'].indexOf("application/json") === 0) {
			var str = '';
			res.on('data', function(chunk) {
				str += chunk;
			});
			res.on('end', function() {
				var result = JSON.parse(str);
				if (res.statusCode == 200) callback(null, result);
				else callback(new Error(result.error ? result.error : result.message));
			});
		// If response is file
		} else {
			this.pipe(fs.createWriteStream(outputFile));
			this.on('end', function() {
				callback();
			});
		}
	});
	if (inputFile) apiRequest.form().append('file', fs.createReadStream(inputFile));
}

/**
 *	Test method to determine functionality of conversion method
*/
function testConversion() {
	convert('pdf', 'sample.pdf', 'epub', 'sample.epub');
}
