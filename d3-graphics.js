function d3_scatter(chart_ID,x,y,data_path,tooltip_text){

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 40, left: 50},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var Svg = d3.select(chart_ID)
    .attr("class","d3-scatter")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  if(typeof tooltip_text !== "undefined"){

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div") 
        .attr("class", "d3-tooltip")        
        .style("opacity", 0);

  }// end tooltip if


  //Read the data
  d3.csv(data_path, function(data) {

    // Add X axis
    var x_scale = d3.scaleLinear()
      .domain([-500, 14500])
      .range([ 0, width ])
    Svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_scale).tickSize(-height*1.3).ticks(8))
      .select(".domain").remove();

    // Add Y axis
    var y_scale = d3.scaleLinear()
      .domain([45, 105])
      .range([ height, 0])
      .nice()
    Svg.append("g")
      .call(d3.axisLeft(y_scale).tickSize(-width*1.3).ticks(7))
      .select(".domain").remove()

    // Customization
    Svg.selectAll(".tick line").attr("stroke", "#EBEBEB")

    // Add X axis label:
    Svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .attr("class","axis-label")
        .text("Altitude (feet)");

    // Y axis label:
    Svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .attr("class","axis-label")
        .text("Blood Oxygen Saturation")

    // Add dots
    var data_points = Svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x_scale(d['Altitude']); } )
        .attr("cy", function (d) { return y_scale(d['O2']); } )
        .attr("r", 8)
        .attr("class","data-point");

    if(typeof tooltip_text !== "undefined"){

        // define mouseover behavior for tooltips
        data_points.on("mouseover", function(d) {		
              tooltip.transition()		
                  .duration(200)		
                  .style("opacity", .9);		
              tooltip.html(tooltip_text(d))	
                  .style("left", (d3.event.pageX + 20) + "px")		
                  .style("top", (d3.event.pageY - 28) + "px");	
              }) // end mouseover
        .on("mouseout", function(d) {		
              tooltip.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
        });// end mouseout

    } // end tooltip if

  }); // end d3.csv
  
} // end d3_scatter