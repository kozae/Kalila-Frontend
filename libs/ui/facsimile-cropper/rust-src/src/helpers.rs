pub fn get_distance((x1, y1): (u32, u32), (x2, y2): (u32, u32)) -> u32 {
    let sum_of_powers = (u32::pow(x2 - x1, 2) + u32::pow(y2 - y1, 2)) as f64;
    sum_of_powers.sqrt().round() as u32
}

pub fn normalize_degrees(mut degrees: f64) -> f64 {
    degrees %= 360.0;
    if degrees < 0.0 {
        return degrees + 360.0;
    }
    degrees
}
