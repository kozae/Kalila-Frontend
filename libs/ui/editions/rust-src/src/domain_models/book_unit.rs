use serde_derive::{Serialize, Deserialize};

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BookUnit {
    #[serde(rename = "Id")]
    pub(crate) id: String,
    #[serde(rename = "Order")]
    pub(crate) order: f64,
    #[serde(rename = "Title")]
    pub(crate) title: String,
}
