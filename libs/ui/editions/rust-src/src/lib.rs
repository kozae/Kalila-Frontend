extern crate core;

mod domain_models;
pub mod edition_store;
mod helpers;
pub mod operations;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
