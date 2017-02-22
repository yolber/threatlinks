/* ----------------Get date time: either from url params or set default going back one day---------------- */

function get_date_time() { 

    if (getUrlVars()["date"] != undefined) {


        var date = getUrlVars()["date"];

        var time = getUrlVars()["time"];

        if (time) {
            if (settings.hourShown.indexOf(time) == -1) time = settings.hourShown[settings.hourShown.length-1];
        }   
        else time = settings.hourShown[settings.hourShown.length-1];


        return date + " " + time;
    }

    else {

        var today = new Date();
        var show_day = new Date(today);
        show_day.setDate(today.getDate() - 1 - settings.maxBackDaysfromToday);

        return moment(show_day).format('YYYY-MM-DD') + " " + settings.hourShown[settings.hourShown.length-1];
    }
}

/* ----------------Validate if IP address ------------------------ */

function ValidateIPaddress(ipaddress)   
{  

 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return (true)  
  }  
return (false)  
} 

/* -------------Enable link opening in a separate tab -----------------*/

function enable_links(link_id) {

		jQuery(link_id).on("click",function(){
            jQuery(this).attr("target", "_blank");
        });
	
}

/*-----------Get Random Range -----------------------*/

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}


/*-----------------GET URL variables and return them as an associative array-------------- */

	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}

/* --------------REST Services URL Builder------*/
	
	function build_url(_serviceName, _attr, _date, _time) {

        var localDate, localTime;

        if (_date && _time) {
            localDate = _date; localTime = _time;
        }

        else {

            localDate = date_time_value.split(" ")[0];
            localTime = date_time_value.split(" ")[1];
        }

		var extra = ""; if (_attr) extra += "&" + _attr;

        var restURL = "http://"+ hname + ":" + port + settings.restURL + _serviceName +
                      "?date=" + localDate + "&hour=" + localTime.split(':')[0] + "&minutes=" + localTime.split(':')[1] +
                      extra;

		console.log("URL is : " + restURL);

		return restURL;

	}


/* --------------SPINNER------*/
/*
     * Function for loader.
     * Author: Matt Woelk
     * Code copied from example: http://bl.ocks.org/Mattwoelk/6132258
     * */

function loader(config) {
  return function() {
    var radius = Math.min(config.width, config.height) / 2;
    var tau = 2 * Math.PI;

    var arc = d3.svg.arc()
            .innerRadius(radius*0.5)
            .outerRadius(radius*0.9)
            .startAngle(0);

    var svg = d3.select(config.container).append("svg")
        .attr("id", config.id)
        .attr("width", config.width)
        .attr("height", config.height)
      .append("g")
        .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")")

    var background = svg.append("path")
            .datum({endAngle: 0.33*tau})
            .style("fill", "#4D4D4D")
            .attr("d", arc)
            .call(spin, 1500)

    function spin(selection, duration) {
        selection.transition()
            .ease("linear")
            .duration(duration)
            .attrTween("transform", function() {
                return d3.interpolateString("rotate(0)", "rotate(360)");
            });

        setTimeout(function() { spin(selection, duration); }, duration);
    }

    function transitionFunction(path) {
        path.transition()
            .duration(7500)
            .attrTween("stroke-dasharray", tweenDash)
            .each("end", function() { d3.select(this).call(transition); });
    }

  };
}

/*------------------Add commas to large numbers------------------------------*/

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


/* IFRAME resizer based on internal content */

function resizeIframe(iframe) {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + 20 +"px";
 }


function resizeBody(iframe, _otherHeight) {
  
    var addHeight = 20; var height; 

    if (iframe == undefined || iframe == '') height = document.body.scrollHeight + addHeight + "px";
    
    else height = parent.document.getElementById(iframe).contentWindow.document.body.scrollHeight + addHeight +"px";

    if (_otherHeight) height = _otherHeight;
    
    window.parent.postMessage(["setHeight", height], "*");

}


/* Reset all Iframes to emty href */

function resetIframes() {

    frames = document.getElementsByTagName("iframe");

    for (i = 0; i < frames.length; ++i)
    {
        frames[i].src = "";

    }


}

/* Open specific tab from another iframe */

function open_tab_graphs(type, datetime){

    var demo ="false";


    window.parent.$('#main-tabs a[href="#' + type + 'graphs"]').tab('show');
   
    $("#" + type + "graphs-iframe").attr("src", 'http://' + hname +':8080/gui/graphs.html?date=' + date_time_value.split(" ")[0] + 
                                                    '&time=' + date_time_value.split(" ")[1] + '&graphtype=' + type +'&demo='+ demo);

}

 /*Lookup item in an array based on property*/

 function lookup(array, prop, value) {
    
    for (var i = 0, len = array.length; i < len; i++)
        if (array[i][prop] === value) return array[i];
}

/* anonymize ip */

function anonymize(ip_address){

    if(!isNaN(ip_address.trim().split('.').join(''))) 
        ip_address = ip_address.split('.')[0] +"." + ip_address.split('.')[1] + ".*.*";

    return ip_address;

}

/*--Enable search based on client id, send event to parent window---*/


function show_client_detail(sel_ip) {

    parent.document.getElementById('ip-search-cl').value = sel_ip;


    parent.document.getElementById('ip-search-cl').dispatchEvent(new Event('change'));

}

/*--Enable search based on alert id, send event to parent window---*/

function show_alert_detail(alert_id) {

    parent.document.getElementById('alert-search').value = alert_id;


    parent.document.getElementById('alert-search').dispatchEvent(new Event('change'));


}


/* array sorting based on an object's attribute */

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function getBlacklistType (number) {
    switch (number) {
      case '0':
        return 'Miscellaneous';
        break;
      case '1':
        return 'Botnet';
        break;
      case '2':
        return 'Malware';
        break;
      case '3':
        return 'Misuse and Abuse';
        break;
      case '4':
        return 'Network Worm';
        break;
      case '5':
        return 'P2P';
        break;
      case '6':
        return 'Phishing';
        break;
      case '7':
        return 'Spam';
        break;
      case '8':
        return 'Spyware';
        break;
      case '9':
        return 'Web Application Attack';
        break;
      case '10':
        return 'Worm';
        break;
      default:
        return number;
        break;
    }
}