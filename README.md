# Tablemaker: Making tables easier to make #

An API and a user interface for generating HTML tables. 

**Document**:       FlexModal, the jQuery Plugin

**Author**:         Frank M. Taylor

**Dependencies**:   None
                
**Demo**:
https://jsfiddle.net/Paceaux/v5hzsg6z/8/

## Configuration
You can set a default configuration for all of your tables. 

That configuration is *tablemakerConfig.js*.

````
var tmDefaultConfig = {
  layout: {
    header: {
      rows: 0,
      cols: 0,
    },
    body: {
      rows: 1,
      cols: 2,
    },
    footer: {
      rows: 0,
      cols: 0,
    },
    colgroups: 0,
  },
  meta: {
    summary: '',
    caption: '',
  },
  classes: {
    table: '',
    rows: {
      even: '',
      odd: '',
      nth: '',
    },
    cols: {
      even: '',
      odd: '',
      nth: '',
    }
  },
};
````
The Tablemaker API will depend on the presence of a default configuration. Make sure that this is included somewhere. 

## Making the Table
### Generating a default table
You can generate a table with `var myTable = new TableMaker();`

This will generate a table based on the default configuration. 

### Generating a custom table
You can also create your own configuration, and pass it in as an argument:
`var myCustomTable = new TableMaker(config)`;

### Adding the table
Generating the table adds it to the DOM. It's not yet added to an element, though. 

Your TableMaker object has a property, `.table` which is the generated markup. You can add the table to a place in the DOM like so:

````
var myTable = new TableMaker(myConfig);
var output = document.querySelector('.myDiv');
output.appendChild(myTable.table);
````

## The TableMaker API
When you generate a new TableMaker, it comes with loads of methods and properties you can use for manipulating the table.

### Configuration

`.config`

Contains all of the configuration data used to generate the table. Updated automatically when changes are made to the table. 


### Cells

`addCell(type, row, index, text)`

adds a single cell.

* `type`: text. accepts 'td' or 'th'
* `row` : node. a valid row for holding the cell
* `index`: integer. optional. location in the row
* `text` : text. optional. text to be placed in the cell

`.delCell(row, index)`

* `row`: node. valid row for holding the cell;
* `index`: integer. indexed position of the cell

### Rows
`.addRow(container, index, nCells)`

Adds a single row. 

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `index` : integer. indexed position of the row;
* `nCells`: integer. optional. Number of cells to add. If none is provided, the number of cells will be the same as the last row in the container

`.delRow(container, index)`

deletes a single row

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `index` : integer. indexed position of the row

`.addRows(container, rows, ncells)`

Adds multiple rows to the end of the container

*  `container`: node of type TBODY, THEAD, or TFOOT. 
*  `rows`: integer. Number of rows to add 
* `nCells`: integer. optional. Number of cells to add. If none is provided, the number of cells will be the same as the last row in the container

`delRows(container, start, end)`

Deletes multiple rows

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `start` : integer. starting index within container
* `end`: integer. optional. ending index of rows. If `end` is not provided, it will delete all rows in the container starting at `start`


###Columns

In this API, columns represent either `<td>` or `<th>` elements. They are not `<col>`. A cell is a single cell within a row. A column is a collection of those cells. 

`.addCol(rowContainer, index)`

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `index` : integer. indexed position of the cell

`.delCol(container, index)`

deletes a single column

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `index` : integer. indexed position of the cell

`.delCols(container, start, end)`

deletes multiple columns

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `start` : integer. starting index within each row
* `end`: integer. optional. ending index of cells. If `end` is not provided, it will delete all cells in each row starting at start

### ColGroups

Still under development. Check the source code

### Header and Footer

`.addHeader(rows, cells)`
`.addFooter(rows, cells)`
Adds a header/footer to the table. It will only add one. 

* `rows`: integer. Number of rows to add. 
* `cells`: integer. Number of cells to add;

`.delHeader()`
`.delFooter()`

Deletes the header/footer.



### Ranges

`.getRange(container, startColumn, startRow, endColumn, endRow)`

Returns a 2 dimensional array of cells. Each array represents a row, inside of that array will be nodes for each cell. 

Ranges are useful for merging or manipulating cells that don't cover an entire column or row.


*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `startColumn`: integer. index of first cell
* `startRow`: integer. index of first row
* `endColumn`: integer. index of last cell
* `endRow`: integer. index of first row

`.getRowRange(container, rowIndex, start, end)`

returns a 1 dimensional array of cells. Each cell will be a node from the row. 

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `rowIndex`: integer. index of the row. 
* `start`: integer. index of the starting cell.
* `end`: integer. index of the ending cell;

`.delRange(range)`

Deletes a range of cells.

* `range`: object of type range. this can be a 1 or 2d range.

`.mergeRange(range)`

Merges a range of cells. All cells except the first are deleted from the range. The first cell will have a `rowspan` and `colspan` that takes up appropriate space. 

You cannot merge a range into another cell that has been merged (yet). 

* `range`: object of type range. This can be a 1 or 2d range. 

### Table Metadata
Metadata are displayed, or accessible information, about the table. 

`.addCaption(text)`
`.addSummary(text)`

* `text`: text string. If a Caption or summary already exists, then the text will be updated

`.delCaption()`
`.delSummary()`

Deletes the caption or summary. 

### Classes

`.addClasses(container, selector, classnames)`

Adds classes to children of a container

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `selector` : text string. this will be passed into `querySelector()`
* `classnames`: Array or text string. 

`.delClasses(container, selector, classnames)`

Deletes classes of children in a container

*  `container`: node of type TBODY, THEAD, or TFOOT. 
* `selector` : text string. this will be passed into `querySelector()`
* `classnames`: Array or text string. Optional. If none are provided, then the selector will be the classname deleted. 

`.refreshRowClasses(container)`

Updates all of the class names of all of the rows in the container to match what the config designates. 

*  `container`: node of type TBODY, THEAD, or TFOOT. 

`.refreshColClasses(container)`

Updates all of the class names of all of the cells in the container to match what the config designates. 

*  `container`: node of type TBODY, THEAD, or TFOOT. 

`.refreshClasses(container)`

A wrapper for `refreshColClasses() and refreshRowClasses()`.

*  `container`: node of type TBODY, THEAD, or TFOOT. 

### Building the table


`.buildTable()`

The table is build when you instantiate an object. However, if you want to generate the table again, there's a method for that