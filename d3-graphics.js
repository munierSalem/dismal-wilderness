function d3_scatter(chart_ID,x,y,data_path,tooltip_text,x_label,y_label){
  /*
    Produce a 1-d scatter plot across the width of the page.  Optionally,
    pass a custom tool-tip text generator.

    TODO: 
      - axis limits currently hard-coded to POC chart, FIXME
        - num axis ticks also hard-coded to POC chart, FIXME
      - no support for dates
      - width hard-coded to 700 pixels ... FIXME

    Args:
      chart_ID : required div ID (e.g. "#mychart")
      x : x-variable (e.g. "dinosaurs")
      y : y-variable (e.g. "mammals")
      data_path : full URL to data file (currently only CSV)

    Opt Args:
      tooltip_text (undefined) : function that takes data row and
        returns text/HTML to display within a tooltip.  If none
        supplied, no tooltips are generated.
      x_label (undefined) : label x-axis, if null will use x var name
      y_label (undefined) : label y-axis, if null will use y var name

    Returns:
      undefined
  */
  
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 40, left: 60},
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
      .domain([d3.min(data,d=>+d[x]), d3.max(data,d=>+d[x])])
      .range([ 0, width ])
    Svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_scale).tickSize(-height*1.3).ticks(6))
      .select(".domain").remove();
    

    // Add Y axis
    var y_scale = d3.scaleLinear()
      .domain([d3.min(data,d=>+d[y]), d3.max(data,d=>+d[y])])
      .range([ height, 0])
      .nice()
    Svg.append("g")
      .call(d3.axisLeft(y_scale).tickSize(-width*1.3).ticks(6))
      .select(".domain").remove()

    // Customization
    Svg.selectAll(".tick line").attr("stroke", "#EBEBEB")

    // Add axis labels:
    if(typeof x_label === "undefined") x_label = x;
    if(typeof y_label === "undefined") y_label = y;
    Svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .attr("class","axis-label")
        .text(x_label);
    Svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .attr("class","axis-label")
        .text(y_label);

    // Add dots
    var data_points = Svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x_scale(d[x]); } )
        .attr("cy", function (d) { return y_scale(d[y]); } )
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


function d3_barchart(chart_ID,x,y_vars,data_path,tooltip_text,y_label){
  /*
    Produce a horizontal bar chartacross the width of the page.  Optionally,
    pass a custom tool-tip text generator.  Pass in a *list* of y_vars.  If 
    there's more than one, buttons appear to toggle between y-vars.

    TODO: 
      - should allow to switch to stacked instead of toggle buttons
      - no support for dates
      - width hard-coded to 700 pixels ... FIXME

    Args:
      chart_ID : required div ID (e.g. "#mychart")
      x : x-variable (e.g. "dinosaurs")
      y_vars : y-variables (e.g. ["height,weight"])
      data_path : full URL to data file (currently only CSV)

    Opt Args:
      tooltip_text (undefined) : function that takes data row and
        returns text/HTML to display within a tooltip.  If none
        supplied, no tooltips are generated.
      y_label (undefined) : if present, labels y-axis with this string

    Returns:
      undefined
  */

  // infer y_label from y_vars if only one y_var given
  if( !Array.isArray(y_vars) && typeof y_label === "undefined"){
    y_label = y_vars;
  } // end y_vars if

  // set the dimensions and margins of the graph
  var margin = {
    top:    10, 
    right:  10, 
    bottom: 40, 
    left:   (typeof y_label !== "undefined") ? 60 : 40
  },
      width = 700 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  chart = d3.select(chart_ID)
    .classed("d3-barchart d3-chart",true);

  // append the svg object to the body of the page
  var svg = chart
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // y axis-label
  if(typeof y_label !== "undefined"){
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left+20)
          .attr("x", -margin.top)
          .attr("class","axis-label")
          .text(y_label);
  } // end x_label if

  if(typeof tooltip_text !== "undefined"){
      // Define the div for the tooltip
      var tooltip = d3.select("body").append("div") 
          .attr("class", "d3-tooltip")
          .style("opacity", 0);
  }// end tooltip if

  // Initialize the X axis
  var x_scale = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")");

  // Initialize the Y axis
  var y_scale = d3.scaleLinear()
    .range([ height, 0]);
  var y_axis = svg.append("g");

  // A function that create / update the plot for a given variable:
  function update(y,duration=1000) {

    d3.csv(data_path,function(data){

      // Select top 10 items by selected metric
      data = data.sort((d1,d2)=>d3.descending(+d1[y], +d2[y]));
      data = data.slice(0,10); 

        // Update the X axis
        x_scale.domain(data.map(d=>d[x]))
        xAxis
          .call(d3.axisBottom(x_scale))
          .select("domain").remove();

        // Update the Y axis
        y_scale.domain([0, d3.max(data,d=>+d[y])]);
        y_axis.transition().duration(duration)
          .call(d3.axisLeft(y_scale).tickSize(-width*1.3).ticks(4))
          .select("domain").remove();

        // Create the bars
        var bars = svg.selectAll("rect")
          .data(data);

        // append new bars from updated dataset
        bars
          .enter()
          .append("rect")  // Add a new rect for each new elements
          .merge(bars)     // get the already existing elements as well
          .transition()    // and apply changes to all of them
          .duration(duration)
            .attr("x", d=>x_scale(d[x]))
            .attr("y", d=>y_scale(d[y]))
            .attr("width", x_scale.bandwidth())
            .attr("height", d=>height - y_scale(d[y]))
            .attr("class", "bar");

        if(typeof tooltip_text !== "undefined"){
            // define mouseover behavior for tooltips
            bars.on("mouseover", function(d) {
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


        // remove bars no longer in refeshed plot
        bars.exit().remove();

      }); // end d3.csv
  } // end update function

  // if we're given multiple y_vars, set up toggle
  if(Array.isArray(y_vars)){

    var controls = chart.insert('div',":first-child").classed('controls',true);
    var buttons = controls
      .selectAll('a')
      .data(y_vars)
      .enter()
      .append('a')
      .classed("button",true)
      .classed("selected",(d,i)=>i == 0)
      .attr("value",d=>d)
      .html(d=>d);
    controls.append("br");

    // Initialize the plot with the first dataset
    update(controls.select('.selected').attr('value'),duration=0);
    update(controls.select('.selected').attr('value'),duration=0); // tooltip BS

    // Set up click functionality for controls
    buttons.on("click",function(){
      var curr_button = d3.select(this);
      if(!curr_button.classed("selected")){
        buttons.classed('selected',false);
          curr_button.classed('selected',true);
          update(curr_button.attr("value"));
      } // selected if
    }); // end button click function

  } else { // otherwise just one y_var, and no need for toggles

    update(y_vars,duration=0);
    update(y_vars,duration=0);  // tooltip BS

  } // end isArray if/else

} // end d3_scatter function


function d3_linechart(chart_ID,x,y_vars,data_path,tooltip_text,x_label,y_label){

  // infer y_label from y_vars if only one y_var given
  if( !Array.isArray(y_vars) && typeof y_label === "undefined"){
    y_label = y_vars;
  } // end y_vars if
  if(typeof x_label === "undefined"){
    x_label = x;
  } // end x_label if

  // set the dimensions and margins of the graph
  var margin = {
    top:    10, 
    right:  10, 
    bottom: 40, 
    left:   (typeof y_label !== "undefined") ? 60 : 40
  },
      width = 700 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  chart = d3.select(chart_ID)
    .classed("d3-linechart d3-chart",true);

  // append the svg object to the body of the page
  var svg = chart
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // y axis-label
  if(typeof y_label !== "undefined"){
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .attr("class","axis-label")
        .text(y_label);
  } // end x_label if
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 20)
    .attr("class","axis-label")
    .text(x_label);

  if(typeof tooltip_text !== "undefined"){
      // Define the div for the tooltip
      var tooltip = d3.select("body").append("div") 
          .attr("class", "d3-tooltip")
          .style("opacity", 0);
  }// end tooltip if

  // Initialize the X axis
  var x_scale = d3.scaleLinear()
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")");

  // Initialize the Y axis
  var y_scale = d3.scaleLinear()
    .range([ height, 0]);
  var y_axis = svg.append("g");

  d3.csv(data_path,function(data){

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = y_vars.map( function(grpName) {
      return {
        name: grpName,
        values: data.map(function(d) {
          return {x: +d[x], y: +d[grpName], name: grpName};
        })
      };
    });

    // Update the X axis
    var x_min = d3.min(data,d=>+d[x]), x_max = d3.max(data,d=>+d[x]);
    x_scale.domain([x_min,x_max + (x_max-x_min)*0.1])
    xAxis
      .call(d3.axisBottom(x_scale).tickSize(-height*1.3).ticks(4).tickFormat(d3.format("d")))
      .select("domain").remove();

    // Update the Y axis
    y_scale.domain([
      d3.min(y_vars.map(y=>d3.min(data,d=>d[y]))),
      d3.max(y_vars.map(y=>d3.max(data,d=>d[y])))
    ]); // end y_scale.domain
    y_axis
      .call(d3.axisLeft(y_scale).tickSize(-width*1.3).ticks(4).tickFormat(d3.format(".0%")))
      .select("domain").remove();

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(y_vars).range(['#cc2c00','#00A0CC','#9CD10C','#9860E7','#F8AD07']);

    // Add the lines
    var line = d3.line().x(d=>x_scale(d.x)).y(d=>y_scale(d.y))
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .classed("line",true)
        .attr("d", d=>line(d.values))
        .attr("stroke",d=>myColor(d.name))
        .style("fill", "none");

    // Add the markets
    var point_collections = svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", d=>myColor(d.name))
      // Second we need to enter in the 'values' part of this group
      
    var points = point_collections.selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .classed('marker',true)
        .attr("cx",d=>x_scale(d.x))
        .attr("cy",d=>y_scale(d.y));


    // add labels after ea. line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .classed('line-label',true)
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { 
            return "translate(" + x_scale(d.value.x) + "," + y_scale(d.value.y) + ")"; })
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) });


    if(typeof tooltip_text !== "undefined"){
        // define mouseover behavior for tooltips
        points.on("mouseover", function(d) {
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

} // end d3_linechart function