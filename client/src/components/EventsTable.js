import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { format } from 'date-fns'
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';



function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { order, orderBy, rows, selected, dataLength, selectAll } = this.props
    
    return (
      <TableHead>
          <TableRow>
            <TableCell style={{textAlign: 'center', padding: 0, position: 'sticky', top: 0, backgroundColor: "#fff", zIndex: 10}}>
              <Tooltip title="Select All">
                <Checkbox
                  style={{padding: 9}}
                  checked={selected.length === dataLength}
                  onChange={selectAll}
                />
              </Tooltip>
            </TableCell>
            {rows.map(row => {            
              return (
                <TableCell
                  key={row.field}
                  padding='default'
                  sortDirection={orderBy === row.field ? order : false}
                  style={{position: 'sticky', top: 0, backgroundColor: "#fff", textAlign: row.type==='integer' ? 'center' : 'inherit'}}
                >
                  <Tooltip
                    title="Sort"
                    placement={row.type==='integer' ? 'bottom-end' : 'bottom-start'}
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
              )
            }, this)}
          </TableRow>

      </TableHead>
    )
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
})

let EnhancedTableToolbar = props => {
  const { classes, title, mobileView, sendEvent, selected } = props

  return (
    <Toolbar>
      {title && 
        <div className={classes.title}>
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        </div>
      }
      {selected.length > 0 &&
        <div>
          <Tooltip title="Send Event">
            <Button aria-label="Send Event" variant={mobileView ? 'fab' : 'contained'} color="primary" mini={mobileView} onClick={()=>sendEvent(selected)}>
              <SendIcon/>
              {!mobileView &&
                <Typography variant="subtitle1" noWrap color="inherit">
                  Send Event
                </Typography>
              }
            </Button>
          </Tooltip>
        </div>
      }
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
      {selected.length > 0 && <div style={{fontSize: 35, color: 'green', fontWeight: 'bold'}}> {selected.length} </div>}
    </Toolbar>
  )
}


EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: "auto"
  },
  tableWrapper: {
    overflowX: 'auto'
  },
})

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: this.props.orderBy,
    data: this.props.data,
    page: 0,
    rowsPerPage: 20,
    selected: []
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  handleRowSelect = id => {
    if (this.state.selected.includes(id))
      this.setState({selected: this.state.selected.filter(selectedID => selectedID !== id)})
    else
      this.setState({selected: [...this.state.selected, id]})
  }

  handleSelectAll = () => {
    if (this.state.selected.length === this.state.data.length)
      this.setState({selected: []})
    else
      this.setState({selected: [...this.state.data.map(n => n.stb_mac)]})
  }


  render() {
    const { classes, mobileView, rows, tableHeight, title, sendEvent } = this.props
    const { data, order, orderBy, rowsPerPage, page, selected } = this.state

    return (
      <Paper className={classes.root} style={{width: mobileView ? '93vw' : '100%'}} elevation={5}>
        <EnhancedTableToolbar 
          title={title} 
          mobileView={mobileView} 
          sendEvent={sendEvent}
          selected={selected}
        />
        <div className={classes.tableWrapper} style={{height: tableHeight}} >
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              selected={selected}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rows={rows}
              dataLength={data.length}
              mobileView={mobileView}
              selectAll={this.handleSelectAll}
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
                        onClick={()=>this.handleRowSelect(n.stb_mac)}
                        selected={this.state.selected.includes(n.stb_mac)}
                        style={{cursor: 'pointer'}}
                      >
                        <TableCell style={{textAlign: 'center', padding: 0}}>
                          <Tooltip title="Select">
                            <Checkbox
                              style={{padding: 9}}
                              checked={this.state.selected.includes(n.stb_mac)}
                              onChange={()=>this.handleRowSelect(n.stb_mac)}
                            />
                          </Tooltip>
                        </TableCell>
                        {Object.entries(n).map(([field, value]) => {
                          const fieldProperties = this.props.rows.find(row=>row.field===field)
                          switch (fieldProperties.type) {
                            case 'boolean':
                              return <TableCell key={field} style={{textAlign: 'center', paddingLeft: 0}}> <Icon color={value ? 'primary' : 'secondary'}>{value ? 'thumb_up' : 'thumb_down'}</Icon> </TableCell>
                            case 'integer':
                              return <TableCell key={field} style={{textAlign: 'center', paddingLeft: 0}}> {value} </TableCell>
                            case 'date':
                              return <TableCell key={field}> {format(Date.parse(value), 'dd MMM YYYY @ HH:mm:ss')} </TableCell>
                            default:
                              return <TableCell key={field}> {value} </TableCell>
                          }
                        })}                      
                      </TableRow>
                    )

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
    )
  }
}


export default withStyles(styles)(EnhancedTable)
