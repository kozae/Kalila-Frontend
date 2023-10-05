use crate::domain_models::edition::Edition;
use crate::edition_store::EditionStore;
use crate::helpers::{build_indexes, format_token};
use itertools::Itertools;
use regex::Regex;
use std::collections::{HashMap, HashSet};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
impl EditionStore {
    pub fn load(data: JsValue) -> Result<EditionStore, String> {
        console_error_panic_hook::set_once();

        match serde_wasm_bindgen::from_value::<Edition>(data) {
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
                let (token_inverted_index, token_index, page_breaks, symbols, located_images) =
                    build_indexes(&edition.manuscripts);
                let word_list = token_inverted_index
                    .keys()
                    .into_iter()
                    .cloned()
                    .collect_vec();
                let store = EditionStore {
                    edition,
                    images,
                    line_regions,
                    token_inverted_index,
                    token_index,
                    word_list,
                    page_breaks,
                    symbols,
                    located_images,
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

    pub fn get_ms_id(&self, idx: usize) -> String {
        self.edition.manuscripts[idx].id.clone()
    }

    pub fn get_ms_unit_presence_array(&self, idx: usize) -> Box<[i32]> {
        self.edition.manuscripts[idx]
            .units
            .iter()
            .enumerate()
            .map(|(i, u)| match u {
                Some(unit) => unit.order as i32,
                None => {
                    if self.edition.manuscripts[idx].lacunae.contains(&i) {
                        -2
                    } else {
                        -1
                    }
                }
            })
            .collect_vec()
            .into_boxed_slice()
    }

    pub fn get_dividers(&self) -> Box<[usize]> {
        self.edition
            .book_units
            .iter()
            .enumerate()
            .filter(|(_, u)| u.divider)
            .map(|(i, _u)| i)
            .collect_vec()
            .into_boxed_slice()
    }

    pub fn get_ms_image_presence_array(&self, idx: usize) -> Box<[u8]> {
        self.edition
            .book_units
            .iter()
            .map(|u| match &u.depicting_images {
                Some(images) => match images[idx] {
                    Some(_) => 1,
                    None => 0,
                },
                None => 0,
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

    pub fn unit_is_in_edition(&self, id: String) -> bool {
        self.edition.book_units.iter().any(|bu| bu.id == id)
    }

    pub fn unit_is_in_range(&self, numeric_order: f64) -> bool {
        match self
            .edition
            .book_units
            .binary_search_by(|bu| bu.numeric_order.total_cmp(&numeric_order))
        {
            Ok(_) => true,
            Err(i) => {
                if i == 0 {
                    false
                } else {
                    i < self.edition.book_units.len()
                }
            }
        }
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

    pub fn is_unit_lacuna(&self, manuscript_idx: usize, unit_idx: usize) -> bool {
        self.edition.manuscripts[manuscript_idx]
            .lacunae
            .contains(&unit_idx)
    }

    pub fn get_url(&self, key: String) -> Option<String> {
        self.images.get(&key).cloned()
    }

    pub fn get_line_region(&self, key: String) -> Option<Box<[u32]>> {
        self.line_regions.get(&key).cloned()
    }

    pub fn get_image_region(&self, ms_idx: usize, unit_idx: usize) -> Option<Box<[u32]>> {
        match &self.edition.manuscripts[ms_idx].units[unit_idx] {
            Some(unit) => unit
                .located_image
                .as_ref()
                .map(|image| image.region.clone().into_boxed_slice()),
            None => None,
        }
    }

    pub fn get_image_legend_region(&self, ms_idx: usize, unit_idx: usize) -> Option<Box<[u32]>> {
        match &self.edition.manuscripts[ms_idx].units[unit_idx] {
            Some(unit) => unit
                .located_image
                .as_ref()
                .map(|image| {
                    image
                        .legend
                        .clone()
                        .map(|legend| legend.region.map(|region| region.into_boxed_slice()))
                        .unwrap_or_default()
                })
                .unwrap_or_default(),
            None => None,
        }
    }

    pub fn get_image_legend_page_number(&self, ms_idx: usize, unit_idx: usize) -> Option<i16> {
        match &self.edition.manuscripts[ms_idx].units[unit_idx] {
            Some(unit) => unit.located_image.as_ref().map(|image| {
                image
                    .legend
                    .clone()
                    .map(|legend| legend.page_number as i16)
                    .unwrap_or(-1)
            }),
            None => None,
        }
    }

    pub fn get_image_legend_token_count(&self, ms_idx: usize, unit_idx: usize) -> Option<usize> {
        match &self.edition.manuscripts[ms_idx].units[unit_idx] {
            Some(unit) => unit.located_image.as_ref().map(|image| {
                image
                    .legend
                    .clone()
                    .map(|legend| legend.tokens.len())
                    .unwrap_or(0)
            }),
            None => None,
        }
    }

    pub fn get_image_legend_token(
        &self,
        ms_idx: usize,
        unit_idx: usize,
        token_idx: usize,
    ) -> Option<String> {
        match &self.edition.manuscripts[ms_idx].units[unit_idx] {
            Some(unit) => unit.located_image.as_ref().map(|image| {
                image
                    .legend
                    .clone()
                    .map(|legend| {
                        format_token(legend.tokens[token_idx].clone(), &legend.states[token_idx])
                    })
                    .unwrap_or_default()
            }),
            None => None,
        }
    }

    pub fn get_unit_image_page_number(&self, ms_idx: usize, unit_idx: usize) -> Option<u16> {
        match &self.edition.book_units[unit_idx].depicting_images {
            Some(images) => images[ms_idx].as_ref().map(|image| image.page_number),
            None => None,
        }
    }

    pub fn get_unit_image_region(&self, ms_idx: usize, unit_idx: usize) -> Option<Box<[u32]>> {
        match &self.edition.book_units[unit_idx].depicting_images {
            Some(images) => images[ms_idx]
                .as_ref()
                .map(|image| image.region.clone().into_boxed_slice()),
            None => None,
        }
    }

    pub fn get_unit_image_legend_token_count(
        &self,
        ms_idx: usize,
        unit_idx: usize,
    ) -> Option<usize> {
        match &self.edition.book_units[unit_idx].depicting_images {
            Some(images) => match &images[ms_idx] {
                Some(image) => image.legend.as_ref().map(|legend| legend.tokens.len()),
                None => None,
            },
            None => None,
        }
    }

    pub fn get_unit_image_legend_token(
        &self,
        ms_idx: usize,
        unit_idx: usize,
        token_idx: usize,
    ) -> Option<String> {
        match &self.edition.book_units[unit_idx].depicting_images {
            Some(images) => match &images[ms_idx] {
                Some(image) => image.legend.clone().map(|legend| {
                    format_token(legend.tokens[token_idx].clone(), &legend.states[token_idx])
                }),
                None => None,
            },
            None => None,
        }
    }

    pub fn find_unit_by_order(&self, order: usize) -> Option<usize> {
        if order < self.edition.book_units.len() {
            Some(order)
        } else {
            None
        }
    }

    pub fn find_unit_by_title(&self, filter: String) -> Box<[i32]> {
        self.edition
            .book_units
            .iter()
            .enumerate()
            .flat_map(|(i, u)| {
                if u.title.to_lowercase().contains(&filter) {
                    [i as i32, -1, -1]
                } else {
                    [-2, -2, -2]
                }
            })
            .filter(|p| p != &-2)
            .collect()
    }

    pub fn get_page_breaks(&self) -> Box<[usize]> {
        self.page_breaks.clone()
    }

    pub fn get_symbols(&self) -> Box<[usize]> {
        self.symbols.clone()
    }

    pub fn get_located_images(&self) -> Box<[usize]> {
        self.located_images.clone()
    }

    pub fn find_words(&self, filter: String) -> Option<Box<[usize]>> {
        console_error_panic_hook::set_once();
        let re = Regex::new("[\u{064b}\u{064c}\u{064d}\u{064e}\u{064f}\u{0650}\u{0651}\u{0652}]+")
            .unwrap();
        let strip_tashkeel = |word: &str| re.replace_all(word, "").to_string();
        let stripped = strip_tashkeel(&filter);
        let word_seq = stripped.split(' ').collect_vec();
        let first_word_occurrences = self
            .word_list
            .iter()
            .filter(|w| w.eq(&word_seq[0]))
            .collect_vec();
        let mut results: Vec<Box<[usize]>> = vec![];
        for word in first_word_occurrences {
            if let Some(result) = self.token_inverted_index.get(word) {
                for occ in result {
                    let mut range_end = occ[2];
                    let unit_tokens = &self.token_index[occ[1]][occ[0]];
                    let mut pointer = 1;
                    let mut location = range_end + pointer;
                    let n_words = word_seq.len();
                    let n_unit_tokens = unit_tokens.len();
                    let mut valid = true;
                    while pointer < n_words {
                        if location > n_unit_tokens - 1 {
                            valid = false;
                            break;
                        }
                        let next_word = &unit_tokens[location];
                        if next_word.eq(word_seq[pointer]) {
                            range_end = location;
                            pointer += 1;
                            location = occ[2] + pointer;
                        } else {
                            valid = false;
                            break;
                        }
                    }
                    if valid {
                        results.push(Box::new([occ[0], occ[1], occ[2], range_end]))
                    }
                }
            }
        }
        Some(
            results
                .iter()
                .flat_map(|v| v.clone().into_vec())
                .collect_vec()
                .into_boxed_slice(),
        )
    }
}
