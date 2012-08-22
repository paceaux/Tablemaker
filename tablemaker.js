var $tContainer;        //thing that holds the table
var $t;                 //the table
var $tcapt;             // table caption
var $tsumm;             //table summary
var $tr;                //table rows
var $td;                //table cells
var tri = 1;            // for counting rows, we sstart with one
var $ts;
var tdi = 0;            // for counting table cells, starts at 0
$tContainer = $('#tablemaker');
$t = $tContainer.find('table');
$t.content = {};
$t.controls = {};
$t.info = {};
$t.info.bodyRowCount = 1;
$t.info.cellCount = 0;
$t.info.colGSpans = 0;
$t.info.colGCount = 0;
$tcapt = $t.find('caption');
$th = $t.find('thead');
$tf = $t.find('tfoot');
//----------TODO----------
//  1  a loop for merging up that checks to see if the row has the right amount of cells
//  2  a colgroup editor: add spans to col groups. also visually show how colgroups are spread
//  3  Custom row Width
//  4  When merging... need to preserve data some how
//  5  Short cut for: new column/ row, col width
//   6 
//
//----------/TODO---------


//---
//ADD TABLE PARTS
//---

//THEAD
function addHead() {
    $th = $t.find('thead');
    if ($th.length === 0) {
      $t.prepend("<thead>");
        $('.tr1').eq(0).clone(true).appendTo($t.find('thead'));       
    } else if($th.length > 0){
        $th.detach();
    }
return $th; 
}

//TFOOT
function addFoot() {
    $tf = $t.find('tfoot');
    if($tf.length === 0) {
    $t.find('tbody').before("<tfoot>"); //foot should come after thead but before tbody
    $('.tr1').eq(0).clone(true).appendTo($t.find('tfoot'));       
    } else if ($tf.length > 0){
       $tf.detach();
    }
    return $tf;
}

//CAPTION
$('#tcaption').change(function(e) {  
    $t.content.caption = $(this).val();
    if ($t.content.caption === "" || $t.content.caption === null) {
        $t.find('caption').remove();
        $t.content.caption = null;
    } else if ($t.find('caption').index() === -1) {
        $t.prepend("<caption></caption>");
        $tcapt = $t.find('caption');
    }
    $t.find('caption').html($t.content.caption);
return;
});

//SUMMARY 
$('#tsummary').change(function(e) {
    $t.content.summary = $(this).val();
    if ($t.content.summary === null || $t.content.summary === "") {
     $t.removeAttr('summary');  
     $t.info.summary = null; 
    } else {
        $t.attr("summary", $t.content.summary);
    }
    return;
});

//ROWS
function addRow() {
    $t.info.bodyRowCount += 1;

    $tr = $t.find('tbody tr:last-child').clone().appendTo($t).attr('class', 'tr' + $t.info.bodyRowCount);
    $('[name="rowNum"]').val($t.info.bodyRowCount);      // update number counter
    return $tr;
}
function remRow() {
    while ($t.info.bodyRowCount > 1) {
        $remT = $('tbody tr:last-child').remove();
        $t.info.bodyRowCount -=1;
        $('[name="rowNum"]').val($t.info.bodyRowCount);  // update the number counter
        return $remT;
    }
    return;
}

//CELLS
function addCol() {
    $tr = $('.tr1');          //TR IS THE FIRST TABLE ROW (ONLY ONE NOT USER CREATED)
    $t.info.cellCount +=1;
    $td = $tr.append('<td></td>');
   
    $t.find('thead tr, tfoot tr').live().append('<td>');
    $tr.find('td').eq($t.info.cellCount-1).addClass('td' + $t.info.cellCount);
    if ($t.info.bodyRowCount > 1) {                 //in case we added columns after we added rows
        $('tr').slice(1).append("<td>");
    }
    $('[name="colNum"]').val($t.info.cellCount); // update the number counter
    $t.info.colGSpans++;
    return $td;
}

function remCol() {
    while ($t.info.cellCount > 1) {
        tds = $tr.find('td').length;
        $remTd = $('tr td:last-child').remove();
        $t.info.cellCount-= 1;
        if ($t.info.cellCount <= 0) {
            $t.info.cellCount = 0;
        } 
        $('[name="colNum"]').val($t.info.cellCount);
        $t.info.colGSpans--;
        return $remTd;
    }
    return;
}
//COLUMN GROUPS
function addColG() {
    if ($t.info.colGCount < $t.info.cellCount){ //can't have more colgroups than td's
        $t.info.colGCount +=1;
        $t.info.colGSpans -=1;
        $t.prepend("<colgroup></colgroup>");
        $('[name="colGNum"]').val($t.info.colGCount);
    }
}
function remColG() {
    if ($t.info.colGCount > 0){
        $t.info.colGCount -=1;
        $t.info.colGSpans +=1;
        $t.find('colgroup:first-child').remove();
        $('[name="colGNum"]').val($t.info.colGCount);
    }
}

//---
//IN-TABLE EDITING
//---

//set current, first, and last editable    
$("td, th").live("mouseover focus", function(e) { 
    $(this).attr('contenteditable', true);
    $(this).next('td, th').attr('contenteditable',true);
    $(this).prev('td, th').attr('contenteditable', true);

    //set the first td in next row editable
    if( $(this).is(':last-child')){         
        $(this).parents('tr').next('tr').find('td:first-child, th:first-child').attr('contenteditable',true);
    }else if( $(this).is(':first-child')){  //set last td of last row editable
        $(this).parents('tr').prev('tr').find('td:last-child, th:last-child').attr('contenteditable',true);    
   }
});

//remove editable
$("td, th").live("mouseout focusout blur mouseleave", function(e) { 
    $(this).removeAttr('contenteditable');
    $(this).prev('td, th').removeAttr('contenteditable');
    $(this).next('td, th').removeAttr('contenteditable');
    $(this).parents('tr').prev('tr').find(':last-child').removeAttr('contenteditable');
    liveTableHTML();
});

//CHANGE TH TO TD  
//td doubleclick    
$('td').live('dblclick', function(e){
    var thisClass = $(this).attr('class');
$(this).replaceWith( "<th class=\""+thisClass+"\">"+ $(this).text() +"</th>" );
});

//th doubleclick
$('th').live('dblclick', function(e){
    var thisClass = $(this).attr('class');
    $(this).replaceWith( "<td class=\""+thisClass+"\">"+ $(this).text() +"</td>" );
});
//MERGE FUNCTIONS
function mergeToRight(el){
    if ($(el).parents('tr').is(':only-child')){
        remCol();
    } else{
        if(!$(el).is(':last-child')){
            var rowSpan = $(el).attr('rowspan') == null ? parseInt(1,10) : parseInt($(el).attr('rowspan'),10);
            var position = $(el).index();
            var rowPosition = $(el).parents('tr').index();
            var nextSpan = $(el).next('td, th').attr('colspan') == null ? 1 : parseInt($(el).next('td,th').attr('colspan'),10);
            var span = $(el).attr('colspan') == null ? (1 + nextSpan) : parseInt($(el).attr('colspan'),10)+nextSpan;
            $(el).attr('colspan', span); 
            if (rowSpan == 1){
                $(el).next().remove();
            } else if(rowSpan > 1){
                 $(el).next().remove();
                var start = rowPosition+1;
                var stop = rowPosition + rowSpan;
                for (i = start; i < stop; i++){
                $t.find('tr').eq(i).find('td, th').eq(position).remove();
                }

                    
                
                }
            }
        }
}
function mergeToLeft(el){
        if ($(el).parents('tr').is(':only-child')){
            remCol();
    }else {
    if (!$(el).is(':first-child')){
        var nextSpan = $(el).prev('td, th').attr('colspan') == null ? 1 : parseInt($(el).prev('td,th').attr('colspan'),10);
        var span = $(el).attr('colspan') == null ? (1+nextSpan) : parseInt($(el).attr('colspan')+nextSpan,10);
        $(el).prev().attr('colspan', span);
        $(el).remove();  
    } 
        }
}
function mergeUp(el){
    //TODO: NEED A LOOP TO CHECK AND SEE
    //      IF ROWCELLS == PREVROWCELLS AND START REMOVING
    //      WHEN THEY MATCH 
    if (!$(el).parents('tr').is(':first-child')){ 
        var rowPosition = $(el).parents('tr').index();
        var rowCells = $(el).parents('tr').find('td, th').length;
        var selfRowSpan = $(el).attr('rowspan') == null ? 1 : parseInt($(el).attr('rowspan'),10);
        var selfColSpan = $(el).attr('colspan') == null ? 1 : parseInt($(el).attr('colspan'),10);
        var position =  parseInt($(el).index(),10);
        var nextRow = parseInt(rowPosition-1,10);
        var prevRow = $(el).parents('tbody').find('tr').eq(nextRow);
        var nextRowCells = $(prevRow).find('td,th').length;
        var nextSpan = $(el).parents('tbody').find('tr').eq(nextRow).find('td, th').eq(position).attr('rowspan') == null ? 1 : parseInt($(el).parents('tbody').find('tr').eq(nextRow).find('td, th').eq(position).attr('rowspan'),10); 
        var newSpan = selfRowSpan + nextSpan;

        $(prevRow).find('td, th').eq(position).attr("rowspan",newSpan);   
        $(el).remove();
    }
}

function mergeDown(el){
    if (!$(el).parents('tr').is(':last-child')){
        var rowPosition = $(el).parents('tr').index();
        var selfRowSpan = $(el).attr('rowspan') == null ? 1 : parseInt($(el).attr('rowspan'),10);
        var selfColSpan = $(el).attr('colspan') == null ? 1 : parseInt($(el).attr('colspan'),10);
        var position =  $(el).index();
        var nextRow = parseInt(rowPosition + selfRowSpan,10);
        var nextSpan = $(el).parents('tbody').find('tr').eq(nextRow).find('td, th').eq(position).attr('rowspan') == null ? 1 : parseInt($(el).parents('tbody').find('tr').eq(nextRow).find('td, th').eq(position).attr('rowspan'),10); 
        var newSpan = selfRowSpan + nextSpan;
        
        $(el).attr('rowspan', newSpan);
        //Account for the cell having Column Spans
        if (selfColSpan == 1){
            $(el).parents('tbody').find('tr').eq(nextRow).find('th, td').eq(position).remove();
        } else {
                $(el).parents('tbody').find('tr').eq(nextRow).find('th, td').filter(function (index) {
                return index >= position && index <= parseInt(position + (selfColSpan-1),10) ;
                }).remove();
            }
    }
}
 
//IN-TABLE ADJUSTMENTS 
function showRowHeightAdjuster(el){
    if ($t.controls.rowAdjuster ==  null || $t.controls.rowAdjuster == true) {
        $t.controls.rowAdjuster = false;
        $('.rowAdjustContainer').show();
        $t.controls.thisRow  = $(el).parents('tr');
        var parentRowOffset = $t.controls.thisRow.offset();
        var rowIndex = $(el).parents('tr').index(); //use index in case helper classes removed
        $('.rowAdjustContainer').offset({left: (parentRowOffset.left) + 100,top: parentRowOffset.top});
    } else if($t.controls.rowAdjuster == false ) {
        $t.controls.rowAdjuster = true;
        $('.rowAdjustContainer').hide();
    }
}
function adjustRowHeight(val){
    $t.controls.thisRow.css("height", val);
}    
    
//KEYSTROKES IN THE TABLE
$t.find('td').live('keydown', function(e){
    var el = $(this);
    if (e.shiftKey){
        switch (e.keyCode){
            //right + shift
            case  39:              
                mergeToRight(el);
                break;
            case 37 :
            //left + shift
                mergeToLeft(el);                    
                break;
            //down + shift
            case 40 : 
                mergeDown(el);
                 break;
            //up + shift
            case 38: 
                mergeUp(el);
                break;
            default: break;                 
            }
    };
    if (e.ctrlKey){
        switch (e.keyCode){
            //shift +h
            case 72: 
                showRowHeightAdjuster(el);
                break;
            default: break;                 
            }
    };
    //plus
    if (e.keyCode == 82){
        switch( e.keyCode){
            case 187:
                alert(e.keyCode);
                addRow();
                break;
            case 189: 
                alert(e.keyCode);
                remRow();
                break;
                
            default:break;
        }
   };
    //minus

});
//---
//STYLE FUNCTIONS 
//---    
    //add class to tables
$('#tableStyle').change(function(e){
    var val = $(this).val();
    if ($(this).val() === null || $(this).val() === ""){
        $t.info.tClass = "";
        $t.removeAttr('class');
    }   else {
        $t.info.tClass =$(this).val(); 
            $t.addClass($(this).val());
        }
});
//add cell spacing and padding
$('#cellPadding').change(function(e){
    var val = $(this).val();
    $t.attr("cellpadding", $(this).val());
 return;       
});
$('#cellSpacing').change(function(e){
    var val = $(this).val();
    $t.attr("cellSpacing", $(this).val());
 return;       
}); 
//add classes to evens and odds            
$('input[type="checkbox"]').change(function(e){
    if($(this).is(':checked')){
        $t.find($(this).attr('data-element')).addClass($(this).val());
    } else if(!$(this).is(':checked')){
            $t.find($(this).attr('data-element')).removeClass($(this).val());
        }     
});

//---
//CLASS FUNCTIONS
//---

//CUSTOM CLASSES    
function custClass(el, val){
    var el = el;
    var val = val;
    //remove the previous class that might have been there
$t.find(el+'.cust'+$t.info.custClass).removeClass('cust'+$t.info.custClass);
        if ($t.info.hasCustom === true){                
$t.find(el+':nth-child('+val+')').addClass('cust'+val);
        $t.info.custClass = val;
    }
}
//CLEAR CLASSES
function clearClasses(el){
    var el = el;
 $t.find(el).removeAttr('class');   
    
 } 
//HELPER CLASSES
function helperClasses(el){
    var el = el;
    if (el == "td"){
    $t.find('tr td').live().each(function(i){
        var index = $(this).index()+1;
        $(this).addClass("td"+index);
    });
}
    if (el == "tr"){
    $t.find('tbody tr').live().each(function(i){
        var index = $(this).index()+1;
        $(this).addClass("tr"+index);
    });    
    }   
}    
//EXPORT THE CODE
$( "#tableHTML" ).draggable();
    
//create the export code function
function liveTableHTML(){
    var tableHTML = $tContainer.html();
    $('.tableCode').text(tableHTML);    
}
//---    
//BUTTONS AND FORMS
//---

$('#colNum').focus(function(e){ //columns
        tdi = $(this).val();
    }).change(function(e){
        if ($(this).val() < tdi) {
            remCol();
        } else if ($(this).val() > tdi) {
            addCol();
            }
    return tdi;
});
$('#rowNum').focus(function(e) { //rows
    tri = $(this).val();
}).change(function(e) {
    if ($(this).val() < tri) {
        remRow();
    } else if ($(this).val() > tri) {
        addRow();
    }
return tri;
});

 //plus minus toggles
$(".toggle").toggle( 
    function() {
    $(this).text("-");
    }, function() {
    $(this).text("+");
});
//custom rule toggle   
$('.addCustom').toggle(function(e){
    $(this).next().show();
    custVal = $(this).next().val();
    },function(e){
    $(this).next().hide();
});
//RANGE BUTTONS
$('input[type="range"]').change(function(e) { 
    $(this).attr("data-value", $(this).val());
});
//table width    
$('#twidth').change(function(e) {   
    var tw = $(this).val() + 'px';
    $t.width(tw);
});
//row height
$('#rheight').change(function(e) {  
    var rh = $(this).val() + 'px';
    $t.find("tr").height(rh);
});
 //column width
$('#cwidth').change(function(e) {  
    var cw = $(this).val() + 'px';
    $t.find("tr:first-child td").width(cw);
});
//HELPER CLASS TOGGLE
$('.helperClasses').change(function(e){
    var el = $(this).attr('data-element');
    if ($(this).is(':checked')){
        clearClasses(el);
    } else {
        helperClasses(el);
    }   
});    
//CUSTOM NTH-CHILD BUTTON    
$('.custom').blur(function(e){
        val = $(this).val();
        el = $(this).attr('data-element');
        //remove the previous class that might have been there
    if (val !== null || val !== 0){
    $t.info.hasCustom = true;
        if(val >= 4){
        $(this).after('th');
        } else if (val == 3){
          $(this).after('rd');

        } else if(val == 2){
          $(this).after('nd');

        } else {
          $(this).after('st');

        }
        custClass(el, val);
    } else {
    $t.info.hasCustom = false;
    }
});    
    
//every time a user updates something, update the code
$('#editor input, #editor button, #editor textarea').live('click change focusout blur', function(e){
    liveTableHTML();
    console.log($t.info.colGSpans);
});
//make sure we update the code if they view it, too    
$('#getHTML').toggle(
    function(){
    liveTableHTML();
        $('#tableHTML').show();
        $('#getHTML').text("Hide Code");
    },function(){
        $('#tableHTML').hide();
        $('#getHTML').text("Get Code");
});
//what if you copy and paste code into the code viewer?
$('.tableCode').change(function(e){
    val = $(this).val();
        $t.html(val);
    $t.info.bodyRowCount = $t.find('tr').live().length;
    $t.info.cellCount = $t.find('tr:first-child td').live().length;
    
}); 

$('#rowAdjuster').change(function(e){
    var val = $(this).val();
    adjustRowHeight(val);
}); 

​