import { fabric } from 'fabric';
import { hexToRgba } from '@frontend/util';
import { PolygonHelper } from '../../helpers';

export function addTextToPolygons(
  canvas: fabric.Canvas,
  polygons: fabric.Polygon[],
  textGetter: (data: any) => string
) {
  polygons.forEach((p) => {
    const points = p.points as fabric.Point[];
    const center = PolygonHelper.getCenter(
      points.map(({ x, y }) => ({ X: x, Y: y }))
    );
    const renderStates = {
      normal: {
        fill: p.data.HighlightColor,
        stroke: '#000000',
        strokeWidth: 2,
      },
      hidden: {
        fill: undefined,
        stroke: undefined,
      },
      greyed: { fill: hexToRgba('#333333', 0.6), stroke: undefined },
    };
    canvas.add(
      new fabric.Text(textGetter(p.data), {
        ...renderStates.normal,
        originX: 'center',
        originY: 'center',
        left: center.X,
        top: center.Y,
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        selectable: false,
        hoverCursor: 'pointer',
        evented: false,
        data: renderStates,
      })
    );
  });
  canvas.renderAll();
}
