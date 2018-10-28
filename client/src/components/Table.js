import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';



function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {this.props.rows.map(row => {
            return (
              <TableCell
                key={row.field}
                numeric={row.numeric}
                padding='default'
                sortDirection={orderBy === row.field ? order : false}
                style={{position: 'sticky', top: 0, backgroundColor: "#fff"}}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.field}
                    direction={order}
                    onClick={this.createSortHandler(row.field)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
          <TableCell style={{position: 'sticky', top: 0, backgroundColor: "#fff", zIndex: 10}}/>
        </TableRow>
      </TableHead>
    );
  }
}


const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  spacer: {
    flex: '1 1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
    padding: '0px 10px'
  },
  title: {
    flex: '0 0 auto',
  },
  margin: {
    margin: theme.spacing.unit,
    padding: '0px 20px',
  },
});

let EnhancedTableToolbar = props => {
  const { classes, title } = props;

  return (
    <Toolbar>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          {title}
        </Typography>
      </div>
      <TextField
        className={classes.margin}
        id="input-with-icon-textfield"
        placeholder="Type to search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Add New">
          <Button aria-label="Add New" variant='contained' color="primary">
            <AddIcon />
            <Typography variant="subtitle1" noWrap color="inherit">
              Add New
            </Typography>
          </Button>
        </Tooltip>
      </div>
    </Toolbar>
  );
};


EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
    height: '70vh'
  },
});

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: this.props.orderBy,
    data: this.props.data,
    page: 0,
    rowsPerPage: 20,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar title={this.props.title}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rows={this.props.rows}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, idx) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={idx}
                    >
                      {Object.entries(n).map(([field, value]) => {
                        const fieldProperties = this.props.rows.find(row=>row.field===field)
                        return <TableCell key={field} numeric={fieldProperties.numeric}> {value} </TableCell>
                      })}
                      <TableCell>
                        <Tooltip title="Edit">
                          <Button aria-label="Edit">
                            <EditIcon color="primary" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          rowsPerPageOptions={[20, 50, 100]}
        />
      </Paper>
    );
  }
}


export default withStyles(styles)(EnhancedTable);
