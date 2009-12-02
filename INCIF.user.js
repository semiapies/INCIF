// ==UserScript==
// @name          INCIF
// @description   Comment-filtering and enhancement for Hit & Run - Version 0.4 - New Site Layout!
// @namespace     tag:semiapies@gmail.com,2006-05-15,hitandrun
// @include       http://*.reason.com/blog/*
// @include       http://*.reason.com/archives/*
// @include       http://reason.com/blog/*
// @include       http://reason.com/archives/*
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

// Filter Specifications
	console.log("INCIF Loading Filters...");
	
	var Filters = {
		"ignore":{
			"john":"", 
			"Whacko":{"address":"24ahead.com"}
		}
	};
	
	var Ignore_Whole_Trees = true;  
	var Allow_Comment_Opening = true;
	
	console.log("...INCIF Filters Loaded.");
// The Setup and functions
	var Q = jQuery.noConflict();

	Q.each(Filters, function(name, section) {
		Q.each(section, function(key, val) {
			if (val == "") {
				Filters[name][key] = {"name":key, "address":""};
			}
			if (!Filters[name][key].name)		{ Filters[name][key]["name"] = "";}
			if (!Filters[name][key].address)	{ Filters[name][key]["address"] = "";}
		});
	});

	String.prototype.trim = function() {
		return(this.replace(/^\s+/,'').replace(/\s+$/,''));
	};
	
	var simplifyAddress = function(anAddress) {
		var addy = anAddress.trim().replace("mailto:", "").replace("http://", "");
		if (addy.substring(addy.length - 1) == "/") {
			addy = addy.substring(0, addy.length - 1);
		}
		return addy;
	}
	
	var Comment = function (div) {
		var poster = (function(comment) {
			var credit = comment.find("h2 strong");
			var poster = {};
			var a = {};
			if (credit.find("a").length > 0) {
				a = credit.find("a");
				poster = {"name":a.text().trim(), "address":simplifyAddress(a.attr("href"))};
			} else {
				poster = {"name":credit.text().trim(), "address":""};
			}
			poster.within = function(collection) {
				var result = [];
				var anyMatch = function (first, second) {
					return	(first != "" && second != "")
							&&
							(first.toLowerCase() == second.toLowerCase());
				};
				Q.each(collection, function(label, info) {
					if (anyMatch(info.name, poster.name) || anyMatch(info.address, poster.address)) {
						result.push(label);
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
		return {
			"node":div, "poster":poster, "depth":depth, "kids":kids, "label":""
		};
	};
	
	var Action = {
		"ignore":function(comment) {
			var node = comment.node;
			var label = comment.label;
			if (label == "") {
				label = comment.poster.name;
			}
			if (!node.is(".INCIF-ignore")) {
				node.prepend('<div><span class="open">' + label + '</span></span><span class="close">[ CLOSE ]</span></div>');
				node.addClass("INCIF-ignore");
			}
		}
	};
	
	GM_addStyle( 
		".INCIF-ignore {" + 
			"padding:0; line-height:0.5em; " + 
		"}\n" + 
		".INCIF-ignore div {" +
			"vertical-align:top; font-style:italic; margin:0; padding:0; font-size:7pt; line-height:0.5em; padding-bottom:0.25em; color:silver;" + 
		"}\n" + 
		"span.open {" +
			"display:none;"+ 
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
		".INCIF-ignore h2, .INCIF-ignore p, .INCIF-ignore button, .INCIF-ignore blockquote {" +
			"display:none;" +
		"}\n"	
	);

// The Action
	console.log("INCIF Starting...");
	
	var toIgnore = [];
	Q.each(Q(".comments .com-block"), function () {
		var comment = Comment(Q(this));
		var hit = comment.poster.within(Filters.ignore)
		if (hit.length > 0) {
			comment.label = hit[0];
			toIgnore.push(comment);
		}
	});
	Q.each(toIgnore, function () {
		Action.ignore(this);
	});
	
	if (Ignore_Whole_Trees) {
		Q.each(toIgnore, function () {
			this.kids(Action.ignore);
		});
	}
	if (Allow_Comment_Opening) {
		// If you REALLY want to worry with things best ignored...
		GM_addStyle("INCIF-ignore span.open {cursor:pointer;}\n");
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
	}
	
	console.log("...INCIF Successfully Completed");
