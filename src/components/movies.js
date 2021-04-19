export const Movies = (props) => {
  console.log('props', props)

  const onShowHandler = (event) => {
    props.showHandler(event.target.name, event.target.value === 'Hide'? true : false)
  }

  let table
  if (props.movies !== null) {
    table = props.movies.map((movie) => {
      const hiddenElem = props.moviesData.hidden.includes(movie.id)

      return (
        <div key={movie.id}>
          { !hiddenElem && <div className='table__row' >
            <div className="table__row__item" style={{ backgroundImage: `url(${movie.image})` }}></div>
            <div className="table__row__item">
              <h2 className="table__row__item__title">{movie.title}</h2>
              <p className="table__row__item__year">{movie.year} г.</p>
              <p className="table__row__item__raiting">Rating: <span>{movie.rating}</span></p>
              <p className="table__row__item__date">Uploaded date: {movie.date}</p>
            </div>
            <div className="table__row__item">
              <p className="table__row__item__synopsis">{movie.synopsis}</p>
              <div className="table__row__item__hide"><input type="button" name={movie.id} onClick={onShowHandler} value='Hide'/></div>
            </div>
          </div>}
          {hiddenElem && <div className='table__row_hidden' >
            <h2 className="table__row__item__title_hidden">{movie.title}</h2>
            <div className="table__row__item__hide table__row__item__hide_hidden"><input type="button" name={movie.id} onClick={onShowHandler} value='Show'/></div>
          </div>}
        </div>
      )
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