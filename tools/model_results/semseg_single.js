

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
function draw_full_circleplot(wrapper, data) { var svg = add_svg(wrapper);

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
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
      .padding(0.5);
  let yScale_flat = d3.scaleLinear()
    .domain([0, 1.0])
    .range([svg.attr("line-height") - svg.attr("bottom-margin"), 10]);

  var xAxis_flat = d3.axisBottom(xScale_flat);
  let yAxis_flat = d3.axisLeft(yScale_flat)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_flat = d3.line()
    .x(function(d){ return xScale_flat(d.name)})
    .y(function (d) { return yScale_flat(d.preds) });
    
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
    .attr("d", line_flat(data['data']['road']['data']))
    .attr("id", "myRoad")
    .attr("stroke", data['data']['road']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_flat(data['data']['sidewalk']['data']))
    .attr("id", "mySidewalk")
    .attr("stroke", data['data']['sidewalk']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  // Add circles -----------------------------------------------------------------
  svg.selectAll('circle0')
    .data(data['data']['road']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle0')
      .attr('cy', d => yScale_flat(d['preds']) )
      .attr('cx', d => xScale_flat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['road']['color']);

  svg.selectAll('circle1')
    .data(data['data']['sidewalk']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle1')
      .attr('cy', d => yScale_flat(d['preds']) )
      .attr('cx', d => xScale_flat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['sidewalk']['color']);

  // Add tooltips -----------------------------------------------------------------

  
  d3.selectAll("#myRoad")
    .data(line_flat(data['data']['road']['data']))
    .on('mouseover', function (event) {

      d3.select(this)

        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle0")
        .raise()
        
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  
  d3.selectAll("#mySidewalk")
    .data(line_flat(data['data']['sidewalk']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRoad').raise().attr('stroke-width', '3');
      d3.select('.circle0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('width', '125px')
        .text(`Predicted class: \'road\' Pixels predicted: ${d3.format(".2s")(d.class_total)} Ground truth class: \'${d.name}\'  ` );
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRoad').raise().attr('stroke-width', '2');
      d3.select('.circle0').raise()
      tooltip.style("visibility", "hidden");
    });


  d3.selectAll(".circle1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySidewalk').raise().attr('stroke-width', '3');
      d3.select('.circle1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'sidewalk\'.  Pixels predicted: ${d3.format(".2s")(d.class_total)}      Ground truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySidewalk').raise().attr('stroke-width', '2');
      d3.select('.circle1').raise()
      tooltip.style("visibility", "hidden");
    });

  // Add a legend -------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['road']['color'])
      .attr('y', yScale_flat(0.9))
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`road, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['road']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['sidewalk']['color'])
      .attr('y', yScale_flat(0.81))
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`sidewalk, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['sidewalk']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_flat(0.91))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Flat`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_flat(0.97))
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*2+12));
}
// ----------------- FULL GRAPH --------------------------------------------------------------------//
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

  // FLAT ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_flat = d3.scalePoint()
      .domain(d3.map(data['data']['road']['data'], function(d) {
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
      .padding(0.5);
  let yScale_flat = d3.scaleLinear()
    .domain([0, 1.0])
    .range([svg.attr("line-height") - svg.attr("bottom-margin"), 10]);

  var xAxis_flat = d3.axisBottom(xScale_flat);
  let yAxis_flat = d3.axisLeft(yScale_flat)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_flat = d3.line()
    .x(function(d){ return xScale_flat(d.name)})
    .y(function (d) { return yScale_flat(d.preds) });
    
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
	
  svg.append("path")
    .attr("d", line_flat(data['data']['road']['data']))
    .attr("id", "myRoad")
    .attr("stroke", data['data']['road']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_flat(data['data']['sidewalk']['data']))
    .attr("id", "mySidewalk")
    .attr("stroke", data['data']['sidewalk']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle0')
    .data(data['data']['road']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle0')
      .attr('cy', d => yScale_flat(d['preds']) )
      .attr('cx', d => xScale_flat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['road']['color']);

  svg.selectAll('circle1')
    .data(data['data']['sidewalk']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle1')
      .attr('cy', d => yScale_flat(d['preds']) )
      .attr('cx', d => xScale_flat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['sidewalk']['color']);

  d3.selectAll("#myRoad")
    .data(line_flat(data['data']['road']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle0")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll("#mySidewalk")
    .data(line_flat(data['data']['sidewalk']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle1")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle0")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRoad').raise().attr('stroke-width', '3');
      d3.select('.circle0').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'road\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\' ` );
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRoad').raise().attr('stroke-width', '2');
      d3.select('.circle0').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle1")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySidewalk').raise().attr('stroke-width', '3');
      d3.select('.circle1').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'sidewalk\'  \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\' `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySidewalk').raise().attr('stroke-width', '2');
      d3.select('.circle1').raise()
      tooltip.style("visibility", "hidden");
    });

  // Add a legend -------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['road']['color'])
      .attr('y', yScale_flat(0.9))
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`road, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_flat(0.83))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['road']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['sidewalk']['color'])
      .attr('y', yScale_flat(0.81))
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`sidewalk, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_flat(0.74))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['sidewalk']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_flat(0.91))
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Flat`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_flat(0.97))
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*2+12));
      
      

  // Construction ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_const = d3.scalePoint()
      .domain(d3.map(data['data']['building']['data'], function(d) {
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_const = d3.scaleLinear()
    .domain([0, 1.0])
    .range([2*svg.attr("line-height") - 2*svg.attr("bottom-margin"), svg.attr("line-height") - svg.attr("bottom-margin")+10]);

  var xAxis_const = d3.axisBottom(xScale_const);
  let yAxis_const = d3.axisLeft(yScale_const)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_const = d3.line()
    .x(function(d){ return xScale_const(d.name)})
    .y(function (d) { return yScale_const(d.preds) });
    
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
    .attr("d", line_const(data['data']['building']['data']))
    .attr("id", "myBuilding")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['building']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const(data['data']['wall']['data']))
    .attr("id", "myWall")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['wall']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_const(data['data']['fence']['data']))
    .attr("id", "myFence")
    .attr("transform", `translate(0,${svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['fence']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle2')
    .data(data['data']['building']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle2')
      .attr('cy', d => yScale_const(d['preds']) + 20)
      .attr('cx', d => xScale_const(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['building']['color']);

  svg.selectAll('circle3')
    .data(data['data']['wall']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle3')
      .attr('cy', d => yScale_const(d['preds']) + 20 )
      .attr('cx', d => xScale_const(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['wall']['color']);

  svg.selectAll('circle4')
    .data(data['data']['fence']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle4')
      .attr('cy', d => yScale_const(d['preds']) + 20 )
      .attr('cx', d => xScale_const(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['fence']['color']);

  d3.selectAll("#myBuilding")
    .data(line_flat(data['data']['building']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle2")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myWall")
    .data(line_flat(data['data']['wall']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle3")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myFence")
    .data(line_flat(data['data']['fence']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle4")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle2")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBuilding').raise().attr('stroke-width', '3');
      d3.select('.circle2').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'building\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\' ` );
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBuilding').raise().attr('stroke-width', '2');
      d3.select('.circle2').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle3")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myWall').raise().attr('stroke-width', '3');
      d3.select('.circle3').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'wall\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myWall').raise().attr('stroke-width', '2');
      d3.select('.circle3').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle3")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myWall').raise().attr('stroke-width', '3');
      d3.select('.circle3').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'wall\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\' `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myWall').raise().attr('stroke-width', '2');
      d3.select('.circle3').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle4")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myFence').raise().attr('stroke-width', '3');
      d3.select('.circle4').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'fence\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'`);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myFence').raise().attr('stroke-width', '2');
      d3.select('.circle4').raise()
      tooltip.style("visibility", "hidden");
    });


  // Add a legend -------------------------------------------
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['building']['color'])
      .attr('y', yScale_const(0.9)+ 20)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_const(0.83)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`building, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_const(0.83)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['building']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['wall']['color'])
      .attr('y', yScale_const(0.81)+ 20)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_const(0.74)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`wall, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_const(0.74)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['wall']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['fence']['color'])
      .attr('y', yScale_const(0.72)+ 20)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_const(0.65)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`fence, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_const(0.65)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['fence']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1040)
      .attr("y", yScale_const(0.91)+ 20)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Construction`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_const(0.97)+ 20)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*3+12));
      
      

  // Objects ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_obj = d3.scalePoint()
      .domain(d3.map(data['data']['pole']['data'], function(d) {
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_obj = d3.scaleLinear()
    .domain([0, 1.0])
    .range([3*svg.attr("line-height") - 3*svg.attr("bottom-margin"), 2*svg.attr("line-height") - 2*svg.attr("bottom-margin")+10]);

  var xAxis_obj = d3.axisBottom(xScale_obj);
  let yAxis_obj = d3.axisLeft(yScale_obj)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_obj = d3.line()
    .x(function(d){ return xScale_obj(d.name)})
    .y(function (d) { return yScale_obj(d.preds) });
    
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
    .attr("d", line_obj(data['data']['pole']['data']))
    .attr("id", "myPole")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['pole']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_obj(data['data']['traffic sign']['data']))
    .attr("id", "myTrafficSign")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['traffic sign']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_obj(data['data']['traffic light']['data']))
    .attr("id", "myTrafficLight")
    .attr("transform", `translate(0,${2*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['traffic light']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle5')
    .data(data['data']['pole']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle5')
      .attr('cy', d => yScale_obj(d['preds']) + 40)
      .attr('cx', d => xScale_obj(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['pole']['color']);

  svg.selectAll('circle6')
    .data(data['data']['traffic sign']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle6')
      .attr('cy', d => yScale_obj(d['preds']) + 40)
      .attr('cx', d => xScale_obj(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['traffic sign']['color']);

  svg.selectAll('circle7')
    .data(data['data']['traffic light']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle7')
      .attr('cy', d => yScale_obj(d['preds']) + 40)
      .attr('cx', d => xScale_obj(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['traffic light']['color']);

  d3.selectAll("#myPole")
    .data(line_flat(data['data']['pole']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle5")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrafficSign")
    .data(line_flat(data['data']['traffic sign']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle6")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrafficLight")
    .data(line_flat(data['data']['traffic light']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle7")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle5")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myPole').raise().attr('stroke-width', '3');
      d3.select('.circle5').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'pole\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  ` );
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myPole').raise().attr('stroke-width', '2');
      d3.select('.circle5').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle6")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrafficSign').raise().attr('stroke-width', '3');
      d3.select('.circle6').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'traffic sign\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrafficSign').raise().attr('stroke-width', '2');
      d3.select('.circle6').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle7")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrafficLight').raise().attr('stroke-width', '3');
      d3.select('.circle7').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'traffic light\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrafficLight').raise().attr('stroke-width', '2');
      d3.select('.circle7').raise()
      tooltip.style("visibility", "hidden");
    });
    

  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['pole']['color'])
      .attr('y', yScale_obj(0.9)+ 20*2)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_obj(0.83)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`pole, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_obj(0.83)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['pole']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['traffic sign']['color'])
      .attr('y', yScale_obj(0.81)+ 20*2)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_obj(0.74)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`traffic sign, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_obj(0.74)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['traffic sign']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['traffic light']['color'])
      .attr('y', yScale_obj(0.72)+ 20*2)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_obj(0.65)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`traffic light, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_obj(0.65)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['traffic light']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1050)
      .attr("y", yScale_obj(0.91)+ 20*2)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Object`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_obj(0.97)+ 20*2)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*3+12));

  // Nature ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_nat = d3.scalePoint()
      .domain(d3.map(data['data']['pole']['data'], function(d) {
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_nat = d3.scaleLinear()
    .domain([0, 1.0])
    .range([4*svg.attr("line-height") - 4*svg.attr("bottom-margin"), 3*svg.attr("line-height") - 3*svg.attr("bottom-margin")+10]);

  var xAxis_nat = d3.axisBottom(xScale_nat);
  let yAxis_nat = d3.axisLeft(yScale_nat)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_nat = d3.line()
    .x(function(d){ return xScale_nat(d.name)})
    .y(function (d) { return yScale_nat(d.preds) });
    
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
    .attr("d", line_nat(data['data']['vegetation']['data']))
    .attr("id", "myVegetation")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['vegetation']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_nat(data['data']['terrain']['data']))
    .attr("id", "myTerrain")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['terrain']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_nat(data['data']['sky']['data']))
    .attr("id", "mySky")
    .attr("transform", `translate(0,${3*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['sky']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle8')
    .data(data['data']['vegetation']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle8')
      .attr('cy', d => yScale_nat(d['preds']) + 60)
      .attr('cx', d => xScale_nat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['vegetation']['color']);

  svg.selectAll('circle9')
    .data(data['data']['terrain']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle9')
      .attr('cy', d => yScale_nat(d['preds']) + 60)
      .attr('cx', d => xScale_nat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['terrain']['color']);

  svg.selectAll('circle10')
    .data(data['data']['sky']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle10')
      .attr('cy', d => yScale_nat(d['preds']) + 60)
      .attr('cx', d => xScale_nat(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['sky']['color']);

  d3.selectAll("#myVegetation")
    .data(line_flat(data['data']['vegetation']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle8")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTerrain")
    .data(line_flat(data['data']['terrain']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle9")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#mySky")
    .data(line_flat(data['data']['sky']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle10")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

    d3.selectAll(".circle8")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myVegetation').raise().attr('stroke-width', '3');
      d3.select('.circle8').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'vegetation\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  ` );
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myVegetation').raise().attr('stroke-width', '2');
      d3.select('.circle8').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle9")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTerrain').raise().attr('stroke-width', '3');
      d3.select('.circle9').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'terrain\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTerrain').raise().attr('stroke-width', '2');
      d3.select('.circle9').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle10")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#mySky').raise().attr('stroke-width', '3');
      d3.select('.circle10').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'sky\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#mySky').raise().attr('stroke-width', '2');
      d3.select('.circle10').raise()
      tooltip.style("visibility", "hidden");
    });



  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['vegetation']['color'])
      .attr('y', yScale_nat(0.9)+ 20*3)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_nat(0.83)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`vegetation, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_nat(0.83)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['vegetation']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['terrain']['color'])
      .attr('y', yScale_nat(0.81)+ 20*3)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_nat(0.74)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`terrain, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_nat(0.74)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['terrain']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['sky']['color'])
      .attr('y', yScale_nat(0.72)+ 20*3)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_nat(0.65)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`sky, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_nat(0.65)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`(${data['data']['sky']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1050)
      .attr("y", yScale_nat(0.91)+ 20*3)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Nature`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_nat(0.97)+ 20*3)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*3+12));


  // Human ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_human = d3.scalePoint()
      .domain(d3.map(data['data']['person']['data'], function(d) {
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_human = d3.scaleLinear()
    .domain([0, 1.0])
    .range([5*svg.attr("line-height") - 5*svg.attr("bottom-margin"), 4*svg.attr("line-height") - 4*svg.attr("bottom-margin")+10]);

  var xAxis_human = d3.axisBottom(xScale_human);
  let yAxis_human = d3.axisLeft(yScale_human)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_human = d3.line()
    .x(function(d){ return xScale_human(d.name)})
    .y(function (d) { return yScale_human(d.preds) });
    
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
    .attr("d", line_human(data['data']['person']['data']))
    .attr("id", "myPerson")
    .attr("transform", `translate(0,${4*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['person']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_human(data['data']['rider']['data']))
    .attr("id", "myRider")
    .attr("transform", `translate(0,${4*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['rider']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle11')
    .data(data['data']['person']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle11')
      .attr('cy', d => yScale_human(d['preds']) + 80)
      .attr('cx', d => xScale_human(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['person']['color']);

  svg.selectAll('circle12')
    .data(data['data']['rider']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle12')
      .attr('cy', d => yScale_human(d['preds']) + 80)
      .attr('cx', d => xScale_human(d['name']))
      .attr('r', 3)
    .attr('fill', data['data']['rider']['color']);

  d3.selectAll("#myPerson")
    .data(line_flat(data['data']['person']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle11")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myRider")
    .data(line_flat(data['data']['rider']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle12")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });

  d3.selectAll(".circle11")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myPerson').raise().attr('stroke-width', '3');
      d3.select('.circle11').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'person\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myPerson').raise().attr('stroke-width', '2');
      d3.select('.circle11').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle12")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myRider').raise().attr('stroke-width', '3');
      d3.select('.circle12').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'rider\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myRider').raise().attr('stroke-width', '2');
      d3.select('.circle12').raise()
      tooltip.style("visibility", "hidden");
    });

  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['person']['color'])
      .attr('y', yScale_human(0.9)+ 20*4)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_human(0.83)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`person, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_human(0.83)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['person']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['rider']['color'])
      .attr('y', yScale_human(0.81)+ 20*4)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_human(0.74)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`rider, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1060)
      .attr("y", yScale_human(0.74)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['rider']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1050)
      .attr("y", yScale_human(0.91)+ 20*4)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Human`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_human(0.97)+ 20*4)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*2+12));


  // Vehicle ------------------------------------------------------------------------------------------//

  // Construct scales and axes.
  var xScale_vehicle = d3.scalePoint()
      .domain(d3.map(data['data']['car']['data'], function(d) {
        return d.name
      }))
      .range([svg.attr("side-margin") , svg.attr("width") - svg.attr("side-margin") ])
    .padding(0.5);
      
  let yScale_vehicle = d3.scaleLinear()
    .domain([0, 1.0])
    .range([6*svg.attr("line-height") - 6*svg.attr("bottom-margin"), 5*svg.attr("line-height") - 5*svg.attr("bottom-margin")+10]);

  var xAxis_vehicle = d3.axisBottom(xScale_vehicle);
  let yAxis_vehicle = d3.axisLeft(yScale_vehicle)
    .ticks(svg.attr("line-height") / 50, "0.1s");

  var line_vehicle = d3.line()
    .x(function(d){ return xScale_vehicle(d.name)})
    .y(function (d) { return yScale_vehicle(d.preds) });
    
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
    .attr("d", line_vehicle(data['data']['car']['data']))
    .attr("id", "myCar")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['car']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle(data['data']['truck']['data']))
    .attr("id", "myTruck")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['truck']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle(data['data']['bus']['data']))
    .attr("id", "myBus")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['bus']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle(data['data']['train']['data']))
    .attr("id", "myTrain")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['train']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle(data['data']['motorcycle']['data']))
    .attr("id", "myMotorcycle")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['motorcycle']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");
	
  svg.append("path")
    .attr("d", line_vehicle(data['data']['bicycle']['data']))
    .attr("id", "myBicycle")
    .attr("transform", `translate(0,${5*svg.attr("bottom-margin")})`)
    .attr("stroke", data['data']['bicycle']['color'])
    .attr("stroke-width", "2")
    .attr("fill", "none");

  svg.selectAll('circle13')
    .data(data['data']['car']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle13')
      .attr('cy', d => yScale_vehicle(d['preds']) + 100)
      .attr('cx', d => xScale_vehicle(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['car']['color']);

  svg.selectAll('circle14')
    .data(data['data']['truck']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle14')
      .attr('cy', d => yScale_vehicle(d['preds']) + 100)
      .attr('cx', d => xScale_vehicle(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['truck']['color']);

  svg.selectAll('circle15')
    .data(data['data']['bus']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle15')
      .attr('cy', d => yScale_vehicle(d['preds']) + 100)
      .attr('cx', d => xScale_vehicle(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['bus']['color']);

  svg.selectAll('circle16')
    .data(data['data']['train']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle16')
      .attr('cy', d => yScale_vehicle(d['preds']) + 100)
      .attr('cx', d => xScale_vehicle(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['train']['color']);

  svg.selectAll('circle17')
    .data(data['data']['motorcycle']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle17')
      .attr('cy', d => yScale_vehicle(d['preds']) + 100)
      .attr('cx', d => xScale_vehicle(d['name']))
      .attr('r', 3)
      .attr('fill', data['data']['motorcycle']['color']);

  svg.selectAll('circle18')
    .data(data['data']['bicycle']['data'])
    .enter()
    .append('circle')
      .attr('class', 'circle18')
      .attr('cy', d => yScale_vehicle(d['preds']) + 100)
      .attr('cx', d => xScale_vehicle(d['name']))
      .attr('r', 3)
    .attr('fill', data['data']['bicycle']['color']);


  d3.selectAll("#myCar")
    .data(line_flat(data['data']['car']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle13")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTruck")
    .data(line_flat(data['data']['truck']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle14")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  d3.selectAll("#myBus")
    .data(line_flat(data['data']['bus']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle15")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myTrain")
    .data(line_flat(data['data']['train']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle16")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
  d3.selectAll("#myMotorcycle")
    .data(line_flat(data['data']['person']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle17")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });
    

  d3.selectAll("#myBicycle")
    .data(line_flat(data['data']['rider']['data']))
    .on('mouseover', function (event) {
      d3.select(this)
        .raise()
        .attr('stroke-width', '3')

      d3.selectAll(".circle18")
        .raise()
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke-width', '2');
      tooltip.style('visibility', 'hidden');
    });


  d3.selectAll(".circle13")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myCar').raise().attr('stroke-width', '3');
      d3.select('.circle13').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'car\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myCar').raise().attr('stroke-width', '2');
      d3.select('.circle13').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle14")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTruck').raise().attr('stroke-width', '3');
      d3.select('.circle14').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'truck\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTruck').raise().attr('stroke-width', '2');
      d3.select('.circle14').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle15")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBus').raise().attr('stroke-width', '3');
      d3.select('.circle15').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'bus\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBus').raise().attr('stroke-width', '2');
      d3.select('.circle15').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle16")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myTrain').raise().attr('stroke-width', '3');
      d3.select('.circle16').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'train\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myTrain').raise().attr('stroke-width', '2');
      d3.select('.circle16').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle17")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myMotorcycle').raise().attr('stroke-width', '3');
      d3.select('.circle17').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'motorcycle\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myMotorcycle').raise().attr('stroke-width', '2');
      d3.select('.circle17').raise()
      tooltip.style("visibility", "hidden");
    });
  d3.selectAll(".circle18")
    .on("mouseover", function(event, d) {
      // change the selection style
      d3.select('#myBicycle').raise().attr('stroke-width', '3');
      d3.select('.circle18').raise()
      d3.select(this).raise().attr('stroke-width', '1').attr("stroke", "black")
      // make the tooltip visible and update its text
      tooltip
        .style("visibility", "visible")
        .attr('display', 'block')
        .style('background', 'rgba(69,77,93,.8)')
        .style("top", (event.pageY - 30) + "px")
        .style("left", (event.pageX + 10) + "px")
        .style('max-width', '125px')
        .text(`Predicted class: \'bicycle\' \tPixels predicted: ${d3.format(".2s")(d.class_total)} \tGround truth class: \'${d.name}\'  `);
    })
    .on("mousemove", function() {
      tooltip
        .style("top", event.pageY - 30 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function() {
      // change the selection style
      d3.select(this).attr('stroke-width', '0');
      d3.select('#myBicycle').raise().attr('stroke-width', '2');
      d3.select('.circle18').raise()
      tooltip.style("visibility", "hidden");
    });
  // Legend
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['car']['color'])
      .attr('y', yScale_vehicle(0.9)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_vehicle(0.83)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`car, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_vehicle(0.83)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['car']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['truck']['color'])
      .attr('y', yScale_vehicle(0.81)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_vehicle(0.74)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`truck, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_vehicle(0.74)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['truck']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['bus']['color'])
      .attr('y', yScale_vehicle(0.72)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_vehicle(0.65)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`bus, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_vehicle(0.65)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['bus']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['train']['color'])
      .attr('y', yScale_vehicle(0.63)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_vehicle(0.56)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`train, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_vehicle(0.56)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['train']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['motorcycle']['color'])
      .attr('y', yScale_vehicle(0.54)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_vehicle(0.47)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`motorcycle, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_vehicle(0.47)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['motorcycle']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', data['data']['bicycle']['color'])
      .attr('y', yScale_vehicle(0.45)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1010)
      .attr("y", yScale_vehicle(0.39)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`bicycle, `));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1065)
      .attr("y", yScale_vehicle(0.39)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "#D3D3D3")
      .attr("text-anchor", "center")
      .text(`(${data['data']['bicycle']['miou']} mIoU)`));
  svg.append('g')
    .call(g => g.append("text")
      .attr("x", 1050)
      .attr("y", yScale_vehicle(0.91)+ 20*5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .attr("text-anchor", "center")
      .text(`Vehicle`));
  svg.append('g')
    .call(g => g.append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .attr('y', yScale_vehicle(0.97)+ 20*5)
      .attr("x", 1000)
      .attr('width', 130)
      .attr('height', 15*6+12));

  // LABELS --------------------------------------------------------------------------------------------------------------


        
        
  // Y label
  svg.append('text')
       .attr('text-anchor', 'middle')
       .attr('transform', 'translate(20,' + (svg.attr("height")/2) + ')rotate(-90)')
       .style('font-family', 'Helvetica')
       .style('font-size', 24)
       .text('Number of Positive Pixel Class Predictions, (Normalized) ');


}

