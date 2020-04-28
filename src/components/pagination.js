import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

// Pagination wrapper component
const Pagination = ({ first, last, index, pageCount }) => {
  const prevPageLogic = index === 2 ? "blog/" : `blog/${(index - 1).toString()}`
  const secPageLogic = `blog/${(index + 1).toString()}`
  return (
    <div className="pagination">
      {!!first || (
        <Link to={prevPageLogic}>
          <div className="pagination_number--box">
            <div className="arrow">&#8249;</div>
          </div>
        </Link>
      )}
      <PageNums index={index} pageCount={pageCount} />
      {!!last || (
        <Link to={secPageLogic}>
          <div className="pagination_number--box">
            <div className="arrow">&#8250;</div>
          </div>
        </Link>
      )}
    </div>
  )
}

/* 
PageNums is function that logicaly calculates the range 
around the index of the page and returns the right list 
of numbers related to the page range 
*/
const PageNums = ({ index, pageCount }) => {
  const range = (from, to, step = 1) => {
    let i = from
    const range = []

    while (i <= to) {
      range.push(i)
      i += step
    }
    return range
  }

  if (pageCount <= 5) {
    return ListItem(range(1, pageCount))
  }
  if (pageCount > 5) {
    return ListItem(range(index, index + 5))
  }
  if (pageCount - 5 >= index) {
    return ListItem(range(pageCount - 5, pageCount))
  }
}

/* 
Listitem component receives the range around the index
of page passed from PageNums function and renders the right Ui 
accordingly
*/
const ListItem = (callBackRange) => {
  return (
    <div className="pagination_number">
      <ul>
        {callBackRange.map((num) => {
          return (
            <li key={"key_" + num}>
              <Link
                activeClassName="active-link"
                to={num === 1 ? "blog/" : `blog/${num}`}
              >
                <div className="pagination_number--box">{num}</div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Pagination

// Prop-Types
Pagination.propTypes = {
  first: PropTypes.bool,
  last: PropTypes.bool,
  index: PropTypes.number,
  pageCount: PropTypes.number,
}

PageNums.proprTypes = {
  index: PropTypes.number,
  pageCount: PropTypes.number,
}

ListItem.propTypes = {
  callBackRange: PropTypes.array,
}
