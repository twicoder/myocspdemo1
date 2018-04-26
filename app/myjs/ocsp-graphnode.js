ocspspace.Graph = (function(){
  var PREVIEW_NAME_LENGTH = 25;

  // default dimensions for each type of component
  var dimensions = {
    width: 310,
    height: 100
  };

  // ---------------------------------
  // processors currently on the graph
  // ---------------------------------

  var processorMap;

  // --------------------
  // component containers
  // --------------------

  var processorContainer;

  /**
   * Selects the processor elements against the current processor map.
   */
  var select = function () {
    return processorContainer.selectAll('g.processor').data(processorMap.values(), function (d) {
      return d.component.id;
    });
  };

  // renders the processors
  var renderProcessors = function (entered, selected) {
    if (entered.empty()) {
      return;
    }

    var processor = entered.append('g')
      .attr('id',function(d){
        return 'id-' + d.component.id;
      })
      .attr('class','processor component')
      .classed('selected', selected)
      .call(ocspspace.CanvasUtils.position);

    // processor border
    processor.append('rect')
      .attr({
        'class': 'border',
        'width': function (d) {
          return d.dimensions.width;
        },
        'height': function (d) {
          return d.dimensions.height;
        },
        'fill': 'transparent',
        'stroke-opacity': 0.8,
        'stroke-width': 1
      });

    // processor body
    processor.append('rect')
      .attr('class','body')
      .attr('width',function(d){
        return d.dimensions.width;
      })
      .attr('height',function(d){
        return d.dimensions.height;
      })
      .attr('fill-opacity',0.8)
      .attr('stroke-opacity',0.8)
      .attr('stroke-width',0);

    // processor name
    processor.append('text')
      .attr('x',25)
      .attr('y',18)
      .attr('width',220)
      .attr('height',16)
      .attr('font-size','10pt')
      .attr('font-weight','bold')
      .attr('fill','black')
      .attr('class','processor-name');


    // processor icon
    processor.append('image')
      .call(ocspspace.CanvasUtils.disableImageHref)
      .attr('xlink:href','images/iconProcessor.png')
      .attr('width',28)
      .attr('height',26)
      .attr('x',276)
      .attr('y',5);



    // processor stats preview
    processor.append('image')
      .call(ocspspace.CanvasUtils.disableImageHref)
      .attr('xlink:href','images/bgProcessorStatArea.png')
      .attr('width',294)
      .attr('height',58)
      .attr('x',8)
      .attr('y',35)
      .attr('class','processor-stats-preview');


    // make processors selectable
    processor.call(ocspspace.Selectable.activate).call(ocspspace.ContextMenu.activate);
    //
    // // only activate dragging and connecting if appropriate
    // if (nf.Common.isDFM()) {
    //   processor.call(nf.Draggable.activate).call(nf.Connectable.activate);
    // }

    processor.call(ocspspace.Draggable.activate);//.call(ocspspace.Connectable.activate);


    // call update to trigger some rendering
    // processor.call(updateProcessors);
  };




  return {

    /**
     * Initializes of the Processor handler.
     */
    init: function () {
      processorMap = d3.map();

      // create the processor container
      processorContainer = d3.select('#canvas').append('g')
        .attr('pointer-events','all')
        .attr('class','processors');

    },

    add: function (processors, selectAll) {

      selectAll = !(typeof selectAll === 'undefined' || selectAll === null) ? selectAll : false;

      var add = function (processor) {
        // add the processor
        processorMap.set(processor.id, {
          type: 'Processor',
          component: processor,
          dimensions: dimensions
        });
      };

      // determine how to handle the specified processor
      if ($.isArray(processors)) {
        $.each(processors, function (_, processor) {
          add(processor);
        });
      } else {
        add(processors);
      }

      // apply the selection and handle all new processors
      select().enter().call(renderProcessors, selectAll);
    },


    getNode:function(posX,posY,currentNodeType){
      return {
        'id':'nodeid-'+new Date().getTime(),
        'position':{
          'x':posX,
          'y':posY,
          'nodetype':currentNodeType
        }
      }
    }

  }

}());