use crate::domain_models::book_unit::BookUnit;
use crate::domain_models::manuscript::Manuscript;
use serde_derive::{Deserialize, Serialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct Edition {
    #[serde(rename = "Id")]
    pub(crate) id: String,
    #[serde(rename = "Name")]
    pub(crate) name: String,
    #[serde(rename = "BookUnits")]
    pub(crate) book_units: Vec<BookUnit>,
    #[serde(rename = "Manuscripts")]
    pub(crate) manuscripts: Vec<Manuscript>,
}
