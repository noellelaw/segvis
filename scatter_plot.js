function _1(md){return(
md`# Project -fork
`
)}

function _d3(require){return(
require('d3@5.15.0')
)}

async function _data(d3,FileAttachment)
{
  const scsv = d3.dsvFormat(",") // Important to define the separator of your CSV file
  return scsv.parse(await FileAttachment("InfoVis - Input (1).csv").text())
}


async function _gt_image_1(FileAttachment){return(
await(FileAttachment("seg_000013_10.png")).url()
)}

async function _gt_image_2(FileAttachment){return(
await(FileAttachment("seg_000018_10.png")).url()
)}

async function _gt_image_3(FileAttachment){return(
await(FileAttachment("seg_000021_10.png")).url()
)}

async function _gt_image_4(FileAttachment){return(
await(FileAttachment("seg_000022_10.png")).url()
)}

function _gt_images(gt_image_1,gt_image_2,gt_image_3,gt_image_4){return(
[gt_image_1, gt_image_2, gt_image_3, gt_image_4]
)}

async function _m1_image_1(FileAttachment){return(
await (FileAttachment("m1_000013_10.png")).url()
)}

async function _m1_image_2(FileAttachment){return(
await (FileAttachment("m1_000018_10.png")).url()
)}

async function _m1_image_3(FileAttachment){return(
await (FileAttachment("m1_000021_10.png")).url()
)}

async function _m1_image_4(FileAttachment){return(
await (FileAttachment("m1_000022_10.png")).url()
)}

function _m1_images(m1_image_1,m1_image_2,m1_image_3,m1_image_4){return(
[m1_image_1, m1_image_2, m1_image_3, m1_image_4]
)}

async function _m2_images_1(FileAttachment){return(
await (FileAttachment("000013_10.png")).url()
)}

async function _m2_images_2(FileAttachment){return(
await (FileAttachment("000018_10.png")).url()
)}

async function _m2_images_3(FileAttachment){return(
await (FileAttachment("000021_10.png")).url()
)}

async function _m2_images_4(FileAttachment){return(
await (FileAttachment("000022_10.png")).url()
)}

function _m2_images(m2_images_1,m2_images_2,m2_images_3,m2_images_4){return(
[m2_images_1, m2_images_2, m2_images_3, m2_images_4]
)}

function _margin()
{ 
  return {
    left: 50,       
    right: 50,
    top: 20, 
    bottom: 50   
  } 
}


function _size()
{
  return {
    height: 600,
    width: 800
  }
}


function _width(size,margin){return(
size.width - margin.left - margin.right
)}

function _height(size,margin){return(
size.height - margin.top - margin.bottom
)}

function _SVG(selectedKey,d3,width,margin,height)
{
  console.log(selectedKey)
  return d3.create("svg")
    .attr("width", width + margin.left + margin.right+400)
    .attr("height", height + margin.top + margin.bottom);
}


function _x(d3,width){return(
d3.scaleLinear()
  .domain([-0.5, 1])
  .range([ 0, width ])
)}

function _xAxis(SVG,height,d3,x){return(
SVG.append("g")
  .attr("transform", "translate(12," + height + ")")
  .call(d3.axisBottom(x))
)}

function _opacity(d3){return(
d3.scaleOrdinal()
  .domain(["ovseg","cseg"])
  .range([ 0.25, 1 ])
)}

function _y(d3,height){return(
d3.scaleLinear()
  .domain([-15000, 85000])
  .range([ height, 0])
)}

function _yAxis(SVG,margin,d3,y){return(
SVG.append("g")
  .attr("transform", "translate("+(margin.left+10)+",0 )")
  .call(d3.axisLeft(y))
)}

function _updateChart(d3,x,y,xAxis,yAxis){return(
function updateChart() {
    if (d3.event != null) {
      console.log(" yes in the zoom event", d3.event)
      var newX = d3.event.transform.rescaleX(x);
      var newY = d3.event.transform.rescaleY(y);
      xAxis.call(d3.axisBottom(newX))
      yAxis.call(d3.axisLeft(newY))
      d3.selectAll("circle").remove();
    }
    return {
      "x" : newX,
      "y" : newY
    }  
}
)}

function _colorVals(){return(
['(70, 130, 180)',
 '(0, 0, 0)',
 '(107, 142, 35)',
 '(153, 153, 153)',
 '(70, 70, 70)',
 '(250, 170, 30)',
 '(220, 220, 0)',
 '(0, 60, 100)',
 '(102, 102, 156)',
 '(0, 0, 70)',
 '(0, 0, 142)',
 '(152, 251, 152)',
 '(220, 20, 60)',
 '(244, 35, 232)',
 '(128, 64, 128)',
 '(190, 153, 153)']
)}

function _render_data(color_rgb_dict,selectedKey,colorDict,SVG,width,height,margin,x,y,opacity,d3,updateChart,gt_images,m1_images,m2_images){return(
(svg,  data) => {
  var rgbVal = color_rgb_dict[selectedKey]
  var color_hex = colorDict[selectedKey]['color']
  console.log(color_hex)
  SVG.selectAll(".dot").remove();
  var clip = SVG.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width-10)
      .attr("height",  height)
      .attr('transform', 'translate(' +(12) + ',' +0 + ')')
      .attr("x", margin.left)
      .attr("y", 0);

  // SVG.append("g")
  //   .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
  var scatter = SVG.append('g')
    .attr("clip-path", "url(#clip)");  
   
  //scatter.append('g')
  scatter.selectAll(".dot")
    //svg.append("g")
     // .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) {  
      var xval = x(JSON.parse(String(d["IOU Values"]))[rgbVal]);
       if (xval != undefined) {
              return x(JSON.parse(String(d["IOU Values"]))[rgbVal]);
       } else {
         return x(-1);
         console.log(" in xval undefined");
       }       
    })
    .attr("cy", function (d) { 
      var yval = y((JSON.parse(String(d["GTP_Pixel Values"])))[rgbVal]);
      if (yval != undefined){
        return y((JSON.parse(String(d["GTP_Pixel Values"])))[rgbVal]); 
      } else {
        return y(-15001);
         console.log(" in yval undefined");
       }  
      
    })
    .attr("r", 8)
    .style("fill",color_hex)
    .style("opacity", function (d){
      return opacity(d.type)
    })
      ;

  
  var isZoomed = false;
  
  var ax;
  var zoom = d3.zoom()
      .scaleExtent([.5, 20])  
      .extent([[0, 0], [width , height]])
      .on("zoom", function() {
        isZoomed = true;
        ax = updateChart();     
        SVG.append("g")
          .selectAll(".dot")
          .data(data)
          .join("circle")
          .attr("clip-path", "url(#clip)")
          .attr("cx", function (d) {

            if (ax['x'](JSON.parse(String(d["IOU Values"]))[rgbVal]) != undefined)
              return ax['x'](JSON.parse(String(d["IOU Values"]))[rgbVal]); 
            else {
              return ax['x'](-1);
            }
          } )
          .attr("cy", function (d) {   
            if (ax['y'](JSON.parse(String(d["GTP_Pixel Values"]))[rgbVal]) != undefined)
              return ax['y'](JSON.parse(String(d["GTP_Pixel Values"]))[rgbVal]); 
            else 
              return ax['y'](-15001);
          } )
          .attr("r", 8)
          .style("opacity", function (d){
      return opacity(d.type)
    })
          .style("fill",color_hex)
          .style("pointer-events", "all")
          .on("click", function(d){
              console.log(" inside the click ax", d);
            var index = Math.floor(Math.random() * gt_images.length);
        
        SVG.append("svg:image")
          //.attr("src")
           .attr("xlink:href", d =>gt_images[index])
         
      .attr("x" , 770)
      .attr("y", 100)
      .attr("width", 300)
      .attr("height", 400);

       
    console.log("type " + data.type)
        if (data.type == "ovseg") {
          SVG.append("svg:image")
          //.attr("src")
           .attr("xlink:href", d =>m1_images[index])
      .attr("x" , 770)
      .attr("y", 250)
      .attr("width", 300)
      .attr("height", 400);
        } else {
          SVG.append("svg:image")
          //.attr("src")
           .attr("xlink:href", d =>m2_images[index])
      .attr("x" , 770)
      .attr("y", 250)
      .attr("width", 300)
      .attr("height", 400);
        }
            })
   })
  
  SVG.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom)
  
  if (!isZoomed) {
    SVG.append("g")
      .selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("cx", function (d) { 
      
        if (JSON.parse(String(d["IOU Values"]))[rgbVal] != undefined)
          return x(JSON.parse(String(d["IOU Values"]))[rgbVal]); 
        else {
          return x(-1);
        }
      })
      .attr("cy", function (d) { 
        if (y(JSON.parse(String(d["GTP_Pixel Values"]))[rgbVal]) != undefined)
          return y(JSON.parse(String(d["GTP_Pixel Values"]))[rgbVal]); 
        else {
          return y(-15001)
        }
        
      } )
      .attr("r", 8)
      .style("opacity", function (d){
      return opacity(d.type)
    })
      .style("fill","none")
      .style("pointer-events", "all")
      .on("click", function(data){
         
        var index = Math.floor(Math.random() * gt_images.length);
        
        SVG.append("svg:image")
          //.attr("src")
           .attr("xlink:href", d =>gt_images[index])
         
      .attr("x" , 770)
      .attr("y", 100)
      .attr("width", 300)
      .attr("height", 400);

       
    console.log("type " + data.type)
        if (data.type == "ovseg") {
          SVG.append("svg:image")
          //.attr("src")
           .attr("xlink:href", d =>m1_images[index])
      .attr("x" , 770)
      .attr("y", 250)
      .attr("width", 300)
      .attr("height", 400);
        } else {
          SVG.append("svg:image")
          //.attr("src")
           .attr("xlink:href", d =>m2_images[index])
      .attr("x" , 770)
      .attr("y", 250)
      .attr("width", 300)
      .attr("height", 400);
        }
      //.text("rectttt");

      // SVG.append("g")
      // .append("rect")
      // .attr("x" , 610)
      // .attr("y", 540)
      // .attr("width", 200)
      // .attr("height", 200)
      // .text("rectttt");
        console.log(" inside the click", data)})
  } 

  var legend = ["ovseg-swinb", "cseg-swinb"];
  //legend
  svg.append("g")
    .selectAll("ellipse")
    .data(legend)
    .enter()
    .append("ellipse")
    .attr("cx", 770)
    .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    //.attr("r", 8)
     .attr("rx", 5)
     .attr("ry", 5)
    .style("fill",color_hex)
    .style("opacity", function (d){
      return opacity(d)});


  svg.selectAll("mylabels")
    .data(legend)
    .enter()
    .append("text")
    .attr("x", 780)
    .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")


  svg.append("g")   
    .append("text")
    .attr("font-size", "15px")
    .attr("x", 350)
    .attr("y", 570 ) 
    .text("IOU Value")
    //.style("alignment-baseline", "middle")  

   svg.append("g")
    //.attr("transform", "rotate(-90)")
    .append("text")
    .attr("font-size", "10px")
    .attr("transform", "rotate(-90)")
    .attr("x", -350)
    .attr("y", 6 ) // 100 is where the first dot appears. 25 is the distance between dots
    .text("No of pixels incorrectly predicted")
    .style("alignment-baseline", "middle") 

  
  return SVG.node();
}
)}

function _color_rgb_dict()
{
  return {'road': '(128, 64, 128)',
 'sidewalk': '(244, 35, 232)',
 'building': '(70, 70, 70)',
 'wall': '(102, 102, 156)',
 'fence': '(190, 153, 153)',
 'pole': '(153, 153, 153)',
 'traffic light': '(250, 170, 30)',
 'traffic sign': '(220, 220, 0)',
 'vegetation': '(107, 142, 35)',
 'terrain': '(152, 251, 152)',
 'sky': '(70, 130, 180)',
 'person': '(170, 20, 60)',
 'rider': '(255, 0, 0)',
 'car': '(0, 0, 110)',
 'truck': '(0, 0, 68)',
 'bus': '(0, 60, 100)',
 'train': '(0, 128, 100)',
 'motorcycle': '(0, 0, 232)',
 'bicycle': '(119, 11, 32)',
 'unlabeled': '(0, 0, 0)'}
}


function _colorDict()
{
  return {'road': {
          'color': '#804080'
          },
      'sidewalk': {
          'color': '#F423E8'
          },
      'building': {
          'color': '#464646'
          },
      'wall': {
          'color': '#66669C'
          },
      'fence': {
          'color': '#BE9999'
          },
      'pole': {
          'color': '#999999'
          },
      'traffic light': {
          'color': '#FAAA1E'
          },
      'traffic sign': {
          'color': '#DCDC00'
          },
      'vegetation': {
          'color': '#6B8E23'
          },
      'terrain': {
          'color': '#98FB98'
          },
      'sky': {
          'color': '#4682B4'
          },
      'person': {
          'color': '#AA143C'
          },
      'rider': {
          'color': '#FF0000'
          },
      'car': {
          'color': '#00006E'
          },
      'truck': {
          'color': '#000044'
          },
      'bus': {
          'color': '#003C64'
          },
      'train': {
          'color': '#008064'
          },
      'motorcycle': {
          'color': '#0000E8'
          },
      'bicycle': {
          'color': '#770B20'
          },
      'unlabeled': {
          'color': '#000000'
          }}
}


function _colorKey(color_rgb_dict)
{
  var keyVal = []
  for (var key in color_rgb_dict) {
    keyVal.push(key)
  }
  return keyVal
}


function _selectedKey(Inputs,colorKey){return(
Inputs.select(colorKey, {label: "category"})
)}

function _37(render_data,SVG,data){return(
render_data(SVG, data)
)}

function _38(data){return(
data
)}

function _39(md){return(
md`Image zooming
`
)}

function _40(pred){return(
pred.file("Pred/000010_10.png").url()
)}

function _41(pred){return(
pred.filenames
)}

function _42(groundTruth){return(
groundTruth.filenames
)}

function _img(){return(
"download.jpg"
)}

function _i(FileAttachment){return(
FileAttachment("download.jpg")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["download.jpg", {url: new URL("./files/9a8fba088e1ed769e0b542c3cedb39d9b4e8589dbb31ade6354eba430ecac272aa1fea5dcb6fc68e68099c6daedb8f00f9b836e3bf74d15ddd6cd13eedaa33b0.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["seg_000013_10.png", {url: new URL("./files/60c700a369f1cce8cceb95388d0cfc145bd91324768b9f345243154fc34df174d67ed6994efaa3e533aa3a680ab7b558f36a8f2157e13b97d9c6f3ea64015c52.png", import.meta.url), mimeType: "image/png", toString}],
    ["seg_000018_10.png", {url: new URL("./files/5d2180163c83f7dbc11f27bd1e2e2497b89a5813398c189663ba59a0331bde586c99ef92b1fb18d3144e1566579cc22e8185e45d953e057520490186b244f4a8.png", import.meta.url), mimeType: "image/png", toString}],
    ["seg_000021_10.png", {url: new URL("./files/a5aa8943e0b5f775aa1c0cdb4c4d8e6fc4793bf33c4e34abb86e47bc5c66d6c0f902de74725fcea950b12fc2e905716c15205a3ce52a8fd68f11c51a894e79ee.png", import.meta.url), mimeType: "image/png", toString}],
    ["seg_000022_10.png", {url: new URL("./files/39fc2a5a5d1e5d9eac8e63401b002e83c10882f5d10182dd05e22e697d435fe4c6ea35b0b2240410cea509b4b6fe27bb1dd42cc89c2619209fe1c87e7707ed23.png", import.meta.url), mimeType: "image/png", toString}],
    ["m1_000013_10.png", {url: new URL("./files/ac0e32a78c3e48a77c5e7f9428b4a744b66b956609a6168e3a0e6443b83302e88feae125bcb27c99309f877a18a0556e78849512f79dca59fa5e683492396e32.png", import.meta.url), mimeType: "image/png", toString}],
    ["m1_000022_10.png", {url: new URL("./files/33087b6926f05c99214337aa55d5bd8b64dd1a5a04429e72ba5a82288b11269a64975b1611f6872ac960fb8aabe4b9c2b753f28ac95fc3a0c8ea5f4f8ab1010a.png", import.meta.url), mimeType: "image/png", toString}],
    ["m1_000018_10.png", {url: new URL("./files/8b3d146506219a3be74f4067f95cc59de28b16a3a2dbde18692d79601478641f030dee89908ae4aa2fb08d27cea130b0febe04d13136a32fd38a2c24ddbd447b.png", import.meta.url), mimeType: "image/png", toString}],
    ["m1_000021_10.png", {url: new URL("./files/918ae3176b253b2db53b1d4085414dcfb41a5f4cd6dc8ea022b9292af89bf80009dbbd9f3b862f286b4f026e472afc9cc8ee1713dcf42a40c452dc5d7989956c.png", import.meta.url), mimeType: "image/png", toString}],
    ["000021_10.png", {url: new URL("./files/e96b69fdb1fe4b60d0ff87455cd3766414ffb929065b95c1f28810563c1fc7e622286ad5271884701d7263fca0967085e014c5dee671449720d5b394460b5976.png", import.meta.url), mimeType: "image/png", toString}],
    ["000022_10.png", {url: new URL("./files/e0588c72513ece9de76eaf7948b2baf30b126ccdb7da779b3f93304a790771d95eb485353d05fa08a4691d0eb0ca31223d19307c1e62b69b6354bd4861e7d117.png", import.meta.url), mimeType: "image/png", toString}],
    ["000013_10.png", {url: new URL("./files/2158d017f1692d61ccb9c5acd4f73afc3c35b058e5f6bfce2d7b320357fc153aa44502659c9700af9ca71d440abebdd3a389879f89f192e9f175419db473e20c.png", import.meta.url), mimeType: "image/png", toString}],
    ["000018_10.png", {url: new URL("./files/acceabbbbc9ee563c168bee997dbbd7517b1e864e03b0b5f14d4467e03491f1da99b03b047e83771141936347ed7dd6b125cd3362854e4585e85f0be58cd3f6b.png", import.meta.url), mimeType: "image/png", toString}],
    ["InfoVis - Input (1).csv", {url: new URL("./files/31f3b937086f4693d86188bc3722029045a08ba00e028a4c5febbce4e2858ce399ad93696f8de1e5e2c86c71516148a85f28a71880a5e8b50e920184085889c8.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("gt_image_1")).define("gt_image_1", ["FileAttachment"], _gt_image_1);
  main.variable(observer("gt_image_2")).define("gt_image_2", ["FileAttachment"], _gt_image_2);
  main.variable(observer("gt_image_3")).define("gt_image_3", ["FileAttachment"], _gt_image_3);
  main.variable(observer("gt_image_4")).define("gt_image_4", ["FileAttachment"], _gt_image_4);
  main.variable(observer("gt_images")).define("gt_images", ["gt_image_1","gt_image_2","gt_image_3","gt_image_4"], _gt_images);
  main.variable(observer("m1_image_1")).define("m1_image_1", ["FileAttachment"], _m1_image_1);
  main.variable(observer("m1_image_2")).define("m1_image_2", ["FileAttachment"], _m1_image_2);
  main.variable(observer("m1_image_3")).define("m1_image_3", ["FileAttachment"], _m1_image_3);
  main.variable(observer("m1_image_4")).define("m1_image_4", ["FileAttachment"], _m1_image_4);
  main.variable(observer("m1_images")).define("m1_images", ["m1_image_1","m1_image_2","m1_image_3","m1_image_4"], _m1_images);
  main.variable(observer("m2_images_1")).define("m2_images_1", ["FileAttachment"], _m2_images_1);
  main.variable(observer("m2_images_2")).define("m2_images_2", ["FileAttachment"], _m2_images_2);
  main.variable(observer("m2_images_3")).define("m2_images_3", ["FileAttachment"], _m2_images_3);
  main.variable(observer("m2_images_4")).define("m2_images_4", ["FileAttachment"], _m2_images_4);
  main.variable(observer("m2_images")).define("m2_images", ["m2_images_1","m2_images_2","m2_images_3","m2_images_4"], _m2_images);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("size")).define("size", _size);
  main.variable(observer("width")).define("width", ["size","margin"], _width);
  main.variable(observer("height")).define("height", ["size","margin"], _height);
  main.variable(observer("SVG")).define("SVG", ["selectedKey","d3","width","margin","height"], _SVG);
  main.variable(observer("x")).define("x", ["d3","width"], _x);
  main.variable(observer("xAxis")).define("xAxis", ["SVG","height","d3","x"], _xAxis);
  main.variable(observer("opacity")).define("opacity", ["d3"], _opacity);
  main.variable(observer("y")).define("y", ["d3","height"], _y);
  main.variable(observer("yAxis")).define("yAxis", ["SVG","margin","d3","y"], _yAxis);
  main.variable(observer("updateChart")).define("updateChart", ["d3","x","y","xAxis","yAxis"], _updateChart);
  main.variable(observer("colorVals")).define("colorVals", _colorVals);
  main.variable(observer("render_data")).define("render_data", ["color_rgb_dict","selectedKey","colorDict","SVG","width","height","margin","x","y","opacity","d3","updateChart","gt_images","m1_images","m2_images"], _render_data);
  main.variable(observer("color_rgb_dict")).define("color_rgb_dict", _color_rgb_dict);
  main.variable(observer("colorDict")).define("colorDict", _colorDict);
  main.variable(observer("colorKey")).define("colorKey", ["color_rgb_dict"], _colorKey);
  main.variable(observer("viewof selectedKey")).define("viewof selectedKey", ["Inputs","colorKey"], _selectedKey);
  main.variable(observer("selectedKey")).define("selectedKey", ["Generators", "viewof selectedKey"], (G, _) => G.input(_));
  main.variable(observer()).define(["render_data","SVG","data"], _37);
  main.variable(observer()).define(["data"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["pred"], _40);
  main.variable(observer()).define(["pred"], _41);
  main.variable(observer()).define(["groundTruth"], _42);
  main.variable(observer("img")).define("img", _img);
  main.variable(observer("i")).define("i", ["FileAttachment"], _i);
  return main;
}
