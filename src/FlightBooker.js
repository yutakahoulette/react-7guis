import React, { Component } from 'react'
import moment from 'moment'

const format = 'MM/DD/YYYY'
const validDate = st =>
  /(\d\d)\/(\d\d)\/(\d\d\d\d)/g.test(st) && moment(st, format).isValid()

const checkDates = (oneWaySt, returnSt, type) => {
  if(type === 'one-way') return validDate(oneWaySt)

  const oneWayMoment = moment(oneWaySt, format)
  const returnMoment = moment(returnSt, format)
  return validDate(oneWaySt)
    && validDate(returnSt)
    && !returnMoment.isBefore(oneWayMoment)
}

class FlightBooker extends Component {
  state = {
    type: 'one-way',
    valid: true,
    oneWayValid: true,
    returnValid: true,
    oneWay: moment().format(format),
    return: moment().format(format),
    msg: ''
  }
  setOneWay = (ev) => {
    const string = ev.target.value
    this.setState({
      oneWay:  string,
      oneWayValid: validDate(string),
      valid: checkDates(string, this.state.return, this.state.type)
    })
  }
  setReturn = (ev) => {
    const string = ev.target.value
    this.setState({
      return: string,
      returnValid: validDate(string),
      valid: checkDates(this.state.oneWay, string, this.state.type)
    })
  }
  selectType = (ev) => {
    const type = ev.target.value
    if(type === 'roundtrip') {
      this.returnInput.disabled = false
      this.returnInput.focus()
    } else {
      this.returnInput.disabled = true
    }
    this.setState({
      type,
      valid: checkDates(this.state.oneWay, this.state.return, type)
    })
  }
  submit = (ev) => {
    ev.preventDefault()
    const msg = `You have booked a ${this.state.type} flight on ${this.state.oneWay}${this.state.type === 'roundtrip' ? (' returning on ' + this.state.return) : ''}.`
    this.setState({msg})
  }
  render() {
    return (
      <section>
        <h2>Flight Booker</h2>
        <form onSubmit={this.submit}>
          <select onChange={this.selectType} value={this.state.type}>
            <option value='one-way'>one-way flight</option>
            <option value='roundtrip'>roundtrip flight</option>
          </select>
          <div>
            <input value={this.state.oneWay} 
              style={{borderColor: this.state.oneWayValid ? '' : 'tomato'}}
              onChange={this.setOneWay} type='text' />
          </div>
          <div>
            <input value={this.state.return} 
              disabled={this.state.type !== 'return'}
              style={{borderColor: this.state.returnValid ? '' : 'tomato'}}
              ref={(input) => {this.returnInput = input}}
              onChange={this.setReturn} type='text' />
          </div>
          <button disabled={!this.state.valid}>Book</button>
        </form>
        {this.state.msg ? <p>{this.state.msg}</p> : ''}
      </section>
    )
  }
}

export default FlightBooker
