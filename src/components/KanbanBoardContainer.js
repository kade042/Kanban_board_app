import React, { Component } from 'react';
import { render } from 'react-dom';
import 'whatwg-fetch';
import KanbanBoard from './KanbanBoard';

const API_URL = 'http://kanbanapi.pro-react.com/';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'react-pro',
};

export default class KanBanboardContainer extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cards: [],
    };
  }

  componentDidMount() {
    fetch(API_URL + 'cards', { headers: API_HEADERS })
    .then((response)=> response.json())
    .then((responseData) => {
      this.setState({ cards: responseData });
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  render() {
    return (
      <KanbanBoard cards={this.state.cards} />
    );
  }
}
