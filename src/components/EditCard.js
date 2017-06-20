import React, { Component } from 'react';
import CardForm from './CardForm';

export default class EditCard extends Component {
  componentWillMount() {
    let card = this.props.cards.find((card)=> card.id == this.props.params.card_id);
    this.setState({ ...card });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.cardCallbacks.updateCard(this.state);
    this.props.history.pushState(null, '/');
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  handleClose(e) {
    this.props.history.pushState(null, '/');
  }

  render() {
    return (
      <CardForm draftCard={this.state}
                buttonLabel='Edit Card'
                handleChange={this.handleChange.bind(this)}
                handleSubmit={this.handleSubmit.bind(this)}
                handleClose={this.handleClose.bind(this)} />
    );
  }
}

EditCard.propTypes = {
  cardCallbacks: PropTypes.object,
};
