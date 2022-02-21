export class AngleHelper {
  static TwoPI = 2 * Math.PI;

  static normalizeRotationDeg(value: number) {
    if (value < 0) {
      return Math.round(360 + value);
    }
    if (value >= 360) {
      return Math.round(value - 360);
    }
    return Math.round(value);
  }

  static maxTwoRotations(value: number) {
    if (Math.abs(value) >= 720) {
      return 0;
    }
    return Math.round(value);
  }

  static normalizeRotationRad(value: number) {
    if (value < 0) {
      return AngleHelper.TwoPI + value;
    }
    if (value >= AngleHelper.TwoPI) {
      return value - AngleHelper.TwoPI;
    }
    return value;
  }

  static degToRad(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  static radToDeg(rad: number) {
    return Math.round(rad / (Math.PI / 180));
  }
}
