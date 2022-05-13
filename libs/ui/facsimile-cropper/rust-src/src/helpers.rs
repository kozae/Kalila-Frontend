pub fn get_distance((x1, y1): (u32, u32), (x2, y2): (u32, u32)) -> u32 {
    let sum_of_powers = (u32::pow(x2 - x1, 2) + u32::pow(y2 - y1, 2)) as f64;
    sum_of_powers.sqrt().round() as u32
}

pub trait Normalization<T> {
    fn normalize_degrees(self) -> T;
    fn normalize_and_convert_to_radians(self) -> T;
}

impl Normalization<f64> for f64 {
    fn normalize_degrees(mut self) -> f64 {
        self %= 360.0;
        if self < 0.0 {
            return self + 360.0;
        }
        self
    }

    fn normalize_and_convert_to_radians(self) -> f64 {
        self.normalize_degrees().to_radians()
    }
}
