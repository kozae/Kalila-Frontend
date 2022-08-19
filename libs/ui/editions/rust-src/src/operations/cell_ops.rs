use crate::domain_models::manuscript::Unit;
use crate::edition_store::{EditionCellData, EditionStore};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl EditionStore {
    pub fn build_cell(&self, unit_idx: usize, manuscript_idx: usize) -> EditionCellData {
        match &self.edition.manuscripts[manuscript_idx].units[unit_idx] {
            Some(unit) => EditionCellData {
                unit_idx: Some(unit_idx),
                manuscript_idx,
                manuscript_siglum: self.edition.manuscripts[manuscript_idx].siglum.clone(),
                unit_order: unit.order,
                tokens: unit.tokens.clone(),
                states: unit.states.clone(),
                pages: unit.pages.clone(),
                lines: unit.lines.clone(),
            },
            None => EditionCellData {
                unit_idx: Some(unit_idx),
                manuscript_idx,
                manuscript_siglum: self.edition.manuscripts[manuscript_idx].siglum.clone(),
                unit_order: unit_idx as u16,
                tokens: vec![],
                states: vec![],
                pages: vec![],
                lines: vec![],
            },
        }
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
    pub fn get_token_count(&self) -> usize {
        self.tokens.len()
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
    pub fn get_state(&self, idx: usize) -> String {
        self.states[idx].clone()
    }
    pub fn get_page(&self, idx: usize) -> u16 {
        self.pages[idx]
    }
    pub fn get_line(&self, idx: usize) -> u8 {
        self.lines[idx]
    }
    pub fn get_token(&self, idx: usize) -> String {
        let token = self.tokens[idx].clone();
        match self.states[idx].as_ref() {
            "corrupt" => format!("{}†", token),
            "emended" => format!("{}*", token),
            "unintelligible" => format!("{}?", token),
            "dittography" => format!("[{}]", token),
            "dittography_end" => format!("[{}", token),
            "dittography_begin" => format!("{}]", token),
            "cross-out" => format!("[[{}]]", token),
            "cross-out_end" => format!("[[{}", token),
            "cross-out_begin" => format!("{}]]", token),
            "suppletion" => format!("{{{}}}", token),
            "suppletion_end" => format!("{{{}", token),
            "suppletion_begin" => format!("{}}}", token),
            "added" => format!("<{}>", token),
            "added_end" => format!("<{}", token),
            "added_begin" => format!("{}>", token),
            _ => token,
        }
    }

    pub fn get_unit(update: JsValue) -> Result<String, String> {
        match update.into_serde::<Unit>() {
            Ok(u) => Ok(String::from("Ok")),
            Err(e) => Err(e.to_string()),
        }
    }
}
