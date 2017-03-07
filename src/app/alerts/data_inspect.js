

var url = 'http://'+ document.location.hostname + ':8080/gui/detail.html?alertID=';

var restHostName = "hostnameInformation";
var restAlertsforIP = "retrieveAlertDetailsByIP";
var restAlertDetail = "retrieveAlertId.json";
var restAlertIPs = "retrieveAlerts";

var src = '';

var date_time_value, start, end;

//date_time_value = get_date_time();

var alertID ="";

//var alertID = getUrlVars()["alertID"]; 
/*var demo = getUrlVars()["demo"];

if (demo != undefined) {

	if (demo == "true") settings.operational = false;

}*/

console.log("Loading alert page");

/*var is_controlled = false; //true if it should be controllable


(function () {
	'use strict';
	if (getUrlVars()["controlled"] != undefined){
		is_controlled = getUrlVars()["controlled"];
		//load css
    	$('#insight_css').attr('href', 'css/insight_projector.css');
	}
}());

if(is_controlled){
	var dateAlertObserver = {
		notify: function (message) {
			var temp = JSON.parse(message);
			if (temp.event_type === "date") {
				date_time_value = temp.date;
				alertID = undefined; //would have priority otherwise
				alert_inspect();
			} else if (temp.event_type === "alertId"){
				alertID = temp.alertId; //has priority over any date
				alert_inspect();
			} else if (temp.event_type === "ip"){
				alertID = undefined;
				src = temp.ip;
				alert_inspect();
			} else if (temp.event_type === "scroll" && temp.which === "det"){
		        window.scrollBy(0, 100*temp.pages);
		      }
		}
	}

	var eventManager = EventManager();
	eventManager.settings.channel = is_controlled;
	eventManager.init();
	eventManager.registerObserver(dateAlertObserver);
}*/


alert_inspect();


function alert_inspect(){

	/*
	
	if (alertID == undefined) {

		if (getUrlVars()["srcIP"] != undefined) setup_detail_data_page_client();
		else if (getUrlVars()["DNName"] != undefined) setup_detail_data_page_domain();
		else return; 
	}		

	else */ setup_alert_page();


		
}


function setup_detail_data_page_client(){

	//if (getUrlVars()["srcIP"] != undefined)  

	src = getUrlVars()["srcIP"];

	if (getUrlVars()["start"] != undefined) {

		start = decodeURI(getUrlVars()["start"]);

		end = decodeURI(getUrlVars()["end"]);
	}

	else {

		start = date_time_value.split(' ')[0] + ' 00:00:00';

		end = date_time_value.split(' ')[0] + ' ' + date_time_value.split(' ')[1] + ':59';

	}

	//if (src == '') return;
	
	$('#detail-page-ip').html(src + "(....)");

	if (!is_controlled) {

		$('#detail-page-time').html(moment(start).format('YYYY-MM-DD HH:mm') + "  -  " + moment(end).format('YYYY-MM-DD HH:mm') + " ");

		$('#detail-page-timezone').html(settings.timeZone);

	} else $('#detail-page-time-title').remove();


	$('#detail-page-header').show(); $("#alert-page-header").hide();

	$.getJSON(build_url(restHostName, "ipAddress=" + src), function (hostInfo) {

		var src_display = src;

		if (settings.operational) {

			src_display += " (";
			if (ValidateIPaddress(hostInfo.hostname)){
				src_display +=  "No hostname found";
			} else {
				src_display += hostInfo.hostname;
			}

			src_display += ")";

		} else src_display = anonymize(src);

		$('#detail-page-ip').html(src_display);

		$.getJSON(build_url(restAlertsforIP, "srcIP=" + src), function (alerts) {

			var alertsTitle = "";

			if (alerts.length != 0 ) {

				alerts.forEach(function(alert) {

					alertsTitle += "<li>" + lookup(alert_types, "id", alert.type).title;

					var str = " (id:" + alert.alertId + ")";

					alertsTitle += str.fontsize(1) + "</li>";

				});
			}
			else alertsTitle = "<b>No Alerts Issued</b><br>";

			$('#detail-page-alerts').html(alertsTitle);

					
			render_details(src, start, end, "replies");


		});

	});


	$("#data-queries").click( function () {

		

		render_details(src, start, end, "queries");

	});

			
	$("#data-replies").click( function () {



		render_details(src, start, end, "replies");

	});


	$('#data-selection').click(function() {

		$(this).find('.btn').toggleClass('active');  

	    if ($(this).find('.btn-primary').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-primary');
	    }

	    $(this).find('.btn').toggleClass('btn-default');

	});	
		

}	

function setup_detail_data_page_domain(){

	src = getUrlVars()["DNName"];

	if (getUrlVars()["start"] != undefined) {
		
		start = decodeURI(getUrlVars()["start"]); end = decodeURI(getUrlVars()["end"]);
	}

	else {

		start = date_time_value.split(' ')[0] + ' 00:00:00';

		end = date_time_value.split(' ')[0] + ' ' + date_time_value.split(' ')[1] + ':59';
	}

	
	if (!is_controlled) {

		$('#detail-page-time').html(moment(start).format('YYYY-MM-DD HH:mm') + "  -  " + moment(end).format('YYYY-MM-DD HH:mm') + " "); 

		$('#detail-page-timezone').html(settings.timeZone);

	} else $('#detail-page-time-title').remove();


	$('#detail-page-header').show(); $("#alert-page-header").hide();

	$('#detail-page-ip').html(src);

	$("#assoc-alerts").hide();

					
	render_details(src, start, end, "replies",undefined,undefined,"DNName");


	$("#data-queries").click( function () {

		render_details(src, start, end, "queries",undefined,undefined,"DNName");

	});

			
	$("#data-replies").click( function () {

		render_details(src, start, end, "replies",undefined,undefined,"DNName");

	});


	$('#data-selection').click(function() {

		$(this).find('.btn').toggleClass('active');  

	    if ($(this).find('.btn-primary').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-primary');
	    }

	    $(this).find('.btn').toggleClass('btn-default');

	});	
		

}	


function setup_alert_page(){

	console.log("Alert page");

	$.getJSON('/app/data/' + restAlertDetail, function(alert) {

	//jQuery.getJSON(build_url(restAlertDetail, "alertId=" + alertID), function(alert) {

		end = alert.timestamp.split('.')[0]; start = end.split(' ')[0] + ' 00:00:00';

		date_time_value = end.substring(0, end.length - 3);

		src = alert.srcIP; 

		var source = "replies"; if (alert.hasOwnProperty("eventSource")) source = alert.eventSource;
		
		var filters = []; if (alert.hasOwnProperty("filters")) filters = alert.filters;

	//	jQuery.getJSON(build_url(restHostName, "ipAddress=" + src), function(clientInfo) {

			console.log("Got alert for src: " + src + " on " + start);

			var alertType = alert.type;

			$("#alert-id").html(alertID);


	//		$("#alert-type").html(lookup(alert_types, "id", alertType).title);

			$("#alert-type").html(alertType);

			var src_display = src;

	/*		if (settings.operational) {

				var src_display = "<a href='https://c0041696.itcs.hp.com/APPLICATION/HOSTUSER/hostuser.php?a=1&str=" + 
							  src + "' target='_blank'>" + src + "</a>";

				src_display += " (";

				if (ValidateIPaddress(clientInfo.hostname)) src_display +=  "No hostname found";
				else src_display += clientInfo.hostname;

				src_display += ")";
					
			}

			else src_display = anonymize(src);*/

			$("#alert-client").html(src_display);


			$("#alert-time").html(end.substring(0, end.length - 3) + " ");
			$("#alert-timezone").html('UTC');

			/*
			
			jQuery.getJSON(build_url(restAlertIPs), function(alerts) {

				var inner = "";

				alerts.forEach(function(d) {

				    if (d.type == alertType && d.srcip != src) inner += "<a href='"+ url + d.alertId + "' target='_blank'>"+ d.srcip +"</a>, ";	
				      
				});

				if (inner != "") inner = inner.substring(0, inner.length - 2);
				else inner = "NONE"	;


				$("#alert-others").html(inner);

				if (!settings.operational) $("#alert-others").hide();
			*/

				$("#alert-page-header").show(); $('#detail-page-header').hide();

				//retrieveRawDNSReplies?date=2017-08-26&hour=05&minutes=59&startDate=2017-08-26%2000:00:00&endDate=2017-08-26%2005:59:59&srcIP=93.184.217.124&AlertType=BadClient-DGAConfickerAB&OperationType=retrieve&PageNum=1

				render_details(src, start, end, source, filters, alertType);

			//});
				
	//	});

	});

}

