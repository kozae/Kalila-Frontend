use serde::Deserialize;
use std::collections::HashMap;
use web_sys::HtmlImageElement;

#[derive(Deserialize)]
pub struct SheetRect {
    pub(crate) x: i16,
    pub(crate) y: i16,
    pub(crate) w: i16,
    pub(crate) h: i16,
}
#[derive(Deserialize)]
pub struct Cell {
    pub(crate) frame: SheetRect,
}
#[derive(Deserialize)]
pub struct Sheet {
    pub(crate) frames: HashMap<String, Cell>,
}
pub struct FacsimileHighlighter {
    pub(crate) image: Option<HtmlImageElement>,
    pub(crate) sheet: Option<Sheet>,
    pub(crate) frame: u8,
}

impl FacsimileHighlighter {
    pub fn new() -> Self {
        FacsimileHighlighter {
            image: None,
            sheet: None,
            frame: 0,
        }
    }
}
