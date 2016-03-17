# tango-data-view

Simple component for managing asynchronous data dependency states. If you have a view with 3 base states: fetching, loaded, and errored - this will help you clean up a lot of boilerplate. Works out of the box with `rumba` for doing API stuff.

## Install

```
npm install @tvevt/tango-data-view --save
```

## API

You can define three functions:

- `resolveData`
  - Defaults to doing nothing
  - Triggered on mount/update when any `storeProps` (what you give to tango's connect function) are not fulfilled
  - Responsible for dispatching any actions to fetch data
- `renderData`
  - Defaults to displaying nothing
  - Triggered when all storeProps are resolved
  - Receives a data object as an argument
  - Responsible for rendering the data
- `renderLoader`
  - Defaults to displaying nothing
  - Triggered when all storeProps are not resolved
  - Responsible for rendering a loader
- `renderErrors`
  - Defaults to displaying nothing
  - Triggered when any storeProp value has an `error` attribute
  - Receives an errors Map as an argument
    - Key is the storeProp
    - Value is the error object
  - Responsible for rendering any errors that happened while fetching data

## Example

```js
import React from 'react'
import { PropTypes, connect } from '@tvevt/tango'
import DataComponent from '@tvevt/tango-data-view'
import actions from 'core/actions'

@connect({
  users: 'subsets.users'
})
export default class UserList extends DataComponent {
  static propTypes = {
    users: PropTypes.iterable
  }

  resolveData() {
    actions.api.users.find({ subset: 'users' })
  }

  renderData({ users }) {
    return (
      <div>
        <div>Users</div>
        {
          users.map(user =>
            <Media key={user.get('id')} align="center" img={user.get('image')}>
              <Heading level={3}>{user.get('name')}</Heading>
            </Media>
          )
        }
      </div>
    )
  }

  renderErrors(errors) {
    return (
      <div>
        <div>Users</div>
        <div>Failed to Load!</div>
        {
          errors.map((err, field) =>
            <Media key={field} align="center">
              <Heading level={3}>{field}</Heading>
              <Text>{err.message}</Text>
            </Media>
          ).toArray()
        }
      </div>
    )
  }
}
```
