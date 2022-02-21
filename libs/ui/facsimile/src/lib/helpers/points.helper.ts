import { Point } from '../models';
import { AngleHelper } from './angle.helper';

export class PointsHelper {
  static getMidpoint(p1: Point, p2: Point) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }

  static getDistance(p1: Point, p2: Point) {
    return Math.round(
      Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    );
  }

  static getAngle(p1: Point, p2: Point) {
    const changeInX = p2.x - p1.x,
      changeInY = p2.y - p1.y;
    return AngleHelper.normalizeRotationDeg(
      AngleHelper.radToDeg(Math.atan2(changeInY, changeInX))
    );
  }

  static atDistanceAndAngle(
    origin: Point,
    distance: number,
    angle: number
  ): Point {
    const angleInRad = AngleHelper.degToRad(angle);
    return {
      x: Math.round(origin.x + distance * Math.cos(angleInRad)),
      y: Math.round(origin.y + distance * Math.sin(angleInRad)),
    };
  }
}
