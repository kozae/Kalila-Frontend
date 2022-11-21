mod pipeline;
use crate::pipeline::GenerationPipeline;
use image::RgbImage;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_facsimile(w: u32, h: u32) -> String {
    RgbImage::create_image(w, h).draw_grid().encode_as_base64()
}
