export const Pagination = (props) => {

  // Переход по страницам пагинации кнопками
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

  // сменить страницу на ту, которую ввели в поле ввода
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
        }
      }
    }
  }

  return (
    <>
      <div className='pagination'>
        <input type="button" className="pagination__button" onClick={onClickHandler} name='first' value='1' />
        <input type="button" className="pagination__button" onClick={onClickHandler} name='prev' value='&lt;' />
        <input type="number" className="pagination__button" onKeyUp={handleKey} placeholder='№ страницы ' step='100' />
        <input type="button" className="pagination__button" onClick={onClickHandler} name='next' value='&gt;' />
        <input type="button" className="pagination__button" onClick={onClickHandler} name='last' value={props.pagination.lastPage} />
      </div>
      <p className="pagination__number">{props.pagination.currentPage} из {props.pagination.lastPage}</p>
    </>
  )
}
