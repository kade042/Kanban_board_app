import React from 'react';
import { render }from 'react-dom';
import App from './App';
import Board from './components/Board';
import Square from './components/Square';
import Knight from './components/Knight';
import { observe } from './components/Game';

const rootEl = document.getElementById('root');

observe(knightPosition =>
  render(
    <Board knightPosition={ knightPosition } />,
    rootEl
  )
);
