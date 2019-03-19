import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import {
  Form, FormGroup, Label, Input, Button,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import axios from 'axios';
import './App.css';

const serverHandshake = () => axios.create({
  baseURL: 'http://penguin.linux.test:4000/api'
});

const initialUser = { name: '', bio: '' };

class App extends Component {
  state = { users: [], user: initialUser };

  componentDidMount() {
    serverHandshake().get('/users')
      .then(({ data }) => this.setState({ users: data }))
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState(state => ({
      user: { ...state.user, [name]: value }
    }));
  };

  userSubmit = e => {
    e.preventDefault();
    serverHandshake()
      .post('/users', this.state.user)
      .then(({data}) => this.setState(
        state => ({
          users: [...state.users, Object.assign({}, state.user, data)]
        }),
        () => {
          this.setState({ user: initialUser });
        }
      ));
  };

  deleteUser = id => {
    serverHandshake()
      .delete(`/users/${id}`)
      .then(data => this.setState(state => ({
        users: state.users.filter(user => user.id !== id)
      })))
  };

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.userSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={user.name} onChange={this.handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="bio">Bio</Label>
            <Input type="textarea" name="bio" id="bio" value={user.bio} onChange={this.handleChange} />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
        {this.state.users.length ? (
          <ListGroup>
            {this.state.users.map(user => (
              <ListGroupItem key={user.id}>
                <div>
                  <span onClick={() => this.deleteUser(user.id)}>&#10006;</span><br />
                  <span>&#9999;</span>
                </div>
                <div>
                  <ListGroupItemHeading>{user.name}</ListGroupItemHeading>
                  <ListGroupItemText>{user.bio}</ListGroupItemText>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <Loader type="Grid" color="#596268" height={80} width={80} />
        )}
      </React.Fragment>
    );
  }
}

export default App;
