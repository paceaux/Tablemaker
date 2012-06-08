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
$tcapt = $t.find('caption');
$th = $t.find('thead');
$tf = $t.find('tfoot');

//ADD TABLE PARTS
function addHead() {            //thead
    $th = $t.find('thead');

    if ($th.length ==0){
      $t.prepend("<thead>");
        $('.tr0').eq(0).clone(true).appendTo($t.find('thead'));       
    } else if($th.length >0){
        $th.detach()
    }
    
return $th;
      
};
function addFoot() {            //tfoot
    $tf = $t.find('tfoot');
    if($tf.length ==0){
    $t.find('tbody').before("<tfoot>"); //foot should come after thead but before tbody
    $('.tr0').eq(0).clone(true).appendTo($t.find('tfoot'));       
    } else if($tf.length >0){
       $tf.detach();
}
    return $tf;
};
$('#tcaption').change(function(e){ //caption
    if ($tcapt.length == 0){
        $t.prepend("<caption></caption>");
        $tcapt = $t.find('caption');
    }
    var captContent = $(this).val();
    $tcapt.html(captContent)            //more like captn crunch, amirite?;
return;
});
$('#tsummary').change(function(e){      //summary 
    $t.attr("summary",$(this).val());
return;
});

//ROWS
function addRow() {
    $tr = $t.find('tbody tr:last-child').clone().appendTo($t).attr('class','tr' + tri);
    tri = tri + 1;
    $('[name="rowNum"]').val(tri);      // update number counter
    return $tr;
};
function remRow() {
    while (tri > 1) {
        $remT = $('table tr:last-child').remove();
        tri = tri - 1;
        $('[name="rowNum"]').val(tri);  // update the number counter
        return $remT;
        }
    return;
};
//COLUMNS
function addCol() {
    $tr = $('.tr0');          //TR IS THE FIRST TABLE ROW (ONLY ONE NOT USER CREATED)
    $trs = $t.find('tbody tr').length;    //need this to backfill extra columns
    $td = $tr.append('<td></td>');
    $t.find('thead tr, tfoot tr').live().append('<td>');
    $tr.find('td').eq(tdi).addClass('td' + tdi);
    tdi = tdi + 1;
    if ($trs > 1) {                 //in case we added columns after we added rows
        $('tr').slice(1).append("<td>");
    }
    $('[name="colNum"]').val(tdi); // update the number counter
    return $td;
};

function remCol() {
    while (tdi > 1) {
        tds = $tr.find('td').length;
        $trs = $t.find('tr').length; //need this to backfill
        $remTd = $('tr td:last-child').remove();
        tdi = tdi - 1;
        if (tdi <= 0) {
            tdi = 0;
        };
        $('[name="colNum"]').val(tdi);
        return $remTd;
    }
    return;
};
//FORM FIELDS AND BUTTONS
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

//IN-TABLE EDITING
$("td, th").live("mouseover focus", function(e) { //set current, first, and last editable
    $(this).attr('contenteditable', true);
    $(this).next('td, th').attr('contenteditable',true);
    $(this).prev('td, th').attr('contenteditable', true);

    if( $(this).is(':last-child')){         //set the first td in next row editable
        $(this).parents('tr').next('tr').find('td:first-child, th:first-child').attr('contenteditable',true);
    }else if( $(this).is(':first-child')){  //set last td of last row editable
        $(this).parents('tr').prev('tr').find('td:last-child, th:last-child').attr('contenteditable',true);    
   }
});
$("td, th").live("mouseout focusout blur mouseleave", function() { //remove editable
    $(this).removeAttr('contenteditable');
    $(this).prev('td, th').removeAttr('contenteditable');
    $(this).next('td, th').removeAttr('contenteditable');
});

//BUTTONS AND FORMS
    //plus minus toggles
$(".toggle").toggle( 
    function() {
    $(this).text("-");
    }, function() {
    $(this).text("+");
});

//RANGE BUTTONS
$('input[type="range"]').change(function(e) { 
    $(this).attr("data-value", $(this).val());
});
$('#twidth').change(function(e) {   //table width
    var tw = $(this).val() + 'px';
    $t.width(tw);
});
$('#rheight').change(function(e) {  //row height
    var rh = $(this).val() + 'px';
    $t.find("tr").height(rh);
});
$('#cwidth').change(function(e) {   //column width
    var cw = $(this).val() + 'px';
    $t.find("tr:first-child td").width(cw);
});

//STYLE FUNCTIONS    
    //add class to tables
$('#tableStyle').change(function(e){
    $t.addClass($(this).val());
});
   //add classes to evens and odds            
$('input[type="checkbox"]').change(function(e){
    if($(this).is(':checked')){
        $t.find($(this).attr('data-element')).addClass($(this).val());
    } else if(!$(this).is(':checked')){
        $t.find($(this).attr('data-element')).removeClass($(this).val());
        }     
});
    //custom rule    
$('.addCustom').toggle(function(e){
    $(this).next('input').css("display","block");
    custVal = $(this).next('input').val();
    },function(e){
    $(this).next('input').css("display","none");
});
    //export the code
$('#getHTML').toggle(
    function(){
    var tableHTML = $tContainer.html();
    $('.tableCode').text(tableHTML);
        $('#tableHTML').css("display","block");
        $('#getHTML').text("Hide Code");
    },function(){
        $('#tableHTML').css("display", "none");
        $('#getHTML').text("Get Code");
    });
$( "#tableHTML" ).draggable();

$('td').live('dblclick', function(e){
var thisClass = $(this).attr('class');
$(this).replaceWith( "<th class=\""+thisClass+"\">"+ $(this).text() +"</th>" );
});

$('th').live('dblclick', function(e){
var thisClass = $(this).attr('class');
$(this).replaceWith( "<td class=\""+thisClass+"\">"+ $(this).text() +"</td>" );
});

$('thead tr').live('dblclick', function(e){
alert('boo');
});


$('tr.tr0 td').resizeable({ containment: "parent" });​