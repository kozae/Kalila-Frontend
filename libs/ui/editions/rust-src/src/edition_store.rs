use crate::domain_models::edition::Edition;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct EditionCellData {
    pub(crate) unit_idx: Option<usize>,
    pub(crate) manuscript_idx: usize,
    pub(crate) manuscript_siglum: String,
    pub(crate) unit_order: u16,
    pub(crate) lines: Vec<Line>,
    pub(crate) located_image_at_token: Option<usize>,
    pub(crate) page_range: Vec<u16>,
}

pub(crate) struct Line {
    pub(crate) number: u8,
    pub(crate) page: u16,
    pub(crate) token_indexes: Vec<usize>,
    pub(crate) tokens: Vec<JsValue>,
    pub(crate) is_first_line: bool,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct EditionRowTitle {
    pub(crate) id: String,
    pub(crate) display: String,
    pub(crate) order: Vec<u16>,
    pub(crate) frame_tags: Vec<String>,
    pub(crate) title: String,
    pub(crate) has_images: bool,
    pub(crate) divider: bool,
}

#[wasm_bindgen]
pub struct EditionStore {
    pub(crate) edition: Edition,
    pub(crate) images: HashMap<String, String>,
    pub(crate) line_regions: HashMap<String, Box<[u32]>>,
    pub(crate) token_inverted_index: HashMap<String, Vec<Box<[usize]>>>,
    pub(crate) token_index: Vec<Vec<Vec<String>>>,
    pub(crate) word_list: Vec<String>,
    pub(crate) page_breaks: Box<[usize]>,
    pub(crate) located_images: Box<[usize]>,
    pub(crate) symbols: Box<[usize]>,
}
