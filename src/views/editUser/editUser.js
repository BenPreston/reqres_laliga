import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import { connect } from 'react-redux'
import DefaultLayout from '../../layout'
import get from 'lodash/get'
import PropTypes from 'prop-types'

export class EditUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      avatar: '',
      submitted: false
    }
  }
  componentDidMount() {
    const { id } = this.props.match.params
    this.props.get(id)
  }
  componentWillReceiveProps(nextProps) {
    const { user } = nextProps
    this.setState({
      first_name: get(user, 'first_name', ''),
      last_name: get(user, 'last_name', ''),
      avatar: get(user, 'avatar', '')
    })
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { id } = this.props.match.params
    this.setState({ submitted: true })
    const { first_name, last_name, avatar } = this.state
    if (!(first_name && last_name && avatar)) {
      return
    }
    this.props.update(id, first_name, last_name, avatar)
  }

  render() {
    const { loading } = this.props
    const { first_name, last_name, submitted } = this.state
    const title = 'Edit'
    return (
      <DefaultLayout title={title}>
        <div className="form-box">
          <form name="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                name="first_name"
                className={
                  'form-input' + (submitted && !first_name ? ' error' : '')
                }
                value={first_name}
                onChange={this.handleChange}
                disabled={loading}
              />
              {submitted && !first_name && (
                <div className="error-block first_name">
                  First Name is required.
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                name="last_name"
                className={
                  'form-input' + (submitted && !last_name ? ' error' : '')
                }
                value={last_name}
                onChange={this.handleChange}
                disabled={loading}
              />
              {submitted && !last_name && (
                <div className="error-block last_name">
                  Last Name is required.
                </div>
              )}
            </div>
            <div className="form-group">
              <button className="form-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner  fa-spin" /> loading ...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </DefaultLayout>
    )
  }
}
const mapStateToProps = (state) => ({
  loading: state.edit.loading,
  user: state.edit.user
})
const mapDispatchToProps = (dispatch) => {
  const { get, update } = actions
  return bindActionCreators({ get, update }, dispatch)
}
EditUser.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object,
  get: PropTypes.func,
  update: PropTypes.func
}
export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
