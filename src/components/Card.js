import React, { Component, PropTypes } from 'react';
import CheckList from './CheckList';
import marked from 'marked';
import { CSSTransitionGroup } from 'react-transition-group';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router';
import constants from '../constants';
import CardActionCreators from '../actions/CardActionCreators';

let titlePropType = (props, propName, componentName) => {
  if (props[propName]) {
    let value = props[propName];
    if (typeof value !== 'string' || value.length > 80) {
      return new Error(
        `$(propName) in $(componentName) is longer than 80 characters`
      );
    }
  }
};

const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    if (props.id !== draggedId) {
      CardActionCreators.updateCardPosition(draggedId, props.id);
    }
  },
};

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      status: props.status,
    };
  },

  endDrag(props) {
    CardActionCreators.persistCardDrag(props);
  },
};

let collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
};

let collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
  };
};

class Card extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showDetails: false,
    };
  }

  toggleDetails() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  render() {
    const { connectDragSource, connectDropTarget } = this.props;

    let cardDetails;
    if (this.state.showDetails) {
      cardDetails = (
        <div className='card_details'>
          <span dangerouslySetInnerHTML={{ __html: marked(this.props.description) }} />
          <CheckList cardId={this.props.id}  tasks={this.props.tasks} />
        </div>
      );
    };

    let sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: this.props.color,
    };

    return connectDropTarget(connectDragSource(
      <div className='card'>
        <div style={ sideColor } />
        <div className='card__edit'>
          <Link to={'/edit/' + this.props.id}>&#9998;</Link>
        </div>
        <div className={ this.state.showDetails ? 'card_title card_title--is-open' : 'card_title'
        } onClick={this.toggleDetails.bind(this)}>
          {this.props.title}
        </div>
        <CSSTransitionGroup transitionName='toggle'
                            transitonEnterTimeout={250}
                            transitionLeaveTimeout={250} >
        {cardDetails}
        </CSSTransitionGroup>
      </div>
    ));
  }
}

Card.propTypes = {
  id: PropTypes.number,
  title: titlePropType,
  description: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string,
  tasks: PropTypes.arrayOf(PropTypes.object),
  connectDragSource: PropTypes.func.isRequired,
  onnectDropTarget: PropTypes.func.isRequired,
};

const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(Card);
const dragDropHighOrderCard = DropTarget(constants.CARD, cardDropSpec, collectDrop)(dragHighOrderCard);
export default dragDropHighOrderCard;
