import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SubwayBullet from './SubwayBullet'
import Icon from './Icon'

/**
 * Given a string with bracket notation placeholders, e.g.
 *  "This is a {{string}}"
 * The bracket is replaced with a component and its contents are passed to the component
 * @param {string} string 
 */
function replaceStringWithReactComponent (string) {
  // Returns as-is if not a string
  if (typeof string !== 'string') return string

  const array = string.replace(/{{(.+?)}}/g, '|{{$1}}|').split('|')

  const thing = array.map((item, i) => {
    if (item.match(/^{{.+}}$/)) {
      const line = item.replace('{{', '').replace('}}', '')
      if (line === 'shuttle_bus') {
        return <Icon type="bus" key={i * 10} />
      } else if (line === 'isa') {
        return <Icon type="isa" key={i * 10} />
      } else {
        return <SubwayBullet line={line} small key={i * 10} />
      }
    } else if (item.match('<br>')) {
      return <br key={i * 10} />
    }

    return item
  })

  return thing
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function transformStatusSummary (text) {
  // Typography - should address variable whitespace
  // Also get rid of <br>
  const phase1 = text.trim().replace(/\s*&bull;\s*/g, ' • ').replace(/\s*-\s*(?!bound)/g, '\u200a–\u200a').replace(/<br>/g, '')

  // Replace image HTML with {{brackets}}
  const phase1b = phase1.replace(/<img src='images\/routes\/14px\//g, '{{').replace(/.(png|gif)' align='bottom' \/>/g, '}}')

  // Add newlines between things
  // Split on anything that is 2 or more spaces
  // Drop any new array items that are empty strings
  const phase2 = phase1b.split(/ {2,}/).filter(i => i !== '')
  // Then add <br /> tags in between each line in React
  for (let i = 0; i < phase2.length; i++) {
    if (i % 2 === 0 && i < phase2.length - 1) {
      phase2.splice(i + 1, 0, <br key={i + 1} />)
    }
  }

  // Turn title into bold text
  phase2[0] = <strong key={0}>{capitalizeFirstLetter(phase2[0].toLowerCase())}</strong>

  // Replace images with bullet components
  phase2[phase2.length - 1] = replaceStringWithReactComponent(phase2[phase2.length - 1])

  // Original appends "more" to the end
  // phase2.push(' ... more')

  return phase2
}

function transformStatusDetail (text) {
  // Typography - should address variable whitespace
  const phase1 = text.trim().replace(/\s*&bull;\s*/g, ' • ').replace(/\s*-\s*(?!bound)/g, '\u200a–\u200a')

  // Replace image HTML with {{brackets}}
  const phase1b = phase1.replace(/<img src='images\/routes\/14px\//g, '{{').replace(/.(png|gif)' align='bottom' \/>/g, '}}')

  // Replace accessibility symbol
  const phase1c = phase1b.replace(/<img src='images\/ADA_WhlChr_small.gif'\s*\/?>/g, '{{isa}}')

  // Special work with <br>
  // If string begins or ends with any amount of <br>, remove it
  // Otherwise surround it with | so it can be split on later
  const phase2 = phase1c.replace(/^(<br>)*/, '').replace(/(<br>)*$/, '').replace(/<br>/g, '|<br>|')

  // Replace images with bullet components
  const phase3 = replaceStringWithReactComponent(phase2)

  return phase3
}

export default class ServiceNotice extends Component {
  static propTypes = {
    status: PropTypes.shape({
      id: PropTypes.number,
      summary: PropTypes.string,
      details: PropTypes.string
    }),
    active: PropTypes.bool
  }

  static defaultProps = {
    active: false
  }

  render () {
    const { status, active } = this.props

    return (
      <article className={(active === true) ? 'service-notice-active' : undefined}>
        <p>
          {transformStatusSummary(status.summary)}
        </p>

        <p className="service-notice-details">
          {transformStatusDetail(status.details)}
        </p>
      </article>
    )
  }
}