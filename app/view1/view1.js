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

  $scope.task = {
    'input':{
      'inputs':[]
    }
  };
  $scope.task.events = [];

  $scope.task.outputLabels = [{"id":6,"name":"Example","class_name":"com.asiainfo.ocsp.label.Example","properties":"{\"props\":[{\"pname\":\"a\",\"pvalue\":\"123\"}],\"labelItems\":[]}","owner":"ocspadmin","tick1":true}];
  $scope.streamName = null;
  $scope.enginetype = null;
  $scope.stream_description = null;
  $scope.datasourcecount = 5;


  $scope.inputDatasources = [{"id":1,"name":"Kafka data source","type":"kafka","status":1,"description":null,"properties":"[{\"pname\":\"zookeeper.connect\",\"pvalue\":\"10.1.241.59:2181\"},{\"pname\":\"metadata.broker.list\",\"pvalue\":\"10.1.241.57:6667\"}]"},{"id":4,"name":"t2","type":"kafka","status":2,"description":"test123","properties":"[{\"pname\":\"zookeeper.connect\",\"pvalue\":\"connection12\"},{\"pname\":\"metadata.broker.list\",\"pvalue\":\"brokerlist12\"}]"},{"id":5,"name":"111231","type":"kafka","status":2,"description":"test","properties":"[{\"pname\":\"zookeeper.connect\",\"pvalue\":\"tt123\"},{\"pname\":\"metadata.broker.list\",\"pvalue\":\"123123\"}]"}];
  $scope.datasource = null;


  $scope.addNewEvent = function (array) {
    if (array !== undefined) {
      array.push({
        status: 1,
        output: {},
        userFields: [],
        interval: 0,
        audit: {
          enableDate: "none",
          type: "always",
        },
        auditTypes: [
          { name: 'none', displayName: '重复：无' },
          { name: 'always', displayName: '重复：每批次' },
          { name: 'day', displayName: '重复：每天' },
          { name: 'week', displayName: '重复：每周' },
          { name: 'month', displayName: '重复：每月' }
        ]
      });
    }
  };


  $scope.add = function (array) {
    if (array !== undefined) {
      array.push({
        status: 1,
        output: {},
        userFields: []
      });
    }
  };

  $scope.addUserField = function (input) {
    if (input.userFields === undefined || input.userFields === null) {
      input.userFields = [];
    }
    input.userFields.push({
      pname: "",
      pvalue: ""
    });
  };

  $scope.addInputSource = function (inputsources) {
    if (!!inputsources) {
      if (inputsources.length < $scope.datasourcecount) {
        $scope.add(inputsources);
      } else {
        console.log('addInputSource error!');
        // Notification.error($filter('translate')('ocsp_web_streams_manage_exceedmaxinputsourcecount_part1') + ' ' + $scope.datasourcecount + ' ' + $filter('translate')('ocsp_web_streams_manage_exceedmaxinputsourcecount_part2'));
      }
    }
  };

  $scope.split = function (str) {
    let result = [];
    if (str !== undefined && str.length > 0) {
      let tmp = str.split(",");
      for (let i in tmp) {
        result.push(tmp[i].trim());
      }
    }
    return result;
  };

  $scope.generate = function (inputs, array) {
    let str = "";
    if (array !== undefined && array.length > 0) {
      let result = new Set();
      if (array[0].fields !== undefined && array[0].fields.trim() !== "") {
        result = new Set($scope.split(array[0].fields));
      }
      for (let i = 1; i < array.length; i++) {
        let tmp = new Set();
        if (array[i].fields !== undefined && array[i].fields.trim() !== "") {
          let splits = $scope.split(array[i].fields);
          for (let j in splits) {
            if (result.has(splits[j])) {
              tmp.add(splits[j]);
            }
          }
        }
        result = tmp;
      }
      let resultArray = [...result];
      if (resultArray.length > 0) {
        str = resultArray[0];
        for (let i = 1; i < resultArray.length; i++) {
          str += "," + resultArray[i];
        }
      }
    }
    inputs.fields = str;
  };

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

  //configureTask

  $scope.configureTask = function(funcDrawTaskNode){
    var modal = $uibModal.open({
      animation: true,
      ariaLabelledBy: "modal-title-bottom",
      ariaDescribedBy: "modal-body-bottom",
      templateUrl: "configureTask.html",
      size: "lg",
      backdrop: "static",
      scope: $scope,
      controller: [
        "$scope",
        function($scope) {
          $scope.closeModal = function() {
            modal.close();
          };

          $scope.saveNode = function(){
            if(funcDrawTaskNode){
              funcDrawTaskNode();
            }
            $scope.$parent.streamName = $scope.streamName;
            $scope.$parent.enginetype = $scope.enginetype;
            $scope.$parent.stream_description = $scope.stream_description;
            $scope.closeModal();
          };
        }
      ]
    });
  };


  $scope.configInput = function(funcDrawInputNode){
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

          $scope.saveNode = function(){
            if(funcDrawInputNode){
              funcDrawInputNode();
            }

            $scope.closeModal();
          }
        }
      ]
    });
  };

  $scope.configureLabel = function(funcDrawLabelNode){
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

          $scope.saveNode = function(){
            if(funcDrawLabelNode){
              funcDrawLabelNode();
            }

            $scope.closeModal();
          };
        }
      ]
    });
  };

  $scope.configureEvent = function (funcDrawEventlNode) {
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
        function ($scope) {
          $scope.item = {
            'name':null,
            'select_expr':null,
            'delim':null,
            'filter_expr':null,
            'interval':null,
            'output':{
              'uniqueKey':null,
              'datasource':null,
              'topic':null,
              'codisKeyPrefix':null
            }
          };


          $scope.closeModal = function () {
            modal.close();
          };

          $scope.saveNode = function () {
            if (funcDrawEventlNode) {
              funcDrawEventlNode();
              $scope.$parent.task.events.push($scope.item);
            }

            $scope.closeModal();
          };
        }
      ]
    });
  };

  $scope.preview = function (funcDrawEventlNode) {
    var modal = $uibModal.open({
      animation: true,
      ariaLabelledBy: "modal-title-bottom",
      ariaDescribedBy: "modal-body-bottom",
      templateUrl: "previewTaskDetails.html",
      size: "lg",
      backdrop: "static",
      scope: $scope,
      controller: [
        "$scope",
        function ($scope) {

          $scope.closeModal = function () {
            modal.close();
          };

          $scope.saveNode = function () {
            $scope.closeModal();
          };
        }
      ]
    });
  };




  $scope.getAllPossibleFields = function (fields, userFields) {
    let resultStr = fields;
    if (userFields !== undefined && userFields !== null) {
      userFields.forEach((x) => { resultStr += "," + x.pname; });
    }
    return resultStr;
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
      $scope.configureTask(function(){
        drawNode(svg,processorMap.get(newNode.id));
      });
    } else if(currentNodeType === 'input'){
      $scope.configInput(function(){
        drawNode(svg,processorMap.get(newNode.id));
      });
    } else if(currentNodeType ==='label') {
      $scope.configureLabel(function(){
        drawNode(svg,processorMap.get(newNode.id));
      });
    } else if(currentNodeType ==='event'){
      $scope.configureEvent(function(){
        drawNode(svg,processorMap.get(newNode.id));
      });
    } else {
      drawNode(svg,processorMap.get(newNode.id));
    }




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
          $scope.configureTask();
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