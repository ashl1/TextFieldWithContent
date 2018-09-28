import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

import {createChainedFunction, measureString} from './utils'

// FIXME: Unknown space between this component items (for ~4-10pxx)

const KEY_BACKSPACE = 8
const KEY_DELETE = 46
const DEFAULT_INPUT_WIDTH = '100%'

// The nested class to render or structure on the top of TextField
class ExtendedInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      shouldShowFixedText: props.defaultValue || props.value,
      inputWidth: DEFAULT_INPUT_WIDTH,
    }
  }

  componentDidMount () {
    if (this.state.shouldShowFixedText) {
      this.resizeForText()
    }
  }

  resizeForText = (added = '') => {
    let text = this.refs.myInput.value + added
    let textWidth = measureString(this.refs.myInput, text)
    if (textWidth === 0) {
      textWidth = DEFAULT_INPUT_WIDTH
    }
    this.setState(Object.assign({}, this.state, {
      shouldShowFixedText: text === '' ? false : true,
      inputWidth: textWidth
    }))
  }

  handleDelete = (e) => {
    if (e.keyCode === KEY_BACKSPACE || e.keyCode === KEY_DELETE) {
      this.resizeForText()
    }
  }

  onKeyUp = (e) => {
    this.handleDelete(e)
  }

  onKeyDown = (e) => {
    this.handleDelete(e)
  }

  onKeyPress = (e) => {
    if (e.which && e.charCode) {
      let c = String.fromCharCode(e.keyCode | e.charCode);
      this.resizeForText(c);
    }
  }

  onMouseDown = (e) => {
    this.refs.myInput.focus()
    e.preventDefault() // stop focusing on <div>, keep focus on <input>
  }

  render () {
    let {fixedText: omit, ...inputProps} = this.props;  // eslint-disable-line no-unused-vars
    inputProps = Object.assign(inputProps, {
      onKeyUp: createChainedFunction(this.onKeyUp, this.props.onKeyUp),
      onKeyDown: createChainedFunction(this.onKeyDown, this.props.onKeyDown),
      onKeyPress: createChainedFunction(this.onKeyPress, this.props.onKeyPress),
    })
    return (
      <div
        onMouseDown={this.onMouseDown}
        style={
          Object.assign({}, this.props.style, {
            // 'flex' couldn't work well with <span> or <div> - the text will be vertical aligned to top
            // 'inline-block' with ''whiteSpace: nowap;' added unnecassery scrolls

            // display: 'flex',
            // flexWrap: 'nowrap',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            overflowY: 'hidden', // hack to disable unknown scroll while input
          })
        }>
        <input
          ref='myInput'
          {...inputProps}
          style={
            Object.assign({}, this.props.style, {
              // flexGrow: 1,
              // flexShrink: 0,
              display: 'inline-block',
              marginTop: 0,
              width: this.state.inputWidth,
            })
          }
        />
        <span
          style={
            Object.assign({}, this.props.style, {
              // flexGrow: 0,
              // flexShrink: 1,
              display: this.state.shouldShowFixedText ? this.props.style.display || 'inline-block' : 'none',
              marginTop: 0,
              width: 'auto',
            })
          }
        >
          {this.props.fixedText.replace(/ /g, '\u00a0')}
        </span>
      </div>
    )
  }

  // <div>
  //   <label>... -- might not to be presented
  //   <input>
  //   <div> for <hr>s
  //  ...
  // </div>

  // should become:
  // <div>
  //   <label>...
  //   <div flex>
  //     <input flex-growth: 0> dynamic resizable by content
  //     <span flex-growth: 1>fixedText</span>
  //   </div>
  //   <div> for <hr>s
  //  ...
  // </div>

}

export default class TextFieldWithContent extends React.Component {
  static propTypes = {
    /**
     * The fixed text added to the right (left in RTL) of the input string.
     */
    fixedText: PropTypes.string
  }

  render () {
    let {fixedText: omit, style, ...tfProps} = this.props // eslint-disable-line no-unused-vars

    return (
      <TextField
        {...tfProps}
        style={Object.assign({}, style, {
          overflowY: 'hidden' // hack due to unknown space after field (possibly due to inner marginTop)
        })}
      >
        <ExtendedInput fixedText={this.props.fixedText} defaultValue={this.props.defaultValue}/>
      </TextField>
    )
  }
}
