use crate::domain_models::book_unit::BookUnit;
use crate::domain_models::manuscript::{Manuscript, Unit};
use crate::edition_store::{EditionRowTitle, EditionStore};
use crate::helpers::format_order;
use itertools::Itertools;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
#[macro_use]
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )*
        ).into());
    }
}

#[wasm_bindgen]
impl EditionStore {
    pub fn build_row(&self, index: usize) -> EditionRowTitle {
        let bu = &self.edition.book_units[index];
        let title = bu.title.clone();
        EditionRowTitle {
            id: bu.id.clone(),
            display: format!(
                "{} ({}) {}",
                index,
                format_order(&bu.order, &bu.frame_tags),
                title
            ),
            order: bu.order.clone(),
            frame_tags: bu.frame_tags.clone(),
            title: bu.title.clone(),
            has_images: match &bu.depicting_images {
                Some(units) => units.len() != 0,
                None => false,
            },
            divider: bu.divider,
        }
    }

    pub fn get_row_index(&self, id: &str) -> Option<usize> {
        self.edition.book_units.iter().position(|bu| bu.id == id)
    }

    pub fn delete_row(mut self, idx: usize) -> EditionStore {
        self.edition.book_units.remove(idx);
        for manuscript in self.edition.manuscripts.iter_mut() {
            for row in manuscript.units[idx..].iter_mut() {
                match row {
                    Some(unit) => unit.order -= 1,
                    None => {}
                }
            }
            manuscript.units.remove(idx);
        }
        self
    }

    pub fn insert_row(mut self, update: JsValue) -> EditionStore {
        if let Ok(new_bu) = update.into_serde::<BookUnit>() {
            match self
                .edition
                .book_units
                .binary_search_by(|bu| bu.order.partial_cmp(&new_bu.order).unwrap())
            {
                Ok(_) => {}
                Err(idx) => {
                    self.edition.book_units.insert(idx, new_bu);
                    for manuscript in self.edition.manuscripts.iter_mut() {
                        for row in manuscript.units[idx..].iter_mut() {
                            match row {
                                Some(unit) => unit.order += 1,
                                None => {}
                            }
                        }
                        manuscript.units.insert(idx, None);
                    }
                }
            }
        };
        self
    }

    pub fn replace_rows(mut self, update: JsValue) -> EditionStore {
        if let Ok(new_units) = update.into_serde::<Vec<BookUnit>>() {
            let mut manuscripts: Vec<Manuscript> = vec![];
            for (manuscript_idx, manuscript) in self.edition.manuscripts.iter().enumerate() {
                manuscripts.push(manuscript.clone());
                manuscripts[manuscript_idx].units = vec![None; new_units.len()];
                let ms_units_map: HashMap<String, Unit> = manuscript
                    .units
                    .iter()
                    .filter(|u| u.is_some())
                    .map(|u| {
                        let unit = u.clone().unwrap();
                        (unit.bu_id.clone(), unit)
                    })
                    .collect();
                let mut empty_unit_count: u16 = 0;
                for (unit_index, new_unit) in new_units.iter().enumerate() {
                    match ms_units_map.get(&new_unit.id) {
                        Some(u) => {
                            let mut unit = u.clone();
                            unit.order = u.occ as u16 + empty_unit_count;
                            manuscripts[manuscript_idx].units[unit_index] = Some(unit)
                        }
                        None => {
                            empty_unit_count += 1;
                        }
                    }
                }
            }

            self.edition.book_units = new_units;
            self.edition.manuscripts = manuscripts;
        } else {
            log!("parse failed");
        };
        self
    }
}

#[wasm_bindgen]
impl EditionRowTitle {
    pub fn get_display(&self) -> String {
        self.display.clone()
    }
    pub fn get_row_has_images(&self) -> bool {
        self.has_images
    }

    pub fn get_order(&self) -> Box<[u16]> {
        self.order.clone().into_boxed_slice()
    }
    pub fn get_is_divider(&self) -> bool {
        self.divider
    }

    pub fn update_row(self, index: usize, title: Option<String>, order: &[u16]) -> EditionRowTitle {
        let new_title = match title {
            Some(value) => value,
            None => self.title,
        };
        let new_order = match order.len() {
            0 => self.order,
            _ => order.to_vec(),
        };
        let order_display = format_order(&new_order, &self.frame_tags);
        EditionRowTitle {
            id: self.id,
            title: new_title.clone(),
            order: new_order,
            display: format!("{} ({}) {}", index, order_display, new_title),
            has_images: self.has_images,
            frame_tags: self.frame_tags,
            divider: self.divider,
        }
    }
}
