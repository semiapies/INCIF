// ==UserScript==
// @name          INCIF
// @description   Comment-filtering and enhancement for Hit & Run - Version 0.3.2 - New Site Layout!
// @namespace     tag:semiapies@gmail.com,2006-05-15,hitandrun
// @include       http://*.reason.com/blog/*
// @include       http://reason.com/blog/*
// ==/UserScript==

// Filter Specifications


var Filters = {
	"Ignore": [
		{
			"label":"dave w.", 
			"address":["www.farces", "wannamo.com"], 
			"name":["Dave W.", "S. Franklin", "Sam Franklin"]
		},
		{"label":"sarcastro", "name":"Dan T."},
		{"label":"jersey", "address":"jerseymcjones@gmail.com"},
		{"label":"gopher boy", "address":["peleus@aol.com", "john.kluge@us.army.mil"]}
	]
};
var Actions = {
	'Ignore': {
		"setup":function() {
			GM_addStyle( 
				"div.INCIF-Ignore {" +
				"	font-style:italic; font-size:7pt; color:silver;" + 
				"	padding:0; line-height:auto; height:auto;" +
				"	text-align:center;" +
				"}"
			);
		},
		"apply":function (div, spec) {
			Style.appendClass(div, 'INCIF-Ignore');
			if (spec['label'] == undefined) {
				div.innerHTML = 'filtered comment';	
			} else {
				div.innerHTML = 'comment by ' + spec['label'] + '';
			}
		}
	}
};
// The contents of this variable will be autofilled in the comments information fields (eg your screenname, email address, homepage URL)
var Ident = {
	"Name:":"", "Email:":"", 
	"URL:":""
};


//************************************************************************************
// Do not modify anything below this point
//************************************************************************************

// Library Objects (convenient holders of functions)
	NodeTypes = {
		1:"element", 2:"attribute", 3:"text", 8:"comment", 9:"document", 10:"DTD"
	}
	for (key in NodeTypes) {
		NodeTypes[NodeTypes[key]] = key;  // Makes the association bi-directional 
	}
	
	Style = {
		"appendClass":function (obj, name) {
			obj.className += (' ' + name); 
		},
		"setFor":function (obj, text){
			obj.style.cssText = text;
		}
	}
	Xpath = {
		"find":function (query) {
			return document.evaluate(
				query, document, null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
			);
		},
		"doToAll":function (query, func) {
			var selected = Xpath.find(query)
			for (i=0; i < selected.snapshotLength; i++) {
				func(selected.snapshotItem(i));
			}	
		}
	}
	Matching = {
		"check":function (test, target) {
			return	target && test && (test != '') 
					&& 
					(test.toUpperCase().indexOf(target.toUpperCase()) != -1); 
		},
		"findAny":function (test, target) {
			var i = 0;
			var result = false;
			if (!target) {
				return result;
			}
			if (target.substr) {
				result = Matching.check(test, target); 
			} else if (target.length) {
				for (i=0; i < target.length; i++) {
					result = Matching.check(test, target[i]);
					if (result) {break;}
				}
			} else {
				;
			}
			return result;
		}
	}
	String.prototype.trim = function() {
		return(this.replace(/^\s+/,'').replace(/\s+$/,''));
	}
	Form = {
		"getFormName":function(labelText) {
			var result = "";
			Xpath.doToAll("//label", function(label) {
				if (label.innerHTML == labelText) {
					result = label.htmlFor;
				}
			});
			return result;
		},
		"getFormElem":function(labelText) {
			var name = Form.getFormName(labelText);
			if (name != "") {
				return Xpath.find("//input[@name='" + name + "']").snapshotItem(0);
			}
		},
		"set":function(labelText, value) {
			var item = Form.getFormElem(labelText);
			item.value = value;
		}
	};
	
// Actual Filtering
	// This runs any setup code for Actions
		for (action in Actions) {
			if (Actions[action]["setup"] != undefined) {
				Actions[action].setup();
			}
		}
	
	// This actually goes over all the comments and applies Actions for people matching Filters.
		Xpath.doToAll("//div[@class='com-blck']|//div[@class='white-com-blck']", function(div) {
			var p = div.childNodes[0];
			var a = {};
			var link = "";
			var name = "";
			var filterType = {};
			var filter = {};
			var i = 0;
			if (p.childNodes[0].nodeType == NodeTypes.element) {
				a = p.childNodes[0];
				link = a.href;
				name = a.innerHTML;
			} else {
				name = p.innerHTML.split('|')[0].trim(); // No email or web site, so no link in this case
			}
			for (filterType in Filters) {
				for (i=0; i < Filters[filterType].length; i++) {
					filter = Filters[filterType][i];
					if (Matching.findAny(link, filter['address']) || Matching.findAny(name, filter['name'])) {
						Actions[filterType].apply(div, filter);
						break;
					}
				}
			}
		});
	
// Autofilling form fields
	for (field in Ident) {
		if (Ident[field] != "") {
			Form.set(field, Ident[field]);
		}
	};
