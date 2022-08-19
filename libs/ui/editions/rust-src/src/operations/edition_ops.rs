use crate::domain_models::edition::Edition;
use crate::edition_store::EditionStore;
use itertools::Itertools;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
impl EditionStore {
    pub fn load(data: JsValue) -> Result<EditionStore, String> {
        match data.into_serde::<Edition>() {
            Ok(edition) => {
                let mut images = HashMap::new();
                let mut line_regions = HashMap::new();
                for manuscript in &edition.manuscripts {
                    for facsimile in &manuscript.facsimiles {
                        images.insert(
                            format!("{}_{}", &manuscript.siglum, &facsimile.page_number),
                            facsimile.url.clone().unwrap_or_else(|| String::from("")),
                        );
                        for line in &facsimile.lines {
                            if let Some(order) = line.order {
                                line_regions.insert(
                                    format!(
                                        "{}_{}_{}",
                                        &manuscript.siglum, &facsimile.page_number, order
                                    ),
                                    line.region.clone().into_boxed_slice(),
                                );
                            }
                        }
                    }
                }
                let store = EditionStore {
                    edition,
                    images,
                    line_regions,
                };
                Ok(store)
            }
            Err(err) => Err(err.to_string()),
        }
    }

    pub fn get_edition_id(&self) -> String {
        self.edition.id.clone()
    }

    pub fn get_name(&self) -> String {
        self.edition.name.clone()
    }

    pub fn get_id(&self) -> String {
        self.edition.id.clone()
    }

    pub fn get_no_manuscripts(&self) -> usize {
        self.edition.manuscripts.len()
    }

    pub fn get_ms_siglum(&self, idx: usize) -> String {
        self.edition.manuscripts[idx].siglum.clone()
    }

    pub fn get_ms_unit_presence_array(&self, idx: usize) -> Box<[i32]> {
        self.edition.manuscripts[idx]
            .units
            .iter()
            .map(|u| match u {
                Some(unit) => unit.order as i32,
                None => -1,
            })
            .collect_vec()
            .into_boxed_slice()
    }

    pub fn get_ms_sigla(&self) -> String {
        self.edition
            .manuscripts
            .iter()
            .map(|m| m.siglum.clone())
            .join(",")
    }
    pub fn get_no_rows(&self) -> usize {
        self.edition.book_units.len()
    }

    pub fn get_manuscript_idx(&self, id: String) -> Option<usize> {
        self.edition.manuscripts.iter().position(|m| m.id == id)
    }

    pub fn is_page_in_edition(&self, manuscript_idx: usize, page_number: u16) -> bool {
        let pages: HashSet<u16> = self.edition.manuscripts[manuscript_idx]
            .units
            .iter()
            .filter(|u| u.is_some())
            .flat_map(|u| u.clone().unwrap().pages)
            .collect();
        pages.contains(&page_number)
    }

    pub fn get_url(&self, key: String) -> Option<String> {
        self.images.get(&key).cloned()
    }

    pub fn get_line_region(&self, key: String) -> Option<Box<[u32]>> {
        self.line_regions.get(&key).cloned()
    }
}
