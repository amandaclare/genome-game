var colours = ["yellow", "red","blue","pink"];
var numbers = ["2","4","6"];
var maxcreatures = 5;
var numbits = 4;
var gametime = 120; // in seconds
var timerId;
var lang = "en_GB";




$(document).ready( function() {
    setLanguageStrings();

    $('#langswitchbutton').bind('click', function() {
	switchLang($(this));
    });
    $('.bit').bind('click', function() {
	updateBit($(this));
    });
    $('#showrulesbutton').bind('click', function() {
	toggleRules($(this));
    });
    $('#makepopbutton').bind('click', function() {
	makePop();
    });
    $('#hidepopbutton').bind('click', function() {
	hidePop($(this));
    });
    $('#helpbutton').bind('click', function() {
	help();
    });
    $('#newgamebutton').bind('click', function() {
	initialiseGame();
    });
    $('#showcreaturebutton').bind('click', function() {
	toggleCreature($(this));
    });
    $('.pheno').bind('change', function() {
	phenoChange($(this));
    });
    $('#guessrules .allele').bind('change', function() {
	geneCheck($(this));
    });

    $('#clearscoresbutton').bind('click', function() {
	clearTable();
    });

    $('#quitbutton').bind('click', function() {
	quit();
    });

    $('#closehelpbutton').bind('click', function() {
	$("#helptextdiv").hide();
    });

    $('#rules').hide();
    $('#guessrules').hide();
    $('#creatures').hide();
    $('#showcreaturebutton').hide();
    $('#clearscores').hide();
    $('#countdown').hide();
    $('#quit').hide();
    $("#helptextdiv").hide();

    //$('#makepop').hide();    
    //$('#hidepop').hide();    


    drawCanv();
    printTable();
});


// --------------------------------------------------------------------
// Rendering

function drawCanv() {
    var canv = document.getElementById('creaturecanv');
    var ctx = canv.getContext("2d");
    ctx.clearRect(0,0,400,400);
    drawCreature(ctx,0);
}

function drawCircle(ctx, offset, x, y, radius, colour) {
    var fillcolour = "rgba(255,0,0,1)";
    if (colour == "red") {fillcolour = "rgba(255,0,0,1)";}
    else if (colour == "yellow") {fillcolour = "rgba(250,250,100,1)";}
    else if (colour == "blue") {fillcolour = "rgba(106, 150, 211, 1)";} //"rgba(0,0,255,1)";}
    else if (colour == "pink") {fillcolour = "rgba(251, 148, 168, 1)";} // purple rgba(132, 112, 215, 1)";} //"rgba(150,100,100,1)";}
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.arc(offset+x, y, radius, 0, Math.PI*2, false);
    ctx.fillStyle = fillcolour; 
    ctx.fill();
    ctx.stroke();
}

function drawHead(ctx, offset, colour) { 
    drawCircle(ctx, offset, 100, 50, 40, colour);
}

function drawBody(ctx, offset, colour) {
    drawCircle(ctx, offset, 100, 140, 50, colour);
}


function drawSmile(ctx, offset) {
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.arc(offset+100, 45, 30, Math.PI / 3, 2*Math.PI/3, false);
    ctx.stroke();
}

function drawLegs(ctx, offset, legs) {
    var n = parseInt(legs);
    var gap = 17;
    var start = offset + 100 - ((n-1)*17)/2; 
    for( var i = 0; i < n; i++) {
	ctx.beginPath();
	ctx.moveTo(start + (i*gap),160);
	ctx.lineTo(start + (i*gap),240);
	ctx.lineWidth = 3;
	ctx.stroke();    
    }
}

function drawArms(ctx, offset) {
    ctx.beginPath();
    ctx.moveTo(offset+60,130);
    ctx.lineTo(offset+20,130)
    ctx.lineWidth = 3;
    ctx.stroke(); 
    ctx.beginPath();
    ctx.moveTo(offset+140,130);
    ctx.lineTo(offset+180,130)
    ctx.lineWidth = 3;
    ctx.stroke(); 
}

function drawEyes(ctx, offset, colour) {
    drawCircle(ctx,offset,88,50,10,colour);
    drawCircle(ctx,offset,112,50,10,colour);
}


/* Rendering parts in this order allows the legs and arms to go behind the body 
 * and the eyes to be drawn last, on top. 
*/
function renderCreature(ctx, offset, creature) {
    drawArms(ctx, offset);
    drawLegs(ctx, offset, creature.legsNum);
    drawHead(ctx, offset, creature.headColour);
    drawBody(ctx, offset, creature.bodyColour);
    drawEyes(ctx, offset, creature.eyeColour);
    drawSmile(ctx, offset);
}


function drawCreature(ctx, offset) {
    var ln = "2";
    var hc = "red";
    var bc = "red";
    var ec = "blue";
    var creature = {
	legsNum : ln,
	headColour : hc,
	bodyColour : bc,
	eyeColour : ec,
    }
    $("#rules .pheno option").filter(":selected").each(function (index) {
	var currentrow = $(this).closest('tr');
	var nextrow    = $(currentrow).next();
	var gene       = parseInt($(currentrow).find('td.gene').html()) - 1;
	var zeroAllele = $(currentrow).find('select.allele option').filter(':selected').val();
	var oneAllele  = $(nextrow).find('select.allele option').filter(':selected').val();
	if($(this).val() == "legs") {
	    if($('.bit').eq(gene).text() == "1") {
		creature.legsNum = oneAllele
	    } else {
		creature.legsNum = zeroAllele;
	    }
	} else if ($(this).val() == "head") {
	    if($('.bit').eq(gene).text() == "1") {
		creature.headColour = oneAllele;
	    } else {
		creature.headColour = zeroAllele;
	    }
	} else if ($(this).val() == "body") {
	    if($('.bit').eq(gene).text() == "1") {
		creature.bodyColour = oneAllele;
	    } else {
		creature.bodyColour = zeroAllele;
	    }
	} else {
	    if($('.bit').eq(gene).text() == "1") {
		creature.eyeColour = oneAllele;
	    } else {
		creature.eyeColour = zeroAllele;
	    }
	}
	renderCreature(ctx,offset,creature);
    });
}


// -----------------------------------------------------------------
// Showing, hiding and toggling items

function toggleBit(e) {
    if (e.text() === "0") { e.text(1); }
    else { e.text(0); }
}

function updateBit(e) {
    var bitvalue = e.text();
    toggleBit(e);
    var canv = document.getElementById('creaturecanv');
    var ctx = canv.getContext("2d");
    ctx.clearRect(0,0,400,400);
    drawCreature(ctx,0);
}


function toggleRules(e) {
    if(e.text() === translate[lang]["Show rules"]) { 
	e.text(translate[lang]["Hide rules"]);
	$('#rules').show(); 
    } else {
	e.text(translate[lang]["Show rules"]);
	$('#rules').hide(); 
    }
}

function toggleCreature(e) {
    if(e.text() === "Show creature") {
	e.text("Hide creature");
	$('#creature').show(); 
	$('#bitdiv').show(); 
    } else {
	hideCreature();
    }
}

function hideCreature(e) {
    $('#showcreaturebutton').text("Show creature");
    $('#creature').hide(); 
    $('#bitdiv').hide(); 
}

function hidePop() {
    $('#creatures').hide(); 
}


// -----------------------------------------------------------------
// Checking if guesses are correct

// Check this gene is correct
function geneCheck(e) {
    var currentrow = e.closest('tr');
    var otherrow;
    var genenum;
    var geneelems = currentrow.find("td.gene");
    if(geneelems.length === 0) {
	otherrow = currentrow.prev();
	genenum = otherrow.find("td.gene").text();
	pheno = otherrow.find(".pheno").val();
    } else {
	otherrow = currentrow.next();
	genenum = geneelems.text();
	pheno = currentrow.find(".pheno").val();
    }
    var gameOver = checkRowAndEnd(currentrow, genenum, pheno);
    if(!gameOver) { checkRowAndEnd(otherrow, genenum, pheno); }
}


// See if this tuple of values is the right answer
function isCorrect(geneNumber, alleleNum, guessSetting, guessPheno) {
    var realGene = $("#ruletable .gene:contains("+geneNumber+")")
    var currentRow = realGene.closest('tr');
    realPheno = currentRow.find(".pheno").val();
    if(realPheno != guessPheno) {
	return false;
    }
    if(alleleNum === "1") {
	currentRow = currentRow.next();
    }
    realSetting = currentRow.find(".allele").val();
    if(realSetting != guessSetting) {
	return false;
    } else {
	return true;
    }
}


// See if this row is a correct guess and also return whether this row makes it "game over"
function checkRowAndEnd(e, geneNumber, pheno) {
    var alleleNum = e.find("td.bitvalue").text();
    var setting   = e.find("select.allele").val();
    var correct = isCorrect(geneNumber, alleleNum, setting, pheno);
    if(correct) {
	e.css("background-color","#08DA08");
    } else {
	if(alleleNum === "0") {
	    e.css("background-color","FD4C4C");
	}else {
	    e.css("background-color","FA8181");
	}
    }
    // Are they all green now? If so, we stop.
    var rows = $("#guessrules tr");
    var correctrows = rows.filter(function () { return $(this).css('background-color') == "rgb(8, 218, 8)"; });
    var numcorrect = correctrows.length;
    if(numcorrect === 8) { 
	endOfGame();
	return true;
    } else {
	return false;
    }
}

// ----------------------------------------------------------------

// Function to update the choices when someone has changed a phenotype select
function phenoChange(e) {
    var s = e.find("option:selected");
    var currentrow = e.closest('tr');
    var nextrow    = currentrow.next();
    var a1 = currentrow.find('select.allele');
    var a2 = nextrow.find('select.allele');
    if(s.val() === "legs")
    {
	/* set the other drop downs so only numbers can be chosen */
	a1.find('option').remove() ;
	a2.find('option').remove() ;
        var options = '<option selected value=""></option>' ;
        for (var i = 0; i < numbers.length; i++) {
            options += '<option value="' + numbers[i] + '">' + numbers[i] + '</option>';
        }
        a1.html(options);
        options = '<option selected value=""></option>' ;
        for (var i = 0; i < numbers.length; i++) {
            options += '<option value="' + numbers[i] + '">' + numbers[i] + '</option>';
        }
        a2.html(options);
    }
    else { 
	/* set the other drop downs so only colours can be chosen */
	a1.find('option').remove() ;
	a2.find('option').remove() ;
	var options = '<option selected value=""></option>' ;
        for (var i = 0; i < colours.length; i++) {
            options += '<option value="' + colours[i] + '">' + translate[lang][colours[i]] + '</option>';
	}
        a1.html(options);
        options = '<option selected value=""></option>' ;
        for (var i = 0; i < colours.length; i++) {
            options += '<option value="' + colours[i] + '">' + translate[lang][colours[i]] + '</option>';
        }
        a2.html(options);
    }

}


function randomiseRules() {
    var bodyparts = ["legs","body","head","eyes"]; 
    bodyparts = shuffle(bodyparts);
    $("#ruletable .pheno").each(function(index) {
	$(this).val(bodyparts[index]);
	phenoRandomChange($(this));
   });
}

function phenoRandomChange(e) {
    var s = e.find("option:selected");
    var currentrow = e.closest('tr');
    var nextrow    = currentrow.next();
    var a1 = currentrow.find('select.allele');
    var a2 = nextrow.find('select.allele');
    if(s.val() === "legs")
    {
	/* set the other drop downs so only numbers can be chosen */
	a1.find('option').remove() ;
	a2.find('option').remove() ;
        var options = '' ;
	/* choices is an array which is used to randomly pick 2 elements to set as selected for allele 0 and 1 */
	var choices = new Array(numbers.length);
	for(var i = 0; i < numbers.length; i++) {
	    choices[i] = i;
	}
	choices = shuffle(choices);
        for (var i = 0; i < numbers.length; i++) {
            if (i==choices[0]) {
                options += '<option selected value="' + numbers[i] + '">' + numbers[i] + '</option>';
            }
            else {
                options += '<option value="' + numbers[i] + '">' + numbers[i] + '</option>';
            }
        }
        a1.html(options);
        options = '' ;
        for (var i = 0; i < numbers.length; i++) {
            if (i==choices[1]) {
                options += '<option selected value="' + numbers[i] + '">' + numbers[i] + '</option>';
            }
            else {
                options += '<option value="' + numbers[i] + '">' + numbers[i] + '</option>';
            }
        }
        a2.html(options);
    }
    else { 
	/* set the other drop downs so only colours can be chosen */
	a1.find('option').remove() ;
	a2.find('option').remove() ;
	/* choices is an array which is used to randomly pick 2 elements to set as selected for allele 0 and 1 */
	var choices = new Array(colours.length);
	for(var i = 0; i < colours.length; i++) {
	    choices[i] = i;
	}
	choices = shuffle(choices);
        var options = '' ;
        for (var i = 0; i < colours.length; i++) {
            if (i==choices[0]) {
                options += '<option selected value="' + colours[i] + '">' + translate[lang][colours[i]] + '</option>';
            }
            else {
                options += '<option value="' + colours[i] + '">' + translate[lang][colours[i]] + '</option>';
            }
        }
        a1.html(options);
        options = '' ;
        for (var i = 0; i < colours.length; i++) {
            if (i==choices[1]) {
                options += '<option selected value="' + colours[i] + '">' + translate[lang][colours[i]] + '</option>';
            }
            else {
                options += '<option value="' + colours[i] + '">' + translate[lang][colours[i]] + '</option>';
            }
        }
        a2.html(options);
    }

}

// ----------------------------------------------------------------

function setBits(arr) {
    var bitlist = $('#bitlist');
    var bits = bitlist.find('a');
    for ( var i=0; i< numbits; i++) {
	$(bits[i]).text("" + arr[i]);
    }
}

function displayGenome(ctx, arr, offset) {
    var genome = "";
    for ( var i=0; i< numbits; i++) {
	genome = genome + arr[i];
    }
    ctx.fillStyle = 'black';
    ctx.font = '30px sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(genome, offset+70, 320);   
}


function makePop() {
    $('#showrulesbutton').text(translate[lang]["Show rules"]);
    $('#rules').hide(); 
    $('#creatures').show();  
    var canv = $('#creaturescanv')[0];
    var ctx = canv.getContext("2d");
    ctx.clearRect(0,0,800,400);
    for( var i = 0; i< maxcreatures; i++) {
	var arr = new Array(4);
	for(var j = 0; j < numbits; j++) {
	    arr[j] = Math.floor(Math.random() * 2);
	}
	setBits(arr);
	drawCreature(ctx, i*150);
	displayGenome(ctx, arr, i*150);
    }
    /* Make a final creature for the top corner */
    var arr = new Array(4);
    for(var j = 0; j < numbits; j++) {
	arr[j] = Math.floor(Math.random() * 2);
    }
    setBits(arr);
    canv = $('#creaturecanv')[0];
    ctx = canv.getContext("2d");
    ctx.clearRect(0,0,400,400);
    drawCreature(ctx,0);    
}


// -------------------------------------------------------------------------

// General array shuffle
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// -------------------------------------------------------------------------------

function initialiseGame() {
    $('#rules').hide();
    hideCreature();
    $('#bitsandbuttons').hide();
    $('#makepop').hide();
    $('#hidepop').hide();    

    randomiseRules();
    makePop();
    
    $("#guessruletable .pheno").each(function(index) {
	$(this).val("");
    });

    $("#guessruletable .allele").each(function(index) {
	$(this).val("");
    });
    
    $('#guessruletable .pheno').prop('disabled', false);
    $('#guessruletable .allele').prop('disabled', false); // false

    // Set colours of guesstable back to red
    $('#guessruletable tr:nth-child(odd)').css('background-color','#FD4C4C');
    $('#guessruletable tr:nth-child(even)').css('background-color','#FA8181');

    $('#guessrules').show();
    $('#countdown').show();
    $('#quit').show();
    $('#clearscores').show();

    var tick = gametime;
    clearInterval(timerId);
    timerId = setInterval(function () {
	$("#countdownText").text(tick);
	if(tick === 0) {
	    endOfGame();
	} else {
	    tick--;
	}
    }, 1000);
    
}


/* Time is up, did they win or not? */
function endOfGame() {
    clearInterval(timerId);
    $('#guessruletable .pheno').prop('disabled', 'disabled');
    $('#guessruletable .allele').prop('disabled', 'disabled'); // false
    $('#bitsandbuttons').show();
    $('#hidepop').hide(); 
    $('#makepop').show(); 
    var score = $("#countdownText").text();
    if(score>0) {
	var yrname=prompt(translate[lang]["You scored"]+score+translate[lang]["Enter name"]);
        addToTable(yrname,score);
	printTable();
	$("html, body").animate({ scrollTop: 0 }, "slow");
    } else {
	alert(translate[lang]["Out of time"]);
	$("html, body").animate({ scrollTop: 0 }, "slow");
    }
}


function quit() {
    clearInterval(timerId);
    $('#guessruletable .pheno').prop('disabled', 'disabled');
    $('#guessruletable .allele').prop('disabled', 'disabled'); // false
    $('#bitsandbuttons').show();
    $('#hidepop').hide(); 
    $('#makepop').show(); 
    $('#quit').hide();
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

// -----------------------------------------------------------------------------------------
// High score table code taken from Hannah's Pythagoras game.

function printTable() {
     if (window.localStorage["saved"]=="true")  {
            var total_in=parseInt(window.localStorage["number_stored"]);
            var currname= [];
            var i;
            for (i=0;i<total_in; i++) {
                 currname.push({'myname':window.localStorage["hiscore."+i+".myname"],'myscore':parseFloat(window.localStorage["hiscore."+i+".myscore"])});
	    }
            currname.sort(function(a,b) { return(a.myscore>b.myscore)? -1: ((a.myscore==b.myscore) ? 0:1)});
            var hiscore_string="<h2>"+translate[lang]["High Scores"]+"</h2><ol>";
            for (i=0;i<total_in; i++) {
		    hiscore_string=hiscore_string+"<li>"+currname[i].myscore+" "+currname[i].myname+"</li>"; 
	    }
            hiscore_string=hiscore_string+"</ol>";
            document.getElementById("hiscore").innerHTML=hiscore_string;
     } else {
	 document.getElementById("hiscore").innerHTML="";
     }
}

      
function addToTable(myname,myscore) {
     if (window.localStorage["saved"]=="true")  {
	     total_in=parseInt(window.localStorage["number_stored"]);
     }  else { //it's the first time
         window.localStorage["saved"]="true";
         total_in=0;
     } 
     window.localStorage["hiscore."+total_in+".myname"]=myname;
     window.localStorage["hiscore."+total_in+".myscore"]=myscore;

     window.localStorage["number_stored"]=total_in+1;
}

function clearTable() {
    if (window.localStorage["saved"]=="true")  {
        window.localStorage.clear();
    }
    window.localStorage["saved"]=="false"; 
    printTable();
}


function setLanguageStrings() {
    $("#title").text(translate[lang]["title"]);
    $("#showrulesbutton").text(translate[lang]["Show rules"]);
    $("#makepopbutton").text(translate[lang]["Make population"]);
    $("#hidepopbutton").text(translate[lang]["Hide population"]);
    $("#newgamebutton").text(translate[lang]["New game"]);
    $('#clearscoresbutton').text(translate[lang]["Clear scores"]);
    $('#guesstext').text(translate[lang]["Guess"])
    $('.if').text(translate[lang]["if gene"]);
    $('.then').text(translate[lang]["then"]);
    $('.is').text(translate[lang]["is"]);
    $('#seconds').text(translate[lang]["seconds left"]);
    $('.pheno option').each( function() { $(this).text(translate[lang][$(this).val()]); });
    $('.allele option').each( function() {  $(this).text(translate[lang][$(this).val()]); });
    $("#helptext").text(translate[lang]["helptext"]);
    $("#helpheading").text(translate[lang]["help"]);
    $("#helpbutton").text(translate[lang]["help"]);
    $("#quitbutton").text(translate[lang]["quit"]);
}

function switchLang(e) {
    if(e.text() === "Cymraeg") {
	e.text("English");
	lang = "cy";
	setLanguageStrings();
	printTable(); // also need to redo high score table
    } else {
	e.text("Cymraeg");
	lang = "en_GB";
	setLanguageStrings();
	printTable(); // also need to redo high score table
    }
}

function help() {
    $("#helptextdiv").show();
}