'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope",function($scope) {
  var SCALE = 1;
  var TRANSLATE = [0, 0];
  var INCREMENT = 1.2;
  var MAX_SCALE = 8;
  var MIN_SCALE = 0.2;
  var MIN_SCALE_TO_RENDER = 0.6;

  var revisionPolling = false;
  var statusPolling = false;
  var groupId = 'root';
  var groupName = null;
  var parentGroupId = null;
  var secureSiteToSite = false;
  var clustered = false;

  var canvas = null;

  var canvasClicked = false;
  var panning = false;

  var currentNodeType = null;

  var canvasContainer = $('#canvas-container');
  var currentCanvasTop = canvasContainer[0].offsetTop;
  var currentCavansLeft = canvasContainer[0].offsetLeft;





  var svg = d3.select('#canvas-container').append('svg')
    .on('contextmenu', function () {
    })
    .attr('width','100%')
    .attr('height','600px');


  // create the canvas element
  canvas = svg.append('g')
    .attr('transform','translate(' + TRANSLATE + ') scale(' + SCALE + ')')
    .attr('pointer-events','all')
    .attr('id','canvas');



  var processorMap = d3.map();
  var allConnections = d3.map();
  var allCanvasLines = d3.map();



  function dragCircleMove() {
    var currObjId = $(this)[0].id;
    // processorMap.get(currObjId).position.cx = d3.event.x;
    // processorMap.get(currObjId).position.cy = d3.event.y;

    processorMap.set(currObjId, {
      'id':currObjId,
      'position':{
        'x':d3.event.x,
        'y':d3.event.y,
        'nodetype':processorMap.get(currObjId).position.nodetype
      }
    });

    d3.select(this)
      .attr("cx", $(this).cx = d3.event.x)
      .attr("cy", $(this).cy = d3.event.y);

    refreshLines();
  }

  function dragSeocndMove(){
    var currObjId = $(this)[0].id;

    console.log('dragSeocndMove:');
    console.log(currObjId);
    if(processorMap.get(currObjId)){
      console.log(processorMap.get(currObjId));
      console.log('======');

      processorMap.set(currObjId, {
        'id':currObjId,
        'position':{
          'x':d3.event.x - 30,
          'y':d3.event.y - 40,
          'nodetype':processorMap.get(currObjId).position.nodetype
        }
      });


      d3.select(this)
        .attr('x',$(this).x = d3.event.x - 30)
        .attr('y',$(this).y = d3.event.y - 40);

      refreshLines();
    }


  }

  function dragThirdMove(){
    var currObjId = $(this)[0].id;

    processorMap.set(currObjId, {
      'id':currObjId,
      'position':{
        'x':d3.event.x - 30,
        'y':d3.event.y - 40,
        'nodetype':processorMap.get(currObjId).position.nodetype
      }
    });


    d3.select(this)
      .attr('x',$(this).x = d3.event.x - 30)
      .attr('y',$(this).y = d3.event.y - 40);

    refreshLines();

  }

  var startNode = null;
  var endNode = null;

  var shouldDraw = false;
  var currentStartCenter = null;
  var currentEndCenter = null;
  var tmpMovingLine = null;

  function clickedOnGraphObj(graphObj){
    if(!startNode){
      startNode = graphObj;
    } else if(!endNode){
      endNode = graphObj;

      // In this case, we should delete the tmpMovingLine and update all lines info
      var connectionObj = {
        'id':"line-id-"+new Date().getTime(),
        'startid':startNode.id,
        'endid':endNode.id
      };

      allConnections.set(connectionObj.id, connectionObj);

      startNode = null;
      endNode = null;

      refreshLines();

    } else {
      console.log('Logic error....');
    }
  }

  function refreshLines(){

    console.log('refreshLines()...');
    allCanvasLines.each(function(oldLine){
      oldLine.remove();
    });

    allConnections.each(function(obj){
      console.log(obj);

      var currentObjLine = svg.append("line")
        .attr("x1",processorMap.get(obj.startid).position.x)
        .attr("y1",processorMap.get(obj.startid).position.y)
        .attr("x2",processorMap.get(obj.endid).position.x)
        .attr("y2",processorMap.get(obj.endid).position.y)
        .attr("stroke","red")
        .attr("stroke-width",2)
        .attr("marker-start","url(#arrow)")
        .attr("marker-end","url(#arrow)");

      allCanvasLines.set(obj.id,currentObjLine);

    });

  }



  var dragCircle = d3.drag().on("drag", dragCircleMove).on('end',function(){
    // console.log('dropped!');
    refreshLines();
  });
  var dragSecond = d3.drag().on("drag", dragSeocndMove);
  var dragThird = d3.drag().on("drag", dragThirdMove);


  function addNode(x,y){
    // console.log("Add one node with x=",x,"y=",y);
    var newNode = ocspspace.Graph.getNode(x,y,currentNodeType);
    processorMap.set(newNode.id,newNode);
    console.log('new added node:');
    console.log(newNode);
    drawNode(svg,processorMap.get(newNode.id));

    // ocspspace.Graph.add(newNode,false);
  }

  function printAllNodeInfo(){
    console.log('Now print all node info:');
    console.log(processorMap.keys());
    processorMap.keys().forEach(function(key){
      console.log('key=',key);
      console.log('postdata=',processorMap.get(key));
    });
  }

  function started(d){
    console.log('started....');
    console.log(d);
  }



  d3.select('#canvas-container').on('mousemove',function($event){

    if(shouldDraw){
      if(tmpMovingLine){
        tmpMovingLine.remove();
      }
      if(currentStartCenter){
        tmpMovingLine = svg.append("line")
          .attr("x1",currentStartCenter.x)
          .attr("y1",currentStartCenter.y)
          .attr("x2",d3.event.clientX - currentCavansLeft)
          .attr("y2",d3.event.clientY - currentCanvasTop)
          .attr("stroke","red")
          .attr("stroke-width",2)
          .attr("marker-start","url(#arrow)")
          .attr("marker-end","url(#arrow)");
      }


    }

  });

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

  function drawNode(svg,nodeInfo){
    console.log('nodeInfo:');
    console.log(nodeInfo);

    console.log(nodeInfo.position.nodetype);

    if(nodeInfo.position.nodetype === "task"){
      svg.append("circle")
        .attr('id',nodeInfo.id)
        .attr("cx", nodeInfo.position.x)
        .attr("cy", nodeInfo.position.y)
        .attr("r", 50)
        .attr('fill','#cc3311')
        .on('click',function(){
          clickedOnGraphObj(nodeInfo);
        })
        .call(dragCircle)
        .append('text')
        .attr('x',10)
        .attr('y',10)
        .attr('width',50)
        .attr('height',30)
        .attr('font-size','8pt')
        .attr('fill','black')
        .text('Circle')

    } else if(nodeInfo.position.nodetype === "input") {
      svg.append('rect')
        .attr('x',nodeInfo.position.x-30)
        .attr('y',nodeInfo.position.y-40)
        .attr('width','60px')
        .attr('height','80px')
        .attr('fill','#aa00ee')
        .on('click',function(){
          clickedOnGraphObj(nodeInfo);
        })
        .call(dragSecond);

    } else if(nodeInfo.position.nodetype === "label") {
      svg.append('rect')
        .attr('x',nodeInfo.position.x-30)
        .attr('y',nodeInfo.position.y-40)
        .attr('width','60px')
        .attr('height','80px')
        .attr('fill','#11bb22')
        .call(dragThird);

    }else if(nodeInfo.position.nodetype === "event") {
      svg.append('rect')
        .attr('x',nodeInfo.position.x-30)
        .attr('y',nodeInfo.position.y-40)
        .attr('width','60px')
        .attr('height','80px')
        .attr('fill','#11bb22')
        .call(dragThird);

    } else {
      console.log ("Error!! can't find nodetype information...");
    }

  }


  $scope.startCallback = function (event, ui) {
    currentNodeType = event.target.id;
  };


  $scope.dropCallback = function(event, ui){
    addNode(event.offsetX - currentCavansLeft, event.offsetY - currentCanvasTop);
    currentNodeType = null;
    // printAllNodeInfo();
  };




}]);