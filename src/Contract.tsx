import { Component } from 'react'

class Contract extends Component<{ createTask(value: string): void, tasks: any[] }, {}> {
  task: any = null

  render() {
    return (
      <div id="content">
        <form onSubmit={event => {
          event.preventDefault()
          this.props.createTask(this.task.value)
        }}>
          <input id="newTask" ref={input => this.task = input} type="text" className="form-control" placeholder="Add task..." required />
          <input type="submit" />
        </form>
        <ul id="taskList" className="list-unstyled">
          {
            this.props.tasks.map((task, key) => {
              return (
                <div className="taskTemplate" key={key}>
                  <label>
                    <input type="checkbox" />
                    <span className="content">{task.content}</span>
                  </label>
                </div>
              )
            })
          }
        </ul>
        <ul id="completedTaskList" className="list-unstyled"></ul>
      </div>
    )
  }
}

export default Contract