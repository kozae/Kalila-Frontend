use crate::domain_models::manuscript::Manuscript;
use itertools::Itertools;
use regex::Regex;
use std::collections::HashMap;

pub fn format_token_rev(token: String, state: &String) -> String {
    match state.as_ref() {
        "corrupt" => format!("{}†", token),
        "emended" => format!("{}*", token),
        "unintelligible" => format!("{}?", token),
        "lexical-error" => format!("{}!", token),
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
        "title" => format!("({})", token),
        "title_end" => format!("({}", token),
        "title_begin" => format!("{})", token),
        _ => token,
    }
}

pub fn format_token(token: String, state: &String) -> String {
    match state.as_ref() {
        "corrupt" => format!("†{}", token),
        "emended" => format!("*{}", token),
        "unintelligible" => format!("?{}", token),
        "lexical-error" => format!("!{}", token),
        "dittography" => format!("[{}]", token),
        "dittography_end" => format!("{}]", token),
        "dittography_begin" => format!("[{}", token),
        "cross-out" => format!("[[{}]]", token),
        "cross-out_end" => format!("{}]]", token),
        "cross-out_begin" => format!("[[{}", token),
        "suppletion" => format!("{{{}}}", token),
        "suppletion_end" => format!("{}}}", token),
        "suppletion_begin" => format!("{{{}", token),
        "added" => format!("<{}>", token),
        "added_end" => format!("{}>", token),
        "added_begin" => format!("<{}", token),
        "title" => format!("({})", token),
        "title_end" => format!("{})", token),
        "title_begin" => format!("({}", token),
        _ => token,
    }
}

pub fn format_order(frames: &[u16], tags: &Vec<String>) -> String {
    let tag_span = tags.len();
    if tag_span > 0 {
        format!(
            "{}.{}",
            tags.last().unwrap(),
            frames[tag_span..]
                .iter()
                .map(|d| format!("{}", d))
                .join(".")
        )
    } else {
        frames.iter().map(|d| format!("{}", d)).join(".")
    }
}

pub fn build_indexes(
    data: &[Manuscript],
) -> (
    HashMap<String, Vec<Box<[usize]>>>,
    Vec<Vec<Vec<String>>>,
    Box<[usize]>,
    Box<[usize]>,
    Box<[usize]>,
) {
    let re =
        Regex::new("[\u{064b}\u{064c}\u{064d}\u{064e}\u{064f}\u{0650}\u{0651}\u{0652}]+").unwrap();
    let strip_tashkeel = |word: &str| re.replace_all(word, "").to_string();
    let mut inverted_index: HashMap<String, Vec<Box<[usize]>>> = HashMap::new();
    let mut index: Vec<Vec<Vec<String>>> = vec![];
    let mut page_breaks: Vec<Box<[usize]>> = vec![];
    let mut symbols: Vec<Box<[usize]>> = vec![];
    let mut located_images: Vec<Box<[usize]>> = vec![];
    for (manuscript_index, manuscript) in data.iter().enumerate() {
        let mut manuscript_map: Vec<Vec<String>> = vec![];
        for (unit_index, unit) in manuscript.units.iter().enumerate() {
            let mut unit_map: Vec<String> = vec![];
            if let Some(unit_data) = unit {
                // located images
                let located_image_at_token = match &unit_data.located_image {
                    Some(image) => match &image.location {
                        Some(location) => unit_data.lines.iter().rposition(|v| v == &location[0]), // finding the last token in the same line as the image
                        None => None,
                    },
                    None => None,
                };
                if let Some(index) = located_image_at_token {
                    located_images.push(Box::new([unit_index, manuscript_index, index, index]))
                }
                for (token_index, lemma) in unit_data.lemmas.iter().enumerate() {
                    let word: String = strip_tashkeel(lemma);
                    // inverted_index
                    if let Some(row) = inverted_index.get_mut(&word) {
                        row.push(Box::new([unit_index, manuscript_index, token_index]))
                    } else {
                        inverted_index.insert(
                            word.clone(),
                            vec![Box::new([unit_index, manuscript_index, token_index])],
                        );
                    }
                    // index
                    unit_map.push(word);
                    // page breaks
                    if unit_data.breaks.contains(&token_index) {
                        page_breaks.push(Box::new([
                            unit_index,
                            manuscript_index,
                            token_index,
                            token_index,
                        ]))
                    }

                    // symbols
                    if let Some(state) = unit_data.states.get(token_index) {
                        if state != "sound" {
                            symbols.push(Box::new([
                                unit_index,
                                manuscript_index,
                                token_index,
                                token_index,
                            ]))
                        }
                    }
                }
            }
            manuscript_map.push(unit_map);
        }
        index.push(manuscript_map);
    }
    (
        inverted_index,
        index,
        page_breaks
            .iter()
            .flat_map(|v| v.clone().into_vec())
            .collect_vec()
            .into_boxed_slice(),
        symbols
            .iter()
            .flat_map(|v| v.clone().into_vec())
            .collect_vec()
            .into_boxed_slice(),
        located_images
            .iter()
            .flat_map(|v| v.clone().into_vec())
            .collect_vec()
            .into_boxed_slice(),
    )
}
