'use strict';


var a;

var rest_queries= "retrieveRawDNSQueries";
var rest_replies = "retrieveRawDNSReplies";

var domainChart = dc.bubbleChart("#domain-chart");
var categoryChart = dc.rowChart("#category-chart");
var hourChart = dc.barChart("#hour-chart");
var typeChart = dc.pieChart("#type-chart");
var scoreChart = dc.rowChart("#score-chart");
var dgaChart = dc.pieChart("#dga-chart");
var threatChart = dc.rowChart("#threat-chart");
//var domainBubbleOverlay = dc.bubbleOverlay("#world-map");

// Various formatters.
var formatNumber = d3.format(",d"),
    formatChange = d3.format("+,d"),
   formatDate = d3.time.format.utc("%B %d, %Y"),
    //formatTime = d3.time.format("%I:%M:%S %p"),
    formatTime = d3.time.format("%H:%M:%S"),
    formatTimestamp_other = d3.time.format("%Y\/%m\/%d %H:%M:%S"),
    formatTimestamp = d3.time.format('%Y-%m-%d %H:%M:%S%Z');

var queries = [];

var extraParam = ""; var period; var filters = []; var dataType = "replies"; var alert = false; var query;

var sourceType = "srcIP";

var max_records = 5000;  //var number_records = 5000;

var timeZone = 'UTC';

var myLoader = loader({width: 960, height: 500, container: "#loader_container", id: "loader"});


$("#alert-id").hide();
$("#timezone-button").hide();

$('#feedbackContainer').hide();
$("#export-button").hide();

$('#data-pages').hide();
$("#domain-chart").hide();
$("#category-chart").hide();
$("#hour-chart").hide();
$("#type-chart").hide();
$("#score-chart").hide();
$("#dga-chart").hide();
$("#threat-chart").hide();
$("#selected-rec").hide();
$("#data-table").hide();



function render_details (src, start, end, _dataType, _filters, _alertType, srcType) {


    console.log("Getting details for : " + src + " on date: " + start + " - " + end);

    var startDate = new Date(start); 
    var endDate = new Date(end); 
    

    if (_filters) filters = _filters;

    endDate.setDate(endDate.getDate() + 1);

    period = "startDate=" + start + "&endDate=" + end;

    if (srcType != undefined) sourceType = srcType;

    if (srcType == undefined) extraParam = "&srcIP=" + src;
    else if (srcType == "srcIP") extraParam = "&srcIP=" + src;
    else if (srcType == "DNName") extraParam = "&DNName=" + src;


    if (_alertType) {
        extraParam += "&AlertType=" + _alertType;
        alert = true;
    }

    dataType = _dataType;

    /*if (_dataType == "queries") {
        
        var urlCount = build_url(rest_queries, period + extraParam + "&OperationType=count");
    }
    else var urlCount = build_url(rest_replies, period + extraParam + "&OperationType=count"); 


    d3.json(urlCount, function(error, number_records) {


        if (number_records.count > max_records) {
                
                var nrPages = Math.ceil(number_records.count/max_records);

                $('#data-pages').bootpag({
                       total: nrPages,
                       page: 1,
                       maxVisible: 10,
                       leaps: false
                    }).on('page', function(event, num){
                       get_details(num);
                });

                $("#nrRecords").html("   Total records: " + number_records.count +"; pages: " + nrPages);

                //console.log("Number of records: " + number_records.count +"; pages: " + nrPages);
                
        }

        else $("#nrRecords").html("   Total records: " + number_records.count +"; pages: 1"); */

        $("#nrRecords").html("   Total records: " + max_records +"; pages: 1");
        get_details(1);
    //});

}



function get_details (page_num) {

	$('#feedbackContainer').hide();
    $("#export-button").hide();
    $('#data-pages').hide();
    $("#domain-chart").hide();
    $("#category-chart").hide();
    $("#hour-chart").hide();
    $("#type-chart").hide();
    $("#score-chart").hide();
    $("#dga-chart").hide();
    $("#threat-chart").hide();
    $("#selected-rec").hide();
    $("#data-table").hide();
    

    myLoader();
   

    var target = document.getElementById('loader_container');

    //if (dataType == "queries") var urlRetrieve = build_url(rest_queries, period + extraParam + "&OperationType=retrieve" + "&PageNum=" + page_num);
    
    //else var urlRetrieve = build_url(rest_replies, period + extraParam + "&OperationType=retrieve" + "&PageNum=" + page_num);

    var urlRetrieve = 'app/data/' + rest_replies +'.json';

    d3.json(urlRetrieve, function(error, data) {

        queries = data;

        if (error) {

            d3.select("#loader_container").selectAll("svg").remove();

            $('#alert-bad-data').show();

            return console.warn(error);
        }

        $('#alert-bad-data').hide();
        d3.select("#loader_container").selectAll("svg").remove();

        if (data.length != 0) {

            render_data();

            resizeBody();
        }

    });


}

function render_data(_timezone, _data) {

    if (_timezone != undefined) timeZone = _timezone;

    //console.log("Timezone is: " + _timezone);

    if (_data) queries = data;

	queries.forEach(function(d, i) {

    	d.index = i;
    	d.request = d.request.trim();

        switch (d.type) {
            case '0':
              d.type = 'Miscellaneous';
              break;
            case '1':
              d.type = 'Botnet';
              break;
            case '2':
              d.type = 'Malware';
              break;
            case '3':
              d.type = 'Misuse and Abuse';
              break;
            case '4':
              d.type = 'Network Worm';
              break;
            case '5':
              d.type = 'P2P';
              break;
            case '6':
              d.type = 'Phishing';
              break;
            case '7':
              d.type = 'Spam';
              break;
            case '8':
              d.type = 'Spyware';
              break;
            case '9':
              d.type = 'Web Application Attack';
              break;
            case '10':
              d.type = 'Worm';
              break;
            case '':
              d.type = d.source;
        };

        

        var score = parseInt(d.score);

        if (d.score == "") {
            d.score = '0';
            d["score_corse"] = '0';
        }

        if (score <= 20) d["score_corse"] = '1-20';
        else if (score <= 40) d["score_corse"] = '21-40';
            else if (score <= 60) d["score_corse"] = '41-60';
                else if (score <= 80) d["score_corse"] = '61-80';
                    else if (score <= 100) d["score_corse"] = '81-100';


        d.timestamp = d.timestamp.split('.')[0]; 

        var settingsTimeZone = 'UTC';


        if (timeZone == settingsTimeZone) d["timestampInTimeZone"] = moment.tz(d.timestamp, settingsTimeZone);
        else {
            if (d.timestampInTimeZone == undefined) d["timestampInTimeZone"] = moment.tz(d.timestamp, settingsTimeZone);
            d.timestampInTimeZone = d.timestampInTimeZone.tz(timeZone); 
        }




        if (!d.hasOwnProperty("isDGA")) d["isDGA"] = "false";
        
  	});

    
    if (query != undefined) {
     dc.filterAll(); 
     query.remove();
    }

  	query = crossfilter(queries);

    var all = query.groupAll();

    var totalRecords = all.value();

    var date = query.dimension(function(d) { 
            return formatTimestamp.parse(d.timestampInTimeZone.format('YYYY-MM-DD HH:mm:ss') + '+0000'); 
        }),
        dates = date.group(),
        hour = query.dimension(function(d) { return d.timestampInTimeZone.hour() + d.timestampInTimeZone.minutes() / 60; }),
        //hour = query.dimension(function(d) { return d.timestampInTimeZone.getHours() + d.timestampInTimeZone.getMinutes() / 60; }),
        hours = hour.group(Math.floor);



    if (sourceType !="DNName") {

        var domain = query.dimension(function (d) {
             return d.request.trim();

        });
    } else {

        var domain = query.dimension(function (d) {
         return d.clientIP;

        });
    }


    var domainsSimple = domain.group();

    
    var domainNames = []; var randomNumbers = [];

    domainsSimple.all().forEach(function(item) {

        if (item.key != "") {
        	var domainRandom = {
        		name: item.key,
        		xrandom: Math.floor((Math.random()*1000)+1),
        		yrandom: Math.floor((Math.random()*100)+1),
        	};
          	domainNames.push(item.key);
          	randomNumbers.push(domainRandom);
        }
  	});

    var domainName = "";

    //console.log("Total different domains: " + domainNames.length);
     
    var domains = domainsSimple.reduce(

    	function (p, v) {  
            ++p.count;  domainName = v.request;
            if (sourceType =="DNName") domainName = v.clientIP;
        	p.xaxis = randomNumbers[domainNames.indexOf(domainName)].xrandom;
        	p.yaxis= randomNumbers[domainNames.indexOf(domainName)].yrandom;
    	    return p;

    	},
    	function (p, v) { 
            --p.count; domainName = v.request;
            if (sourceType =="DNName") domainName = v.clientIP;
        	p.xaxis = randomNumbers[domainNames.indexOf(domainName)].xrandom;
        	p.yaxis= randomNumbers[domainNames.indexOf(domainName)].yrandom;
    	    return p;
    	},
    	function () {
            return {count:0, xaxis: 0, yaxis: 0};
        }
    );

    var type = query.dimension(function(d) { 
        if (d.isBlacklisted.trim() == "true") return "BlackListed";
        else return "GreyListed"
    });
    var  types = type.group();

    var threat = query.dimension(function(d){
        if (d.type =='') return "None";
        else return d.type;

    });
    var threats = threat.group();


    var dgaDomain = query.dimension(function(d) {
         return d.isDGA; 
    });
    var dgaDomains = dgaDomain.group();


    var score = query.dimension (function (d) { return d.score_corse});
    var scores = score.group();

    
    var category = query.dimension(function(d) { return d.cat; });
    var categories = category.group();


    /*-----------------CHARTS----------------------*/
    

    if (alert) $('#feedbackContainer').show();
    $("#export-button").show();


    $('#data-pages').show();
    $("#domain-chart").show();
    $("#category-chart").show();
    $("#hour-chart").show();
    $("#type-chart").show();
    $("#score-chart").show();
    $("#dga-chart").show();
    $("#threat-chart").show();
    $("#selected-rec").show();
    $("#data-table").show();
   
    

    var bubbleSize = 0.05, maxScale = 50, inc = 1;

    /*
    if (domainNames.length >= 500) {

        domainChart
                .dimension(type)
                .group(types)
                .x(d3.scale.linear().domain([0, 2]));
        $("#domain-chart").hide();
    }
    
    else {*/

        domainChart.width($('#domain-chart').width())
                .height($('#domain-chart').height()-20)
                .margins({top: 10, right: 40, bottom: 30, left: 40})
                .dimension(domain)
                .group(domains)
                .colors(d3.scale.category20c())
                .keyAccessor(function (d) {
                    return d.value.xaxis;
                })
                .valueAccessor(function (d) {
                    return d.value.yaxis;
                })
                .radiusValueAccessor(function (d) {
                    return (d.value.count*inc);
                })
                .x(d3.scale.linear().domain([0, 20000]))
                .y(d3.scale.linear().domain([-100, 1000]))
                .r(d3.scale.linear().domain([0, maxScale]))
                .minRadiusWithLabel(10)
                .elasticY(true)
                .yAxisPadding(10)
                .elasticX(true)
                .xAxisPadding(100)
                .maxBubbleRelativeSize(bubbleSize)
                .elasticRadius(true)
                .renderLabel(true)
                .renderTitle(true)
                .title(function (d) {

                    var title = d.key + "\n"
                            + "Total records: " + d.value.count;

                    if (sourceType !="DNName") {

                        var record = lookup(queries, "request", d.key);

                        if (record.type != '')  title += "\n" + "Type: " + record.type;
                    }

                    return title;

                });
        domainChart.data(function (group) { return group.top(50);});

        domainChart.xAxis().ticks(0);
        domainChart.yAxis().ticks(0);

    //}


    //var timeChart = dc.barChart("#date-chart");
    
    /*
	timeChart
			.width(800)
	        .height(250)
	        .margins({top: 10, right: 40, bottom: 30, left: 10})
	        .dimension(date)
	        .group(dates)
	        .elasticY(true)
	        .centerBar(true)
	        .gap(2)
	    	.x(d3.time.scale()
        		.domain([startDate, endDate]));
        		//.rangeRound([0, 1000]))
        	//.filter([new Date(2013, 09, 11), new Date(2013, 09, 12)]);
    timeChart.xAxis().ticks(24);

    */

    

    /*

    if (alert) {

        if (timeZone != settings.timeZone) {

            var orginal_time = moment.tz(end, 'UTC');
 

            $('#alert-time').html(orginal_time.tz(timeZone).format('YYYY-MM-DD HH:mm') + " ");

            $('#alert-timezone').html(moment.tz.zone(timeZone).abbr(1388563200000));
        }

    
        hourChart
                .width($('#hour-chart').width())
                .height($('#hour-chart').height()-20)
                .margins({top: 10, right: 40, bottom: 30, left: 40})
                .dimension(hour)
                .group(hours)
                .elasticY(true)
              //  .centerBar(true)
                .gap(3)
            .x(d3.scale.linear()
                .domain([0, 24]));

        hourChart.xAxis().ticks(24);
        

    } else {*/
    

        if (timeZone != 'UTC') {

            var orginal_time_start = moment.tz(start, 'UTC'); var orginal_time_end = moment.tz(end, 'UTC');

            $('#detail-page-time').html(orginal_time_start.tz(timeZone).format('YYYY-MM-DD HH:mm') + " - " +  orginal_time_end.tz(timeZone).format('YYYY-MM-DD HH:mm') + " ");

            $('#detail-page-timezone').html(moment.tz.zone(timeZone).abbr(1388563200000));
        }


        var scale_start = formatTimestamp.parse(queries[0].timestampInTimeZone.format('YYYY-MM-DD HH:mm:ss') + '+0000');
        var scale_end = formatTimestamp.parse(queries[queries.length-1].timestampInTimeZone.format('YYYY-MM-DD HH:mm:ss') + '+0000');

        hourChart
                .width($('#hour-chart').width())
                .height($('#hour-chart').height()-20)
                .margins({top: 10, right: 40, bottom: 30, left: 40})
                .dimension(date)
                .group(dates)
                .elasticY(true)
                .centerBar(true)
                .gap(3)
                .x(d3.time.scale.utc()
                    .domain([scale_start, scale_end]));

        hourChart.xAxis().ticks(12);
   
        
    //}


    var pieWidth = $('#type-chart').width()-30;


    //if (dgaDomains.size() < 2)  pieWidth -= 20;
    
	typeChart
			.width(pieWidth)
            .height($('#type-chart').height()-20)
			.radius(Math.min($('#type-chart').height()-20, pieWidth)/2)
			.innerRadius(30)
			.dimension(type)
			.group(types)
			.title(function(d){
                return (Math.round((d.value/totalRecords)*10000)/100)+ "%";
            });

    if (filters.indexOf("isBL") != -1) typeChart.filter("BlackListed");


    var customColorScale = d3.scale.ordinal()
                        .range(colorbrewer.OrRd[6]);

    scoreChart
            .width($('#score-chart').width())
            .height($('#score-chart').height()-20)
            .dimension(score)
            .group(scores)
            .colors(customColorScale)
            .elasticX(!0)
            .gap(4);

    scoreChart.xAxis().ticks(0);

    //if (scores.size() > 9) $("#score-chart").hide();

    categoryChart.width($('#category-chart').width())
                .height($('#category-chart').height()-20)
                .dimension(category)
                .group(categories)
                .colors(d3.scale.category10())
                .elasticX(!0)
                .gap(7);

    categoryChart.xAxis().ticks(0);


    if (dataType != "queries")  {

       

        if (filters.indexOf("isNX") != -1) categoryChart.filter("NXDOMAIN");
        else  { 
            categoryChart.filter("A"); categoryChart.filter("NXDOMAIN");
        }

        //if (categories.size() < 2) $("#category-chart").hide();


    }

    else $('#category-chart').hide();


    customColorScale = d3.scale.ordinal()
                        .range(colorbrewer.Dark2[8]);


    threatChart
            .width($('#score-chart').width())
            .height($('#score-chart').height()-20)
            .dimension(threat)
            .group(threats)
            .colors(customColorScale)
            .elasticX(!0)
            .gap(4)
            .title(function(d){
                return d.key + ": " + Math.round((d.value/totalRecords)*10000)/100 + "%";
            });

    threatChart.xAxis().ticks(0);

    if (threats.size() == 1) $("#threat-chart").hide();

 
    customColorScale = d3.scale.ordinal()
                    .range(colorbrewer.Accent[3]);

    dgaChart
            .width(pieWidth)
            .height($('#type-chart').height()-20)
            .radius(Math.min($('#type-chart').height()-20, pieWidth)/2)
            .innerRadius(30)
            .dimension(dgaDomain)
            .group(dgaDomains)
            .colors(customColorScale);


    if ((filters.indexOf("isDGA") != -1) && (dgaDomains.size() == 2))  dgaChart.filter("true");

    if (dgaDomains.size() < 2) $("#dga-chart").hide();

    if (filters.indexOf("isDGA") != -1) {
        $("#type-chart").hide();
        $("#score-chart").hide();
    }

    if (sourceType =="DNName") {
        $("#type-chart").hide();
        $("#score-chart").hide();
        $("#threat-chart").hide();
        $("#dga-chart").hide();
    }

    /*if (is_controlled) {
        $("#domain-chart").addClass("dark_diagram");
        $("#category-chart").addClass("dark_diagram");
        $("#hour-chart").addClass("dark_diagram");
        $("#type-chart").addClass("dark_diagram");
        $("#score-chart").addClass("dark_diagram");
        $("#threat-chart").addClass("dark_diagram");
        $("#dga-chart").addClass("dark_diagram");

    }
    else { */
        $("#alert-id").show();
        $("#timezone-button").show();
    //}

    //console.log("filters are: " + filters);

    dc.dataCount("#selected-rec")
        .dimension(query)
        .group(all);

    /* Table rendering */

    var tableHeader = "";

    tableHeader = "<tr class='header'><th>Timestamp</th><th>Domain Requested</th><th>Category</th><th>Type</th>";

    if (filters.length == 0 || filters.indexOf("isBL") != -1) 

    {
        tableHeader += "<th>isBlacklisted</th><th>Score</th>";

        if (dataType != "queries") tableHeader += "<th>Resolution</th><th>TTL(sec.)</th>";                                      
        if (dgaDomains.size() == 2) tableHeader +=  "<th>isDGA</th>";

        dc.dataTable(".dc-data-table")
            .width(1700)
            .dimension(date)
            .group(function (d) {
            	   //var format = d3.format("02d");
            	   //return d.timestampInTimeZone.getFullYear() + "/" + format((d.timestampInTimeZone.getMonth() + 1)) + "/" + d.timestampInTimeZone.getDate();
                    //return d.externalID;
                 return "";
        	   })
        	.size(10000) 
            .columns([
                function (d) {
                    //return formatTimestamp(d.timestampInTimeZone); 
                    return moment(d.timestampInTimeZone).format('YYYY-MM-DD HH:mm');
                },  
                function (d) {
                    return "<a class='virustotal-link' href='https://www.virustotal.com/en/domain/" + d.request + "/information/' target='_blank'>" + d.request + "</a>";
                },
                function (d) {
                    return d.cat;
                },    
                function (d) {
                    return d.type;
                },
                function (d) {
                    return d.isBlacklisted;
                },
                function (d) {
                    return d.score;
                },
                
                //function (d){
                //    return d.externalID;
                //},
                function (d) {
                    if (dataType != "queries") {
                        if (ValidateIPaddress(d.resolvingIP))
                            return "<a class='virustotal-link' href='https://www.virustotal.com/en/ip-address/" + d.resolvingIP + "/information/' target='_blank'>" + d.resolvingIP + "</a>";
                        else return d.resolvingIP;
                    }
                    else return "";
                },
                function (d){
                    if (dataType != "queries") return d.TTL;
                    else return "";
                },
                function (d){
                    if (dgaDomains.size() == 2) return d.isDGA;
                    else return "";
                }
            ])
            .sortBy(function (d) {
                return d.timestampInTimeZone;
               // return (d.timestampInTimeZone.getHours() + d.timestampInTimeZone.getMinutes() / 60 + (d.timestampInTimeZone.getSeconds()/60)/60);
            })
            .order(d3.ascending);

    }


    if (filters.indexOf("isDGA") != -1) 

    {
        if (dataType == "replies" && filters.indexOf("isNX") == -1) tableHeader += "<th>Resolution</th><th>TTL(sec.)</th>";                                      
        //tableHeader +=  "<th>isDGA</th>";

        dc.dataTable(".dc-data-table")
            .width(1700)
            .dimension(date)
            .group(function (d) {
                   //var format = d3.format("02d");
                   //return d.timestampInTimeZone.getFullYear() + "/" + format((d.timestampInTimeZone.getMonth() + 1)) + "/" + d.timestampInTimeZone.getDate();
                    //return d.externalID;
                 return "";
               })
            .size(10000) 
            .columns([
                function (d) {
                    //return formatTimestamp(d.timestampInTimeZone);
                    return moment(d.timestampInTimeZone).format('YYYY-MM-DD HH:mm');
                },  
                function (d) {
                    return "<a class='virustotal-link' href='https://www.virustotal.com/en/domain/" + d.request + "/information/' target='_blank'>" + d.request + "</a>";
                },
                function (d) {
                    return d.cat;
                }, 
                function (d) {
                    return d.type;
                },
                
                //function (d){
                //    return d.externalID;
                //},
                function (d) {
                    if (dataType == "replies" && filters.indexOf("isNX") == -1) {
                        if (ValidateIPaddress(d.resolvingIP))
                            return "<a class='virustotal-link' href='https://www.virustotal.com/en/ip-address/" + d.resolvingIP + "/information/' target='_blank'>" + d.resolvingIP + "</a>";
                        else return d.resolvingIP;
                    }
                    else return "";
                },
                function (d){
                    if (dataType == "replies" && filters.indexOf("isNX") == -1) return d.TTL;
                    else return "";
                }
                //,
                //function (d){
                //    return d.isDGA;
                //}
            ])
            .sortBy(function (d) {
                //return d.cat;
                return d.timestampInTimeZone;
                //return (d.timestampInTimeZone.getHours() + d.timestampInTimeZone.getMinutes() / 60 + (d.timestampInTimeZone.getSeconds()/60)/60);
            })
            .order(d3.ascending);

    }

    

    if (sourceType =="DNName")  

    {

        tableHeader = "<tr class='header'><th>Timestamp</th><th>Querying IP addresses</th><th>Domain Requested</th><th>DNS Record Category</th>"+
                  "<th>Domain Type</th><th>isBlacklisted</th>";

        if (dataType != "queries") tableHeader += "<th>Domain Resolution</th><th>TTL(sec.)</th>";                                      

        dc.dataTable(".dc-data-table")
            .width(1700)
            .dimension(date)
            .group(function (d) {
                   //var format = d3.format("02d");
                   //return d.timestampInTimeZone.getFullYear() + "/" + format((d.timestampInTimeZone.getMonth() + 1)) + "/" + d.timestampInTimeZone.getDate();
                    //return d.externalID;
                 return "";
               })
            .size(10000) 
            .columns([
                function (d) {
                    //return formatTimestamp(d.timestampInTimeZone); 
                    return moment(d.timestampInTimeZone).format('YYYY-MM-DD HH:mm');
                },  
                function (d) {
                    return d.clientIP;
                },
                 
                function (d) {
                    return d.request;
                },
                function (d) {
                    return d.cat;
                },  
                function (d) {
                    return d.type;
                },
                function (d) {
                    return d.isBlacklisted;
                },
                
                function (d) {
                    if (dataType != "queries") {
                        if (ValidateIPaddress(d.resolvingIP))
                            return "<a class='virustotal-link' href='https://www.virustotal.com/en/ip-address/" + d.resolvingIP + "/information/' target='_blank'>" + d.resolvingIP + "</a>";
                        else return d.resolvingIP;
                    }
                    else return "";
                },
                function (d){
                    if (dataType != "queries") return d.TTL;
                    else return "";
                }
            ])
            .sortBy(function (d) {
                return d.timestampInTimeZone;
               // return (d.timestampInTimeZone.getHours() + d.timestampInTimeZone.getMinutes() / 60 + (d.timestampInTimeZone.getSeconds()/60)/60);
            })
            .order(d3.ascending);

    }
                                                   

    document.getElementById('dc-data-table-header').innerHTML = tableHeader + "</tr>";
    
    dc.renderAll();

     window.onresize = function() {
       
        threatChart.width($('#score-chart').width())
                .height($('#score-chart').height()-20);
        
        scoreChart
            .width($('#score-chart').width())
            .height($('#score-chart').height()-20);

        categoryChart.width($('#category-chart').width())
                .height($('#category-chart').height()-20);

        domainChart.width($('#domain-chart').width())
                .height($('#domain-chart').height()-20)
                .margins({top: 10, right: 40, bottom: 30, left: 40});

        hourChart
                .width($('#hour-chart').width())
                .height($('#hour-chart').height()-20)
                .margins({top: 10, right: 40, bottom: 30, left: 40})
                .x(d3.time.scale.utc()
                    .domain([scale_start, scale_end]));

         

        dc.redrawAll();

        domainChart.render();

        hourChart.render();
        
    };


}  