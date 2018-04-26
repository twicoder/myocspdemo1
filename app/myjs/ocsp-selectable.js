ocspspace.Selectable = (function () {

  return {
    init: function () {

    },

    select: function (g) {
      // hide any context menus as necessary
      ocspspace.ContextMenu.hide();

      // only need to update selection if necessary
      if (!g.classed('selected')) {
        // since we're not appending, deselect everything else
        if (!d3.event.shiftKey) {
          d3.selectAll('g.selected').classed('selected', false);
        }

        // update the selection
        g.classed('selected', true);
      } else {
        // we are currently selected, if shift key the deselect
        if (d3.event.shiftKey) {
          g.classed('selected', false);
        }
      }

      // update the toolbar
      // nf.CanvasToolbar.refresh();

      // stop propagation
      d3.event.stopPropagation();
    },

    activate: function (components) {
      components.on('mousedown.selection', function () {
        // get the clicked component to update selection
        ocspspace.Selectable.select(d3.select(this));
      });
    }
  };
}());