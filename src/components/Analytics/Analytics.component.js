import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';

import messages from './Analytics.messages';
import FullScreenDialog from '../UI/FullScreenDialog';
import ModifiedAreaChart from '../UI/ModifiedAreaChart';
import StatCards from '../UI/StatCards';
import StatCards2 from '../UI/StatCards2';
import TableCard from '../UI/TableCard';
import DoughnutChart from '../UI/Doughnut';
import './Analytics.css';
import Barchart from '../UI/Barchart';
import StyledTable from '../UI/StyledTable';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  onDaysChange: PropTypes.func.isRequired,
  days: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isLogged: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  symbolSources: PropTypes.array.isRequired,
  totals: PropTypes.object.isRequired,
  categoryTotals: PropTypes.object.isRequired,
  usage: PropTypes.object.isRequired,
  topUsed: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    color: 'white',
    padding: '0px'
  },
});

export class Analytics extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      openDetailsDialog: false,
      detailsData: []
    };
  }

  handleUserHelpClick = () => {
    window.open('https://www.cboard.io/help', '_blank');
  };

  handleGoBack = () => {
    const { history } = this.props;
    history.replace('/');
  };

  handleDaysChange = event => {
    this.props.onDaysChange(event.target.value);
  };

  handleDetailsDialogOpen = name => event => {
    switch (name) {
      case 'boards':
        this.setState({ detailsData: this.props.totals.boards['rows'] });
        break;
      case 'words':
        this.setState({ detailsData: this.props.totals.words['rows'] });
        break;
      case 'phrases':
        this.setState({ detailsData: this.props.totals.phrases['rows'] });
        break;
      case 'editions':
        this.setState({ detailsData: this.props.totals.editions['rows'] });
        break;
      default:
        this.setState({ detailsData: [] });
        break;
    }
    this.setState({
      openDetailsDialog: true
    })
  };

  getDates = range => {
    const days = [];
    const dateEnd = moment();
    const dateStart = moment().subtract(range, 'days');
    while (dateEnd.diff(dateStart, 'days') >= 0) {
      days.push(dateStart.format('DD/MM'));
      dateStart.add(1, 'days');
    }
    return days;
  };

  handleDialogClose() {
    this.setState({
      openDetailsDialog: false
    });
  }

  render() {
    const {
      intl,
      classes,
      theme,
      usage,
      symbolSources,
      topUsed,
      days,
      totals,
      categoryTotals,
      isFetching
    } = this.props;
    const tablesHead = [
      intl.formatMessage(messages.name),
      intl.formatMessage(messages.timesClicked),
      intl.formatMessage(messages.action)
    ];
    return (
      <FullScreenDialog
        className="Analytics"
        open
        title={<FormattedMessage {...messages.analytics} />}
        onClose={this.handleGoBack}
        fullWidth={true}
      >
        <Fragment>
          <div className="Analytics__Graph">
            <Grid
              container
              direction="row"
              className="Analytics__Graph__Select">
              <Grid item className="Analytics__Graph__Select__Item">
                <FormControl variant="outlined">
                  <Select
                    className={classes.root}
                    labelId="range-select-label"
                    id="range-select"
                    autoWidth={false}
                    onChange={this.handleDaysChange}
                    value={days}
                  >
                    <MenuItem value={10}>{intl.formatMessage(messages.tenDaysUsage)}</MenuItem>
                    <MenuItem value={20}>{intl.formatMessage(messages.twentyDaysUsage)}</MenuItem>
                    <MenuItem value={30}>{intl.formatMessage(messages.thirtyDaysUsage)}</MenuItem>
                    <MenuItem value={60}>{intl.formatMessage(messages.sixtyDaysUsage)}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item className="Analytics__Graph__Select__Item">
                {isFetching && (<CircularProgress size={30} thickness={4} className={classes.root} />)}
              </Grid>
            </Grid>
            <ModifiedAreaChart
              height="200px"
              option={{
                series: [
                  {
                    data: usage.data,
                    type: 'line'
                  }
                ],
                xAxis: {
                  data: this.getDates(days)
                },
                yAxis: {
                  max: usage.max,
                  min: usage.min,
                  offset: -13
                }
              }}
            />
          </div>
          <div className="Analytics__Metrics">
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <StatCards onDetailsClick={this.handleDetailsDialogOpen.bind(this)} data={totals} />
                <TableCard
                  data={topUsed.symbols}
                  tableHead={tablesHead}
                  title={intl.formatMessage(messages.topUsedButtons)}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <DoughnutChart
                  data={symbolSources}
                  title={intl.formatMessage(messages.symbolSources)}
                  height="300px"
                  color={[
                    theme.palette.primary.dark,
                    theme.palette.primary.main,
                    theme.palette.primary.light
                  ]}
                />
                <StatCards2 categoryTotals={categoryTotals} />
                <Barchart
                  data={topUsed.boards}
                  title={intl.formatMessage(messages.mostUsedBoards)}
                />
              </Grid>
            </Grid>
          </div>
          <Dialog
            onClose={this.handleDialogClose.bind(this)}
            aria-labelledby="details-dialog"
            open={this.state.openDetailsDialog}
            TransitionComponent={Transition}
            aria-describedby="details-desc"
          >
            <DialogContent className={classes.root}>
              <DialogContentText id="details-dialog-desc">
              </DialogContentText>
              <StyledTable data={this.state.detailsData} tableHead={tablesHead} isDense={true} />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleDialogClose.bind(this)}
                color="primary"
              >
                {intl.formatMessage(messages.close)}
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      </FullScreenDialog>
    );
  }
}

Analytics.propTypes = propTypes;

export default withStyles(styles, { withTheme: true })(injectIntl(Analytics));
