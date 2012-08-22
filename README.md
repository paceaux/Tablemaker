Document: 			HTML5 Tablemaker
Description: 		Generate flawless HTML tables that are clean and accessible
Author:      	 	Frank M. Taylor. 
References:   		http://jsfiddle.net/Paceaux/6XVmQ/embedded/result/
Version History:	
v0.1	::	Initial commit
v1.1	::	Major updates
	Features for merging table cells (merge up needs love)
	Added CSS  Nth-child rules
	Can Add column groups
	Row Height Adjustment
	When you view table code, you can update the table by editing it
	Can clear the helper classes
	Storing table information as a JSON object, b/c this might be handy later
	fixed a problem where content editable attribute was showing up in table code
v1.2	::	bug fixes and minor-ish updates
	Fixed merge right to account for colspans, there was a bug where merge down then right didn't work
	changed CSS for the row height adjustment so it's vertical, instead of horizontal
	started adding some code for extra shortcut keys
	added the html for table width so user can change measurement (not wired to JS yet)


	

Usage:      Download the HTML, CSS, and JS. Requires jQuery 1.5 or higher. 

---------------------------
TODO	::
1	need a loop for merge up that checks if the row above has colspans or rowspans
2	colgroup editor. add spans to col groups. also visually show how colgroups are spread
3  Custom column Width. HTML is there, need to work on positioning of the range
4	unmerge functions
5	shortcut keys for add / remove columns and rows
6   still need a way to hijack right click in the menu so e can get in attributes
7	if a user updates the table HTML through code window, need to check all tables and rows and update inputs
