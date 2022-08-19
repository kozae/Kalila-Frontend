use crate::domain_models::edition::Edition;
use image::DynamicImage;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct EditionCellData {
    pub(crate) unit_idx: Option<usize>,
    pub(crate) manuscript_idx: usize,
    pub(crate) manuscript_siglum: String,
    pub(crate) unit_order: u16,
    pub(crate) tokens: Vec<String>,
    pub(crate) states: Vec<String>,
    pub(crate) pages: Vec<u16>,
    pub(crate) lines: Vec<u8>,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct EditionRowTitle {
    pub(crate) display: String,
    pub(crate) order: f64,
    pub(crate) title: String,
}

#[wasm_bindgen]
pub struct EditionStore {
    pub(crate) edition: Edition,
    pub(crate) images: HashMap<String, String>,
    pub(crate) line_regions: HashMap<String, Box<[u32]>>,
}
