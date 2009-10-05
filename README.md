INCIF
=====

The Indisputably Non-Coercive Idiot Filter for Hit & Run.


What's It Do?
-------------

This is a script that allows you to filter out comments by specific posters of your choice while reading Reason's Hit & Run comments section. It saves you countless time and frustration by hiding trollish inanity.


What Do I Need?
---------------

First, you'll need the [Firefox browser](http://www.mozilla.com/firefox/) and the [Greasemonkey plugin](https://addons.mozilla.org/en-US/firefox/addon/748) for Firefox.  

Install Firefox first, then go to the Greasemonkey page to install that plugin.  When it asks you to restart Firefox, let it. 

Second, you'll need one of the scripts on this site, INCIF.user.js (the release version) or TEST.user.js (the test version).  Save whichever script you want somewhere you can find it.


How Do I Work This?
-------------------

### Setting Up Filters

Open up that script you downloaded in a text editor - that's something like Notepad, not Microsoft Word or any other word processor.

Look for something like this near the top:

	var Filters = {
		"ignore":{
			
		}
	};

Your filters go in that "ignore" area. 

Let's say you want to filter someone by name - some guy who goes by "Ubershmuck".  You can be all precise and add in a line like this:

	var Filters = {
		"ignore":{
			"Ubershmuck":{"name":"Ubershmuck"}
		}
	};

Alternately, if you're using the TEST version, you can be lazy and just put in his name and a few quotes, like this:

	var Filters = {
		"ignore":{
			"Ubershmuck":""
		}
	};

What's the difference?  Well, maybe this guy likes to use a lot of goony names, but links his blog or puts his email address every time.  So, you can filter on "address" as well as "name".

			"Ubershmuck":{"name":"Ubershmuck", "address":"ooby@shmuck.com"}

That "address" field can also be a link:	

			"Ubershmuck":{"name":"Ubershmuck", "address":"http://shmuck.com/ooby_blog"}

With this sort of setup, any comments where this guy either signs that name _or_ includes such an address will be filtered.

If you're feeling like a little cheap mockery, give him a nickname of your choice:

			"dumb shmuck":{"name":"Ubershmuck", "address":"http://shmuck.com/ooby_blog"}

That's the name you'll see as little, faded-out text where his comment would be.

#### Multiple People

You're probably going to encounter more than one person to filter.  There's a minor formatting issue you have to keep in mind when you put in information for multiple people - commas.  Your filters have to have a comma between them, but the last filter must not have a comma after it.

Here's an example with three people:

	var Filters = {
		"ignore":{
			"spammer":{"address":"spam@spam.com"},
			"facile dick":{"name":"Mr. Dixon", "address":"dick@less.us"},
			"dumb shmuck":{"name":"Ubershmuck", "address":"http://shmuck.com/ooby_blog"}
		}
	};

Note how the first two have commas after them (look after the "}" ), but the last one doesn't.  That's the big rule here - put a comma after every filter except the last one.

### Loading Your Script


Now, save that script with your filters.  Open up Firefox, and open up the script.  You'll get a Greasemonkey window warning you that this is a Greasemonkey script, only open scripts you know, yadda yadda.  Wait until the little countdown ends, then hit the **Install** button.

You're set!

Now open a Hit & Run page and see the filtering, 


Where'd They Go?
----------------

Well, you haven't actually touched their comments (that's the "non-coercive" part).  What's happened is that this Firefox loaded this page, then this script went and hid their comments based on your filters before showing it to you. 

