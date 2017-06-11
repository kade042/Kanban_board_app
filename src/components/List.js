import React, { Component, PropTypes } from 'react';
import Card from './Card';

export default class List extends Component {
  render() {
    var cards = this.props.cards.map((card) => {
      return <Card key={card.id}
                   id={card.id}
                   taskCallbacks={this.props.taskCallbacks}
                   title={card.title}
                   description={card.description}
                   color={card.color}
                   tasks={card.tasks}
                   />;
    });

    return (
      <div className='list'>
        <h1>{this.props.title}</h1>
        {cards}
      </div>
    );

  }
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  card: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object,
};
