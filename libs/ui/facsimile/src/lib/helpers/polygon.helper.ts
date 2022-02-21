import { HandlePosition, Point, Polygon, RegionDimensions } from '../models';
import { PointsHelper } from './points.helper';

export class PolygonHelper {
  static getCenter(points: Polygon) {
    return PointsHelper.getMidpoint(points[0], points[2]);
  }

  static getDiagonal(p: Polygon) {
    PointsHelper.getDistance(p[0], p[2]);
  }

  static getWidthAndHeight(p: Polygon) {
    return {
      Width: PointsHelper.getDistance(p[0], p[1]),
      Height: PointsHelper.getDistance(p[0], p[3]),
    };
  }

  static fromRegion(
    { x, y, width, height }: RegionDimensions,
    rotation: number
  ): Polygon {
    const p1 = { x: x, y: y },
      p2 = PointsHelper.atDistanceAndAngle(p1, width, rotation),
      p3 = PointsHelper.atDistanceAndAngle(p2, height, rotation + 90),
      p4 = PointsHelper.atDistanceAndAngle(p1, height, rotation + 90);
    return [p1, p2, p3, p4];
  }

  static calculateHandleCoordinates(
    p: Polygon,
    rotation: number,
    scale: (x: number) => number = (x) => x
  ): Record<HandlePosition, { cx: number; cy: number }> {
    const top = PointsHelper.getMidpoint(p[0], p[1]),
      bottom = PointsHelper.getMidpoint(p[2], p[3]),
      left = PointsHelper.getMidpoint(p[0], p[3]),
      right = PointsHelper.getMidpoint(p[1], p[2]),
      leftHandle = { cx: scale(left.x), cy: scale(left.y) },
      leftRotate = PointsHelper.atDistanceAndAngle(
        { x: leftHandle.cx, y: leftHandle.cy },
        15,
        rotation + 180
      ),
      rightHandle = { cx: scale(right.x), cy: scale(right.y) },
      rightRotate = PointsHelper.atDistanceAndAngle(
        { x: rightHandle.cx, y: rightHandle.cy },
        15,
        rotation
      ),
      rotationCenter = PointsHelper.getMidpoint(leftRotate, rightRotate),
      rotationDiameter = PointsHelper.getDistance(leftRotate, rightRotate),
      topRotate = PointsHelper.atDistanceAndAngle(
        rotationCenter,
        rotationDiameter / 2,
        rotation + 270
      ),
      bottomRotate = PointsHelper.atDistanceAndAngle(
        rotationCenter,
        rotationDiameter / 2,
        rotation + 90
      );

    return {
      top: { cx: scale(top.x), cy: scale(top.y) },
      topRotate: { cx: topRotate.x, cy: topRotate.y },
      bottom: { cx: scale(bottom.x), cy: scale(bottom.y) },
      bottomRotate: { cx: bottomRotate.x, cy: bottomRotate.y },
      left: leftHandle,
      leftRotate: { cx: leftRotate.x, cy: leftRotate.y },
      right: rightHandle,
      rightRotate: { cx: rightRotate.x, cy: rightRotate.y },
      topLeft: { cx: scale(p[0].x), cy: scale(p[0].y) },
      topRight: { cx: scale(p[1].x), cy: scale(p[1].y) },
      bottomRight: { cx: scale(p[2].x), cy: scale(p[2].y) },
      bottomLeft: { cx: scale(p[3].x), cy: scale(p[3].y) },
    };
  }

  static scale(p: Polygon, scale: (value: number) => number): Polygon {
    return [
      { x: scale(p[0].x), y: scale(p[0].y) },
      { x: scale(p[1].x), y: scale(p[1].y) },
      { x: scale(p[2].x), y: scale(p[2].y) },
      { x: scale(p[3].x), y: scale(p[3].y) },
    ];
  }

  static clipPolygonFromRect(
    rectWidth: number,
    rectHeight: number,
    p: Polygon
  ): Point[] {
    const xValues = p.map((_) => _.x),
      yValues = p.map((_) => _.y),
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
        x: node.points.getItem(0).x,
        y: node.points.getItem(0).y,
      },
      {
        x: node.points.getItem(1).x,
        y: node.points.getItem(1).y,
      },
      {
        x: node.points.getItem(2).x,
        y: node.points.getItem(2).y,
      },
      {
        x: node.points.getItem(3).x,
        y: node.points.getItem(3).y,
      },
    ];
  }
}
