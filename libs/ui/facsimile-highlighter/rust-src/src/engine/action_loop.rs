use crate::browser;
use crate::browser::LoopClosure;
use crate::engine::renderer::Renderer;
use anyhow::{anyhow, Result};
use async_trait::async_trait;
use std::cell::RefCell;
use std::rc::Rc;

#[async_trait(?Send)]
pub trait App {
    async fn initialize(&self) -> Result<Box<dyn App>>;
    fn update(&mut self);
    fn draw(&self, renderer: &Renderer);
}
const FRAME_SIZE: f32 = 1.0 / 60.0 * 1000.0;
pub struct ActionLoop {
    last_frame: f64,
    accumulated_delta: f32,
}
type SharedLoopClosure = Rc<RefCell<Option<LoopClosure>>>;

impl ActionLoop {
    pub async fn start(mut app: impl App + 'static) -> Result<()> {
        let mut app = app.initialize().await?;
        let mut action_loop = ActionLoop {
            last_frame: browser::now()?,
            accumulated_delta: 0.0,
        };
        let renderer = Renderer {
            context: browser::context()?,
        };
        let f: SharedLoopClosure = Rc::new(RefCell::new(None));
        let g = f.clone();
        *g.borrow_mut() = Some(browser::create_loop_closure(move |perf: f64| {
            action_loop.accumulated_delta += (perf - action_loop.last_frame) as f32;
            while action_loop.accumulated_delta > FRAME_SIZE {
                app.update();
                action_loop.accumulated_delta -= FRAME_SIZE;
            }
            action_loop.last_frame = perf;
            app.draw(&renderer);
            browser::request_animation_frame(f.borrow().as_ref().unwrap());
        }));
        browser::request_animation_frame(
            g.borrow()
                .as_ref()
                .ok_or_else(|| anyhow!("GameLoop: Loop is None"))?,
        )?;
        Ok(())
    }
}
