import { AngleHelper } from './angle.helper';
import { IPoint } from '@frontend/domain';

export class PointsHelper {
  static getMidpoint(p1: IPoint, p2: IPoint) {
    return { X: (p1.X + p2.X) / 2, Y: (p1.Y + p2.Y) / 2 };
  }

  static getDistance(p1: IPoint, p2: IPoint) {
    return Math.round(
      Math.sqrt(Math.pow(p2.X - p1.X, 2) + Math.pow(p2.Y - p1.Y, 2))
    );
  }

  static getAngle(p1: IPoint, p2: IPoint) {
    const changeInX = p2.X - p1.X,
      changeInY = p2.Y - p1.Y;
    return AngleHelper.normalizeRotationDeg(
      AngleHelper.radToDeg(Math.atan2(changeInY, changeInX))
    );
  }

  static atDistanceAndAngle(
    origin: IPoint,
    distance: number,
    angle: number
  ): IPoint {
    const angleInRad = AngleHelper.degToRad(angle);
    return {
      X: Math.round(origin.X + distance * Math.cos(angleInRad)),
      Y: Math.round(origin.Y + distance * Math.sin(angleInRad)),
    };
  }
}
