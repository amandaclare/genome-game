$(document).ready( function() {
    $('.bit').bind('click', function() {
	updateBit($(this));
    });
    $('#showrulesbutton').bind('click', function() {
	toggleRules($(this));
    });
    $('#makepopbutton').bind('click', function() {
	makePop($(this));
    });
    $('#hidepopbutton').bind('click', function() {
	hidePop($(this));
    });
    $('.pheno').bind('change', function() {
	phenoChange($(this));
    });
    $('#rules').hide();
    $('#creatures').hide();

    drawCanv();
});


var colours = ["yellow", "red","blue","pink"];
var numbers = ["2","4","6"];
var maxcreatures = 5;
var numbits = 4;

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
    $(".pheno option").filter(":selected").each(function (index) {
	var currentrow = $(this).closest('tr');
	var nextrow    = $(currentrow).next();
	var gene       = parseInt($(currentrow).find('td.gene').html()) - 1;
	var zeroAllele = $(currentrow).find('select.allele option').filter(':selected').text();
	var oneAllele  = $(nextrow).find('select.allele option').filter(':selected').text();
	if($(this).text() == "legs") {
	    if($('.bit').eq(gene).text() == "1") {
		creature.legsNum = oneAllele
	    } else {
		creature.legsNum = zeroAllele;
	    }
	} else if ($(this).text() == "head") {
	    if($('.bit').eq(gene).text() == "1") {
		creature.headColour = oneAllele;
	    } else {
		creature.headColour = zeroAllele;
	    }
	} else if ($(this).text() == "body") {
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


function toggleBit(e) {
    if (e.text() == "0") { e.text(1); }
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
    if(e.text() == "Show rules") { 
	e.text("Hide rules");
	$('#rules').show(); //css({visibility: "visible"});
    } else {
	e.text("Show rules");
	$('#rules').hide(); //css({visibility :"hidden"});
    }
}


function phenoChange(e) {
    var s = e.find("option:selected");
    var currentrow = e.closest('tr');
    var nextrow    = currentrow.next();
    var a1 = currentrow.find('select.allele');
    var a2 = nextrow.find('select.allele');
    if(s.text() == "legs")
    {
	/* set the other drop downs so only numbers can be chosen */
	a1.find('option').remove() ;
	a2.find('option').remove() ;
        var options = '' ;
        for (var i = 0; i < numbers.length; i++) {
            if (i==0) {
                options += '<option selected value="' + numbers[i] + '">' + numbers[i] + '</option>';
            }
            else {
                options += '<option value="' + numbers[i] + '">' + numbers[i] + '</option>';
            }
        }
        a1.html(options);
        var options = '' ;
        for (var i = 0; i < numbers.length; i++) {
            if (i==1) {
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
        var options = '' ;
        for (var i = 0; i < colours.length; i++) {
            if (i==0) {
                options += '<option selected value="' + colours[i] + '">' + colours[i] + '</option>';
            }
            else {
                options += '<option value="' + colours[i] + '">' + colours[i] + '</option>';
            }
        }
        a1.html(options);
        options = '' ;
        for (var i = 0; i < colours.length; i++) {
            if (i==1) {
                options += '<option selected value="' + colours[i] + '">' + colours[i] + '</option>';
            }
            else {
                options += '<option value="' + colours[i] + '">' + colours[i] + '</option>';
            }
        }
        a2.html(options);
    }

}

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

function hidePop() {
    $('#creatures').hide(); 
}

function makePop() {
    $('#showrulesbutton').text("Show rules");
    $('#rules').hide(); //css({visibility :"hidden"});
    $('#creatures').show();  //.css({visibility :"visible"});
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
