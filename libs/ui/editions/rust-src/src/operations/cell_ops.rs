use std::collections::HashMap;

use crate::domain_models::manuscript::Unit;
use crate::edition_store::{EditionCellData, EditionStore, Line};
use crate::helpers::format_token;
use itertools::Itertools;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl EditionStore {
    pub fn build_cell(&self, unit_idx: usize, manuscript_idx: usize) -> EditionCellData {
        match &self.edition.manuscripts[manuscript_idx].units[unit_idx] {
            Some(unit) => {
                let mut map: HashMap<u8, Line> = HashMap::new();
                for i in 0..unit.tokens.len() {
                    let entry = map.entry(unit.lines[i]).or_insert(Line {
                        number: unit.lines[i],
                        token_indexes: vec![],
                        tokens: vec![],
                        page: unit.pages[i],
                        is_first_line: unit.lines[i] == 0,
                    });
                    entry.token_indexes.push(i);
                    entry.tokens.push(JsValue::from_str(&format_token(
                        unit.tokens[i].clone(),
                        &unit.states[i],
                    )))
                }
                let mut lines = map.into_values().collect_vec();
                lines.sort_unstable_by_key(|item| (item.page, item.number));
                EditionCellData {
                    unit_idx: Some(unit_idx),
                    manuscript_idx,
                    manuscript_siglum: self.edition.manuscripts[manuscript_idx].siglum.clone(),
                    unit_order: unit.order,
                    lines,
                    located_image_at_token: match &unit.located_image {
                        Some(image) => match &image.location {
                            Some(location) => unit.lines.iter().rposition(|v| v == &location[0]), // finding the last token in the same line as the image
                            None => None,
                        },
                        None => None,
                    },
                    page_range: vec![
                        unit.pages[0],
                        unit.lines[0] as u16,
                        unit.pages[unit.pages.len() - 1],
                        unit.lines[unit.lines.len() - 1] as u16,
                    ],
                }
            }
            None => EditionCellData {
                unit_idx: Some(unit_idx),
                manuscript_idx,
                manuscript_siglum: self.edition.manuscripts[manuscript_idx].siglum.clone(),
                unit_order: unit_idx as u16,
                lines: vec![],
                located_image_at_token: None,
                page_range: vec![],
            },
        }
    }

    pub fn update_ms_lacunae(mut self, manuscript_idx: usize, lacunae: &[u32]) -> EditionStore {
        self.edition.manuscripts[manuscript_idx].lacunae =
            lacunae.iter().map(|n| *n as usize).collect();
        self
    }

    pub fn update_cells(mut self, update: JsValue, manuscript_idx: usize) -> EditionStore {
        if let Ok(updates) = update.into_serde::<Vec<Option<Unit>>>() {
            for (idx, unit) in updates.iter().enumerate() {
                match unit {
                    None => self.edition.manuscripts[manuscript_idx].units[idx] = None,
                    Some(new_unit) => match &self.edition.manuscripts[manuscript_idx].units[idx] {
                        None => {
                            self.edition.manuscripts[manuscript_idx].units[idx] =
                                Some(new_unit.clone())
                        }
                        Some(old_unit) => {
                            self.edition.manuscripts[manuscript_idx].units[idx] =
                                Some(old_unit.update(new_unit));
                        }
                    },
                }
            }
        };
        self
    }
}

#[wasm_bindgen]
impl EditionCellData {
    pub fn get_located_image_location(&self) -> Option<usize> {
        self.located_image_at_token
    }
    pub fn get_unit_idx(&self) -> Option<usize> {
        self.unit_idx
    }
    pub fn get_manuscript_idx(&self) -> usize {
        self.manuscript_idx
    }
    pub fn get_manuscript_siglum(&self) -> String {
        self.manuscript_siglum.clone()
    }
    pub fn get_unit_order(&self) -> u16 {
        self.unit_order
    }

    pub fn get_page(&self, idx: usize) -> u16 {
        self.lines[idx].page
    }

    pub fn get_line_number(&self, idx: usize) -> u8 {
        self.lines[idx].number
    }

    pub fn get_lines(&self) -> Box<[usize]> {
        (0..self.lines.len()).collect_vec().into_boxed_slice()
    }

    pub fn get_tokens(&self, line_idx: usize) -> Box<[JsValue]> {
        self.lines[line_idx].tokens.clone().into_boxed_slice()
    }

    pub fn get_tokens_indexes(&self, line_idx: usize) -> Box<[usize]> {
        self.lines[line_idx]
            .token_indexes
            .clone()
            .into_boxed_slice()
    }

    pub fn get_page_range(&self) -> Box<[u16]> {
        self.page_range.clone().into_boxed_slice()
    }
    pub fn is_first_token(&self, line_idx: usize) -> bool {
        self.lines[line_idx].is_first_line
    }

    pub fn get_unit(update: JsValue) -> Result<String, String> {
        match update.into_serde::<Unit>() {
            Ok(u) => Ok(String::from("Ok")),
            Err(e) => Err(e.to_string()),
        }
    }
}
