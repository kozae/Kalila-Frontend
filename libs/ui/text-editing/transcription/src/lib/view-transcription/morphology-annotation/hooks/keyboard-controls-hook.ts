import { useEffect } from 'react';
import Mousetrap from 'mousetrap';

export interface IKeyboardControlsParams {
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  gotoFirstPage: () => void;
  gotoNextPage: () => void;
  closePopper: () => void;
  skipToken: () => void;
  selectChoice: (n: number) => void;
}

export function useKeyboardControls({
  moveUp,
  moveLeft,
  moveDown,
  moveRight,
  gotoFirstPage,
  gotoNextPage,
  closePopper,
  skipToken,
  selectChoice,
}: IKeyboardControlsParams) {
  useEffect(() => {
    Mousetrap.bind('up', (e) => {
      e.preventDefault();
      moveUp();
    });
    Mousetrap.bind('down', (e) => {
      e.preventDefault();
      moveDown();
    });
    Mousetrap.bind('left', (e) => {
      e.preventDefault();
      moveLeft();
    });
    Mousetrap.bind('right', (e) => {
      e.preventDefault();
      moveRight();
    });

    Mousetrap.bind('m', (e) => {
      e.preventDefault();
      gotoNextPage();
    });
    Mousetrap.bind('s', (e) => {
      e.preventDefault();
      skipToken();
    });
    Mousetrap.bind('x', (e) => {
      e.preventDefault();
      closePopper();
    });
    Mousetrap.bind('f', (e) => {
      e.preventDefault();
      gotoFirstPage();
    });
    Mousetrap.bind('1', (e) => {
      e.preventDefault();
      selectChoice(1);
    });
    Mousetrap.bind('2', (e) => {
      e.preventDefault();
      selectChoice(2);
    });
    Mousetrap.bind('3', (e) => {
      e.preventDefault();
      selectChoice(3);
    });
    Mousetrap.bind('4', (e) => {
      e.preventDefault();
      selectChoice(4);
    });
    return () => {
      Mousetrap.reset();
    };
  }, [selectChoice, gotoNextPage, gotoFirstPage]);
}
