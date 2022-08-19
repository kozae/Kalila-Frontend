use crate::domain_models::book_unit::BookUnit;
use crate::edition_store::{EditionRowTitle, EditionStore};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl EditionStore {
    pub fn build_row(&self, index: usize) -> EditionRowTitle {
        let bu = &self.edition.book_units[index];
        EditionRowTitle {
            display: format!("{} ({}) {}", index, bu.order, bu.title),
            order: bu.order,
            title: bu.title.clone(),
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
}

#[wasm_bindgen]
impl EditionRowTitle {
    pub fn get_display(&self) -> String {
        self.display.clone()
    }

    pub fn update_row(
        self,
        index: usize,
        title: Option<String>,
        order: Option<f64>,
    ) -> EditionRowTitle {
        let mut new_title = self.title;
        let mut new_order = self.order;
        match title {
            Some(value) => new_title = value,
            None => {}
        }
        match order {
            Some(value) => new_order = value,
            None => {}
        }
        EditionRowTitle {
            title: new_title.clone(),
            order: new_order,
            display: format!("{} ({}) {}", index, new_order, new_title),
        }
    }
}
