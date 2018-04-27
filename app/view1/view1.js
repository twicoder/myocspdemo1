'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope","$uibModal",'$document',function($scope, $uibModal, $document) {
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

  $scope.startNodeId = null;
  $scope.endNodeId = null;

  var tmpMovingLine = null;

  $scope.drawStatus = null;


  $scope.doStuff = function(e){
    console.log('e',e);
    console.log('doStuff');
  };

  $document.bind("keypress", function(event) {
    console.log('event');
    console.log(event.keyCode);
    $scope.$apply(function (){
      if(event.keyCode == 32){
        $scope.drawStatus = null;
        if(tmpMovingLine){
          tmpMovingLine.remove();
          $scope.startNodeId = null;
          $scope.endNodeId = null;
        }

      }else {
        $scope.drawStatus = null;
        if(tmpMovingLine){
          tmpMovingLine.remove();
          $scope.startNodeId = null;
          $scope.endNodeId = null;
        }
      }
    })
  });

  $scope.demoModal = function(){
    var modal = $uibModal.open({
      animation: true,
      ariaLabelledBy: "modal-title-bottom",
      ariaDescribedBy: "modal-body-bottom",
      templateUrl: "stackedModal.html",
      size: "lg",
      backdrop: "static",
      scope: $scope,
      controller: [
        "$scope",
        function($scope) {
          $scope.closeModal = function() {
            modal.close();
          };
        }
      ]
    });
  };

  $scope.configInput = function(){
    var modal = $uibModal.open({
      animation: true,
      ariaLabelledBy: "modal-title-bottom",
      ariaDescribedBy: "modal-body-bottom",
      templateUrl: "configureInput.html",
      size: "lg",
      backdrop: "static",
      scope: $scope,
      controller: [
        "$scope",
        function($scope) {
          $scope.closeModal = function() {
            modal.close();
          };
        }
      ]
    });
  };

  $scope.configureLabel = function(){
    var modal = $uibModal.open({
      animation: true,
      ariaLabelledBy: "modal-title-bottom",
      ariaDescribedBy: "modal-body-bottom",
      templateUrl: "configureLabel.html",
      size: "lg",
      backdrop: "static",
      scope: $scope,
      controller: [
        "$scope",
        function($scope) {
          $scope.closeModal = function() {
            modal.close();
          };
        }
      ]
    });
  };

  $scope.configureEvent = function(){
    var modal = $uibModal.open({
      animation: true,
      ariaLabelledBy: "modal-title-bottom",
      ariaDescribedBy: "modal-body-bottom",
      templateUrl: "configureEvent.html",
      size: "lg",
      backdrop: "static",
      scope: $scope,
      controller: [
        "$scope",
        function($scope) {
          $scope.closeModal = function() {
            modal.close();
          };
        }
      ]
    });
  };





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
    console.log('$(this)');
    var currObjId = $(this)[0].id;

    console.log('dragSeocndMove:');
    console.log(currObjId);
    if(processorMap.get(currObjId)){
      console.log(processorMap.get(currObjId));
      console.log('======');

      processorMap.set(currObjId, {
        'id':currObjId,
        'position':{
          'x':d3.event.x,
          'y':d3.event.y,
          'nodetype':processorMap.get(currObjId).position.nodetype
        }
      });


      d3.select(this)
        .attr('x',$(this).x = d3.event.x - 40)
        .attr('y',$(this).y = d3.event.y - 40);

      refreshLines();
    }


  }

  function dragThirdMove(){
    var currObjId = $(this)[0].id;

    processorMap.set(currObjId, {
      'id':currObjId,
      'position':{
        'x':d3.event.x,
        'y':d3.event.y,
        'nodetype':processorMap.get(currObjId).position.nodetype
      }
    });


    d3.select(this)
      .attr('x',$(this).x = d3.event.x - 40)
      .attr('y',$(this).y = d3.event.y - 40);

    refreshLines();

  }



  function clickedOnGraphObj(graphObj){
    if(!$scope.startNodeId){
      $scope.startNodeId = graphObj.id;
      $scope.drawStatus = "drawTmpLine";
    } else if(!$scope.endNodeId){
      $scope.endNodeId = graphObj.id;

      // In this case, we should delete the tmpMovingLine and update all lines info
      if($scope.startNodeId !== $scope.endNodeId){
        var connectionObj = {
          'id':"line-id-"+new Date().getTime(),
          'startid':$scope.startNodeId,
          'endid':$scope.endNodeId
        };
        allConnections.set(connectionObj.id, connectionObj);
      } else {

      }




      $scope.startNodeId = null;
      $scope.endNodeId = null;
      $scope.drawStatus = "removeTmpLine";

      // before draw all official lines, remove the tmpline.
      if(tmpMovingLine){
        tmpMovingLine.remove();
      }

      $scope.drawStatus = null;

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
  var dragSecond = d3.drag().on("drag", dragSeocndMove).on('end',function(){
    refreshLines();
  });
  var dragThird = d3.drag().on("drag", dragThirdMove).on('end',function(){
    refreshLines();
  });


  function addNode(x,y){
    // console.log("Add one node with x=",x,"y=",y);
    var newNode = ocspspace.Graph.getNode(x,y,currentNodeType);
    processorMap.set(newNode.id,newNode);
    if(currentNodeType === 'task'){
      console.log('task node');
    }

    drawNode(svg,processorMap.get(newNode.id));


  }

  $scope.printNodes = function () {
    printAllNodeInfo();
  };


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

    if($scope.drawStatus === "drawTmpLine"){
      if(tmpMovingLine){
        tmpMovingLine.remove();
      }
      if($scope.startNodeId){
        tmpMovingLine = svg.append("line")
          .attr("x1",processorMap.get($scope.startNodeId).position.x)
          .attr("y1",processorMap.get($scope.startNodeId).position.y)
          .attr("x2",d3.event.clientX - currentCavansLeft)
          .attr("y2",d3.event.clientY - currentCanvasTop)
          .attr("stroke","red")
          .attr("stroke-width",2)
          .attr("marker-start","url(#arrow)")
          .attr("marker-end","url(#arrow)");
      }


    }

  });


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
        .attr('fill','#F7DABE')
        .on('mouseover',function(){
          if($scope.drawStatus === "drawTmpLine"){
            $scope.drawStatus = "stopped";
          }

        })
        .on('mouseout',function(){
          if(!$scope.endNodeId){
            if($scope.drawStatus === "stopped"){
              $scope.drawStatus = "drawTmpLine"
            }

          }
        })
        .on('click',function(){
          clickedOnGraphObj(nodeInfo);
        })
        .on('dblclick',function(){

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
        .attr('id',nodeInfo.id)
        .attr('x',nodeInfo.position.x-40)
        .attr('y',nodeInfo.position.y-40)
        .attr('width','80px')
        .attr('height','80px')
        .attr('fill','#6BBCBF')
        .on('mouseover',function(){
          if($scope.drawStatus === "drawTmpLine"){
            $scope.drawStatus = "stopped";
          }
        })
        .on('mouseout',function(){
          // 如果离开该图片的时候，endNode被设置为空，意味着tmpLine不需要进行绘制了
          if(!$scope.endNodeId){
            if($scope.drawStatus === "stopped"){
              $scope.drawStatus = "drawTmpLine"
            }

          }
        })
        .on('click',function(){
          clickedOnGraphObj(nodeInfo);
        })
        .on('dblclick',function(){
          $scope.configInput();
        })
        .call(dragSecond);

    } else if(nodeInfo.position.nodetype === "label") {
      svg.append('rect')
        .attr('id',nodeInfo.id)
        .attr('x',nodeInfo.position.x-40)
        .attr('y',nodeInfo.position.y-40)
        .attr('width','80px')
        .attr('height','80px')
        .attr('fill','#DD7474')
        .on('mouseover',function(){
          if($scope.drawStatus === "drawTmpLine"){
            $scope.drawStatus = "stopped";
          }
        })
        .on('mouseout',function(){
          if(!$scope.endNodeId){
            if($scope.drawStatus === "stopped"){
              $scope.drawStatus = "drawTmpLine"
            }

          }
        })
        .on('click',function(){
          clickedOnGraphObj(nodeInfo);
        })
        .on('dblclick',function(){
          $scope.configureLabel();
        })
        .call(dragThird);

    }else if(nodeInfo.position.nodetype === "event") {
      svg.append('rect')
        .attr('id',nodeInfo.id)
        .attr('x',nodeInfo.position.x-40)
        .attr('y',nodeInfo.position.y-40)
        .attr('width','80px')
        .attr('height','80px')
        .attr('fill','#49B2EA')
        .on('mouseover',function(){
          if($scope.drawStatus === "drawTmpLine"){
            $scope.drawStatus = "stopped";
          }
        })
        .on('mouseout',function(){
          if(!$scope.endNodeId){
            if($scope.drawStatus === "stopped"){
              $scope.drawStatus = "drawTmpLine"
            }

          }
        })
        .on('click',function(){
          clickedOnGraphObj(nodeInfo);
        })
        .on('dblclick',function(){
          $scope.configureEvent();
        })
        .call(dragThird);

    } else {
      console.log ("Error!! can't find nodetype information...");
    }

  }


  $scope.startCallback = function (event, ui) {
    currentNodeType = event.target.id;
    console.log('Current Node Type:');
    console.log(currentNodeType);
  };


  $scope.dropCallback = function(event, ui){
    // var shape = {
    //   'width':0,
    //   'height':0
    // }
    // if(currentNodeType!=='task'){
    //   shape.width = 60;
    //   shape.height = 80;
    // }
    addNode(event.offsetX - currentCavansLeft, event.offsetY - currentCanvasTop);
    currentNodeType = null;
    // printAllNodeInfo();
  };




}]);