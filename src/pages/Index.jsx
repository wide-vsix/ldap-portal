import React from 'react';
import container from '../container';

const styles = {
  root: {
  },
};

class Index extends React.Component {
  render() {
    return (
      <div className={this.props.classes.root}>
      </div>
    );
  }
}

export default container(styles)(Index);
