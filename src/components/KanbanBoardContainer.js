import React, { Component } from 'react';
import { render } from 'react-dom';
import update from 'react-addons-update';
import 'whatwg-fetch';
import KanbanBoard from './KanbanBoard';
import 'babel-polyfill';

const API_URL = 'http://kanbanapi.pro-react.com/';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'proreact',
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
    window.state = this.state;
  }

  addTask(cardId, taskName) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((card)=> card.id == cardId);
    let newTask = { id: new Date(), name: taskName, done: false };

    let nextState = update(this.state.cards, {
                            [cardIndex]: {
                              tasks: { $push: [newTask] },
                            },
                          });
    this.setState({ cards: nextState });

    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask),
    })
    .then((response)=> {
      if (response.ok) {
        return response.json();
      }else {
        throw new Error('Server response wasn\'t ok');
      }
    })
    .then((responseData)=> {
      newTask.id = responseData.id;
      this.setState({ cards: nextState });
    }).catch((error)=> {
      this.setState(prevState);
    });

  }

  deleteTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
    let prevState = this.state;
    let nextState = update(this.state.cards, {
                            [cardIndex]: {
                              tasks: { $splice: [[taskIndex, 1]] },
                            }, });
    this.setState({ cards: nextState });

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS,
    })
    .then((response)=> {
      if (!response.ok) {
        throw new Error('Server response wasn\'t ok');
      }
    }).catch((error)=> {
      console.error('Fetch error: ', error);
      this.setState(prevState);
    });
  }

  toggleTask(cardId, taskId, taskIndex) {
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
    let prevState = this.state;
    let newDoneValue;
    let nextState = update(this.state.cards, {
                            [cardIndex]: {
                              tasks: {
                                [taskIndex]: {
                                  done: {
                                    $apply: (done) => {
                                      newDoneValue = !done
                                      return newDoneValue;
                                    },
                                  },
                                },
                              },
                            },
                          },
                        );

    this.setState({ cards: nextState });
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({ done: newDoneValue }),
    }).then((response)=> {
      if (!response.ok) {
        throw new Error('Server response wasn\'t ok');
      }
    }).catch((error)=> {
      console.error('Fetch error: ', error);
      this.setState(prevState);
    });
  }

  updateCardStatus(cardId, listId) {
    let cardIndex = this.state.cards.findIndex((card)=> card.id == cardId);
    let card = this.state.cards[cardIndex];

    if (card.status !== listId) {
      this.setState(update(this.state, {
        cards: {
          [cardIndex]: {
            status: { $set: listId },
          },
        },
      }));
    }
  }

  updateCardPosition(cardId, afterId) {
    if (cardId !== afterId) {
      let cardIndex = this.state.cards.findIndex((card)=> card.id == cardId);
      let card = this.state.cards[cardIndex];
      let afterIndex = this.state.cards.findIndex((card)=> card.id == afterIndex);

      this.setState(update(this.state, {
        cards: {
          $splice: [
            [cardIndex, 1],
            [afterIndex, 0, card],
          ],
        },
      }));
    }
  }

  render() {
    return (
      <KanbanBoard cards={this.state.cards}
                   taskCallbacks={{ toggle: this.toggleTask.bind(this),
                                    delete: this.deleteTask.bind(this),
                                    add: this.addTask.bind(this), }}
                    cardCallbacks={{ updateStatus: this.updateCardStatus.bind(this),
                                     updatePosition: this.updateCardPosition.bind(this), }}
                                     />

    );
  }
}
