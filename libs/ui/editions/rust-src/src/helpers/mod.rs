use crate::domain_models::manuscript::Manuscript;
use regex::Regex;
use std::collections::HashMap;

pub fn format_token(token: String, state: &String) -> String {
    match state.as_ref() {
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

pub fn build_inverted_index(
    data: &[Manuscript],
) -> (HashMap<String, Vec<Box<[usize]>>>, Vec<Vec<Vec<String>>>) {
    let re =
        Regex::new("[\u{064b}\u{064c}\u{064d}\u{064e}\u{064f}\u{0650}\u{0651}\u{0652}]+").unwrap();
    let strip_tashkeel = |word: &str| re.replace_all(word, "").to_string();
    let mut inverted_index: HashMap<String, Vec<Box<[usize]>>> = HashMap::new();
    let mut index: Vec<Vec<Vec<String>>> = vec![];
    for (manuscript_index, manuscript) in data.iter().enumerate() {
        let mut manuscript_map: Vec<Vec<String>> = vec![];
        for (unit_index, unit) in manuscript.units.iter().enumerate() {
            let mut unit_map: Vec<String> = vec![];
            if let Some(unit_data) = unit {
                for (token_index, token) in unit_data.tokens.iter().enumerate() {
                    let word: String = strip_tashkeel(token);
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
                }
            }
            manuscript_map.push(unit_map);
        }
        index.push(manuscript_map);
    }
    (inverted_index, index)
}
