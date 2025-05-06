var width=670;
var height=590;
var sunburstcolorScale=d3.scaleOrdinal()
.domain(["vowels","consonants","punctuations"])
.range(["#5F9EA0","#0096FF","#CF9FFF"])

//var colorIndex=0;
function submitclicked(){
    //console.log("submit clicked");
    // treemapsvg.selectAll("*").remove();
    // sankeysvg.selectAll("*").remove();
    d3.select("#sunburst_svg").selectAll("*").remove();
    d3.select("#sankey_svg").selectAll("*").remove();
    var text=document.getElementById("wordbox").value.trim().toLowerCase();
    console.log(text);
   vowels={
    "a":0,
    "e":0,
    "i":0,
    "o":0,
    "u":0,
    "y":0
   }
   consonants={
    "b":0,
    "c":0,
    "d":0,
    "f":0,
    "g":0,
    "h":0,
    "j":0,
    "k":0,
    "l":0,
    "m":0,
    "n":0,
    "p":0,
    "q":0,
    "r":0,
    "s":0,
    "t":0,
    "v":0,
    "w":0,
    "x":0,
    "z":0
   }
   punctuations={
    ".":0,",":0,"!":0,"?":0,":":0,";":0
   }

   for (const char of text){
    if(char in vowels){
        vowels[char]+=1;
    }
    else if(char in consonants){
        consonants[char]+=1;
    }
    else if(char in punctuations){
        punctuations[char]+=1;
    }
   }
   //console.log(vowels);
   //console.log(consonants);
   //console.log(punctuations);
   var varray=[];
   var carray=[];
   var parray=[];
   for (var key in (vowels)){
   
    if(vowels[key]>0){
        varray.push({"name":key,"value":vowels[key]});
    }
   }
   for (var key in (consonants)){
    if(consonants[key]>0){
        carray.push({"name":key,"value":consonants[key]});
    }
   }
   for (var key in (punctuations)){
    if(punctuations[key]>0){
        parray.push({"name":key,"value":punctuations[key]});
    }
   }

   //console.log(varray);
   var data={name:"characters",children:[
   {name:"vowels",children:varray},{name:"consonants",children:carray},{name:"punctuations",children:parray}
]};
console.log(data.children[1].children)
//console.log(charsMap);
// var root=d3.hierarchy(data).sum(d=>d.value);
// console.log(root);
// treemap=d3.treemap()
// .size([width,height])
// .paddingInner(3);
// root=treemap(root)



// console.log(root);
// console.log(root.leaves());
drawsunburstchart(data,text)

}
function drawsunburstchart(data,text){
    var tooltip = d3.select("#sunburst_div")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("color","black")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("border-color","black")
    .style("padding", "10px")
    .html("I'm a tooltip");
      // Specify the chart’s dimensions.
      var width=670;
      var height=670;
  const radius = width / 6;

  // Create the color scale.
  var sunburstcolorScale=d3.scaleOrdinal()
.domain(["vowels","consonants","punctuations"])
.range(["#5F9EA0","#0096FF","#CF9FFF"])

  // Compute the layout.
  const hierarchy = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  const root = d3.partition()
      .size([2 * Math.PI, hierarchy.height + 1])
    (hierarchy);
  root.each(d => d.current = d);
console.log("hierarchy ",hierarchy)
console.log("root: ",root);
  // Create the arc generator.
  const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius)
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

  // Create the SVG container.
  const sunburst_svg = d3.select("#sunburst_svg")
  .style("padding","2px")
     .attr("viewBox", [-width / 2, -height / 2, width,height ])
      .style("font", "10px sans-serif");
//console.log("root.descendants: ",root.descendants().slice(1))
  // Append the arcs.
  const path = sunburst_svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      .attr("fill", d => { 
       // console.log("d.data.name",d.data.name);
       while (d.depth > 1) d = d.parent;
       return sunburstcolorScale(d.data.name); 
    })
     // .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")

      .attr("d", d => arc(d.current))
        .on("click",(e,d)=>drawsankeychart(d.data.name,text))
        .on("mouseover",function(e,d){
            return tooltip.style("visibility","visible")
            .html(`Character: ${d.data.name}<br>Count: ${d.data.value}`)
            .style("top",(e.pageY-75)+"px")
            .style("left",(e.pageX+8)+"px");
        })
            .on("mousemove",function(e){return tooltip.style("top",(e.pageY-75)+"px").style("left",(e.pageX+8)+"px");})
        .on("mouseout",function(){return tooltip.style("visibility","hidden");})
  // Make them clickable if they have children.
//   path.filter(d => d.children)
//       .style("cursor", "pointer")
//       .on("click", clicked);

//   const format = d3.format(",d");
//   path.append("title")
//       .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  const label = sunburst_svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name)
//   const parent = sunburst_svg.append("circle")
//       .datum(root)
//       .attr("r", radius)
//       .attr("fill", "none")
//       .attr("pointer-events", "all")
//       .on("click", clicked);


  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return sunburst_svg.node();
}

function drawsankeychart(character, text){
    d3.select("#sankey_svg").selectAll("*").remove();
   document.getElementById("flow_label").innerHTML="Character flow for '"+character+"'";
//console.log(character);
//console.log(text);
beforechar={}
afterchar={}
graph={nodes:[],links:[]}
//textarray=text.split(" ").join("").split("");
newtextarray=text.split("");
//console.log("type of textarray[0]",(textarray[0]));
var charsset=new Set(["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","?",".",",","!",":",";"]);
//console.log(charsset);
var vowelsset=new Set(["a","e","i","o","u","y"]);
var consonantsset=new Set(["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]);
var punctuationsset=new Set(["?",".",",","!",":",";"]);
// var newtextarray=[];
// for (var i=0;i< textarray.length;i++){
// if( charsset.has(textarray[i])){
//     newtextarray.push(textarray[i]);
// }
// }
//var newtextarray=textarray.filter((d)=> charsset.has(d));
console.log("newtextarray",newtextarray);
console.log("selected character",(character));
var textarraysize=newtextarray.length;
for (var i=0;i<textarraysize;i++){
    if(newtextarray[i]==character){
        if(i>0){
            if(charsset.has(newtextarray[i-1])){

          
            if(newtextarray[i-1] in beforechar){
                beforechar[newtextarray[i-1]]+=1;
            }
            else{
                beforechar[newtextarray[i-1]]=1;
            }
        }
        }
        if( i<textarraysize-1){
            if(charsset.has(newtextarray[i+1])){

            
            if(newtextarray[i+1] in afterchar){
                afterchar[newtextarray[i+1]]+=1;
            }
            else{
                afterchar[newtextarray[i+1]]=1;
            } 
        }
        }
    }
}

var nodes=[]
for(var key of Object.keys(beforechar)){
nodes.push(`left-${key}`);
}
nodes.push(character);
for(var key of Object.keys(afterchar)){
    nodes.push(`right-${key}`);
}
var id=0;
var map={};
for(var node of nodes){
    map[node]=id;
    graph.nodes.push({"node":id++,name:node});
    
}


for(var node of nodes){
    if(node.includes("left-")){
graph.links.push({source:map[node] ,target:map[character],value:beforechar[node.replace("left-","")]});
    }
    else if(node.includes("right-")){
        graph.links.push({source:map[character] ,target:map[node],value:afterchar[node.replace("right-","")]});
    }
}
console.log(graph);
var tooltip = d3.select("#sankey_div")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("color","black")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-color","black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html("I'm a tooltip");

var sankey_svg=d3.select("#sankey_svg")
.attr("width",width)
.attr("height",height)
.append("g")
.attr("transform","translate("+24+","+8+")");

var sankey=d3.sankey()
.nodeWidth(25)
.nodePadding(8)
.size([width-28,height-10])
// .nodes(graph.nodes)
// .links(graph.links)
var sankeygraph=sankey(graph);
console.log("sankeygraph",sankeygraph)
var link=sankey_svg.append("g")
.selectAll(".link")
.data(sankeygraph.links)
.enter()
.append("path")
.attr("d", d3.sankeyLinkHorizontal())
.style("stroke","#C0C0C0")
.style("stroke-width",function(d) {
    return d.width;})
.style("fill","none")

var node=sankey_svg.append("g")
.selectAll(".node")
.data(sankeygraph.nodes)
.enter()
.append("g")



node.append("rect")
.attr("x",function(d){return d.x0})
.attr("y",function(d){return d.y0})
.attr("height",function(d){return d.y1-d.y0;})
.attr("width",sankey.nodeWidth())
.style("fill",function(d){
    return d.color=sunburstcolorScale(vowelsset.has(d.name.replace("left-","").replace("right-",""))?"vowels":consonantsset.has(d.name.replace("left-","").replace("right-",""))?"consonants":"punctuations");
//return d.color="blue";
})
.style("stroke","black")
.attr("rx","4px")
.attr("ry","4px")
.on("mouseover",function(e,d){
    if(d.name.includes("left-")){
        tooltiptext="Character '"+d.name.replace("left-","")+"' flows into <br>character '"+character+"' "+d.value+" times.";
    }
    else if(d.name.includes("right-")){
        tooltiptext="Character '"+character+"' flows into <br>character'"+d.name.replace("right-","")+"' "+d.value+" times.";
    }
    else{
        tooltiptext="Character '"+character+"' appears "+d.value+" times.";
    }
    
    return tooltip.style("visibility","visible")
    .html(tooltiptext)
    .style("top",(e.pageY-75)+"px")
    .style("left",(e.pageX+8)+"px");
})
.on("mousemove",function(e,d){
return tooltip.style("top",(e.pageY-75)+"px").style("left",(e.pageX+8)+"px");
})
.on("mouseout",function(e,d){
    return tooltip.style("visibility","hidden");
})
.style("stroke-width","1px")

node.append("text")
.text(d=>d.name.replace("left-","").replace("right-",""))
.attr("text-anchor","end")
.attr("dy", ".35em")
.attr("x",function(d){return d.x0-6.5;})
.attr("y",function(d){return ((d.y1+ d.y0) / 2);})
.style("font-size","15.5px")

return sankey_svg;
}