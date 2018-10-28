import React, { Component } from 'react'
import Table from 'components/Table'


const rows = [
  { field: 'username', numeric: false, label: 'Username' },
  { field: 'email', numeric: false, label: 'Email' },
  // { field: 'firstName', numeric: false, label: 'First Name' },
  // { field: 'lastName', numeric: false, label: 'Last Name' },
  { field: 'phoneNo', numeric: false, label: 'Telephone' },
  { field: 'accountStatus', numeric: false, label: 'Account Status' },
  // { field: 'parentID', numeric: false, label: 'Parent Username' },
  // { field: 'childrenCount', numeric: true, label: 'No of Children' },
  { field: 'creditsAvailable', numeric: true, label: 'Credits Available' },
  { field: 'creditsOnHold', numeric: true, label: 'Credits on Hold' },
  { field: 'createdAt', numeric: false, label: 'Created At' },
  // { field: 'updatedAt', numeric: false, label: 'Updated At' }
]


const data = [
  {
    username: 'test',
    email: 'test@mail',
    phoneNo: '64786543',
    accountStatus: 'active',
    creditsAvailable: 15,
    creditsOnHold: 10,
    createdAt: 'some date'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test3',
    email: 'test@m131ail',
    phoneNo: '15618461',
    accountStatus: 'active',
    creditsAvailable: 2,
    creditsOnHold: 1,
    createdAt: 'some dateasd'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  },
  {
    username: 'test2',
    email: 'test@maile',
    phoneNo: '4561384',
    accountStatus: 'disabled',
    creditsAvailable: 12,
    creditsOnHold: 6,
    createdAt: 'some datesa'
  }
]


export default class Client extends Component {
  render() {
    return (
      <div>
        <Table
          title='Users'
          rows={rows}
          data={data}
          orderBy='creditsAvailable'
        />
      </div>
    )
  }
}