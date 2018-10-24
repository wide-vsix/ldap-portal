import React from 'react';
import container from '../container';
import assert from 'assert';
import axios from 'axios';

const styles = {
  root: {
  },
};

class Pubkey extends React.Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem('token');
    this.state = {
      token,
    };
    (async ()=>{
      const {data} = await axios.get(`/api/pubkey?token=${token}`);
      assert.notEqual(null, data.pubkey);
      this.setState({pubkey: data.pubkey});
    })();
  }
  render() {
    return (
      <div className={this.props.classes.root}>
      </div>
    );
  }
}

export default container(styles)(Pubkey);
