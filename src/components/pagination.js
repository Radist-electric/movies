import { useRef } from 'react'

export const Pagination = (props) => {
  const input = useRef(null)

  // Navigating through the pages with buttons
  const onClickHandler = (event) => {
    let page
    switch (event.target.name) {
      case 'first':
        page = 1
        break
      case 'prev':
        page = props.pagination.prevPage
        break
      case 'next':
        page = props.pagination.nextPage
        break
      case 'last':
        page = props.pagination.lastPage
        break
      default:
        page = 1
    }
    if (page !== props.pagination.currentPage && page !== null) {
      props.paginationHandler(page)
    }
  }

  // Go to the page entered in the input field 
  const handleKey = event => {
    if (event.key === 'Enter') {
      const number = event.target.value.replace(/-/g, '')
      if (!!number) {
        let page
        if (number === 0) {
          page = 1
        } else if (number > props.pagination.lastPage) {
          page = props.pagination.lastPage
        } else {
          page = number
        }
        if (page !== props.pagination.currentPage) {
          props.paginationHandler(page)
          input.current.value = ''
        }
      }
    }
  }

  return (
    <>
      <div className='pagination'>
        <input type="button" className="pagination__button" onClick={onClickHandler} name='first' value='1' />
        <input type="button" className="pagination__button" onClick={onClickHandler} name='prev' value='&lt;' />
        <input type="number" className="pagination__button" onKeyUp={handleKey} placeholder='№ страницы ' step='100' ref={input}/>
        <input type="button" className="pagination__button" onClick={onClickHandler} name='next' value='&gt;' />
        <input type="button" className="pagination__button" onClick={onClickHandler} name='last' value={props.pagination.lastPage} />
      </div>
      <p className="pagination__number">{props.pagination.currentPage} из {props.pagination.lastPage}</p>
    </>
  )
}
