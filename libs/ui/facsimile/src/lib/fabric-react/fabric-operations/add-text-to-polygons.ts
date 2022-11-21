import { fabric } from 'fabric';
import { hexToRgba } from '@frontend/util';
import { PolygonHelper } from '../../helpers';
import { darken } from '@mui/system';

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
        fill: darken(p.data.HighlightColor, 0.5),
        textBackgroundColor: hexToRgba('#ffffff', 0.4),
      },
      hidden: {
        fill: undefined,
        textBackgroundColor: undefined,
      },
      greyed: {
        fill: hexToRgba('#333333', 0.6),
        textBackgroundColor: undefined,
      },
    };
    canvas.add(
      new fabric.Text(textGetter(p.data), {
        ...renderStates.normal,
        originX: 'center',
        originY: 'center',
        left: center.X,
        top: center.Y,
        fontSize: 20,
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
