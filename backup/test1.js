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



// allConnections.each(function(obj){
//
//   var currentObjLine = svg.append("line")
//     .attr("x1",processorMap.get(obj.startid).position.x)
//     .attr("y1",processorMap.get(obj.startid).position.y)
//     .attr("x2",processorMap.get(obj.endid).position.x)
//     .attr("y2",processorMap.get(obj.endid).position.y)
//     .attr("stroke","red")
//     .attr("stroke-width",2)
//     .attr("marker-start","url(#arrow)")
//     .attr("marker-end","url(#arrow)");
//
//   allCanvasLines.set(obj.id,currentObjLine);
//
// });


// d3.select('#canvas-container').on('mousemove',function($event){
//
//   if($scope.drawStatus === "drawTmpLine"){
//     if(tmpMovingLine){
//       tmpMovingLine.remove();
//     }
//     if($scope.startNodeId){
//       tmpMovingLine = svg.append("line")
//         .attr("x1",processorMap.get($scope.startNodeId).position.x)
//         .attr("y1",processorMap.get($scope.startNodeId).position.y)
//         .attr("x2",d3.event.clientX - currentCavansLeft)
//         .attr("y2",d3.event.clientY - currentCanvasTop)
//         .attr("stroke","red")
//         .attr("stroke-width",2)
//         .attr("marker-start","url(#arrow)")
//         .attr("marker-end","url(#arrow)");
//     }
//
//
//   }
//
// });



// .on('mouseover',function(){
//   if($scope.drawStatus === "drawTmpLine"){
//     $scope.drawStatus = "stopped";
//   }
//
// })
// .on('mouseout',function(){
//   if(!$scope.endNodeId){
//     if($scope.drawStatus === "stopped"){
//       $scope.drawStatus = "drawTmpLine"
//     }
//
//   }
// })
// .on('click',function(){
//   clickedOnGraphObj(nodeInfo);
// })



