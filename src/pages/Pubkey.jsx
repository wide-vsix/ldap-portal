import React from 'react';
import container from '../container';
import assert from 'assert';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
  },
  index: {
    width: 100,
  },
  pubkey: {
    minWidth: 100,
    maxWidth: 700,
    overflowWrap: 'break-word',
  },
  delete: {
    width: 100,
  },
};

class Pubkey extends React.Component {
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem('token');
    this.state = {
      err: [],
      token,
      pubkey: [],
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
        <Grid container justify="center">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>pubkey</TableCell>
                  <TableCell>delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.pubkey.map((key, i)=>{
                  return (
                    <TableRow key={i}>
                      <TableCell className={this.props.classes.pubkey}>{key}</TableCell>
                      <TableCell className={this.props.classes.delete}>
                        <Button variant="contained" color="primary">delete</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default container(styles)(Pubkey);
