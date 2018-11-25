import React from 'react'
import { format } from 'date-fns'
import { isEqual } from 'lodash';
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
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import PlusOneIcon from '@material-ui/icons/PlusOne'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Checkbox from '@material-ui/core/Checkbox';
import SendIcon from '@material-ui/icons/Send'
import downloadCsv from 'download-csv';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'



function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}



function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { order, orderBy, viewOnly, data, rows, selected, dataLength, selectAll, isEvent, backgroundColor } = this.props
    
    return (
      <TableHead>
          <TableRow>
            {isEvent &&
              <TableCell style={{textAlign: 'center', padding: 0, position: 'sticky', top: 0, backgroundColor, zIndex: 10}}>
                <Tooltip title="Select All">
                  <Checkbox
                    style={{padding: 9}}
                    checked={selected.length === dataLength}
                    onChange={selectAll}
                  />
                </Tooltip>
              </TableCell>
            }
            {!viewOnly && !isEvent && 
              <TableCell style={{
                position: 'sticky', 
                top: 0, 
                backgroundColor, 
                zIndex: 10, 
                paddingRight: 0, 
                paddingLeft: 20
            }}>
              <Tooltip title="Download as CSV">
                <Button aria-label="Download as CSV" variant= 'fab' color="primary" mini={true} onClick={()=>downloadCsv(data, rows)}>
                  <CloudDownloadIcon/>
                </Button>
              </Tooltip>
            </TableCell>
            }

            {rows.map(row => {
              return (
                <TableCell
                  key={row.field}
                  padding='default'
                  sortDirection={orderBy === row.field ? order : false}
                  style={{position: 'sticky', top: 0, backgroundColor, textAlign: row.type==='integer' ? 'center' : 'inherit'}}
                >
                  <Tooltip
                    title="Sort"
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


const EnhancedTableToolbar = props => {
  const { title, mobileView, viewOnly, addNew, canAdd, fuzzySearchFilter, selected, sendEvent } = props

  return (
    <Toolbar>
      {title && 
        <div style={{flex: '0 0 auto'}}>
          <Typography variant="h6" id="tableTitle"> {title} </Typography>
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
        style={{margin: '0px 20px'}}
        id="input-with-icon-textfield"
        placeholder="Type to filter..."
        InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ) }}
        fullWidth
        onChange={fuzzySearchFilter}
      />
      <div style={{flex: '1 1 1 100%'}} />
      {!viewOnly && canAdd &&
        <div>
          <Tooltip title="Add New">
            <Button aria-label="Add New" variant={mobileView ? 'fab' : 'contained'} color="primary" mini={mobileView} onClick={addNew}>
              <AddIcon/>
              { !mobileView && <Typography variant="subtitle1" noWrap color="inherit"> Add New </Typography> }
            </Button>
          </Tooltip>
        </div>
      }
    </Toolbar>
  )
}

export default class EnhancedTable extends React.Component {
  state = {
    order: this.props.orderByDirection,
    orderBy: this.props.orderBy,
    data: this.props.data,
    page: 0,
    rowsPerPage: 20,
    selected: []
  }

  componentDidMount = () => {
    this.handleRequestSort(null, this.props.orderBy)
  }

  handleRequestSort = (event, property) => {   
    const orderBy = property
    const order = (this.state.orderBy === property && this.state.order === 'desc') ? 'asc' : 'desc'
    this.setState({ order, orderBy }, ()=> {
      this.stableSort(this.state.data, getSorting(order, orderBy))
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {   
    if (!isEqual(prevProps.data, this.props.data)) {
      this.setState({data: this.props.data})
    }
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

  stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    this.setState({data: stabilizedThis.map(el => el[0])})
  }

  fuzzySearchFilter = (event) => {
    const filterValue = event.target.value
    const filteredData = this.props.data.filter( row => {
      for (const val of Object.values(row)){
        if((val+'').includes('T') && val.includes('Z') && !isNaN(Date.parse(val))) {
          if (format(Date.parse(val), 'D MMM YYYY @ HH:mm:ss').toLowerCase().includes(filterValue.toLowerCase()))
            return true
        }
        else {
          if ((val+'').toLowerCase().includes(filterValue.toLowerCase()))
            return true
        }
      }
      return false
    })
    this.setState({data: filteredData})
  }


  render() {
    const { 
      mobileView, 
      rows, 
      tableHeight, 
      title, 
      viewOnly, 
      addNew, 
      canAdd, 
      incrementClientCredit, 
      authCreditsAvailable, 
      gotoLink,
      sendEvent,
      limit,
      noPagination,
      backgroundColor
    } = this.props

    const { data, order, orderBy, rowsPerPage, page, selected } = this.state

    return (
      <Paper style={{overflowX: "auto", width: mobileView ? '93vw' : '100%', background: backgroundColor}} elevation={5}>
        <EnhancedTableToolbar 
          title={title} 
          mobileView={mobileView} 
          viewOnly={viewOnly}
          canAdd={canAdd}
          addNew={addNew}
          selected={selected}
          sendEvent={sendEvent}
          fuzzySearchFilter={this.fuzzySearchFilter}
        />
        <div style={{height: tableHeight, overflowX: 'auto'}} >
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rows={rows}
              data={data}
              viewOnly={viewOnly}
              mobileView={mobileView}
              isEvent={sendEvent}
              selected={selected}
              dataLength={data.length}
              selectAll={this.handleSelectAll}
              backgroundColor={backgroundColor}
            />
            <TableBody>
              {data.slice(0, limit)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, idx) => 
                  <TableRow 
                    hover 
                    tabIndex={-1} 
                    key={idx} 
                    onClick={()=>sendEvent && this.handleRowSelect(n.stb_mac)}
                    selected={sendEvent && this.state.selected.includes(n.stb_mac)}
                    style={{cursor: sendEvent ? 'pointer' : ''}}
                  >
                    {sendEvent && 
                      <TableCell style={{textAlign: 'center', padding: 0}}>
                        <Tooltip title="Select">
                          <Checkbox
                            style={{padding: 9}}
                            checked={this.state.selected.includes(n.stb_mac)}
                            onChange={()=>this.handleRowSelect(n.stb_mac)}
                          />
                        </Tooltip>
                      </TableCell>
                    }
                    {!viewOnly && !sendEvent &&
                      <TableCell style={{paddingRight: 0, textAlign: 'center'}}>
                        <div style={{display: 'grid', gridTemplateColumns: incrementClientCredit ? '1fr 1fr' : '1fr'}}>
                        <Tooltip title="Edit">
                          <IconButton aria-label="Edit" style={{padding: 9}} onClick={()=>gotoLink(n)}>
                            <EditIcon fontSize="small" color="primary"/>
                          </IconButton>
                        </Tooltip>
                        {incrementClientCredit && 
                          <Tooltip title={(authCreditsAvailable<=0 && n.accountBalance===0) ? "No credits available to transfer" : "Add 1 Credit"}>
                            <IconButton 
                              aria-label="Add 1 Credit" 
                              style={{padding: 9}} 
                              onClick={()=>(authCreditsAvailable<=0 && n.accountBalance===0) ? {} : incrementClientCredit(n)}
                            >
                              <PlusOneIcon fontSize="small" color="primary"/>
                            </IconButton>
                          </Tooltip>
                        }
                        </div>
                      </TableCell>
                    }
                    {Object.entries(n).map(([field, value]) => {
                      const fieldProperties = rows.find(row=>row.field===field)
                      switch (fieldProperties.type) {
                        case 'boolean':
                          return (
                            <TableCell key={field} style={{textAlign: 'center', paddingLeft: 0}}> 
                              <Icon style={{color: value ? 'green' : 'red'}}>{value ? 'thumb_up' : 'thumb_down'}</Icon> 
                            </TableCell>
                          )
                        case 'integer':
                          return <TableCell key={field} style={{textAlign: 'center', paddingLeft: 0}}> {value} </TableCell>
                        case 'date':
                          return <TableCell key={field}> {format(Date.parse(value), 'D MMM YYYY @ HH:mm:ss')} </TableCell>
                        default:
                          return <TableCell key={field}> {value} </TableCell>
                      }
                    })}
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
        {!noPagination &&
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{'aria-label': 'Previous Page'}}
            nextIconButtonProps={{'aria-label': 'Next Page'}}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 50, 100]}
          />
        }
      </Paper>
    )
  }
}
