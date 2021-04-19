import { useState, useEffect } from 'react'
import { Movies } from './components/movies'
import { Pagination } from './components/pagination'
import { Loader } from './components/loader'
import 'normalize.css'
import './sass/App.sass'

const isLocalStorage = storageAvailable('localStorage')

function storageAvailable(x) {
  try {
    localStorage.setItem(x, x)
    localStorage.removeItem(x)
    return true
  }
  catch (e) {
    return false
  }
}

const storageMoviesDataName = 'moviesData'
const storagePaginationName = 'paginationData'
let initMoviesData
let initPaginationData
if (isLocalStorage) {
  initMoviesData = JSON.parse(localStorage.getItem(storageMoviesDataName))
  initPaginationData = JSON.parse(localStorage.getItem(storagePaginationName))
}
if (!initMoviesData) {
  initMoviesData = {
    hidden: [],
    comments: [
      {
        id: 30581,
        comment: ['Cool!', 'I didn&rsquo;t like']
      },
      {
        id: 30578,
        comment: ['Delete this movie!', 'I want to watch &quot;the movie&quot; again!']
      }
    ]
  }
}

if (!initPaginationData) {
  initPaginationData = {
    currentPage: 1,
    prevPage: 1,
    nextPage: 1,
    lastPage: 1,
    limit: 10
  }
}


function App() {
  const [moviesData, setMoviesData] = useState(initMoviesData)
  const [pagination, setPagination] = useState(initPaginationData)
  const [movies, setMovies] = useState(null)
  const [loading, setLoading] = useState(false)

  // componentDidMount
  useEffect(() => {
    getMovies(pagination.currentPage, pagination.limit)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // Получить список фильмов
  const getMovies = async (page, limit) => {
    const url = `https://yts.mx/api/v2/list_movies.json?page=${page}&limit=${limit}`
    try {
      const data = await request(url)
      console.log('data', data)
      const newMovies = data.data.movies.map((item) => {
        return {
          id: item.id,
          date: item.date_uploaded,
          image: item.medium_cover_image,
          rating: item.rating,
          synopsis: item.synopsis,
          title: item.title,
          year: item.year
        }
      })
      setMovies(newMovies)

      const lastPage = Math.ceil(data.data.movie_count / pagination.limit)
      const newPagination = {
        ...pagination,
        currentPage: page,
        nextPage: page === lastPage ? page : page + 1,
        prevPage: page === 1 ? 1 : page - 1,
        lastPage: lastPage
      }
      setPagination(newPagination)
      localStorage.setItem(storagePaginationName, JSON.stringify(newPagination))

    } catch (e) {
      console.log('error', e)
    }
  }


  // Запрос на сервер
  const request = async (url) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const data = await response.json()
      setLoading(false)
      return data

    } catch (e) {
      setLoading(false)
      throw e
    }
  }

  // Скрыть/показать фильм
  const showHandler = (id, hide) => {
    const newInitMoviesData = JSON.parse(JSON.stringify(moviesData))

    if (hide) {
      newInitMoviesData.hidden.push(+id)
    } else {
      const newHidden = newInitMoviesData.hidden.filter((item) => {
        return item !== +id
      })
      newInitMoviesData.hidden = newHidden
    }
    setMoviesData(newInitMoviesData)
    localStorage.setItem(storageMoviesDataName, JSON.stringify(newInitMoviesData))
  }

  // Сменить страницу пагинации
  const paginationHandler = (page) => {
    getMovies(page, pagination.limit)
  }

  return (
    <div className='App'>
      <h1>List of films</h1>
      <Movies
        movies={movies}
        moviesData={moviesData}
        showHandler={showHandler}
      />
      <Pagination pagination={pagination} paginationHandler={paginationHandler} />
      {loading && <Loader />}
    </div>
  )
}

export default App
