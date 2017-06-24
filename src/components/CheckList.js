import React, { Component, PropTypes } from 'react';
import TaskActionCreators from '../actions/TaskActionCreators';

export default class CheckList extends Component {
  checkInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      let newTask = { id: Date.now(), name: evt.target.value, done: false };
      TaskActionCreators.addTask(this.props.cardId, newTask);
      evt.target.value = '';
    }
  }

  render() {
    let tasks = this.props.tasks.map((task, taskIndex) => {
      return <li key={task.id} className='checklist_task'>
        <input type='checkbox'
               Checked={task.done}
               onChange={
                TaskActionCreators.toggleTask.bind(null, this.props.cardId, task.id, taskIndex)
          } />
        {task.name}{' '}
        <a href='#'
           className='checklist_task--remove'
           onClick={
            TaskActionCreators.deleteTask.bind(null, this.props.cardId, task.id, taskIndex)
          } />
      </li>;
    });

    return (
      <div className='checklist'>
        <ul>{tasks}</ul>
        <input  type='text'
                className='checklist--add-task'
                placeholder='Type then hit Enter to add a task'
                onKeyPress={this.checkInputKeyPress.bind(this)} />
      </div>
    );
  }
}

CheckList.propTypes = {
  cardId: PropTypes.number,
  tasks: PropTypes.arrayOf(PropTypes.object),
};
