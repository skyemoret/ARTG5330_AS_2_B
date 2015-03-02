/*Assignment 2-B: Skye Moret */

//canvas setup
var margin = {t:50,r:50,b:50,l:50};
var width = $('.plot').width() - margin.r - margin.l,
    height = $('.plot').height() - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')      //"svg = canvas on which visuals are rendered"
    .attr('width', width + margin.r + margin.l)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('class','plot')
    .attr('transform','translate('+margin.l+','+margin.t+')');   //translate(50,50)

//axes scales setup
var scaleX = d3.scale.log().range([0,width]),
    scaleY = d3.scale.log().range([height,0]),
    scaleR = d3.scale.sqrt().range([5,40]) ;      //scale for circle radius

//axes generator function
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickValues([1045,4125,12746,40000])
    .tickSize(-height,0)
    .scale(scaleX);
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY); //one-to-one ratio of scale specified above

/* Acquire and parse data */

console.log("Start loading data");
//import data from csv file
d3.csv('data/world_bank_2010_gdp_co2.csv', parse, dataLoaded);

function dataLoaded(err,rows){  //callback function
    console.log("Data loaded");
    console.log(rows);

    var rangeX = d3.extent(rows, function(d){
        return d.gdpPerCap;
    })
    var rangeY = d3.extent(rows, function(d){
        return d.co2PerCap;
    })
    var rangeR = d3.extent(rows, function(d) {
        return d.co2Emiss;
    })
    scaleX.domain(rangeX);  //mapping data domain to screen range
    scaleY.domain(rangeY);
    scaleR.domain(rangeR);

    //draw axes here (or could draw them in draw function)
    canvas.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0,' +height+')')
        .call(axisX);
    canvas.append('g')
        .attr('class','axis y')
        .call(axisY);

    draw(rows);
}

function draw(rows){
    console.log("start drawing...");

    //generating DOM elements for data elements
    //--> .selectAll() + .data() + .enter()
    var nodes = canvas.selectAll('.node')
        .data(rows)     //match data with DOM elements
        .enter()
        .append('g')
        .attr('class','node')
        .filter(function(d){    //accessor function
            return d.gdpPerCap && d.co2PerCap;
        })
        //moving g element to (x,y) locations
        .attr('transform', function(d){
            return 'translate(' +scaleX(d.gdpPerCap)+ ',' +scaleY(d.co2PerCap)+ ')';
        })
        .on('click', function(d){   //user interaction
            alert(d.country);
        })

        nodes.append('circle')
            .attr('r',function(d){
                return scaleR(d.co2Emiss);
            })
        nodes.append('text')
            .text(function(d){
                return d.country;
            })
            .attr('text-anchor','middle')   //text anchored to middle of node
            .attr('dy', 14);    //displace text by 14px
}

//parsing data
function parse(row){
    return {
        gdpPerCap: row["GDP per capita, PPP (constant 2011 international $)"]=='..'?undefined:+row["GDP per capita, PPP (constant 2011 international $)"],
        co2Emiss: row['CO2 emissions (kt)']=='..'?undefined:+row['CO2 emissions (kt)'],
        co2PerCap: row['CO2 emissions (metric tons per capita)']=='..'?undefined:+row['CO2 emissions (metric tons per capita)'],
        country: row['Country Name']
    };
}