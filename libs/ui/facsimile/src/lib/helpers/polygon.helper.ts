import { IPoint, Polygon } from '@frontend/domain';
import { RectDimensions } from '../models';
import { PointsHelper } from './points.helper';
import { fabric } from 'fabric';
import { sortBy } from 'lodash';

export class PolygonHelper {
  static getCenter(points: Polygon) {
    return PointsHelper.getMidpoint(points[0], points[2]);
  }

  static getDiagonal(p: Polygon) {
    PointsHelper.getDistance(p[0], p[2]);
  }

  static getWidthAndHeight(p: Polygon | IPoint[]) {
    return {
      Width: PointsHelper.getDistance(p[0], p[1]),
      Height: PointsHelper.getDistance(p[0], p[3]),
    };
  }

  static fromRect(
    { X, Y, Width, Height }: RectDimensions,
    rotation: number
  ): Polygon {
    const p1 = { X, Y },
      p2 = PointsHelper.atDistanceAndAngle(p1, Width, rotation),
      p3 = PointsHelper.atDistanceAndAngle(p2, Height, rotation + 90),
      p4 = PointsHelper.atDistanceAndAngle(p1, Height, rotation + 90);
    return [p1, p2, p3, p4];
  }

  static scale(
    p: Polygon | IPoint[],
    scale: (value: number) => number
  ): Polygon {
    return [
      { X: scale(p[0].X), Y: scale(p[0].Y) },
      { X: scale(p[1].X), Y: scale(p[1].Y) },
      { X: scale(p[2].X), Y: scale(p[2].Y) },
      { X: scale(p[3].X), Y: scale(p[3].Y) },
    ];
  }

  // order only for the calculation of clippath
  static orderPoints(p: Polygon | IPoint[]): Polygon {
    const xValues = p.map((_) => _.X),
      yValues = p.map((_) => _.Y),
      minX = Math.min(...xValues),
      maxX = Math.max(...xValues),
      minY = Math.min(...yValues),
      maxY = Math.max(...yValues);

    return [
      { X: minX, Y: minY },
      { X: maxX, Y: minY },
      { X: maxX, Y: maxY },
      { X: minX, Y: maxY },
    ];
  }

  static clipPolygonFromRect(
    rectWidth: number,
    rectHeight: number,
    p: Polygon
  ): fabric.IPoint[] {
    const xValues = p.map((_) => _.X),
      yValues = p.map((_) => _.Y),
      minX = Math.min(...xValues),
      maxX = Math.max(...xValues),
      minY = Math.min(...yValues),
      maxY = Math.max(...yValues);
    return [
      { x: 0, y: 0 },
      { x: 0, y: rectHeight },
      { x: minX, y: rectHeight },
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
      { x: minX, y: rectHeight },
      { x: rectWidth, y: rectHeight },
      { x: rectWidth, y: 0 },
    ];
  }

  static fromHTMLNode(node: SVGPolygonElement): Polygon {
    return [
      {
        X: node.points.getItem(0).x,
        Y: node.points.getItem(0).y,
      },
      {
        X: node.points.getItem(1).x,
        Y: node.points.getItem(1).y,
      },
      {
        X: node.points.getItem(2).x,
        Y: node.points.getItem(2).y,
      },
      {
        X: node.points.getItem(3).x,
        Y: node.points.getItem(3).y,
      },
    ];
  }
}
