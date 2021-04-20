import { useState } from 'react'

export const Movies = (props) => {
  const [addComment, setAddComment] = useState({
    id: null,
    show: false,
    text: ''
  })

  // Hide/Show chosen movie
  const onShowHandler = event => {
    props.showHandler(event.target.name, event.target.value === 'Hide' ? true : false)
  }

  // Hide/Show comments textarea
  const commentsShowHandler = event => {
    setAddComment({
      ...addComment,
      id: +event.target.name,
      show: addComment.id === +event.target.name && addComment.show ? false : true,
      text: addComment.id === +event.target.name ? addComment.text : ''
    })
  }

  // Listen textarea changes
  const onChangeHandler = event => {
    setAddComment({
      ...addComment,
      text: event.target.value
    })
  }


  // Add/Remove comments handler
  const commentsHandler = event => {
    const eventData = event.target.name.split(',')
    if (JSON.parse(eventData[1])) {
      if (addComment.text.trim().length) {
        props.commentsHandler(+eventData[0], JSON.parse(eventData[1]), addComment.text.trim())
        setAddComment({
          ...addComment,
          show: false,
          text: ''
        })
      }
    } else {
      props.commentsHandler(+eventData[0], JSON.parse(eventData[1]), +eventData[2])
    }

  }


  // Create JSX
  let table
  if (props.movies !== null) {
    table = props.movies.map((movie) => {
      const hiddenElem = props.moviesData.hidden.includes(movie.id)
      const comments = props.moviesData.comments.filter((item) => {
        return item.id === movie.id
      })

      let commentsList = null
      if (comments.length !== 0) {
        commentsList = comments[0].comments.map((item, i) => {
          return <li className='table__row__item__comments__item' key={i}>
            <input type='button' name={[movie.id, false, i]} onClick={commentsHandler} value='-' />
            <span>{item}</span>
          </li>
        })
      }

      return (
        <div key={movie.id} className={hiddenElem ? 'table__row_hidden' : 'table__row'}>
          { !hiddenElem &&
            <>
              <div className='table__row__item' style={{ backgroundImage: `url(${movie.image})` }}></div>
              <div className='table__row__item'>
                <h2 className='table__row__item__title'>{movie.title}</h2>
                <p className='table__row__item__year'>{movie.year} г.</p>
                <p className='table__row__item__rating'>Rating: <span>{movie.rating}</span></p>
                <p className='table__row__item__date'><span>Uploaded date: </span>{new Date(movie.date).toLocaleDateString()}</p>
              </div>
              <div className='table__row__item'>
                <h3 className='table__row__item__synopsis__title'>Synopsis</h3>
                <p className='table__row__item__synopsis'>{movie.synopsis}</p>
                <div className='table__row__item__hide'><input type='button' name={movie.id} onClick={onShowHandler} value='Hide' /></div>
              </div>
              <h3 className='table__row__item__comments__title'>Comments:
                <input
                  type='button'
                  name={movie.id}
                  onClick={commentsShowHandler}
                  className='write'
                  value={addComment.show && addComment.id === movie.id ? 'Close window' : 'Write a comment'}
                />
                {addComment.show && addComment.id === movie.id && addComment.text.trim() &&
                  <input
                    type='button'
                    name={[movie.id, true, null]}
                    onClick={commentsHandler}
                    className='add'
                    value='Add comment' />}
              </h3>
              {addComment.show && addComment.id === movie.id &&
                <textarea
                  rows="2"
                  name="comment"
                  placeholder='Your comment'
                  className='table__row__item__comments__area'
                  value={addComment.text}
                  onChange={onChangeHandler}
                >
                </textarea>}
              {comments.length !== 0 && <div className='table__row__item'>
                <ul className='table__row__item__comments'>{commentsList}</ul>
              </div>}
            </>}
          {hiddenElem &&
            <>
              <h2 className='table__row__item__title_hidden'>{movie.title}</h2>
              <div className='table__row__item__hide table__row__item__hide_hidden'>
                <input type='button' name={movie.id} onClick={onShowHandler} value='Show' />
              </div>
            </>}
        </div>
      )
    })
  }

  return (
    <div className='table'>
      <div className='table__head'>
        <div className='table__head__item'>Cover</div>
        <div className='table__head__item'>About movie</div>
        <div className='table__head__item'>Synopsis</div>
      </div>
      {table}
    </div>
  )
}