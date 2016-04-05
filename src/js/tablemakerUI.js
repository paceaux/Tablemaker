  /*==========
  #TABLEMAKERUI 
  ==========*/
/*
#TODOS
1. wire up the add table header/footer
2. wire up colgroups
3. wire up the even/odd/ classes
4. wire up the nth classes
5. wire up the table class
6. wire up up table width/ cell padding/spacing
7. wire up column width / row height
*/


var tableMakerUI = tableMakerUI || {};

tableMakerUI.init = function() {
  var config = tmDefaultConfig;
  
  //#TODO move the config changes somewhere else, so the init is less cluttered
  
  // this is really here just to test out different features of TableMaker
  config.layout.body.rows = 4;
  config.layout.body.cols = 4;
  config.classes.rows.even = 'tr--even';
  config.classes.rows.odd = 'tr--odd';
  config.classes.rows.nth = 3;
  config.classes.cols.even = 'td--even';
  config.classes.cols.nth = 3;
  config.classes.cols.odd = 'td--odd';
  
  this.outputTable = new TableMaker(config);
  
  this.bindEvts(this.selectors, this.callbacks);
  this.showTable(this.outputTable.table);
};

tableMakerUI.selectors = {
  addHead: '#addHead',
  addFoot: '#addFoot',
  tcaption: '#tcaption',
  tsummary: '#tsummary',
  addCol: '#addCol',
  remCol: '#remCol',
  colNum: '#colNum',
  addRow: '#addRow',
  remRow: '#remRow',
  rowNum: '#rowNum',
  addColG: '#addColG',
  remColG: '#remColG',
  colGNum: 'colGNum',
  evenRow: '#evenRow',
  oddRow: '#oddRow',
  evenCell: '#evenCell',
  oddCell: '#oddCell',
  outputContainer: '#tablemaker',
};

tableMakerUI.functions = {
  updateRows: function(amt) {
    this.outputTable.addRows(this.outputTable.body,amt);
  },
  updateCols: function(amt) {
    this.outputTable.addCols(this.outputTable.body,amt);
  },
  updateColGroups: function(amt) {

  },
  updateClasses: function(selector, className) {

  },
  updateCaption: function (text) {
    if (text !== '' || text !== undefined) {
      this.outputTable.addCaption(text);
    }
    if (text === '' || text === undefined) {
      this.outputTable.delCaption();
    }
  },
  updateSummary: function(text) {
    this.outputTable.addSummary(text);
  },
  updateRowHeight: function() {

  },
  updateColWidth: function() {

  }
};

tableMakerUI.showTable = function (table) {
  var output = document.querySelector(this.selectors.outputContainer);
  output.appendChild(table);
};

tableMakerUI.callbacks = {
  addCol : function () {
    var _this = tableMakerUI,
        colNum = document.querySelector(_this.selectors.colNum);
        
    colNum.value = parseInt(colNum.value, 10) + 1;
    
      if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          colNum.dispatchEvent(evt);
      }
      else {
          colNum.fireEvent("onchange");
      }
  },
  remCol : function () {
    var _this = tableMakerUI,
        colNum = document.querySelector(_this.selectors.colNum);
        
     colNum.value = parseInt(colNum.value, 10) -1;
     
      if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          colNum.dispatchEvent(evt);
      }
      else {
          colNum.fireEvent("onchange");
      }
  },
  changeCols: function () {
    var _this = tableMakerUI,
        colNum = document.querySelector(_this.selectors.colNum),
        cols = parseInt(colNum.value, 10),
        dif = cols - _this.outputTable.body.rows[0].cells.length;

    // todo: move this into the functions.updatecols
    if (cols > _this.outputTable.body.rows[0].cells.length) {
      _this.outputTable.addCols(_this.outputTable.body, dif);
    }
    
    if (cols < _this.outputTable.body.rows[0].cells.length) {
      _this.outputTable.delCol(_this.outputTable.body, (_this.outputTable.body.rows[0].cells.length -1) + dif, _this.outputTable.body.rows[0].cells.length -1);
    }
    
  },
  addRow : function () {
    var _this = tableMakerUI,
      rowNum = document.querySelector(_this.selectors.rowNum);
      
    rowNum.value = parseInt(rowNum.value, 10) + 1;
    
       if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          rowNum.dispatchEvent(evt);
      } else {
          rowNum.fireEvent("onchange");
      }
  },
  remRow : function () {
    var _this = tableMakerUI,
        rowNum = document.querySelector(_this.selectors.rowNum);
        
     rowNum.value = parseInt(rowNum.value, 10) -1 ;
     
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      rowNum.dispatchEvent(evt);
    } else {
      rowNum.fireEvent("onchange");
    }
  },
  changeRows: function () {
    var _this = tableMakerUI,
        rowNum = document.querySelector(_this.selectors.rowNum),
        rows = parseInt(rowNum.value, 10),
        dif = rows - _this.outputTable.body.rows.length;
    
    //todo: move this into the functions.updaterows
    if (rows > _this.outputTable.body.rows.length) {
      _this.outputTable.addRows(_this.outputTable.body, dif);
    }
    
    if (rows < _this.outputTable.body.rows.length) {
      _this.outputTable.delRows( _this.outputTable.body,(_this.outputTable.body.rows.length ) + dif);
    }
  },
  changeCaption: function (e) {
    var _this = tableMakerUI,
        text = e.target.value;
        
    _this.functions.updateCaption.call(tableMakerUI, text);
  },
  changeSummary: function (e) {
    var _this = tableMakerUI,
        text = e.target.value;
        
    _this.functions.updateSummary.call(tableMakerUI, text);
  },
  changeRowClass: function (e) {
    var _this = tableMakerUI;
    if (_this.outputTable.config.classes.rows[e.target.name] !== '') {
      _this.outputTable.delClasses(_this.outputTable.body,'.'+_this.outputTable.config.classes.rows[e.target.name]);
    }

    _this.outputTable.config.classes.rows[e.target.name] = e.target.value;
    _this.outputTable.refreshRowClasses(_this.outputTable.body);
  },
  changeColClass: function (e) {
    var _this = tableMakerUI;

    console.log('.'+_this.outputTable.config.classes.cols[e.target.name]);
    if (_this.outputTable.config.classes.cols[e.target.name] !== '') {
      _this.outputTable.delClasses(_this.outputTable.body,'.'+_this.outputTable.config.classes.cols[e.target.name]);
    }
      
    _this.outputTable.config.classes.cols[e.target.name] = e.target.value;
    _this.outputTable.refreshColClasses(_this.outputTable.body);
  },
};

tableMakerUI.bindEvts = function(selectors, callbacks) {
  document.querySelector(selectors.colNum).addEventListener('change', callbacks.changeCols);
  document.querySelector(selectors.addCol).addEventListener('click', callbacks.addCol);
  document.querySelector(selectors.remCol).addEventListener('click', callbacks.remCol);  

  document.querySelector(selectors.rowNum).addEventListener('change', callbacks.changeRows);
  document.querySelector(selectors.addRow).addEventListener('click', callbacks.addRow);
  document.querySelector(selectors.remRow).addEventListener('click', callbacks.remRow);

  document.querySelector(selectors.tcaption).addEventListener('change', callbacks.changeCaption);
  document.querySelector(selectors.tsummary).addEventListener('change', callbacks.changeSummary);

  document.querySelector(selectors.evenRow).addEventListener('change', callbacks.changeRowClass);
  document.querySelector(selectors.oddRow).addEventListener('change', callbacks.changeRowClass);

  document.querySelector(selectors.evenCell).addEventListener('change', callbacks.changeColClass);
  document.querySelector(selectors.oddCell).addEventListener('change', callbacks.changeColClass);
};

tableMakerUI.init();