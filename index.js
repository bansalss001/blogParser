var fs = require('fs');

var fileToRead = './blog.txt';

var jsonOutput = {};

(function(){
	fs.readFile(fileToRead, "utf8", async (err, data) => {
		if(data){
			var headerContent = data.match(/---([\s\S]*)---/g);
			if(headerContent){
				var headerStringArray = headerContent.map(header => {return header.match(/(.*):(.*)/g)});
				var headers;
				for (let headerString of headerStringArray) { 
					headers = headerString.map(head=>{return head.split(':')});
				}
				for (let header of headers){
					let key = header.shift().trim();
					let value = header.join(':').trim();
					try {
						value = eval(value);
					} catch(error){
					}
					if(['TAGS','TAG'].indexOf(key.toUpperCase()) != -1){
						value = value.split(/(?: |),(?: |)/g);
					}
					jsonOutput = { ...jsonOutput , [key] : value};
				}
			}
			
			if(Array.isArray(headerContent) && headerContent.length){
				var shortContent = data.substring(headerContent[0].length).match(/([\s\S]*)READMORE/g);
			} else {
				var shortContent = data.match(/([\s\S]*)READMORE/g);
			}
			if(Array.isArray(shortContent) && shortContent.length){
				shortContent = (shortContent[0].substring(0,shortContent[0].indexOf('READMORE'))).trim();
				jsonOutput = { ...jsonOutput , 'short-content' : shortContent};
			}
			var content = data.match(/READMORE([\s\S]*)/g);
			if(content){
				content = content[0].substring(8).replace(/\n/g,' ').trim();
				jsonOutput = { ...jsonOutput , content : content};
			}
			console.log(jsonOutput);
		} else {
			console.log(error);
		}
		
	})
})();
