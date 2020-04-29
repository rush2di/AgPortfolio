import React from "react"
import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"
import PropTypes from "prop-types"

const timeout = 1000
const getCoverTransition = {
  entering: {
    transition: `all ${timeout}ms ease-in-out`,
    transform: "translateY(-100vh)",
  },
  exiting: {
    transition: `all ${timeout}ms ease-in-out`,
    transform: "translateY(100vh)",
  },
}
const getOpacityTransition = {
  entering: {
    position: `absolute`,
    opacity: 0,
  },
  entered: {
    transition: `opacity ${timeout - 250}ms ease-in-out`,
    opacity: 1,
  },
  exiting: {
    transition: `opacity ${timeout - 250}ms ease-in-out`,
    opacity: 0,
  },
}
const styleFixer = { position: "relative", width: "100%" }

class Transition extends React.PureComponent {
  render() {
    const { children, location } = this.props
    return (
      <TransitionGroup>
        <ReactTransition
          key={!!location ? location.pathname : ""}
          timeout={{
            enter: timeout,
            exit: timeout,
          }}
        >
          {(status) => (
            <div style={styleFixer}>
              <div
                className="transition--cover"
                style={{
                  ...getCoverTransition[status],
                }}
              ></div>
              <div
                style={{
                  ...getOpacityTransition[status],
                }}
              >
                {children}
              </div>
            </div>
          )}
        </ReactTransition>
      </TransitionGroup>
    )
  }
}

export default Transition

// Prop-Types
Transition.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
}
