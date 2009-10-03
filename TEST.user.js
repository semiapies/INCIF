// ==UserScript==
// @name          INCIF
// @description   Comment-filtering and enhancement for Hit & Run - Version 0.4 - New Site Layout!
// @namespace     tag:semiapies@gmail.com,2006-05-15,hitandrun
// @include       http://*.reason.com/blog/*
// @include       http://reason.com/blog/*
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

// Filter Specifications
	var People = {
		"ignore":{
			"xavier woods":"", 
			"john":"", 
			"tulpa":"",
			"Randian":{"address":"http://libertariansteve.blogspot.com", "name":""}  //Just an address test :)
		}
	};

// The Setup and functions
	var Q = jQuery.noConflict();

	String.prototype.trim = function() {
		return(this.replace(/^\s+/,'').replace(/\s+$/,''));
	};
	
	var Comment = function (div) {
		var poster = (function(comment) {
			var credit = comment.find("h2 strong");
			var poster = {};
			var a = {};
			if (credit.find("a").length > 0) {
				a = credit.find("a");
				poster = {"name":a.text().trim(), "address":a.attr("href").trim()};
			} else {
				poster = {"name":credit.text().trim(), "address":""};
			}
			poster.within = function(collection) {
				var result = false;
				var anyMatch = function (first, second) {
					return	(first != "" && second != "")
							&&
							(first.toLowerCase() == second.toLowerCase());
				};
				Q.each(collection, function(label, info) {
					if (anyMatch(info.name, poster.name) || anyMatch(info.address, poster.address)) {
						result = true;
						return false;
					}
				});
				return result;
			};
			return poster;
		})(div);
		var depth = (function(node) {
			var classes = node.attr("class").toString().split(" ");
			var result = "";
			Q.each(classes, function() {
				if (this.indexOf("depth") == 0) {
					result = parseInt(this.replace("depth", ""));
					return false;
				}
			});
			return result;
		})(div);
		
		var kids = function (func) {
			var next = div.next(); 
			while (next.length > 0 && depth < Comment(next).depth) {
				func(Comment(next));
				next = next.next();
			}			
		};		
		return {"node":div, "poster":poster, "depth":depth, "kids":kids};
	};
	
	var Action = {
		"ignore":function(comment) {
			var node = comment.node;
			if (!node.is(".INCIF-ignore")) {
				node.prepend('<div><span class="open">' + comment.poster.name + '</span></span><span class="close">[ CLOSE ]</span></div>');
				node.addClass("INCIF-ignore");
			}
		}
	};
	
	GM_addStyle( 
		".INCIF-ignore {" + 
			"padding:0; line-height:1em; " + 
		"}\n" + 
		".INCIF-ignore div {" +
			"vertical-align:top; font-style:italic; margin:0; padding:0; font-size:7pt; line-height:1em; color:silver;" + 
		"}\n" + 
		"span.open {" +
			"cursor:pointer; display:none;"+ 
		"}\n" + 
		"span.close {" +
			"cursor:pointer; color:green;"+ 
		"}\n" + 
		".INCIF-ignore div span.open {" +
			"display:inline;"+ 
		"}\n" + 
		".INCIF-ignore div span.close {" +
			"display:none;"+ 
		"}\n" + 
		".INCIF-ignore h2, .INCIF-ignore p, .INCIF-ignore button {" +
			"display:none;" +
		"}\n"	
	);
// The Action
	console.log("INCIF Starting...");
	
	Q.each(People, function(name, section) {
		Q.each(section, function(key, val) {
			if (val == "") {
				People[name][key] = {"name":key, "address":""};
			}
			if (!People[name][key].name)		{ People[name][key]["name"] = "";}
			if (!People[name][key].address)	{ People[name][key]["address"] = "";}
		});
	});

	Q.each(Q(".comments .com-block"), function () {
		var comment = Comment(Q(this));
		if (comment.poster.within(People.ignore)) {
			Action.ignore(comment);
			comment.kids(Action.ignore);
		}
	});
	
	// If you REALLY want to worry with things best ignored...
	Q("head").append(
		'<script type="text/javascript">\n' +
		'	jQuery(function () {		\n' +
		'			jQuery(".INCIF-ignore div").click(function () {;' +
		'				var div = jQuery(this.parentNode);		\n' +
		'				if (div.is(".INCIF-ignore")) {		\n' +
		'					div.removeClass("INCIF-ignore");		\n' +
		'				} else {		\n' +
		'					div.addClass("INCIF-ignore")		\n' +
		'				}		\n' +
		'			});		\n' +
		'	});		\n' +
		'</script>'
	);
	
	console.log("...INCIF Successfully Completed");
