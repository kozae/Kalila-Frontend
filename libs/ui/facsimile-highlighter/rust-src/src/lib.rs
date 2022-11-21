mod app;
mod browser;
mod engine;

use crate::app::models::FacsimileHighlighter;
use crate::engine::action_loop::ActionLoop;
use anyhow::Result;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn start() -> Result<(), JsValue> {
    console_error_panic_hook::set_once();
    browser::spawn_local(async move {
        let app = FacsimileHighlighter::new();
        ActionLoop::start(app)
            .await
            .expect("Could not start game loop");
    });
    Ok(())
}
