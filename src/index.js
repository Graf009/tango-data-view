import { Component } from '@eagle/tango'
import { fromJS, Iterable, List, Map } from 'immutable'

export default class DataComponent extends Component {
  constructor(...args) {
    super(...args)
    if (!this.constructor.storeProps) {
      throw new Error('DataComponent requires storeProps to be defined! Did you forget to use the connect decorator?')
    }
  }

  componentWillMount() {
    this.tryResolveData()
  }
  componentDidUpdate() {
    if (!this.handleResolved) return
    if (this._resolved) return
    const loading = this.getResolvingFields()
    if (loading.size !== 0) return

    this._resolved = true
    this.handleResolved(this.getResolvedData())
  }

  getResolvingFields() {
    // has keys that are either undefined/null or have a pending = true key
    return fromJS(this.constructor.storeProps).reduce((prev, cursor, prop) =>
      (this.isPropResolving(prop) ? prev.push(prop) : prev)
    , List())
  }
  getErrors() {
    // has keys that have an error = data key
    return fromJS(this.constructor.storeProps).reduce((prev, cursor, prop) =>
      (this.isPropErrored(prop)
        ? prev.set(prop, this.props[prop].get('error'))
        : prev)
    , Map())
  }
  getResolvedData() {
    return Object.keys(this.constructor.storeProps).reduce((prev, prop) => {
      const val = this.props[prop]
      if (!this.isPropResolving(prop)) {
        prev[prop] = Iterable.isIterable(val) ? val.get('data') || val : val
      }
      return prev
    }, {})
  }

  tryResolveData() {
    if (!this.resolveData) return
    const loading = this.getResolvingFields()
    if (loading.size === 0) return
    this.resolveData()
  }

  isPropResolving(prop) {
    return this.props[prop] == null ||
      (Iterable.isIterable(this.props[prop]) &&
      this.props[prop].get('pending') === true)
  }
  isPropErrored(prop) {
    return Iterable.isIterable(this.props[prop]) && this.props[prop].get('error') != null
  }
  isResolving() {
    return !this.isErrored() && !this.getResolvingFields().isEmpty()
  }
  isErrored() {
    return !this.getErrors().isEmpty()
  }

  // eslint-disable-next-line class-methods-use-this
  renderLoader() {
    return null
  }
  // eslint-disable-next-line class-methods-use-this
  renderErrors() {
    return null
  }
  // eslint-disable-next-line class-methods-use-this
  renderData() {
    return null
  }

  render() {
    let node = null

    if (this.isResolving()) {
      node = this.renderLoader(this.getResolvingFields())
    } else if (this.isErrored()) {
      node = this.renderErrors(this.getErrors())
    } else {
      node = this.renderData(this.getResolvedData())
    }

    return node
  }
}
