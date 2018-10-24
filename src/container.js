import withStyles from '@material-ui/core/styles/withStyles';

export default function(styles) {
  return function(Component) {
    Component = withStyles(styles)(Component);
    return Component;
  };
}
