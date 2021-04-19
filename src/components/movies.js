import { useState, useEffect } from 'react'

export const Movies = (props) => {
  console.log('props', props)

  // useEffect(() => {
  // if(props.movies !== null) {

  // }
  // }, [props])

  let table
  if (props.movies !== null) {
    table = props.movies.map((movie) => {
      return <div className='table__row' key={movie.id}>
        <div className="table__row__item" style={{ backgroundImage:`url(${movie.image})` }}></div>
        <div className="table__row__item">
          <h2 className="table__row__item__title">{movie.title}</h2>
          <p className="table__row__item__year">{movie.year} г.</p>
          <p className="table__row__item__raiting">Rating: <span>{movie.rating}</span></p>
          <p className="table__row__item__date">Uploaded date: {movie.date}</p>
        </div>
        <div className="table__row__item">
          {movie.synopsis}
        </div>
      </div>
    })
  }

  return (
    <div className='table'>
      <div className='table__head'>
        <div className="table__head__item">Cover</div>
        <div className="table__head__item">About movie</div>
        <div className="table__head__item">Synopsis</div>
      </div>
      {table}
    </div>
  )
}