import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import KanBanboardContainer from './components/KanBanboardContainer';
import KanBanboard from './components/KanbanBoard';
import EditCard from './components/EditCard';
import NewCard from './components/NewCard';

let cardsList = [
  {
    id: 1,
    title: 'Read the Book',
    description: 'I should read the **whole** book',
    color: '#BD8D31',
    status: 'in-progress',
    tasks: [],
  },
  {
    id: 2,
    title: 'Write some code',
    description: 'Code along with the samples in the book. The complete source cab be found at [github](https://github.com/pro-react)',
    color: '#3A7E28',
    status: 'todo',
    tasks: [
      {
        id: 1,
        name: 'ContactList Example',
        done: true,
      },
      {
        id: 2,
        name: 'Kanban Example',
        done: false,
      },
      {
        id: 3,
        name: 'My own experiments',
        done: false,
      },
    ],
  },
  {
    id: 3,
    title: 'This is a new card with a very, very long title, thus having more than 80 characters wow it\'s too long it seems i was reading the all contents',
    color: '#15438F',
    status: 'done',
    tasks: [],
  },
];

const rootEl = document.getElementById('root');

render(
    <Router history={ createBrowserHistory() }>
      <Route component={KanBanboardContainer}>
        <Route path='/' component={KanBanboard}>
          <Route path='new' component={NewCard} />
          <Route path='edit/:card_id' component={EditCard}/>
        </Route>
      </Route>
    </Router>,
    rootEl
);
