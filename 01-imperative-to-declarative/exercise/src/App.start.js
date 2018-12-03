/*

Instructions:

Goal: Update the document title to say "Todos ([incomplete])" as the data changes.

- Make a `<DocumentTitle/>` component
- Pass it a prop with the string for the title
- Use lifecycle hooks to keep it up to date with the data

Tips:

- You'll need two lifecycle hooks
- You'll need string interpolation `it looks ${like} this`
- the DOM API to update the title is `document.title = "some string"`

*/

import React, { Component } from "react";

class DocumentTitle extends Component {
  componentDidMount() {
    document.title = this.props.title;
  }

  componentDidUpdate() {
    document.title = this.props.title;
  }

  render() {
    return null;
  }
}

class App extends Component {
  state = {
    completed: 0,
    todos: ["Wake up", "Eat a taco", "Avoid twitter"]
  };

  render() {
    let { todos, completed } = this.state;
    let incomplete = todos.length - completed;
    let title = `Todos (${incomplete})`;

    return (
      <div className="app">
        <DocumentTitle title={ title }/>
        <h1>{ title }</h1>

        <form
          onSubmit={event => {
            let todo = event.target.elements[0].value;
            event.preventDefault();
            event.target.reset();
            this.setState(state => {
              return { todos: state.todos.concat([todo]) };
            });
          }}
        >
          <input type="text" /> <button type="submit">Add</button>
        </form>

        <ul>
          {todos.map(todo => (
            <li>
              <label>
                <input
                  type="checkbox"
                  onChange={event => {
                    let checked = event.target.checked;
                    this.setState(state => {
                      return {
                        completed: checked
                          ? state.completed + 1
                          : state.completed - 1
                      };
                    });
                  }}
                />{" "}
                {todo}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
