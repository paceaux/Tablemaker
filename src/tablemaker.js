console.clear();

/*==========
#TABLEMAKER
==========*/

/*
#TODOS
1. create add table Col <col> functionality
2. create ability to designate which <col> for which colgroup
3. create a class updater method (should run after add/del, merge)
4. create a "switch in place" method for converting a td into a th
*/
var TableMaker = function(configData) {
  this.config = configData !== undefined ? configData : tmDefaultConfig;
  this.table = document.createElement('table');

  /*========== 
  #CLASSES.
  ==========*/
  /*These should be where we manipulate the elements (Add classes, properties, attributes) */
  
  this._Cell = function(type, row, text, index) {
    var cell = type === 'td' ?  row.insertCell(index) : row.insertBefore(document.createElement('th'), row.children[index]);
    
    if (text) {
      cell.innerText = text;
    }
    
    if (this.config.classes.cols.hasEven && (row.cells.length + 1) %2 === 0 ) {
      cell.classList.add('td--odd');
    }
    
    if (this.config.classes.cols.hasOdd && !((row.cells.length + 1) %2 === 0) ) {
      cell.classList.add('td--even');
    }
    
    if (this.config.classes.cols.nth !== 'none' && ((row.cells.length)%this.config.classes.cols.nth === 0) ) {
      cell.classList.add('td--nth-' + this.config.classes.cols.nth);
    }
    
    return cell;
  };
  
  this._Colgroup = function(index) {
    var colgroup = document.createElement('colgroup');
    return colgroup;
  };
  
  this._Caption = function(text) {
    var caption = this.table.caption !== null ? this.table.caption : this.table.createCaption();

    if (text) {
      caption.innerText = text;
    }
    return caption;
  };

  this._Footer = function() {
    var footer = this.table.createTFoot();
    return footer;
  };

  this._Header = function() {
    var header = this.table.createTHead();
    return header;
  };

  this._Body = function() {
    var body = this.table.createTBody();

    return body;
  };

  this._Row = function(rowContainer, index, nCells) {
    index = index !== undefined ? index : -1;
    
    var row = rowContainer.insertRow(index);
    
    for (var i = 0; i < nCells; i++) {
      this.addCell('td', row, i);
    }
 
    if (this.config.classes.rows.hasEven && (rowContainer.rows.length) %2 === 0 ) {
      row.classList.add('tr--even');
    }
    
    if (this.config.classes.rows.hasOdd && !((rowContainer.rows.length) %2 === 0) ) {
      row.classList.add('tr--odd');
    }
    
    if (this.config.classes.rows.nth !== 'none' && ((rowContainer.rows.length)%this.config.classes.rows.nth === 0) ) {
      row.classList.add('tr--nth-' + this.config.classes.rows.nth);
    }
    
    return row;
  };
  
   this._Range = function(rowContainer, colStart, rowStart, colEnd, rowEnd) {
    var range = [];
      for (var rowI = rowStart, row; rowI <= rowEnd; rowI++) {
        row = rowContainer.rows[rowI];
        var rowRange = [];
        for (var celli = colStart, cell; celli <= colEnd; celli++) {
          cell = row.cells[celli];
          rowRange.push(cell);
        }
        range.push(rowRange);
      }
    return range;
   };
  
  /*==========
  #METHODS
  ==========*/
  
  this.addBody = function() {
    this.body = this._Body();
  };

  /*==========
  #METHODS #CELLS
  ==========*/

  this.addCell = function (type, row,index, text) {
    index = index !== undefined ? index : -1;
    var cell = this._Cell(type, row, text, index);
    
    return cell;
  
  };
  this.delCell = function(row, index) {
    row.deleteCell(index);
  };
  
  /*==========
  #METHODS #ROWS
  ==========*/
  
  this.addRow = function(rowContainer, index, nCells) {
    nCells = nCells !== undefined ? nCells : rowContainer.rows[rowContainer.rows.length-1].cells.length;
    var row = this._Row(rowContainer, index, nCells);
    
    return row;
  };

  this.delRow = function(rowContainer, index) {
    rowContainer.deleteRow(index);
  };

//#TODO consider merging addrows with addrow?
  this.addRows = function(rowContainer, nRows, nCells) {
    for (var i = 0; i < nRows; i++) {
      this.addRow(rowContainer, -1, nCells);
    }
  };

  this.delRows = function(rowContainer, start, end) {
    end = end !== undefined ? end : start + 1;
    
    for (var i = start; i < end; i++) {
      this.delRow(rowContainer, i);
    }
  };
  
  /*==========
  #METHODS #COLS
  ==========*/

//#TODO figure out what we're going to call the thing that adds the <col> element
//#TODO why is there an addrows, but no addcols?
  this.addCol = function(rowContainer, index) {
    var _this = this;
    var rows = rowContainer.rows;

    [].forEach.call(rows, function(row) {
      _this.addCell('td', row, index );
    });
  };
  
  this.delCol = function(rowContainer, start, end) {
    var _this = this;
    var rows = rowContainer.rows;

    end = end !== undefined ? end : start + 1;

    [].forEach.call(rows, function (row) {
      var cells = row.cells;
      [].forEach.call(cells, function (cell, index) {
        if (index >= start && index < end) {
          _this.delCell(row,index);
        }
      });
    });
  };

  /*==========
  #METHODS #COLGROUP
  ==========*/
  
  this.addColGroup = function(index) {
    var colgroup = document.createElement('colgroup');
    this.table.insertBefore(colgroup, this.table.querySelector(':first-child'));
  };

  this.delColGroup = function(index) {
    var colgroups = this.table.querySelectorAll('colgroup');
    this.table.removeNode(colgroups[index]);
  };

  this.addColGroups = function(nCols) {
    for (var i = 0; i < nCols; i++) {
      this.addcolGroup(-1);
    }
  };

  /*==========
  #METHODS #HEADER #FOOTER
  ==========*/
  this.addHeader = function(nRows, nCells) {
    if (nRows > 0 && this.table.tHead === null) {
      this.header = this._Header();
      this.addRows(this.header, nRows, nCells);
    }
  };

  this.delHeader = function() {
    this.table.deleteTHead();
  };

  this.addFooter = function(nRows, nCells) {
    if (nRows > 0 && this.table.tFoot === null) {
      this.footer = this._Footer();
      this.addRows(this.footer, nRows, nCells);
    }
  };

  this.delFooter = function() {
    this.table.deleteTFoot();
  };
  
  /*==========
  #METHODS #RANGE
  ==========*/
  //This is the first step in merging cells
  this.getRange = function (rowContainer, startC, startR, endC, endR) {
    //make sure that the start is always less than the end
    endC = endC < startC ? [startC, startC = endC] : endC;
    endR = endR < startR ? [startR, startR = endR] : endR;


   //if the requested range is bigger than the table, stop at the end of the table
    if (endR > rowContainer.rows.length) {
      endR = rowContainer.rows.length;
    }
    // go to the ending row, and check the number of cells there to see if we overreached
    if (endC > rowContainer.rows[endR].cells.length) {
      endC = rowContainer.rows[endR].cells.length;
    }
    var range = this._Range(rowContainer, startC, startR, endC, endR);
    return range;
  };

  this.getRowRange = function (rowContainer, rowIndex, startC, endC) {
    var range = this.getRange(rowContainer, startC, rowIndex, endC, rowIndex);
    return range[0];
  };
  
  this.delRange = function (range) {
    range.forEach(function(item) {
      if (Array.isArray(item)) {
        item.forEach(function(child) {
          child.parentElement.removeChild(child);
        });
      } else {
        item.parentElement.removeChild(item);
      }
    });
  };

  this.mergeRange = function (range) {
    //first, take out the first cell
    var _this = this;
    var is2d = Array.isArray(range[0]);
    var mergeTo =is2d ? range[0].shift() : range.shift();
    //#TODO Sort out what to do when merging an already merged cell
    if (!is2d) {
      this.delRange(range);
      mergeTo.colSpan = range.length + 1;
    } else {
        mergeTo.colSpan =  range[range.length-1].length;
      mergeTo.rowSpan = range.length;
            this.delRange(range);
    }
  };
  
  /*==========
  #METHODS #METADATA
  ==========*/
  
  this.addCaption = function (text) {
    if (text !== undefined && text !== '') {
      this.caption = this._Caption(text);  
    }
  };
  
  this.delCaption = function () {
    this.table.deleteCaption();
  };

  this.addSummary = function (text) {
    if (text !== undefined && text !== '' ) {
      this.table.summary = text;
    }
  };
  
  this.delSummary = function () {
    this.table.removeAttribute('summary');
  };
  
  /*==========
  #METHODS #INIT
  ==========*/
  
  this.buildTable = function (config) {
      if (config.classes.table !== undefined && config.classes.table !== '') {
        this.table.classList.add(config.classes.table);
      }
      this.addBody();
      this.addHeader(config.layout.header.rows, config.layout.header.cols);
      this.addFooter(config.layout.footer.rows, config.layout.footer.cols);
      this.addRows(this.body, config.layout.body.rows, config.layout.body.cols);
      this.addSummary(config.meta.summary);
      this.addCaption(config.meta.caption);
    };
 
  this.buildTable(this.config);

};