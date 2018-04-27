console.log(d3.event);
// console.log(d3.event.layerY);

// var line = svg.append("line")
//   .attr("x1",50)
//   .attr("y1",50)
//   .attr("x2",200)
//   .attr("y2",400)
//   .attr("stroke","red")
//   .attr("stroke-width",2)
//   .attr("marker-start","url(#arrow)")
//   .attr("marker-end","url(#arrow)")


//
// var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
// arrowMarker.append("path")
//   .attr("d",arrow_path)
//   .attr("fill","#000")
// //绘制直线
// var line = svg.append("line")
//   .attr("x1",50)
//   .attr("y1",50)
//   .attr("x2",200)
//   .attr("y2",400)
//   .attr("stroke","red")
//   .attr("stroke-width",2)
//   .attr("marker-start","url(#arrow)")
//   .attr("marker-end","url(#arrow)")



//添加defs标签
var defs = svg.append("defs");



//添加marker标签及其属性
var arrowMarker = defs.append("marker")
  .attr("id","arrow")
  .attr("markerUnits","strokeWidth")
  .attr("markerWidth",12)
  .attr("markerHeight",12)
  .attr("viewBox","0 0 12 12")
  .attr("refX",6)
  .attr("refY",6)
  .attr("orient","auto");



// shouldDraw = false;
// if(currentStartCenter && !currentEndCenter){
//   currentEndCenter = {
//     'x': nodeInfo.x,
//     'y': nodeInfo.y,
//     'type':'second'
//   };
//   shouldDraw = false;
// }
//
// drawFinalLine();


.on('mouseover',function(){
  console.log('mouseover...');
  shouldDraw = false;


})
  .on('mouseout',function(){

    if(!currentEndCenter){
      shouldDraw = true;
    }

  })



// function drawFinalLine(){
//   if(currentStartCenter && currentEndCenter){
//     if(tmpMovingLine){
//       tmpMovingLine.remove();
//     }
//
//     svg.append("line")
//       .attr("x1",currentStartCenter.x)
//       .attr("y1",currentStartCenter.y)
//       .attr("x2",currentEndCenter.x)
//       .attr("y2",currentEndCenter.y)
//       .attr("stroke","red")
//       .attr("stroke-width",2)
//       .attr("marker-start","url(#arrow)")
//       .attr("marker-end","url(#arrow)")
//
//   }
// }


