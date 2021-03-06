console.clear();



/*==========
#TABLEMAKER
==========*/

/*
#TODOS
1. create add table Col <col> functionality
2. create ability to designate which <col> for which colgroup
3. create a "switch in place" method for converting a td into a th
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
    
    if (this.config.classes.cols.even && this.config.classes.cols.even !== '' && (row.cells.length ) %2 === 0 ) {
      cell.classList.add(this.config.classes.cols.even);
    }
    
    if (this.config.classes.cols.odd && this.config.classes.cols.odd !== '' && !((row.cells.length ) %2 === 0) ) {
      cell.classList.add(this.config.classes.cols.odd);
    }
    
    if (this.config.classes.cols.nth && this.config.classes.cols.nth !== '' && ((row.cells.length)%this.config.classes.cols.nth === 0) ) {
      cell.classList.add('nth--' + this.config.classes.cols.nth);
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
 
    if (this.config.classes.rows.even && this.config.classes.rows.even !== ''  && (rowContainer.rows.length) %2 === 0 ) {
      row.classList.add(this.config.classes.rows.even);
    }
    
    if (this.config.classes.rows.odd && this.config.classes.rows.odd !== '' && !((rowContainer.rows.length) %2 === 0) ) {
      row.classList.add(this.config.classes.rows.odd);
    }
    
    if (this.config.classes.rows.nth  && this.config.classes.rows.nth !== '' && ((rowContainer.rows.length)%this.config.classes.rows.nth === 0) ) {
      row.classList.add('nth--' + this.config.classes.rows.nth);
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

  this.updateLayout = function (rowContainer, prop, value) {
    var containerName = rowContainer.nodeName;
    var layoutProp;

    switch(containerName) {
        case "TBODY":
          layoutProp = 'body';
          break;
        case 'THEAD':
          layoutProp = 'header';
          break;
        case 'TFOOT':
          layoutProp = 'footer';
          break;
        default:
          break;
    }
    this.config.layout[layoutProp][prop] = value;
    return this.config[layoutProp];
  };
  
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
  //#TODO make sure changes to the rows are changes to the config
  this.addRow = function(rowContainer, index, nCells) {
    nCells = nCells !== undefined ? nCells : rowContainer.rows[rowContainer.rows.length-1].cells.length;
    var row = this._Row(rowContainer, index, nCells);

    this.updateLayout(rowContainer,'rows', rowContainer.rows.length);

    return row;
  };

  this.delRow = function(rowContainer, index) {
    rowContainer.deleteRow(index);
    this.updateLayout(rowContainer,'rows', rowContainer.rows.length);
  };

//#TODO consider merging addrows with addrow?
  this.addRows = function(rowContainer, nRows, nCells) {
    for (var i = 0; i < nRows; i++) {
      this.addRow(rowContainer, -1, nCells);
    }
  };

  this.delRows = function(rowContainer, start, end) {
    end = end !== undefined ? end : rowContainer.rows.length-1;
    for (var i = end; i >= start; i--) {
      this.delRow(rowContainer, i);
    }
  };
  
  /*==========
  #METHODS #COLS
  ==========*/
//#TODO Mke sure that changes to the cols also adjust changes to the config
//#TODO figure out what we're going to call the thing that adds the <col> element
  this.addCol = function(rowContainer, index) {
    var _this = this;
    var rows = rowContainer.rows;
    index = index !== undefined ? index : -1;

    [].forEach.call(rows, function (row) {
      _this.addCell('td', row, index );
      _this.updateLayout(rowContainer, 'cols',  row.cells.length + 1);
    });
  };

  this.addCols = function (rowContainer, nCols, index) {
    for (var i = 0; i < nCols; i++) {
      this.addCol(rowContainer, index);
    }
  };
  
  this.delCol = function(rowContainer, index) {
    var _this = this;
    var rows = rowContainer.rows;

    var end = index;

    [].forEach.call(rows, function (row) {
        _this.delCell(row, index);
    });

    _this.updateLayout(rowContainer, 'cols',  rows[0].cells.length);
  };

  this.delCols = function(rowContainer, start, end) {
    var _this = this;
    var rows = rowContainer.rows;

    end = end !== undefined ? end : rowContainer.rows[0].cells.length -1;

    [].forEach.call(rows, function (row) {

      for (var i = end; i>= start; i--) {
        _this.delCell(row, i)
      }

    });
    _this.updateLayout(rowContainer, 'cols',  rows[0].cells.length);
  };
  /*==========
  #METHODS #COLGROUP
  ==========*/
  
  this.addColGroup = function(index) {
    var colgroup = document.createElement('colgroup');
    this.table.insertBefore(colgroup, this.table.querySelector(':first-child'));
    this.config.layout.colgroups++;
    return colgroup;
  };

  this.delColGroup = function(index) {
    var colgroups = this.table.querySelectorAll('colgroup');
    this.table.removeNode(colgroups[index]);
    this.config.layout.colgroups--;
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

    var colspans = 0;
    var rowspans = 0;

    if (!is2d) {
      range.forEach(function (cell) {
        colspans = cell.colSpan + colspans;
      });

      this.delRange(range);
      mergeTo.colSpan = mergeTo.colSpan + colspans;

    } else {
      range.forEach(function (childRange) {
        childRange.forEach(function (cell) {
          colspans = cell.colSpan + colspans;
          rowspans = cell.rowSpan + rowspans;
        });
      });
      
      mergeTo.colSpan = mergeTo.colSpan + colspans ;
      mergeTo.rowSpan = range.length;
      this.delRange(range);
    }
    return mergeTo;
  };
  
  /*==========
  #METHODS #METADATA
  ==========*/
  
  this.addCaption = function (text) {
    if (text !== undefined && text !== '') {
      this.caption = this._Caption(text);  
      this.config.meta.caption = text;
    }
  };
  
  this.delCaption = function () {
    this.table.deleteCaption();
    this.config.meta.caption = '';
  };

  this.addSummary = function (text) {
    if (text !== undefined && text !== '' ) {
      this.table.summary = text;
      this.config.meta.summary = text;
    }
  };
  
  this.delSummary = function () {
    this.table.removeAttribute('summary');
    this.config.meta.summary = '';
  };

    /*==========
  #METHODS #CLASSES
  ==========*/
  this.addClasses = function (rowContainer, selector, classnames) {
    var collection = rowContainer.querySelectorAll(selector);

    classnames = Array.isArray(classnames) ? classnames : classnames.split(' ');

    [].forEach.call(collection, function (item) {

        classnames.forEach(function (classname) {
          item.classList.add(classname);
        })
    });
  };

  this.delClasses = function (rowContainer, selector, classnames) {
    var collection = rowContainer.querySelectorAll(selector);

    classnames = classnames !== undefined ? classnames : selector.substr(1);
    classnames = Array.isArray(classnames) ? classnames : classnames.split(' ');

    [].forEach.call(collection, function (item) {

        classnames.forEach(function (classname) {
          item.classList.remove(classname);
        })
    });
  };
  
  this.refreshRowClasses = function (rowContainer) {
    var _this = this,
      rowClasses = _this.config.classes.rows;
    var rows = rowContainer.rows;

    [].forEach.call(rows, function (row, i) {
      i = i+1;

      if (rowClasses.even && rowClasses.even !== ''  && i %2 === 0 ) {
        row.classList.add(rowClasses.even);
      }
      
      if (rowClasses.odd && rowClasses.odd !== '' && !(i %2 === 0) ) {
        row.classList.add(rowClasses.odd);
      }
      
      if (rowClasses.nth  && rowClasses.nth !== '' && (i%rowClasses.nth === 0) ) {
        row.classList.add('nth--' + rowClasses.nth);
      }
    });
  };

  this.refreshColClasses = function (rowContainer) {
    var _this = this,
      colClasses = _this.config.classes.cols;

    var rows = rowContainer.rows;

    [].forEach.call(rows, function (row) {

      [].forEach.call(row.cells, function (cell, i) {
        i = i+1;

        if (colClasses.even && colClasses.even !== ''  && i %2 === 0 ) {
          cell.classList.add(colClasses.even);
        }
        
        if (colClasses.odd && colClasses.odd !== '' && !(i %2 === 0) ) {
          cell.classList.add(colClasses.odd);
        }
        
        if (colClasses.nth  && colClasses.nth !== '' && (i%colClasses.nth === 0) ) {
          cell.classList.add('nth--' + colClasses.nth);
        }
      });
    });
  };

  this.refreshClasses = function(rowContainer) {
    this.refreshColClasses(rowContainer);
    this.refreshRowClasses(rowConainer);
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