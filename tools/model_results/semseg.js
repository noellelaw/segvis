

function add_svg(wrapper)
{
    var svg = d3.select(wrapper).select("svg");
  
    if (svg.empty())
      svg = d3.select(wrapper).append("svg");
    else
      svg.selectAll("*").remove();
  
  return svg.attr("width", 1200)
    .attr("line-height", 200)
    .attr("height", 1320)
    .attr("side-margin", 60)
    .attr("bottom-margin", 20)
    .attr("center-adjust", 20);
}

function set_update(div_id, _)
{

  comm.call({n: 5})
  setInterval(function(){ comm.call({n: 5}) }, 2000);

}

function draw_full_circleplot(wrapper, data) {

  var svg = add_svg(wrapper);

  // tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .style('color', '#d3d3d3')
    .style('font-size', '10px')
    .style('visibility', 'hidden')
    .style('padding', '.2rem .4rem')
    .style('position', 'absolute');

  // FLAT ------------------------------------------------------------------------------------------//
  // Construct scales and axes.
  var xScale_flat = d3.scalePoint()
      .domain(d3.map(data['data']['road']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
      .padding(0.5);
  let yScale_flat = d3.scaleLinear()
    .domain([0, 1.0])
    .range([svg.attr("line-height") - svg.attr("bottom-margin"), 10]);

  var xAxis_flat = d3.axisBottom(xScale_flat);
  let yAxis_flat = d3.axisLeft(yScale_flat)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_flat_0 = d3.line()
    .x(function(d){ return xScale_flat(d.name_0)})
    .y(function (d) { return yScale_flat(d.preds_0) });

  var line_flat_1 = d3.line()
    .x(function(d){ return xScale_flat(d.name_1)})
    .y(function (d) { return yScale_flat(d.preds_1) });
    
  // Create Subplot -------------------------------------------------------------------
  svg.append("g")
    .attr("transform",
          `translate(0, ${svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_flat);

  svg.append("g")
      .attr("transform", `translate(${svg.attr("side-margin")},0)`)
      .attr("class", "yAxis")
    .call(yAxis_flat);

      
	// Add lines -------------------------------------------------------------------
  svg.append("path")
    .attr("d", line_flat_0(data['data']['road']['data']))
    .attr("id", "myRoad_0")
    .attr("stroke", data['data']['road']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_flat_0(data['data']['sidewalk']['data']))
    .attr("id", "mySidewalk_0")
    .attr("stroke", data['data']['sidewalk']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.append("path")
    .attr("d", line_flat_1(data['data']['road']['data']))
    .attr("id", "myRoad_1")
    .attr("stroke", data['data']['road']['color'])
    .attr("stroke-width", "2")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_flat_1(data['data']['sidewalk']['data']))
    .attr("id", "mySidewalk_1")
    .attr("stroke", data['data']['sidewalk']['color'])
    .attr("stroke-width", "2")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  // Add circles -----------------------------------------------------------------
  svg.selectAll('circle0_0')
    .data(data['data']['road']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle0_0')
      .attr('cy', d => yScale_flat(d['preds_0']) )
      .attr('cx', d => xScale_flat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['road']['color']);

  svg.selectAll('circle1_0')
    .data(data['data']['sidewalk']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle1_0')
      .attr('cy', d => yScale_flat(d['preds_0']) )
      .attr('cx', d => xScale_flat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['sidewalk']['color']);
      
  svg.selectAll('circle0_1')
    .data(data['data']['road']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle0_1')
      .attr('cy', d => yScale_flat(d['preds_1']) )
      .attr('cx', d => xScale_flat(d['name_1']))
      .attr('r', 3)
      .attr('fill',  data['data']['road']['color']);

  svg.selectAll('circle1_1')
    .data(data['data']['sidewalk']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle1_1')
      .attr('cy', d => yScale_flat(d['preds_1']) )
      .attr('cx', d => xScale_flat(d['name_1']))
    .attr('r', 3)
    .attr('fill', data['data']['sidewalk']['color']);

  // Add tooltips -----------------------------------------------------------------

  d3.selectAll("#myRoad_0")
    .data(line_flat_0(data['data']['road']['data']))
    .on('mouseover', function (event) {

      d3.select(this)

        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle0_0")
        .raise()
        
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  
  d3.selectAll("#mySidewalk_0")
    .data(line_flat_0(data['data']['sidewalk']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle1_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle0_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRoad_0').raise().attr('stroke-width', '3');
      d3.select('.circle0_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'road\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRoad_0').raise().attr('stroke-width', '2');
      d3.select('.circle0_0').raise()
      tooltip.style("visibility", "hidden");
    });


  d3.selectAll(".circle1_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySidewalk_0').raise().attr('stroke-width', '3');
      d3.select('.circle1_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} Predicted class: \'sidewalk\'  
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)}      
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySidewalk_0').raise().attr('stroke-width', '2');
      d3.select('.circle1_0').raise()
      tooltip.style("visibility", "hidden");
    });

  
  d3.selectAll("#myRoad_1")
    .data(line_flat_0(data['data']['road']['data']))
    .on('mouseover', function (event) {

      d3.select(this)

        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle0_1")
        .raise()
        
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  
  d3.selectAll("#mySidewalk_1")
    .data(line_flat_0(data['data']['sidewalk']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle1_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle0_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRoad_1').raise().attr('stroke-width', '3');
      d3.select('.circle0_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('width', '125px')
        .text(`Model: ${d.model_1}
              \tPredicted class: \'road\'
              Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
              Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRoad_1').raise().attr('stroke-width', '2');
      d3.select('.circle0_1').raise()
      tooltip.style("visibility", "hidden");
    });


  d3.selectAll(".circle1_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySidewalk_1').raise().attr('stroke-width', '3');
      d3.select('.circle1_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1}
        Predicted class: \'sidewalk\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)}     
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySidewalk_1').raise().attr('stroke-width', '2');
      d3.select('.circle1_1').raise()
      tooltip.style("visibility", "hidden");
    });

  // Add a legend -------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['road']['color'])
      .attr('y', yScale_flat(0.81))
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'road\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['road']['miou_0']} mIoU, ${data['data']['road']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['sidewalk']['color'])
      .attr('y', yScale_flat(0.72))
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_flat(0.65))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'sidewalk\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_flat(0.65))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['road']['miou_0']} mIoU, ${data['data']['road']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1000)
      .attr("y", yScale_flat(0.91))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`FLAT`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 900)
      .attr("x2", 1130)
      .attr("y1", yScale_flat(0.9))
      .attr("y2", yScale_flat(0.9))
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 1052)
      .attr("x2", 1062)
      .attr("y1", yScale_flat(0.85))
      .attr("y2", yScale_flat(0.85))
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 964)
      .attr("x2", 972)
      .attr("y1", yScale_flat(0.85))
      .attr("y2", yScale_flat(0.85))
      .style("stroke", 'black'));

 
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_flat(0.97))
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 15 * 3 + 13));


      
   //d3.select("svg")
   //   .append("image")
   //   .attr("xlink:href", await(FileAttachment("/content/000000_10.png")).url())
   //   .attr("width", 400)
   //   .attr("height", 120)
   //  .attr('x', 400)
   //  .attr('y', 400)
   //  .attr("crossorigin", "anonymous");
}
// ----------------- FULL GRAPH ----------------------------------------------------------------------------------------------------------------//
function draw_full_linegraph(wrapper, data) {
  var svg = add_svg(wrapper);

  // tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .style('color', '#d3d3d3')
    .style('font-size', '10px')
    .style('visibility', 'hidden')
    .style('padding', '.2rem .4rem')
    .style('position', 'absolute');

  // FLAT --------------------------------------------------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_flat = d3.scalePoint()
      .domain(d3.map(data['data']['road']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
      .padding(0.5);
  let yScale_flat = d3.scaleLinear()
    .domain([0, 1.0])
    .range([svg.attr("line-height") - svg.attr("bottom-margin"), 10]);

  var xAxis_flat = d3.axisBottom(xScale_flat);
  let yAxis_flat = d3.axisLeft(yScale_flat)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_flat_0 = d3.line()
    .x(function(d){ return xScale_flat(d.name_0)})
    .y(function (d) { return yScale_flat(d.preds_0) });

  var line_flat_1 = d3.line()
    .x(function(d){ return xScale_flat(d.name_1)})
    .y(function (d) { return yScale_flat(d.preds_1) });
    
  // Create Subplot
  svg.append("g")
    .attr("transform",
          `translate(0, ${svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_flat);

  svg.append("g")
      .attr("transform", `translate(${svg.attr("side-margin")},0)`)
      .attr("class", "yAxis")
      .call(yAxis_flat);
		// Add lines -------------------------------------------------------------------
  svg.append("path")
    .attr("d", line_flat_0(data['data']['road']['data']))
    .attr("id", "myRoad_0")
    .attr("stroke", data['data']['road']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_flat_0(data['data']['sidewalk']['data']))
    .attr("id", "mySidewalk_0")
    .attr("stroke", data['data']['sidewalk']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.append("path")
    .attr("d", line_flat_1(data['data']['road']['data']))
    .attr("id", "myRoad_1")
    .attr("stroke", data['data']['road']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_flat_1(data['data']['sidewalk']['data']))
    .attr("id", "mySidewalk_1")
    .attr("stroke", data['data']['sidewalk']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  // Add circles -----------------------------------------------------------------
  svg.selectAll('circle0_0')
    .data(data['data']['road']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle0_0')
      .attr('cy', d => yScale_flat(d['preds_0']) )
      .attr('cx', d => xScale_flat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['road']['color']);

  svg.selectAll('circle1_0')
    .data(data['data']['sidewalk']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle1_0')
      .attr('cy', d => yScale_flat(d['preds_0']) )
      .attr('cx', d => xScale_flat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['sidewalk']['color']);
      
  svg.selectAll('circle0_1')
    .data(data['data']['road']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle0_1')
      .attr('cy', d => yScale_flat(d['preds_1']) )
      .attr('cx', d => xScale_flat(d['name_1']))
      .attr('r', 3)
      .attr('fill',  data['data']['road']['color']);

  svg.selectAll('circle1_1')
    .data(data['data']['sidewalk']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle1_1')
      .attr('cy', d => yScale_flat(d['preds_1']) )
      .attr('cx', d => xScale_flat(d['name_1']))
    .attr('r', 3)
    .attr('fill', data['data']['sidewalk']['color']);

  // Add tooltips -----------------------------------------------------------------

  d3.selectAll("#myRoad_0")
    .data(line_flat_0(data['data']['road']['data']))
    .on('mouseover', function (event) {

      d3.select(this)

        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle0_0")
        .raise()
        
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  
  d3.selectAll("#mySidewalk_0")
    .data(line_flat_0(data['data']['sidewalk']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle1_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle0_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRoad_0').raise().attr('stroke-width', '3');
      d3.select('.circle0_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'road\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRoad_0').raise().attr('stroke-width', '2');
      d3.select('.circle0_0').raise()
      tooltip.style("visibility", "hidden");
    });


  d3.selectAll(".circle1_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySidewalk_0').raise().attr('stroke-width', '3');
      d3.select('.circle1_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} Predicted class: \'sidewalk\'  
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)}     
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySidewalk_0').raise().attr('stroke-width', '2');
      d3.select('.circle1_0').raise()
      tooltip.style("visibility", "hidden");
    });

  
  d3.selectAll("#myRoad_1")
    .data(line_flat_0(data['data']['road']['data']))
    .on('mouseover', function (event) {

      d3.select(this)

        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle0_1")
        .raise()
        
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
  
  d3.selectAll("#mySidewalk_1")
    .data(line_flat_0(data['data']['sidewalk']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle1_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle0_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRoad_1').raise().attr('stroke-width', '4');
      d3.select('.circle0_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'road\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRoad_1').raise().attr('stroke-width', '3');
      d3.select('.circle0_1').raise()
      tooltip.style("visibility", "hidden");
    });


  d3.selectAll(".circle1_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySidewalk_1').raise().attr('stroke-width', '4');
      d3.select('.circle1_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} Predicted class: \'sidewalk\'  
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)}      
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySidewalk_1').raise().attr('stroke-width', '3');
      d3.select('.circle1_1').raise()
      tooltip.style("visibility", "hidden");
    });

  // Add a legend -------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['road']['color'])
      .attr('y', yScale_flat(0.81))
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'road\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['road']['miou_0']} mIoU, ${data['data']['road']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['sidewalk']['color'])
      .attr('y', yScale_flat(0.72))
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_flat(0.65))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'sidewalk\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_flat(0.65))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['road']['miou_0']} mIoU, ${data['data']['road']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1000)
      .attr("y", yScale_flat(0.91))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`FLAT`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 900)
      .attr("x2", 1130)
      .attr("y1", yScale_flat(0.9))
      .attr("y2", yScale_flat(0.9))
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 1052)
      .attr("x2", 1062)
      .attr("y1", yScale_flat(0.85))
      .attr("y2", yScale_flat(0.85))
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 964)
      .attr("x2", 972)
      .attr("y1", yScale_flat(0.85))
      .attr("y2", yScale_flat(0.85))
      .style("stroke", 'black'));

 
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_flat(0.97))
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 15*3+13));

  // Construction -------------------------------------------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_const = d3.scalePoint()
      .domain(d3.map(data['data']['building']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_const = d3.scaleLinear()
    .domain([0, 1.0])
    .range([2 * svg.attr("line-height") - 2 * svg.attr("bottom-margin"),
            svg.attr("line-height") - svg.attr("bottom-margin") + 10]);

  var xAxis_const = d3.axisBottom(xScale_const);
  let yAxis_const = d3.axisLeft(yScale_const)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_const_0 = d3.line()
    .x(function(d){ return xScale_const(d.name_0)})
    .y(function (d) { return yScale_const(d.preds_0) });

  var line_const_1 = d3.line()
    .x(function(d){ return xScale_const(d.name_1)})
    .y(function (d) { return yScale_const(d.preds_1) });
    
  // Create Subplot
  svg.append("g")
    .attr("transform",
          `translate(0, ${2*svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_const);

  svg.append("g")
      .attr("transform", `translate(${svg.attr("side-margin")},${svg.attr("bottom-margin")})`)
      .attr("class", "yAxis")
      .call(yAxis_const);
	
  svg.append("path")
    .attr("d", line_const_0(data['data']['building']['data']))
    .attr("id", "myBuilding_0")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['building']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const_0(data['data']['wall']['data']))
    .attr("id", "myWall_0")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['wall']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const_0(data['data']['fence']['data']))
    .attr("id", "myFence_0")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['fence']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const_1(data['data']['building']['data']))
    .attr("id", "myBuilding_1")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['building']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const_1(data['data']['wall']['data']))
    .attr("id", "myWall_1")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['wall']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const_1(data['data']['fence']['data']))
    .attr("id", "myFence_1")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['fence']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  svg.selectAll('circle2_0')
    .data(data['data']['building']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle2_0')
      .attr('cy', d => yScale_const(d['preds_0']) + 20)
      .attr('cx', d => xScale_const(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['building']['color']);

  svg.selectAll('circle3_0')
    .data(data['data']['wall']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle3_0')
      .attr('cy', d => yScale_const(d['preds_0']) + 20 )
      .attr('cx', d => xScale_const(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['wall']['color']);

  svg.selectAll('circle4_0')
    .data(data['data']['fence']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle4_0')
      .attr('cy', d => yScale_const(d['preds_0']) + 20 )
      .attr('cx', d => xScale_const(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['fence']['color']);

  svg.selectAll('circle2_1')
    .data(data['data']['building']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle2_1')
      .attr('cy', d => yScale_const(d['preds_1']) + 20)
      .attr('cx', d => xScale_const(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['building']['color']);

  svg.selectAll('circle3_1')
    .data(data['data']['wall']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle3_1')
      .attr('cy', d => yScale_const(d['preds_1']) + 20 )
      .attr('cx', d => xScale_const(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['wall']['color']);

  svg.selectAll('circle4_1')
    .data(data['data']['fence']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle4_1')
      .attr('cy', d => yScale_const(d['preds_1']) + 20 )
      .attr('cx', d => xScale_const(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['fence']['color']);

  d3.selectAll("#myBuilding_0")
    .data(line_const_0(data['data']['building']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle2_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myWall_0")
    .data(line_flat_0(data['data']['wall']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle3_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myFence_0")
    .data(line_const_0(data['data']['fence']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle4_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle2_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBuilding_0').raise().attr('stroke-width', '3');
      d3.select('.circle2_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'building\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'   `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBuilding_0').raise().attr('stroke-width', '2');
      d3.select('.circle2_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle3_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myWall_0').raise().attr('stroke-width', '3');
      d3.select('.circle3_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'wall\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\' `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myWall_0').raise().attr('stroke-width', '2');
      d3.select('.circle3_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle4_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myFence_0').raise().attr('stroke-width', '3');
      d3.select('.circle4_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'fence\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'   `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myFence_0').raise().attr('stroke-width', '2');
      d3.select('.circle4_0').raise()
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll("#myBuilding_1")
    .data(line_const_1(data['data']['building']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle2_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myWall_1")
    .data(line_const_1(data['data']['wall']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle3_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myFence_1")
    .data(line_const_1(data['data']['fence']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle4_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle2_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBuilding_1').raise().attr('stroke-width', '4');
      d3.select('.circle2_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'building\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'   `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBuilding_1').raise().attr('stroke-width', '3');
      d3.select('.circle2_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle3_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myWall_1').raise().attr('stroke-width', '4');
      d3.select('.circle3_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'wall\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\' `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myWall_1').raise().attr('stroke-width', '3');
      d3.select('.circle3_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle4_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myFence_1').raise().attr('stroke-width', '4');
      d3.select('.circle4_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'fence\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'   `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myFence_1').raise().attr('stroke-width', '3');
      d3.select('.circle4_1').raise()
      tooltip.style("visibility", "hidden");
    });



  // Add a legend -------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['building']['color'])
      .attr('y', yScale_const(0.81)+ 20)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_const(0.74)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'building\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_const(0.74)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['building']['miou_0']} mIoU, 
            ${data['data']['building']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['wall']['color'])
      .attr('y', yScale_const(0.72)+ 20)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_const(0.65)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'wall\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_const(0.65)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['wall']['miou_0']} mIoU, ${data['data']['wall']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['fence']['color'])
      .attr('y', yScale_const(0.63)+ 20)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_const(0.56)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'fence\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_const(0.56)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['fence']['miou_0']} mIoU, ${data['data']['fence']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_const(0.91)+20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`CONSTRUCTION`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_const(0.83)+20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_const(0.83)+20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_const(0.83)+20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 900)
      .attr("x2", 1130)
      .attr("y1", yScale_const(0.9)+20)
      .attr("y2", yScale_const(0.9)+20)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 1052)
      .attr("x2", 1062)
      .attr("y1", yScale_const(0.85)+20)
      .attr("y2", yScale_const(0.85)+20)
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 964)
      .attr("x2", 972)
      .attr("y1", yScale_const(0.85)+20)
      .attr("y2", yScale_const(0.85)+20)
      .style("stroke", 'black'));

 
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_const(0.97)+20)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 15*4+13));
      
      

  // Objects ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_obj = d3.scalePoint()
      .domain(d3.map(data['data']['pole']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_obj = d3.scaleLinear()
    .domain([0, 1.0])
    .range([3*svg.attr("line-height") - 3*svg.attr("bottom-margin"), 2*svg.attr("line-height") - 2*svg.attr("bottom-margin")+10]);

  var xAxis_obj = d3.axisBottom(xScale_obj);
  let yAxis_obj = d3.axisLeft(yScale_obj)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_obj_0 = d3.line()
    .x(function(d){ return xScale_obj(d.name_0)})
    .y(function (d) { return yScale_obj(d.preds_0) });

  var line_obj_1 = d3.line()
    .x(function(d){ return xScale_obj(d.name_1)})
    .y(function (d) { return yScale_obj(d.preds_1) });
    
  // Create Subplot
  svg.append("g")
    .attr("transform",
          `translate(0, ${3*svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_obj);

  svg.append("g")
      .attr("transform", `translate(${svg.attr("side-margin")},${2*svg.attr("bottom-margin")})`)
      .attr("class", "yAxis")
      .call(yAxis_obj);
	
  svg.append("path")
    .attr("d", line_obj_0(data['data']['pole']['data']))
    .attr("id", "myPole_0")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['pole']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_obj_0(data['data']['traffic sign']['data']))
    .attr("id", "myTrafficSign_0")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['traffic sign']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_obj_0(data['data']['traffic light']['data']))
    .attr("id", "myTrafficLight_0")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['traffic light']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle5_0')
    .data(data['data']['pole']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle5_0')
      .attr('cy', d => yScale_obj(d['preds_0']) + 40)
      .attr('cx', d => xScale_obj(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['pole']['color']);

  svg.selectAll('circle6_0')
    .data(data['data']['traffic sign']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle6_0')
      .attr('cy', d => yScale_obj(d['preds_0']) + 40)
      .attr('cx', d => xScale_obj(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['traffic sign']['color']);

  svg.selectAll('circle7_0')
    .data(data['data']['traffic light']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle7_0')
      .attr('cy', d => yScale_obj(d['preds_0']) + 40)
      .attr('cx', d => xScale_obj(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['traffic light']['color']);
	
  svg.append("path")
    .attr("d", line_obj_1(data['data']['pole']['data']))
    .attr("id", "myPole_1")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['pole']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_obj_1(data['data']['traffic sign']['data']))
    .attr("id", "myTrafficSign_1")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['traffic sign']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_obj_1(data['data']['traffic light']['data']))
    .attr("id", "myTrafficLight_1")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['traffic light']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  svg.selectAll('circle5_1')
    .data(data['data']['pole']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle5_1')
      .attr('cy', d => yScale_obj(d['preds_1']) + 40)
      .attr('cx', d => xScale_obj(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['pole']['color']);

  svg.selectAll('circle6_1')
    .data(data['data']['traffic sign']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle6_1')
      .attr('cy', d => yScale_obj(d['preds_1']) + 40)
      .attr('cx', d => xScale_obj(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['traffic sign']['color']);

  svg.selectAll('circle7_1')
    .data(data['data']['traffic light']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle7_1')
      .attr('cy', d => yScale_obj(d['preds_1']) + 40)
      .attr('cx', d => xScale_obj(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['traffic light']['color']);

  d3.selectAll("#myPole_0")
    .data(line_obj_0(data['data']['pole']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle5_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrafficSign_0")
    .data(line_obj_0(data['data']['traffic sign']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle6_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrafficLight_0")
    .data(line_obj_0(data['data']['traffic light']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle7_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle5_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myPole_0').raise().attr('stroke-width', '3');
      d3.select('.circle5_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'pole\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myPole_0').raise().attr('stroke-width', '2');
      d3.select('.circle5_0').raise()
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll(".circle6_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrafficSign_0').raise().attr('stroke-width', '3');
      d3.select('.circle6_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'traffic sign\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrafficSign_0').raise().attr('stroke-width', '2');
      d3.select('.circle6_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle7_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrafficLight_0').raise().attr('stroke-width', '3');
      d3.select('.circle7_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} \tPredicted class: \'traffic light\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrafficLight_0').raise().attr('stroke-width', '2');
      d3.select('.circle7_0').raise()
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll("#myPole_1")
    .data(line_obj_1(data['data']['pole']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle5_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrafficSign_1")
    .data(line_obj_1(data['data']['traffic sign']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle6_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrafficLight_1")
    .data(line_obj_1(data['data']['traffic light']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle7_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle5_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myPole_1').raise().attr('stroke-width', '4');
      d3.select('.circle5_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'pole\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myPole_1').raise().attr('stroke-width', '4');
      d3.select('.circle5_1').raise()
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll(".circle6_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrafficSign_1').raise().attr('stroke-width', '4');
      d3.select('.circle6_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'traffic sign\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrafficSign_1').raise().attr('stroke-width', '3');
      d3.select('.circle6_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle7_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrafficLight_1').raise().attr('stroke-width', '4');
      d3.select('.circle7_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} \tPredicted class: \'traffic light\' 
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrafficLight_1').raise().attr('stroke-width', '3');
      d3.select('.circle7_1').raise()
      tooltip.style("visibility", "hidden");
    });
    

  // Legend ----------------------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['pole']['color'])
      .attr('y', yScale_obj(0.81)+ 20*2)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_obj(0.74)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'pole\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_obj(0.74)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['pole']['miou_0']} mIoU, ${data['data']['pole']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['traffic sign']['color'])
      .attr('y', yScale_obj(0.72)+ 20*2)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_obj(0.65)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`\'traffic sign\'`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_obj(0.65)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['traffic sign']['miou_0']} mIoU, ${data['data']['traffic sign']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['traffic light']['color'])
      .attr('y', yScale_obj(0.63)+ 20*2)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_obj(0.56)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`\'traffic light\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_obj(0.56)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['traffic light']['miou_0']} mIoU, ${data['data']['traffic light']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 992)
      .attr("y", yScale_obj(0.91)+40)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`OBJECT`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_obj(0.83)+40)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_obj(0.83)+40)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_obj(0.83)+40)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 900)
      .attr("x2", 1130)
      .attr("y1", yScale_obj(0.9)+40)
      .attr("y2", yScale_obj(0.9)+40)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 1052)
      .attr("x2", 1062)
      .attr("y1", yScale_obj(0.85)+40)
      .attr("y2", yScale_obj(0.85)+40)
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 964)
      .attr("x2", 972)
      .attr("y1", yScale_obj(0.85)+40)
      .attr("y2", yScale_obj(0.85)+40)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_obj(0.97)+40)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 15*4+13));

  // Nature ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_nat = d3.scalePoint()
      .domain(d3.map(data['data']['pole']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_nat = d3.scaleLinear()
    .domain([0, 1.0])
    .range([4*svg.attr("line-height") - 4*svg.attr("bottom-margin"), 3*svg.attr("line-height") - 3*svg.attr("bottom-margin")+10]);

  var xAxis_nat = d3.axisBottom(xScale_nat);
  let yAxis_nat = d3.axisLeft(yScale_nat)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_nat_0 = d3.line()
    .x(function(d){ return xScale_nat(d.name_0)})
    .y(function (d) { return yScale_nat(d.preds_0) });

  var line_nat_1 = d3.line()
    .x(function(d){ return xScale_nat(d.name_1)})
    .y(function (d) { return yScale_nat(d.preds_1) });
    
  // Create Subplot
  svg.append("g")
    .attr("transform",
          `translate(0, ${4*svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_nat);

  svg.append("g")
      .attr("transform", `translate(${svg.attr("side-margin")},${3*svg.attr("bottom-margin")})`)
      .attr("class", "yAxis")
      .call(yAxis_nat);
	
  svg.append("path")
    .attr("d", line_nat_0(data['data']['vegetation']['data']))
    .attr("id", "myVegetation_0")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['vegetation']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_nat_0(data['data']['terrain']['data']))
    .attr("id", "myTerrain_0")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['terrain']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_nat_0(data['data']['sky']['data']))
    .attr("id", "mySky_0")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['sky']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle8_0')
    .data(data['data']['vegetation']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle8_0')
      .attr('cy', d => yScale_nat(d['preds_0']) + 60)
      .attr('cx', d => xScale_nat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['vegetation']['color']);

  svg.selectAll('circle9_0')
    .data(data['data']['terrain']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle9_0')
      .attr('cy', d => yScale_nat(d['preds_0']) + 60)
      .attr('cx', d => xScale_nat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['terrain']['color']);

  svg.selectAll('circle10_0')
    .data(data['data']['sky']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle10_0')
      .attr('cy', d => yScale_nat(d['preds_0']) + 60)
      .attr('cx', d => xScale_nat(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['sky']['color']);
	
  svg.append("path")
    .attr("d", line_nat_1(data['data']['vegetation']['data']))
    .attr("id", "myVegetation_1")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['vegetation']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_nat_1(data['data']['terrain']['data']))
    .attr("id", "myTerrain_1")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['terrain']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_nat_1(data['data']['sky']['data']))
    .attr("id", "mySky_1")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['sky']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  svg.selectAll('circle8_1')
    .data(data['data']['vegetation']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle8_1')
      .attr('cy', d => yScale_nat(d['preds_1']) + 60)
      .attr('cx', d => xScale_nat(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['vegetation']['color']);

  svg.selectAll('circle9_1')
    .data(data['data']['terrain']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle9_1')
      .attr('cy', d => yScale_nat(d['preds_1']) + 60)
      .attr('cx', d => xScale_nat(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['terrain']['color']);

  svg.selectAll('circle10_1')
    .data(data['data']['sky']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle10_1')
      .attr('cy', d => yScale_nat(d['preds_1']) + 60)
      .attr('cx', d => xScale_nat(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['sky']['color']);

  d3.selectAll("#myVegetation_0")
    .data(line_nat_0(data['data']['vegetation']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle8_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTerrain_0")
    .data(line_nat_0(data['data']['terrain']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle9_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#mySky_0")
    .data(line_nat_0(data['data']['sky']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle10_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle8_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myVegetation_0').raise().attr('stroke-width', '3');
      d3.select('.circle8_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'vegetation\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myVegetation_0').raise().attr('stroke-width', '2');
      d3.select('.circle8_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle9_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTerrain_0').raise().attr('stroke-width', '3');
      d3.select('.circle9_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'terrain\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTerrain_0').raise().attr('stroke-width', '2');
      d3.select('.circle9_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle10_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySky_0').raise().attr('stroke-width', '3');
      d3.select('.circle10_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'sky\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySky_0').raise().attr('stroke-width', '2');
      d3.select('.circle10_0').raise()
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll("#myVegetation_1")
    .data(line_nat_1(data['data']['vegetation']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle8_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTerrain_1")
    .data(line_nat_1(data['data']['terrain']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle9_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#mySky_1")
    .data(line_nat_1(data['data']['sky']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle10_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle8_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myVegetation_1').raise().attr('stroke-width', '4');
      d3.select('.circle8_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'vegetation\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '1');
      d3.select('#myVegetation_1').raise().attr('stroke-width', '3');
      d3.select('.circle8_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle9_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTerrain_1').raise().attr('stroke-width', '4');
      d3.select('.circle9_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'terrain\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTerrain_1').raise().attr('stroke-width', '3');
      d3.select('.circle9_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle10_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySky_1').raise().attr('stroke-width', '4');
      d3.select('.circle10_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'sky\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySky_1').raise().attr('stroke-width', '3');
      d3.select('.circle10_1').raise()
      tooltip.style("visibility", "hidden");
    });



  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['vegetation']['color'])
      .attr('y', yScale_nat(0.81)+ 20*3)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_nat(0.74)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'vegetation\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_nat(0.74)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['vegetation']['miou_0']} mIoU, 
            ${data['data']['vegetation']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['terrain']['color'])
      .attr('y', yScale_nat(0.72)+ 20*3)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_nat(0.65)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`\'terrain\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_nat(0.65)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['terrain']['miou_0']} mIoU, 
          ${data['data']['terrain']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['sky']['color'])
      .attr('y', yScale_nat(0.63)+ 20*3)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_nat(0.56)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'sky\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_nat(0.56)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['sky']['miou_0']} mIoU, 
            ${data['data']['sky']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_nat(0.91)+60)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`NATURE`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_nat(0.83)+60)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_nat(0.83)+60)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_nat(0.83)+60)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 900)
      .attr("x2", 1130)
      .attr("y1", yScale_nat(0.9)+60)
      .attr("y2", yScale_nat(0.9)+60)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 1052)
      .attr("x2", 1062)
      .attr("y1", yScale_nat(0.85)+60)
      .attr("y2", yScale_nat(0.85)+60)
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 964)
      .attr("x2", 972)
      .attr("y1", yScale_nat(0.85)+60)
      .attr("y2", yScale_nat(0.85)+60)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_nat(0.97)+60)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 15*4+13));


  // Human ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_human = d3.scalePoint()
      .domain(d3.map(data['data']['person']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_human = d3.scaleLinear()
    .domain([0, 1.0])
    .range([5*svg.attr("line-height") - 5*svg.attr("bottom-margin"), 4*svg.attr("line-height") - 4*svg.attr("bottom-margin")+10]);

  var xAxis_human = d3.axisBottom(xScale_human);
  let yAxis_human = d3.axisLeft(yScale_human)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_human_0 = d3.line()
    .x(function(d){ return xScale_human(d.name_0)})
    .y(function (d) { return yScale_human(d.preds_0) });

  var line_human_1 = d3.line()
    .x(function(d){ return xScale_human(d.name_1)})
    .y(function (d) { return yScale_human(d.preds_1) });
    
  // Create Subplot
  svg.append("g")
    .attr("transform",
          `translate(0, ${5*svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_human);

  svg.append("g")
      .attr("transform", `translate(${svg.attr("side-margin")},${4*svg.attr("bottom-margin")})`)
      .attr("class", "yAxis")
      .call(yAxis_human);
	
  svg.append("path")
    .attr("d", line_human_0(data['data']['person']['data']))
    .attr("id", "myPerson_0")
    .attr("transform", `translate(0,${4*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['person']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_human_0(data['data']['rider']['data']))
    .attr("id", "myRider_0")
    .attr("transform", `translate(0,${4*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['rider']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle11_0')
    .data(data['data']['person']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle11_0')
      .attr('cy', d => yScale_human(d['preds_0']) + 80)
      .attr('cx', d => xScale_human(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['person']['color']);

  svg.selectAll('circle12_0')
    .data(data['data']['rider']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle12_0')
      .attr('cy', d => yScale_human(d['preds_0']) + 80)
      .attr('cx', d => xScale_human(d['name_0']))
      .attr('r', 3)
    .attr('fill', data['data']['rider']['color']);
	
  svg.append("path")
    .attr("d", line_human_1(data['data']['person']['data']))
    .attr("id", "myPerson_1")
    .attr("transform", `translate(0,${4*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['person']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_human_1(data['data']['rider']['data']))
    .attr("id", "myRider_1")
    .attr("transform", `translate(0,${4*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['rider']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  svg.selectAll('circle11_1')
    .data(data['data']['person']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle11_1')
      .attr('cy', d => yScale_human(d['preds_1']) + 80)
      .attr('cx', d => xScale_human(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['person']['color']);

  svg.selectAll('circle12_1')
    .data(data['data']['rider']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle12_1')
      .attr('cy', d => yScale_human(d['preds_1']) + 80)
      .attr('cx', d => xScale_human(d['name_1']))
      .attr('r', 3)
    .attr('fill', data['data']['rider']['color']);

  d3.selectAll("#myPerson_0")
    .data(line_human_0(data['data']['person']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle11_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myRider_0")
    .data(line_human_0(data['data']['rider']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle12_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle11_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myPerson_0').raise().attr('stroke-width', '3');
      d3.select('.circle11_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0}
        \tPredicted class: \'person\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)}
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myPerson_0').raise().attr('stroke-width', '2');
      d3.select('.circle11_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle12_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRider_0').raise().attr('stroke-width', '3');
      d3.select('.circle12_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0}
        \tPredicted class: \'rider\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)}
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRider_0').raise().attr('stroke-width', '2');
      d3.select('.circle12_0').raise()
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll("#myPerson_1")
    .data(line_human_1(data['data']['person']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle11_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myRider_1")
    .data(line_human_1(data['data']['rider']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle12_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle11_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myPerson_1').raise().attr('stroke-width', '4');
      d3.select('.circle11_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1}
        \tPredicted class: \'person\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)}
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myPerson_1').raise().attr('stroke-width', '3');
      d3.select('.circle11_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle12_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRider_1').raise().attr('stroke-width', '4');
      d3.select('.circle12_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1}
        \tPredicted class: \'rider\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)}
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRider_1').raise().attr('stroke-width', '3');
      d3.select('.circle12_1').raise()
      tooltip.style("visibility", "hidden");
    });

  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['person']['color'])
      .attr('y', yScale_human(0.81)+ 20*4)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_human(0.74)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'person\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_human(0.74)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['person']['miou_0']} mIoU, ${data['data']['person']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['rider']['color'])
      .attr('y', yScale_human(0.72)+ 20*4)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_human(0.65)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'rider\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_human(0.65)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['rider']['miou_0']} mIoU, ${data['data']['rider']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 990)
      .attr("y", yScale_human(0.91)+80)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`HUMAN`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 975)
      .attr("y", yScale_human(0.83)+80)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_human(0.83)+80)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 910)
      .attr("y", yScale_human(0.83)+80)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 900)
      .attr("x2", 1130)
      .attr("y1", yScale_human(0.9)+80)
      .attr("y2", yScale_human(0.9)+80)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 1052)
      .attr("x2", 1062)
      .attr("y1", yScale_human(0.85)+80)
      .attr("y2", yScale_human(0.85)+80)
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 964)
      .attr("x2", 972)
      .attr("y1", yScale_human(0.85)+80)
      .attr("y2", yScale_human(0.85)+80)
      .style("stroke", 'black')); 
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_human(0.97)+80)
      .attr("x", 900)
      .attr('width', 230)
      .attr('height', 15*3+13));


  // Vehicle ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_vehicle = d3.scalePoint()
      .domain(d3.map(data['data']['car']['data'], function(d) {
        return d.name_0
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_vehicle = d3.scaleLinear()
    .domain([0, 1.0])
    .range([6*svg.attr("line-height") - 6*svg.attr("bottom-margin"), 5*svg.attr("line-height") - 5*svg.attr("bottom-margin")+10]);

  var xAxis_vehicle = d3.axisBottom(xScale_vehicle);
  let yAxis_vehicle = d3.axisLeft(yScale_vehicle)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_vehicle_0 = d3.line()
    .x(function(d){ return xScale_vehicle(d.name_0)})
    .y(function (d) { return yScale_vehicle(d.preds_0) });

  var line_vehicle_1 = d3.line()
    .x(function(d){ return xScale_vehicle(d.name_1)})
    .y(function (d) { return yScale_vehicle(d.preds_1) });
    
  // Create Subplot
  svg.append("g")
    .attr("transform",
          `translate(0, ${6*svg.attr("line-height") - svg.attr("bottom-margin")})`)
    .attr("class", "xAxis")
    .attr("stroke-width", "1")
    .call(xAxis_vehicle);

  svg.append("g")
    .attr("transform", `translate(${svg.attr("side-margin")},${5 * svg.attr("bottom-margin")})`)
    .attr("class", "yAxis")
    .call(yAxis_vehicle);
	
  svg.append("path")
    .attr("d", line_vehicle_0(data['data']['car']['data']))
    .attr("id", "myCar_0")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['car']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_0(data['data']['truck']['data']))
    .attr("id", "myTruck_0")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['truck']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_0(data['data']['bus']['data']))
    .attr("id", "myBus_0")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['bus']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_0(data['data']['train']['data']))
    .attr("id", "myTrain_0")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['train']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_0(data['data']['motorcycle']['data']))
    .attr("id", "myMotorcycle_0")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['motorcycle']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_0(data['data']['bicycle']['data']))
    .attr("id", "myBicycle_0")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['bicycle']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle13_0')
    .data(data['data']['car']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle13_0')
      .attr('cy', d => yScale_vehicle(d['preds_0']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['car']['color']);

  svg.selectAll('circle14_0')
    .data(data['data']['truck']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle14_0')
      .attr('cy', d => yScale_vehicle(d['preds_0']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['truck']['color']);

  svg.selectAll('circle15_0')
    .data(data['data']['bus']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle15_0')
      .attr('cy', d => yScale_vehicle(d['preds_0']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['bus']['color']);

  svg.selectAll('circle16_0')
    .data(data['data']['train']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle16_0')
      .attr('cy', d => yScale_vehicle(d['preds_0']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['train']['color']);

  svg.selectAll('circle17_0')
    .data(data['data']['motorcycle']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle17_0')
      .attr('cy', d => yScale_vehicle(d['preds_0']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_0']))
      .attr('r', 3)
      .attr('fill', data['data']['motorcycle']['color']);

  svg.selectAll('circle18_0')
    .data(data['data']['bicycle']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle18_0')
      .attr('cy', d => yScale_vehicle(d['preds_0']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_0']))
      .attr('r', 3)
    .attr('fill', data['data']['bicycle']['color']);
	
  svg.append("path")
    .attr("d", line_vehicle_1(data['data']['car']['data']))
    .attr("id", "myCar_1")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['car']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_1(data['data']['truck']['data']))
    .attr("id", "myTruck_1")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['truck']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_1(data['data']['bus']['data']))
    .attr("id", "myBus_1")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['bus']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_1(data['data']['train']['data']))
    .attr("id", "myTrain_1")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['train']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_1(data['data']['motorcycle']['data']))
    .attr("id", "myMotorcycle_1")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['motorcycle']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle_1(data['data']['bicycle']['data']))
    .attr("id", "myBicycle_1")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['bicycle']['color'])
    .attr("stroke-width", "3")
    .style("stroke-dasharray", ("3, 3"))
    .attr("fill", "none");

  svg.selectAll('circle13_1')
    .data(data['data']['car']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle13_1')
      .attr('cy', d => yScale_vehicle(d['preds_1']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['car']['color']);

  svg.selectAll('circle14_1')
    .data(data['data']['truck']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle14_1')
      .attr('cy', d => yScale_vehicle(d['preds_1']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['truck']['color']);

  svg.selectAll('circle15_1')
    .data(data['data']['bus']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle15_1')
      .attr('cy', d => yScale_vehicle(d['preds_1']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['bus']['color']);

  svg.selectAll('circle16_1')
    .data(data['data']['train']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle16_1')
      .attr('cy', d => yScale_vehicle(d['preds_1']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['train']['color']);

  svg.selectAll('circle17_1')
    .data(data['data']['motorcycle']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle17_1')
      .attr('cy', d => yScale_vehicle(d['preds_1']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_1']))
      .attr('r', 3)
      .attr('fill', data['data']['motorcycle']['color']);

  svg.selectAll('circle18_1')
    .data(data['data']['bicycle']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle18_1')
      .attr('cy', d => yScale_vehicle(d['preds_1']) + 100)
      .attr('cx', d => xScale_vehicle(d['name_1']))
      .attr('r', 3)
    .attr('fill', data['data']['bicycle']['color']);


  d3.selectAll("#myCar_0")
    .data(line_vehicle_0(data['data']['car']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle13_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTruck_0")
    .data(line_vehicle_0(data['data']['truck']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle14_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  d3.selectAll("#myBus_0")
    .data(line_vehicle_0(data['data']['bus']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle15_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrain_0")
    .data(line_vehicle_0(data['data']['train']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle16_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  d3.selectAll("#myMotorcycle_0")
    .data(line_vehicle_0(data['data']['person']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle17_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myBicycle_0")
    .data(line_vehicle_0(data['data']['rider']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle18_0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });


  d3.selectAll(".circle13_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myCar_0').raise().attr('stroke-width', '3');
      d3.select('.circle13_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'car\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myCar_0').raise().attr('stroke-width', '2');
      d3.select('.circle13_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle14_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTruck_0').raise().attr('stroke-width', '3');
      d3.select('.circle14_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'truck\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTruck_0').raise().attr('stroke-width', '2');
      d3.select('.circle14_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle15_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBus_0').raise().attr('stroke-width', '3');
      d3.select('.circle15_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'bus\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBus_0').raise().attr('stroke-width', '2');
      d3.select('.circle15_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle16_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrain_0').raise().attr('stroke-width', '3');
      d3.select('.circle16_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'train\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrain_0').raise().attr('stroke-width', '2');
      d3.select('.circle16_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle17_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myMotorcycle_0').raise().attr('stroke-width', '3');
      d3.select('.circle17_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'motorcycle\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myMotorcycle_0').raise().attr('stroke-width', '2');
      d3.select('.circle17_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle18_0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBicycle_0').raise().attr('stroke-width', '3');
      d3.select('.circle18_0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_0} 
        \tPredicted class: \'bicycle\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_0)} 
        Ground truth class: \'${d.name_0}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBicycle_0').raise().attr('stroke-width', '2');
      d3.select('.circle18_0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll("#myCar_1")
    .data(line_vehicle_1(data['data']['car']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle13_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTruck_1")
    .data(line_vehicle_1(data['data']['truck']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle14_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
  d3.selectAll("#myBus_1")
    .data(line_vehicle_1(data['data']['bus']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle15_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrain_1")
    .data(line_vehicle_1(data['data']['train']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle16_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
  d3.selectAll("#myMotorcycle_1")
    .data(line_vehicle_1(data['data']['person']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle17_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myBicycle_1")
    .data(line_vehicle_1(data['data']['rider']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '4')

      d3.selectAll(".circle18_1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '3');
      tooltip.style('visibility', 'hidden');
    });


  d3.selectAll(".circle13_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myCar_1').raise().attr('stroke-width', '4');
      d3.select('.circle13_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'car\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myCar_1').raise().attr('stroke-width', '3');
      d3.select('.circle13_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle14_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTruck_1').raise().attr('stroke-width', '4');
      d3.select('.circle14_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'truck\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTruck_1').raise().attr('stroke-width', '3');
      d3.select('.circle14_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle15_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBus_1').raise().attr('stroke-width', '4');
      d3.select('.circle15_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'bus\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBus_1').raise().attr('stroke-width', '3');
      d3.select('.circle15_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle16_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrain_1').raise().attr('stroke-width', '4');
      d3.select('.circle16_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'train\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrain_1').raise().attr('stroke-width', '3');
      d3.select('.circle16_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle17_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myMotorcycle_1').raise().attr('stroke-width', '4');
      d3.select('.circle17_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'motorcycle\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myMotorcycle_1').raise().attr('stroke-width', '3');
      d3.select('.circle17_1').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle18_1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBicycle_1').raise().attr('stroke-width', '4');
      d3.select('.circle18_1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Model: ${d.model_1} 
        \tPredicted class: \'bicycle\'
        Pixels predicted: ${d3.format(".2s")(d.class_total_1)} 
        Ground truth class: \'${d.name_1}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBicycle_1').raise().attr('stroke-width', '3');
      d3.select('.circle18_1').raise()
      tooltip.style("visibility", "hidden");
    });

  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['car']['color'])
      .attr('y', yScale_vehicle(0.81)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.74)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'car\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.74)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['car']['miou_0']} mIoU, ${data['data']['car']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['truck']['color'])
      .attr('y', yScale_vehicle(0.72)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.65)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'truck\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.65)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['truck']['miou_0']} mIoU, ${data['data']['truck']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['bus']['color'])
      .attr('y', yScale_vehicle(0.63)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.56)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'bus\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.56)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['bus']['miou_0']} mIoU, ${data['data']['bus']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['train']['color'])
      .attr('y', yScale_vehicle(0.54)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.47)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'train\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.47)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['train']['miou_0']} mIoU, ${data['data']['train']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['motorcycle']['color'])
      .attr('y', yScale_vehicle(0.45)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.39)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'motorcycle\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.39)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['motorcycle']['miou_0']} mIoU, 
              ${data['data']['motorcycle']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['bicycle']['color'])
      .attr('y', yScale_vehicle(0.36)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 16));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.3)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`\'bicycle\' `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.3)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "white")
      .attr("text-anchor", "center")
      .text(`(${data['data']['bicycle']['miou_0']} mIoU, 
            ${data['data']['bicycle']['miou_1']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 290+50)
      .attr("y", yScale_vehicle(0.91)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`VEHICLE`)); 
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 275+50)
      .attr("y", yScale_vehicle(0.83)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_0']}  `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 365+50)
      .attr("y", yScale_vehicle(0.83)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`${data['data']['sidewalk']['model_1']} `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 210+50)
      .attr("y", yScale_vehicle(0.83)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`class `));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 200+50)
      .attr("x2", 430+50)
      .attr("y1", yScale_vehicle(0.9)+ 20*5)
      .attr("y2", yScale_vehicle(0.9)+ 20*5)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 352+50)
      .attr("x2", 362+50)
      .attr("y1", yScale_vehicle(0.85)+ 20*5)
      .attr("y2", yScale_vehicle(0.85)+ 20*5)
      .style("stroke-dasharray","3,3")//dashed array for line
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append("line")//making a line for legend
      .attr("x1", 264+50)
      .attr("x2", 272+50)
      .attr("y1", yScale_vehicle(0.85)+ 20*5)
      .attr("y2", yScale_vehicle(0.85)+ 20*5)
      .style("stroke", 'black'));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_vehicle(0.97)+ 20*5)
      .attr("x", 200+50)
      .attr('width', 230)
      .attr('height', 15*7+13));

  // LABELS --------------------------------------------------------------------------------------------------------------


        
        
  // Y label
  svg.append('text')
       .attr('text-anchor', 'middle')
       .attr('transform', 'translate(20,' + (svg.attr("height")/2) + ')rotate(-90)')
       .style('font-family', 'Helvetica')
       .style('font-size', 20)
       .text('Number of Positive Pixel Class Predictions, (Normalized) ');


        
        
  // X label
  svg.append('text')
       .attr('text-anchor', 'middle')
       .attr('transform', 'translate('+(svg.attr("width")/2)+',' + (svg.attr("height")-90) + ')')
       .style('font-family', 'Helvetica')
       .style('font-size', 20)
       .text('Ground Truth Labels');



}

