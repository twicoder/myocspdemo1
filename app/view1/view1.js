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

  // ocspspace.Canvas.init();
  // ocspspace.Graph.init();
  // ocspspace.Draggable.init();


  var currentNodeType = null;


  var canvasContainer = $('#canvas-container');
  var currentCanvasTop = canvasContainer[0].offsetTop;
  var currentCavansLeft = canvasContainer[0].offsetLeft;


  var processorMap = d3.map();
  var svg = d3.select('#canvas-container').append('svg')
    .on('contextmenu', function () {
      // // reset the canvas click flag
      // canvasClicked = false;
      //
      // // since the context menu event propagated back to the canvas, clear the selection
      // nf.CanvasUtils.getSelection().classed('selected', false);
      //
      // // show the context menu on the canvas
      // nf.ContextMenu.show();
      //
      // // prevent default browser behavior
      // d3.event.preventDefault();
    })
    .attr('width','100%')
    .attr('height','600px');


  // create the canvas element
  canvas = svg.append('g')
    .attr('transform','translate(' + TRANSLATE + ') scale(' + SCALE + ')')
    .attr('pointer-events','all')
    .attr('id','canvas');




  function dragCircleMove() {
    d3.select(this)
      .attr("cx", $(this).cx = d3.event.x)
      .attr("cy", $(this).cy = d3.event.y);
  }

  function dragSeocndMove(){
    d3.select(this)
      .attr('x',$(this).x = d3.event.x - 30)
      .attr('y',$(this).y = d3.event.y - 40);
  }

  function dragThirdMove(){
    d3.select(this)
      .attr('x',$(this).x = d3.event.x - 30)
      .attr('y',$(this).y = d3.event.y - 40);
  }

  var dragCircle = d3.drag().on("drag", dragCircleMove);
  var dragSecond = d3.drag().on("drag", dragSeocndMove);
  var dragThird = d3.drag().on("drag", dragThirdMove);


  function addNode(x,y){
    // console.log("Add one node with x=",x,"y=",y);
    var newNode = ocspspace.Graph.getNode(x,y,currentNodeType);
    processorMap.set(newNode.id,newNode.position);
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

  function drawNode(svg,nodeInfo){
    console.log('nodeInfo:');
    console.log(nodeInfo);

    console.log(nodeInfo.nodetype);

    if(nodeInfo.nodetype === "first"){
      svg.append("circle")
        .attr("cx", nodeInfo.x)
        .attr("cy", nodeInfo.y)
        .attr("r", 50)
        .attr('fill','#cc3311')
        .call(dragCircle)
        .append('text')
        .attr('x',10)
        .attr('y',10)
        .attr('width',50)
        .attr('height',30)
        .attr('font-size','8pt')
        .attr('fill','black')
        .text('Circle');

    } else if(nodeInfo.nodetype === "second") {
      svg.append('rect')
        .attr('x',nodeInfo.x-30)
        .attr('y',nodeInfo.y-40)
        .attr('width','60px')
        .attr('height','80px')
        .attr('fill','#aa00ee')
        .call(dragSecond);

    } else if(nodeInfo.nodetype === "third") {
      svg.append('rect')
        .attr('x',nodeInfo.x-30)
        .attr('y',nodeInfo.y-40)
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