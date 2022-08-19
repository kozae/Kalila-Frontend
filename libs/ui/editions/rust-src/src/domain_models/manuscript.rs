use serde_derive::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Manuscript {
    #[serde(rename = "Id")]
    pub(crate) id: String,
    #[serde(rename = "Siglum")]
    pub(crate) siglum: String,
    #[serde(rename = "Units")]
    pub(crate) units: Vec<Option<Unit>>,
    #[serde(rename = "Facsimiles")]
    pub(crate) facsimiles: Vec<Facsimile>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Unit {
    #[serde(rename = "Id")]
    pub(crate) id: String,
    #[serde(rename = "BuID")]
    pub(crate) bu_id: String,
    #[serde(rename = "Order")]
    pub(crate) order: u16,
    #[serde(rename = "Type")]
    pub(crate) type_field: String,
    #[serde(rename = "Tokens")]
    pub(crate) tokens: Vec<String>,
    #[serde(rename = "States")]
    pub(crate) states: Vec<String>,
    #[serde(rename = "Pages")]
    pub(crate) pages: Vec<u16>,
    #[serde(rename = "Lines")]
    pub(crate) lines: Vec<u8>,
    #[serde(rename = "DepictingImage")]
    pub(crate) depicting_image: Option<Image>,
    #[serde(rename = "LocatedImage")]
    pub(crate) located_image: Option<Image>,
}

impl Unit {
    pub(crate) fn update(&self, update: &Unit) -> Unit {
        Unit {
            id: self.id.clone(),
            bu_id: self.id.clone(),
            order: update.order,
            type_field: update.type_field.clone(),
            tokens: if update.tokens.len() == 0 {
                self.tokens.clone()
            } else {
                update.tokens.clone()
            },
            states: if update.states.len() == 0 {
                self.states.clone()
            } else {
                update.states.clone()
            },
            pages: if update.pages.len() == 0 {
                self.pages.clone()
            } else {
                update.pages.clone()
            },
            lines: if update.lines.len() == 0 {
                self.lines.clone()
            } else {
                update.lines.clone()
            },
            depicting_image: None,
            located_image: None,
        }
    }
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Facsimile {
    #[serde(rename = "PageNumber")]
    pub(crate) page_number: u16,
    #[serde(rename = "Url")]
    pub(crate) url: Option<String>,
    #[serde(rename = "Lines")]
    pub(crate) lines: Vec<Line>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Line {
    #[serde(rename = "Order")]
    pub(crate) order: Option<u8>,
    #[serde(rename = "Region")]
    pub(crate) region: Vec<u32>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Image {
    #[serde(rename = "Position")]
    pub(crate) position: Option<u8>,
    #[serde(rename = "PageNumber")]
    pub(crate) page_number: u16,
    #[serde(rename = "Legend")]
    pub(crate) legend: Option<String>,
    #[serde(rename = "Region")]
    pub(crate) region: Vec<u32>,
}
