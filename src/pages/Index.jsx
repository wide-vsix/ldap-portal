import React from 'react';
import container from '../container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Redirect} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    padding: 20,
  },
};

class Index extends React.Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container justify="center" spacing={24}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  パスワード変更
                </Typography>
                <Typography component="p">
                  Linux,vpn,sambaのパスワード変更。
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={()=>this.props.history.push('/password')}>
                  Password
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  シェル変更
                </Typography>
                <Typography component="p">
                  Linuxのログインシェルの変更。
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={()=>this.props.history.push('/shell')}>
                  Shell
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  公開鍵登録
                </Typography>
                <Typography component="p">
                  LinuxのSSHの公開鍵登録。
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={()=>this.props.history.push('/pubkey')}>
                  Pubkey
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default container(styles)(Index);
