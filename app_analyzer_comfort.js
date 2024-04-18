//****************************************
// some global variables
//****************************************

var mySerieItems = [];
var source = "";
var modes = "";
var modeslist = "";
var myExposures = ['area','areaspline','areastack','areastair','column','columnstack','line','linestack','spline','stair'];
var ExposureList = "";

//****************************************
function GetSeriesItems()
//****************************************
{
	var f = new XMLHttpRequest();
    f.open("GET", "apps/series_items.json", false);
    f.onreadystatechange = function ()
    {
        if(f.readyState === 4)
        {
            if(f.status === 200 || f.status == 0)
            {
                var res= f.responseText;
                //alert(res);
				mySerieItems = JSON.parse(res);
            }
        }
    }
    f.send(null);
}


//****************************************
function SetSelectItem()
//****************************************
{
	$.each(mySerieItems, function(idx, myItem){
    modeslist += "<option value=\"" + myItem + "\">" +  myItem  + "</option>";
	})
  
   $('#apItem1').append(modeslist).val('avg').selectmenu('refresh');
   
   $.each(myExposures, function(idx, myItem){
    ExposureList += "<option value=\"" + myItem + "\">" +  myItem  + "</option>";
	})
  
   $('#apExposure1').append(ExposureList).val('spline').selectmenu('refresh');
  
	
	
}

//****************************************
function GetColor(button) {
//****************************************
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
					// Send Value immediate
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
  }
 isItem = myObj.id.search("apItem") == 0 ? true : false
 if (isItem)
  {
    myId = myObj.id.replace(/[^0-9]/g,"");
    myHeadLine = document.getElementById("itemsetting"+myId)
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
  
  GetSeriesItems();
  SetSelectItem();
  
  myDate= new Date()
  document.getElementById("StartDate").value= myDate.toJSON().slice(0, 4) +'-01-01'
  document.getElementById("EndDate").value= myDate.toJSON().slice(0, 10);
  document.getElementById("EndTime").value= myDate.toJSON().slice(11, 16)
  

  //$('#StartDate').prop('disabled',true);
	
			
  // get available database modes from backend driver and make
  // them selectable options
  var modes = io.aggregates ? io.aggregates.concat(['minmax', 'minmaxavg']) : ['avg', 'min', 'max', 'diff', 'sum', 'on', 'raw', 'count', 'countall', 'integrate', 'differentiate', 'duration', 'minmax', 'minmaxavg'];
  //var modes = io.aggregates.concat(['minmax', 'minmaxavg']);
  var modeslist = ""
  $.each(modes, function(idx, mode){
    modeslist += "<option value=\"" + mode + "\">" +  mode  + "</option>";
  })
  for (var i=1; i<6; i++){
    $('#apMode'+ i).append(modeslist).val('avg').selectmenu('refresh');
  }
  
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
      var apModes = $('#apMode' + source).val().toString();
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


