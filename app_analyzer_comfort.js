//****************************************
// some global variables
//****************************************
var mySerieItems = [];
var source = "";
var modes = "";
var modeslist = "";
var myExposures = ['area','areaspline','areastair','column','line','spline','stair','from Stack']; // 'areastack','linestack','columnstack'
var myStackTypes = ['normal','percent'];
var ExposureList = "";
var yAxisCount = 0;

// Objects to store all the informations
var myYAxis = {};
var myTimeSettings = {};
var myItems = {};
var myChartOptions = {};
var myStackings = {};


// define default Time-Settings
myDate= new Date()
myTimeSettings = {
                    "ItemType"  : "Database",
                    "StartType" : "1",
                    "StartDate" : myDate.toJSON().slice(0, 4) +'-01-01',
                    "StartTime" : "00:00",
                    "EndType"   : "1",
                    "EndDate"   : myDate.toJSON().slice(0, 10),
                    "EndTime"   : myDate.toJSON().slice(11, 16),
                    "Duratin"   : "1d"
                  }
// define first Axis
var tmplYAxis = {}
tmplYAxis['no']= yAxisCount
tmplYAxis['apYmin']     = ""
tmplYAxis['apYmax']     = ""
tmplYAxis['apYpos']     = "0"
tmplYAxis['apYtype']    = "linear"
tmplYAxis['apYunit']    = ""
newAxisID="0001"
myYAxis[newAxisID] = JSON.parse(JSON.stringify(tmplYAxis));

// define First Item
var tmplItem = {}
tmplItem['apItem'] = ""
tmplItem['apMode'] = "avg"
tmplItem['apCount'] = "100"
tmplItem['apExposure'] = "spline"
tmplItem['apColor'] = ""
tmplItem['apAssign'] = newAxisID		// Assing to first Y-Axis
tmplItem['apStack'] = ""
newItemID="0001"
myItems[newItemID] = JSON.parse(JSON.stringify(tmplItem));



var yAxisHeader = '<table style="width:97%;">\
                    <tr>\
                      <th style = "width:5%; text-align:center;">No.</th>\
                      <th style = "width:14%; text-align:center;">Min-Value</th>\
                      <th style = "width:14%; text-align:center;">Max-Value</th>\
                      <th style = "width:14%; text-align:center;">Axis-Position</th>\
                      <th style = "width:14%; text-align:center;min-width:100px;">Axis scale type</th>\
                      <th style = "width:14%; text-align:center;">Axis unit</th>\
                      <th style = "width:14%; text-align:center;">Function</th>\
                    </tr>'

var yAxisHtml = '<tr>\
        <td style="text-align:center">{NO}</td>\
        <td><input id="apYmin-{id}" onchange="changedYAxis(this)" ></td>\
        <td><input id="apYmax-{id}" onchange="changedYAxis(this)"></td>\
        <td><select id="apYpos-{id}" onchange="changedYAxis(this)" data-native-menu="false" style="font-size:0.8em;"><option value="0">left</option><option value="1">right</option></select>\</td>\
        <td><select id="apYtype-{id}" onchange="changedYAxis(this)" data-native-menu="false"><option value="linear">linear</option><option value="logarithmic">logarithm</option><option value="boolean">bool</option></select></td>\
        <td>\<input id="apYunit-{id}" onchange="changedYAxis(this)">\</td>\
        <td>\
          <div class="tooltip">\
            <button id="del_Y_Axis-{id}" class="FctButton ui-mini ui-btn-inline" name="btn-delete-y-axis" type="button"  onclick="deleteYAxis(this)"><img src="icons/ws/jquery_delete.svg"></button>\
            <span class="tooltiptext">remove Axis</span>\
          </div>\
        </td>\
      </tr>';

var ItemHtml ='<div id="itemsetting-{id}" class="itemsetting" data-role="collapsible" data-collapsed="true" data-theme="c" data-content-theme="a" style="width:98%;">\
			<h3 style="display:inline"> *** NEW Item ***</h3>\
				<table style="width:100%;">\
					<tr>\
					  <td style = "width:10%;">Item</td>\
					  <td style = "width:50%;"><select id="apItem-{id}" data-native-menu="false" style="font-size:0.8em;width:100%;" onchange="selectChanged(this)"> </select></td>\
					  <td style = "width:15%;text-align:center;">DB-Mode</td>\
					  <td style = "width:25%;" ><select id="apMode-{id}" data-native-menu="false" style="font-size:0.8em;" onchange="itemChange(this)"></select></td>\
					  </tr>\
        </table>\
				<table>\
          <tr>\
					  <td style = "width:15%;">Count</td>\
					  <td style = "width:10%;"><input id="apCount-{id}" value="100" onchange="itemChange(this)"/></td>\
					  <td style = "width:20%;text-align:center;">Series Type</td>\
					  <td style = "width:30%;"><select id="apExposure-{id}" data-native-menu="false" onchange="itemChange(this)"></select></td>\
					  <td style = "width:10%;text-align:center;">Color</td>\
					  <td style = "width:15%;">\
              <input class="apColorButton" id="apColor-{id}" type="button" onclick="GetColor(this)" style="background-color:rgb(248, 249, 247);opacity:1;">\
						<div id="myColorPicker-apColor-{id}"> </div>\
					  </td>\
				  </tr>\
					<tr>\
					  <td>Y-Axis</td>\
					  <td><select id="apAssign-{id}" data-native-menu="false" onchange="itemChange(this)"><option value="0001">1</option></select></td>\
					  <td style="text-align:center">Stack-Number</td>\
					  <td>\
						<select id="apStack-{id}" style="width:30%;" data-native-menu="false" onchange="itemChange(this)"><option value="0" >&nbsp;</option></select>\
					  </td>\
					  <td></td>\
					  <td>\
						<div class="tooltip">\
						  <button id="del_Item-{id}" class="FctButton ui-mini ui-btn-inline" name="btn-store-streams" type="button"  onclick="deleteItem(this)"><img src="icons/ws/jquery_delete.svg"></button>\
						  <span class="tooltiptext">remove Item</span>\
						</div>\
					  </td>\
					</tr>\
			  </table>\
      </div>'

var tmplStackHeader = '<table style="width:97%;">\
                      <tr>\
                        <th style = "width:20%; text-align:center;">No.</th>\
                        <th style = "width:35%; text-align:center;">Stack-Type</th>\
                        <th style = "width:35%; text-align:center;">Stack-Exposure</th>\
                        <th style = "width:10%; text-align:center;">Function</th>\
                      </tr>'



var tmplStacks =  '<tr>\
                    <td style = "text-align:center;">{NO}</td>\
                    <td style = "text-align:center;">\
                    <select id="apStackType-{id}" data-native-menu="false" onchange="changedStack(this)"><option value="normal">normal</option><option value="percent">percent</option></select>\
                    </td>\
                    <td style = "text-align:center;">\
                    <select id="apStackExposure-{id}" data-native-menu="false" onchange="changedStack(this)"><option value="areastack">areastack</option><option value="linestack">linestack</option></option><option value="columnstack">columnstack</option></select>\
                    </td>\
                    <td>\
                    <div class="tooltip">\
                      <button id="del_Stack-{id}" class="FctButton ui-mini ui-btn-inline" name="btn-remove-stack" type="button"  onclick="deleteStack(this)"><img src="icons/ws/jquery_delete.svg"></button>\
                      <span class="tooltiptext">remove stack</span>\
                    </div>\
                    </td>\
                  </tr>'






//*******************************************************
// Item - Handling
//*******************************************************

//****************************************
function ItemValue2Screen()
//****************************************
{
	for (var key in myItems)
		{
			myActID = key
			for (var entry in myItems[key])
			  {
			   myObj = $('#'+entry+'-'+myActID)
			   if (myObj[0].nodeName == "SELECT")
				{
				  $('#'+entry+'-'+myActID).val(myItems[key][entry]).selectmenu('refresh');
				  // Set Headline
				  if (entry == "apItem" && myObj[0].value !=  "")
				  {
					myHeadLine = document.getElementById("itemsetting-"+myActID)
					myText = myHeadLine.children[0].innerHTML
					myNewText=myText.split(">")[0]+">" + myObj[0].value
					myNewText += myText.substr(myText.search("<span",189))
					
					myHeadLine.children[0].innerHTML  = myNewText
				  }
				}
			   else if (myObj[0].nodeName == "INPUT" && entry == "apColor")
				{
				  myObj[0].style.backgroundColor= myItems[key][entry]
				}
			   else 
				{
				  myObj[0].value = myItems[key][entry]
				}
			  }
		}

}

//****************************************
function Items2Screen(addNew)
//****************************************
{
	
	itemCount = 0
	newItemID = 0
	myHtmlItem = ""
	for (var key in myItems)
		{
		itemCount += 1
		newItemID = parseInt(key)
		myHtml2append = ItemHtml.split("{id}").join(key)
		myHtmlItem += myHtml2append
		}
	if (addNew == true)
	{
	  itemCount += 1
	  newItemID = "00000" + (parseInt(newItemID)+1)
	  newItemID = newItemID.slice(newItemID.length-4,8);
	  myItems[newItemID] = JSON.parse(JSON.stringify(tmplItem));
	  
	  
	  myHtml2append = ItemHtml.split("{id}").join(newItemID)
	  myHtml2append = myHtml2append.split("{NO}").join(itemCount)

	  myHtml2append = myHtml2append.split('data-collapsed="true"').join('data-collapsed="false"')
	  myHtmlItem += myHtml2append        
	}
	
	ItemSettings = $('#ItemSettings');
	ItemSettings.html(myHtmlItem).trigger('create');
	
	SetSelectItem();
	YValue2Screen();
	StackValue2Screen();
	ItemValue2Screen()
}

//****************************************
function deleteItem(that)
//****************************************
{
	myActId=that.id.split("-")[1]
	delete myItems[myActId]
	Items2Screen(false)
}

//****************************************
function addItem(that)
//****************************************
{
	Items2Screen(true)
}

//****************************************
function itemChange(that)
//****************************************
{
  myActType=that.id.split("-")[0]
  myActId=that.id.split("-")[1]
  myItems[myActId][myActType] = that.value
}


//*******************************************************
// Y-Axis - Handling
//*******************************************************

//****************************************
function changedYAxis(that)
//****************************************
{
  myActType=that.id.split("-")[0]
  myActId=that.id.split("-")[1]
  myYAxis[myActId][myActType] = that.value
}

//****************************************
function deleteYAxis(button)
//****************************************
{
	if (Object.keys(myYAxis).length == 1)  	// -> Anzahl Achsen
	{
		notify.message('warning', 'Y-Axis-Handling', 'You can´t delete the last Y-Axis. But you can leave it blank');
		return
	}
	myActId=button.id.split("-")[1]
	delete myYAxis[myActId]
	YAxis2Screen(myYAxis,false)
}

//****************************************
function YAxis2Screen(data, addNew)
//****************************************
{
  my_Y_Axis = ""
  my_Y_Axis += yAxisHeader
  yAxisCount = 0
  newAxisID = 0
  for (var key in data) {
    yAxisCount += 1
    newAxisID = parseInt(key)
    myYAxis[key]['no']= yAxisCount
    myHtml2append = yAxisHtml.split("{id}").join(key)
    myHtml2append = myHtml2append.split("{NO}").join(yAxisCount)
    my_Y_Axis += myHtml2append
    }
  if (addNew == true)
    {
      yAxisCount += 1
      newAxisID = "00000" + (parseInt(newAxisID)+1)
      newAxisID = newAxisID.slice(newAxisID.length-4,8);
      myYAxis[newAxisID] = JSON.parse(JSON.stringify(tmplYAxis));
      myYAxis[newAxisID]['no']= yAxisCount
      
      myHtml2append = yAxisHtml.split("{id}").join(newAxisID)
      myHtml2append = myHtml2append.split("{NO}").join(yAxisCount)

      myHtml2append = myHtml2append.split('data-collapsed="true"').join('data-collapsed="false"')
      my_Y_Axis += myHtml2append        
    }
  my_Y_Axis += '</table>'
  y_Axis_Rows = $('#y_axis_settings');
  y_Axis_Rows.html(my_Y_Axis).trigger('create');
  YValue2Screen()
}

//****************************************
function YValue2Screen()
//****************************************
{
  myOptions = "";
  for (var key in myYAxis )
  {
    myActID = key
	myOptions += "<option value=\"" + key + "\">" +  myYAxis[key]['no']  + "</option>";
    for (var entry in myYAxis[key])
      {
		if (entry != 'no')
         {
           myObj = $('#'+entry+'-'+myActID)
          if (myObj[0].nodeName == "SELECT")
            {
              $('#'+entry+'-'+myActID).val(myYAxis[key][entry]).selectmenu('refresh');
            }
          else
            {
              myObj[0].value = myYAxis[key][entry]
            }
         }
      }
  }
  for (var key in myItems )
  {
	myActValue = myItems[key]['apAssign']
	if (myYAxis[myActValue] == undefined)
	{
	   // Y-Axis disappeared
	   myValue="0001"
	   myItems[key]['apAssign'] = "0001"
	}
	$('#apAssign-'+key ).children().remove().end();
    $('#apAssign-'+key ).append(myOptions).val(myActValue).selectmenu('refresh');
  }
}
//****************************************
function addYAxis()
//****************************************
{
  YAxis2Screen(myYAxis,true)
}


//*******************************************************
// Stack - Handling
//*******************************************************


//****************************************
function Stacks2Screen(addNew)
//****************************************
{
  my_Stacks = ""
  my_Stacks += tmplStackHeader
  StackCount = 0
  newStackID = 0
  for (var key in myStackings) {
    StackCount += 1
    newStackID = parseInt(key)
    myStackings[key]['no']= StackCount
    myHtml2append = tmplStacks.split("{id}").join(key)
    myHtml2append = myHtml2append.split("{NO}").join(StackCount)
    my_Stacks += myHtml2append
    }
  if (addNew == true)
    {
      StackCount += 1
      newStackID = "00000" + (parseInt(newStackID)+1)
      newStackID = newStackID.slice(newStackID.length-4,8);
      myStackings[newStackID] = {}
      myStackings[newStackID]['no']= StackCount
      myStackings[newStackID]['apStackType']     = "normal"
      myStackings[newStackID]['apStackExposure']     = "columnstack"
      
      myHtml2append = tmplStacks.split("{id}").join(newStackID)
      myHtml2append = myHtml2append.split("{NO}").join(StackCount)

      myHtml2append = myHtml2append.split('data-collapsed="true"').join('data-collapsed="false"')
      my_Stacks += myHtml2append        
    }
  my_Stacks += '</table>'
  Stack_Rows = $('#StackSettings');
  Stack_Rows.html(my_Stacks).trigger('create');
  StackValue2Screen()
}

//****************************************
function StackValue2Screen()
//****************************************
{
  myOptions = "";
  // add a blank line
  myOptions += "<option value=\"" + '0000' + "\">" +  '&nbsp;'  + "</option>";
  for (var key in myStackings )
  {
	myOptions += "<option value=\"" + key + "\">" +  myStackings[key]['no']  + "</option>";
	myActID = key
    for (var entry in myStackings[key])
      {
        if (entry != 'no')
         {
           myObj = $('#'+entry+'-'+myActID)
          if (myObj[0].nodeName == "SELECT")
            {
              $('#'+entry+'-'+myActID).val(myStackings[key][entry]).selectmenu('refresh');
            }
          else
            {
              myObj[0].value = myStackings[key][entry]
            }
         }
      }
  }
  for (var key in myItems )
  {
	myObj = '#apStack-'+key 
	myActValue = myItems[key]['apStack']
	if (myStackings[myActValue] == undefined)
	{
	   // Stack disappeared
	   myValue="0000"
	   myItems[key]['apStack'] = ""
	}
	$(myObj).children().remove().end();
    $(myObj).append(myOptions).val(myActValue).selectmenu('refresh');
  }
  
}

//****************************************
function addStack()
//****************************************
{
  Stacks2Screen(true)
}
//****************************************
function deleteStack(button)
//****************************************
{
	myActId=button.id.split("-")[1]
	delete myStackings[myActId]
	Stacks2Screen(false)
}

//****************************************
function changedStack(that)
//****************************************
{
	myActName=that.id.split("-")[0]
	myActId=that.id.split("-")[1]
	myStackings[myActID][myActName] = that.value
}


//*******************************************************
// Settings - Handling
//*******************************************************

//****************************************
function SetSelectItem()
//****************************************
{
	if (myTimeSettings.ItemType == "Database")
  {
    var myType ="Series"
  }
  else
  {
    var myType ="ListItems"
  }
  myItemList = ""
  $.each(mySerieItems[myType], function(idx, myItem){
    myItemList += "<option value=\"" + myItem + "\">" +  myItem  + "</option>";
	})

	ExposureList = ""
	$.each(myExposures, function(idx, myItem){
	ExposureList += "<option value=\"" + myItem + "\">" +  myItem  + "</option>";
	})   

	for (key in myItems)
	{
		$('#apItem-'+key).children().remove().end();
		$('#apItem-'+key).append(myItemList).val('avg').selectmenu('refresh');

		$('#apExposure-'+key).children().remove().end();
		$('#apExposure-'+key).append(ExposureList).val('spline').selectmenu('refresh');
		
		$('#apMode-'+key).children().remove().end();
		$('#apMode-'+key).append(modeslist).val('avg').selectmenu('refresh');
		
	}
	
	
}

//****************************************
function GetColor(button) 
//****************************************
{
	var myColorButton = button;
	var myID = button.id.split("-")[1];

	var self = this;
	var canvas = $('<canvas style="border: none;">')

	var node = this.element;
	var size = 280;
	var colors = 30;	// Original 15
	var steps = 10;		// Original 19
	var step = Math.round(2 * 100 / (steps + 1) * 10000) / 10000;

	var arc = Math.PI / (colors + 2) * 2;
	var startangle = arc - Math.PI / 2;
	var gauge = (size - 2) / 2 / (steps + 1);
	var share = 360 / colors;
	var center = size / 2;

	if (canvas[0].getContext) {
		var ctx = canvas[0].getContext("2d");
		ctx.canvas.width = size;
		ctx.canvas.height = size;
		canvas.width(size).height(size);

		// draw background
		ctx.beginPath();
		ctx.fillStyle = '#888';
		ctx.shadowColor = 'rgba(96,96,96,0.4)';
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 4;
		ctx.arc(center, center, size / 2 - 1, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.beginPath();
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;
		ctx.fillStyle = '#555';
		ctx.arc(center, center, size / 2 - 2, 0, 2 * Math.PI, false);
		ctx.fill();

		// draw colors
		for (var i = 0; i <= colors; i++) {
			var angle = startangle + i * arc;
			var ring = 1;
			var h = i * share;
			for (var v = step; v <= 100 - step/2; v += step) {
				ctx.beginPath();
				ctx.fillStyle = 'rgb('+fx.hsv2rgb(h, 100, v).join(',')+')';
				ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
				ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
				ctx.fill();
				ring += 1;
			}
			for (var s = (100 - step * ((steps + 1) % 2)/2); s >= step/2; s -= step) {
				ctx.beginPath();
				ctx.fillStyle = 'rgb('+fx.hsv2rgb(h, s, 100).join(',')+')';
				ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
				ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
				ctx.fill();
				ring += 1;
			}
		}

		// draw grey
		angle = startangle - 2 * arc;
		ring = 1;
		h = i * share;
		for (var v = step; v <= 100; v += (step / 2)) {
			ctx.beginPath();
			ctx.fillStyle = 'rgb('+fx.hsv2rgb(h, 0, v).join(',')+')';
			ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + 2 * arc + 0.01, false);
			ctx.arc(center, center, ring * gauge, angle + 2 * arc + 0.01, angle, true);
			ctx.fill();
			ring += 1;
		}

		// draw center
		ctx.beginPath();
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.arc(center, center, gauge + 1, 0, 2 * Math.PI, false);
		ctx.fill();

	}

	//var items = this.options.item.explode();
	var colormodel = 'rgb'
	var max = [255,255,255]
	var min = [0,0,0]


	// ensure max and min as array of 3 floats (fill by last value if array is shorter)
	for(var i = 0; i <= 2; i++) {
		max[i] = parseFloat(max[Math.min(i, max.length-1)])
		min[i] = parseFloat(min[Math.min(i, min.length-1)])
	}
	// get Position
	myElement = document.getElementById(button.id)
	var rect = myElement.getBoundingClientRect();
	var mytop = rect.top + (rect.bottom - rect.top) / 2 
	var myleft = rect.left + (rect.right - rect.left) / 2 
	// event handler on color select
	//positionTo: this.element
	canvas.popup({ theme: 'none', overlayTheme: 'a', shadow: false, y:mytop, x:myleft  }).popup("open")
	.on( {
		'popupafterclose': function() { $(this).remove(); },
		'click': function (event) {
			var offset = $(this).offset();
			var x = Math.round(event.pageX - offset.left);
			var y = Math.round(event.pageY - offset.top);

			var values = canvas[0].getContext("2d").getImageData(x, y, 1, 1).data;
			// DEBUG: console.log([rgb[0], rgb[1], rgb[2], rgb[3]]);

			if(values[3] > 0) { // set only if selected color is not transparent
				switch(colormodel) {
					case 'rgb':
						values = [
							Math.round(values[0] / 255 * (max[0] - min[0])) + min[0],
							Math.round(values[1] / 255 * (max[1] - min[1])) + min[1],
							Math.round(values[2] / 255 * (max[2] - min[2])) + min[2]
						];
						break;
					case 'hsl':
						values = fx.rgb2hsl(values[0],values[1],values[2]);
						values = [
							Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
							Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
							Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
						];
						break;
					case 'hsv':
						values = fx.rgb2hsv(values[0],values[1],values[2]);
						values = [
							Math.round(values[0] / 360 * (max[0] - min[0])) + min[0],
							Math.round(values[1] / 100 * (max[1] - min[1])) + min[1],
							Math.round(values[2] / 100 * (max[2] - min[2])) + min[2]
						];
						break;
				}

				
	self._mem = values;
			}

			$(this).popup("close");
			myColor = rgbToHex(values[0],values[1],values[2])
			myColorButton.style.backgroundColor=myColor
			// Set Value to dict
			myActId=myColorButton.id.split("-")[1]
			myItems[myActId]['apColor'] = myColor
		}
	});

}



//****************************************
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
//****************************************

//****************************************
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//****************************************


//****************************************
function selectChanged(myObj)
//****************************************
{
  console.log(myObj);
  switch(myObj.name)
  {
    case 'selDuration' :
    {
      $('#txtDuration')[0].value = myObj.value;
      break;
    }
    case 'apDataSource' :
    {
      myTimeSettings.ItemType  = myObj.value;
      SetSelectItem();
      break;
    }
  }
 isItem = myObj.id.search("apItem-") == 0 ? true : false
 if (isItem)
  {
    myActId=myObj.id.split("-")[1]
	myItems[myActId]['apItem'] = myObj.value;
    myHeadLine = document.getElementById("itemsetting-"+myActId)
    myText = myHeadLine.children[0].innerHTML
    myNewText=myText.split(">")[0]+">" + myObj.value
    myNewText += myText.substr(myText.search("<span",189))
    
    myHeadLine.children[0].innerHTML  = myNewText
  }

}
//****************************************
function SetupPage(event, ui)
//****************************************
{
	// source was for different menu styles and is not needed any more
	// can be used to display config menus for more items
	// get available database modes from backend driver and make
	// them selectable options
	modes = io.aggregates ? io.aggregates.concat(['minmax', 'minmaxavg']) : ['avg', 'min', 'max', 'diff', 'sum', 'on', 'raw', 'count', 'countall', 'integrate', 'differentiate', 'duration', 'minmax', 'minmaxavg'];
	//var modes = io.aggregates.concat(['minmax', 'minmaxavg']);
	modeslist = ""
	$.each(modes, function(idx, mode){
	modeslist += "<option value=\"" + mode + "\">" +  mode  + "</option>";
	})

	
	GetSeriesItems();
	GetAllSets();
	YAxis2Screen(myYAxis,false);
	StackValue2Screen(false);
	Items2Screen(false);
	SetSelectItem();

	

	myDate= new Date()
	document.getElementById("StartDate").value= myDate.toJSON().slice(0, 4) +'-01-01'
	document.getElementById("EndDate").value= myDate.toJSON().slice(0, 10);
	document.getElementById("EndTime").value= myDate.toJSON().slice(11, 16)
  

  //$('#StartDate').prop('disabled',true);

  // start plot display on button click
  $('#apSubmit ').on('click', function(event,ui){
  
    var plot = $('[id*="analyse-plotpopup"]');
    var plotId = plot.attr('id');
    var that = plot.data().svWidget;
            
    // stop subscription for actual plot
    if (io.stopseries )
      io.stopseries(plot);
    that.element.highcharts().destroy();
    var apSeries = "", apCount = "", apExposure = "", apColor = "", apMode = "", apLabel = "", apAssign = "", apStacking = "", apStacks = "", apBaseItems = "";

    // Data source: database or item
    var apDataSource = $('#apDataSource').val().toString() || 'database';

    // time axis
    var apTmin = $('#apTmin').val().toString() || '1h';
    var apTmax = $('#apTmax').val().toString() || 'now';
    
    //y-axis parameters for 4 axes				
    var apYmins = [], apYmaxs = [], apYtypes = [],apYposs = [], apYunits = [];
    // check active axis with highest number
    for (var i=1; i<5; i++){
      if ($('#apYact'+i).prop('checked'))
        var apMaxYaxis = i;
    }
    // evaluate settings up to highest active axis
    for (var i=1; i<apMaxYaxis+1; i++){
      apYmins[i-1]  = $('#apYmin'+i).val().toString() || ''; 
      apYmaxs [i-1] = $('#apYmax'+i).val().toString() || '';
      apYtypes[i-1] = $('#apYtype'+i).val().toString();
      apYposs[i-1]  = $('#apYpos' +i).val().toString();
      apYunits[i-1] = $('#apYunit' +i).val().toString() || '';
    }
    var apYmin = apYmins.join(',');
    var apYmax = apYmaxs.join(',');
    var apYtype = apYtypes.join(',');
    var apYpos = apYposs.join(',');
    var apYunit = apYunits.join(',');
    var apChartopts = $('#apChartopts').val() || '';

    // item specific settings organized in 5 tabs
    for (var source = 1; source < 6; source++){
      var apItems = $('#apItem'+ source).val().toString().split(/,\s*/);
      if (apItems =='')
        apItems = null;
      var apModes = $('#apMode-' + source).val().toString();
      var apCounts = $('#apCount' + source).val().toString().split(/,\s*/);
      var apExposures = $('#apExposure' + source).val().toString().split(/,\s*/);
      var apColors = $('#apColor' + source).val().toString().split(/,\s*/);
      var apAssigns = $('#apAssign' + source).val().toString().split(/,\s*/);
      var apStackings = $('#apStacking' + source).val().toString().split(/,\s*/);
      var apStackss = $('#apStacks' + source).val().toString().split(/,\s*/);

      // every tab can have more than one item
      $.each(apItems, function(idx, apItem){
        var delimiter = (idx == 0 && source== 1) ? '': ',';
        if (apSeries != '')
          apSeries += ',';
        if (apCounts[idx] == undefined || apCounts[idx] == '')
          apCounts[idx] = 100;
        if (apExposures[idx] == undefined || apExposures[idx] == '')
          apExposures[idx] = 'line';
        if (apColors[idx] == undefined) 
          apColors[idx] = '';
        if (apAssigns[idx] == undefined || apAssigns[idx] == '')
          apAssigns[idx] = 1;
        if (apStackings[idx] == undefined || apStackings[idx] == '') 
          apStackings[idx] = 'normal';
        if (apStackss[idx] == undefined) 
          apStackss[idx] = '';
        if (apDataSource == 'database'){
          if (apModes.indexOf("minmax") == 0){
            apSeries += [apItem, "min", apTmin, apTmax, apCounts[idx]].join('.') +',';
            apSeries += [apItem, "max", apTmin, apTmax, apCounts[idx]].join('.');
            if (apModes == "minmaxavg")
              apSeries += ',' + [apItem, "avg", apTmin, apTmax, apCounts[idx]].join('.');
          } else
              apSeries += [apItem, apModes, apTmin, apTmax, apCounts[idx]].join('.');
        } else
          apSeries += apItem;

        apLabel += delimiter + apItem;
        apCount += delimiter + apCounts[idx];
        apExposure += delimiter + apExposures[idx];
        apColor += delimiter + apColors[idx];
        apMode += delimiter + apModes;
        apAssign += delimiter + apAssigns[idx];
        apStacking += delimiter + apStackings[idx];
        apStacks += delimiter + apStackss[idx];
        apBaseItems += delimiter + apItem;
      })
    }

    // populate widget parameters from input elements
    plot.attr('data-tmin', apTmin);
    that.options.tmin = apTmin;
    plot.attr('data-tmax', apTmax);
    that.options.tmax = apTmax;
    plot.attr('data-ymin', apYmin);
    that.options.ymin = apYmin;
    plot.attr('data-ymax', apYmax);
    that.options.ymax = apYmax;
    plot.attr('data-ytype', apYtype);
    that.options.ytype = apYtype;
    plot.attr('data-opposite', apYpos);
    that.options.opposite = apYpos;
    plot.attr('data-unit', apYunit);
    that.options.unit = apYunit;
    plot.attr('data-chart-options', apChartopts);
    if (apChartopts != undefined && apChartopts != ''){
      try {that.options.chartOptions = JSON.parse(apChartopts);} 
      catch(error){notify.message('error', 'No valid JSON', 'please use quotes for the individual properties, e.g. {"rangeSelector":{"selected":"2"}}');}
    }
    
    plot.attr('data-item',  apSeries);
    that.options.item = apSeries;
    that.items = apSeries.split(',');
    plot.attr('data-mode',  apMode);
    that.options.mode = apMode;
    plot.attr('data-count', apCount);
    that.options.count = apCount;
    plot.attr('data-exposure', apExposure);
    that.options.exposure = apExposure;
    plot.attr('data-color', apColor);
    that.options.color = apColor;
    plot.attr('data-label', apLabel);
    that.options.label = apLabel;
    plot.attr('data-assign', apAssign);
    that.options.assign = apAssign;
    plot.attr('data-stacking', apStacking);
    that.options.stacking = apStacking;
    plot.attr('data-stacks', apStacks);
    that.options.stacks = apStacks;
    
    that._create()
            
    // start new series subscription
    if (io.startseries)
      io.startseries(plot);
      
    // update widget code display field
    var widgetCode = ["''", setWidgetParam(apBaseItems, ''), setWidgetParam(apMode, 'avg'), setWidgetParam(apTmin, '1h'), setWidgetParam(apTmax, 'now'), setWidgetParam(apYmin, ''), setWidgetParam(apYmax, ''),
             setWidgetParam(apCount, '100'), setWidgetParam(apLabel, ''), setWidgetParam(apColor, ''), setWidgetParam(apExposure, 'line'), "''", "'advanced'", setWidgetParam(apAssign, ''),
             setWidgetParam(apYpos, ''), "''", setWidgetParam(apYtype, 'linear'), setWidgetParam(apYunit, ''), 	apChartopts ? apChartopts: "''", setWidgetParam(apStacking, 'normal'), setWidgetParam(apStacks, ''), "2", 
             "'"+apDataSource+"'"	].join(', '); 
    var widgetCodeHtml = $('#apWidgetCode').html();
    $('#apWidgetCode').html(widgetCodeHtml.replace(/period\(.*\)/, 'period('+widgetCode+')'));
  });
  
  function setWidgetParam(widgetParam, defaultValue){
    if (widgetParam.split(/,\s*/).every(function(element){return element == defaultValue}))
      widgetParam = '';
    var paramLength = widgetParam.split(',').length;
    var ret = paramLength > 1 ? "['":"'";
    ret += widgetParam.split(/,\s*/).join("', '");
    ret += paramLength > 1 ? "']" : "'";
    return ret;
  }
};



//************************************************************
// Some helper function
//************************************************************

//*****************************************
function getCheckRadio(myRadioName)
//*****************************************
{
var radios = document.getElementsByName(myRadioName);

for (var i = 0, length = radios.length; i < length; i++) {
  if (radios[i].checked) {
    var retVal = radios[i].id
    // only one radio can be logically checked, don't check the rest
    break;
  }
}
return retVal
}

//*****************************************
function setCheckRadio(myRadioName, radioID)
//*****************************************
{
  var radios = document.getElementsByName(myRadioName);

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].id == radioID) {
      $("#"+radios[i].id).click()
      $("#"+radios[i].id).click()
      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
}


//*****************************************
function LoadSet(that)
//*****************************************
{
	myFileName = that.value
	$.ajax({
      url: "apps/app_analyzer_comfort.php",
      type: "GET",
         data: {
              command  : 'get_set_settings',
              filename : myFileName
             },
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        console.log('Status of load set:'+ response );
		data = JSON.parse(response);
		myTimeSettings 	= data["TimeSettings"]
		myYAxis 		= data["yAxis"]
		myItems			= data["Items"]
		myChartOptions  = data["chartOptions"]
		myStackings 	= data["Stackings"]
		
		YAxis2Screen(myYAxis,false);
		Stacks2Screen(false);
		Items2Screen(false);
      },
      error: function () {
          notify.message('error', 'Error when loading Set from Backend', 'Please try again');

      }
   });
}

//*****************************************
function SaveSetAs()
//*****************************************
{
  console.log("saveSetAs")
  fileName = document.getElementById('apNewFileName').value
  if (fileName == "")
  {
	  notify.message('error', 'No valid Filename', 'Please enter a correct Filename');
	  return;
  }
  storeSet(fileName);
  mySetList = "<option value=\"" + fileName + "\">" +  fileName  + "</option>";
  $('#apLoadSettings').append(mySetList).val(fileName).selectmenu('refresh');
  fileName = document.getElementById('apNewFileName').value = ""
}

//*****************************************
function SaveSet()
//*****************************************
{
  console.log("saveSet")
  fileName = document.getElementById("apLoadSettings").value
  if (fileName == "")
  {
	  notify.message('error', 'No Set selected', 'Please select a set-name');
	  return;
  }
  storeSet(fileName);
}

//************************************************************
// PHP Function
//************************************************************

//************************************************************
function storeSet(myFileName)
//************************************************************
{
  values2Save = {
                  "TimeSettings" : myTimeSettings,
                  "yAxis"        : myYAxis,
                  "Items"        : myItems,
                  "chartOptions" : myChartOptions,
                  "Stackings"    : myStackings
                }
  $.ajax({
      url: "apps/app_analyzer_comfort.php",
      type: "GET",
         data: {
              command : 'store_set_settings',
              filename : myFileName,
              data : JSON.stringify(values2Save)
             },
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        console.log('Status of storing set :'+ response );
      },
      error: function () {
          notify.message('error', 'Error when storing Set to Backend', 'Please try again');

      }
   });
}

//****************************************
function GetSeriesItems()
//****************************************
{
$.ajax({
    url: "apps/app_analyzer_comfort.php",
    type: "GET",
		   data: {
			   		command : 'get_set_series_items'
			   	 },
    contentType: "application/json; charset=utf-8",
    success: function (response) {
    	console.log('Status of get serie-items :'+ response );
      mySerieItems = JSON.parse(response);
      SetSelectItem();
    },
    error: function () {
        console.log("Error - while gettins series")

    }
 });	


}

//************************************************************
function GetAllSets()
//************************************************************
{
$.ajax({
    url: "apps/app_analyzer_comfort.php",
    type: "GET",
		   data: {
			   		command : 'getFileArray',
            suffix  : '.pac'
			   	 },
    contentType: "application/json; charset=utf-8",
    success: function (response) {
    	console.log('Status get all sets :'+ response );
      setlistJson = JSON.parse(response)
      mySetList = ""
	  var firstSet = ""
      $.each(setlistJson, function(idx, mySet){
        mySet = mySet.split('.')[0]
		if (firstSet == "")	{ firstSet = mySet }
        mySetList += "<option value=\"" + mySet + "\">" +  mySet  + "</option>";
      })
     
       $('#apLoadSettings').children().remove().end();
       $('#apLoadSettings').append(mySetList).val('').selectmenu('refresh');
    },
    error: function () {
        console.log("Error - while storing settings")

    }
 });
}