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
        id: 30650,
        comments: ['Cool!', 'I dislike it(']
      },
      {
        id: 30649,
        comments: ['Delete this movie!', 'I want to watch the movie again!']
      },
      {
        id: 30656,
        comments: ['Delete this movie!', 'I want to watch the movie again!', 'Great film!', 'Its story of a couple of carnival folk and the jams they get themselves into is genuinely funny, and as the luckless sideshow barker and his half-fish half-girl partner, Red Skelton and Esther Williams are delightfully teamed.']
      },
      {
        id: 30655,
        comments: ['Delete this movie!', 'I want to watch the movie again!', 'The playing Is good, John Schlesingers direction (and his use of evocative backgrounds) is efficient. But the plot Is a bit frayed.', 'I really liked it!']
      },
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


  // Get movie list
  const getMovies = async (page, limit) => {
    const url = `https://yts.mx/api/v2/list_movies.json?page=${page}&limit=${limit}`
    try {
      const data = await request(url)
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
        currentPage: +page,
        nextPage: page === lastPage ? page : +page + 1,
        prevPage: page === 1 ? 1 : +page - 1,
        lastPage: lastPage
      }

      setPagination(newPagination)

      if (isLocalStorage) {
        localStorage.setItem(storagePaginationName, JSON.stringify(newPagination))
      }

    } catch (e) {
      console.error('error', e)
    }
  }

  // Request to server
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

  // Show/Hide a movie
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

    if (isLocalStorage) {
      localStorage.setItem(storageMoviesDataName, JSON.stringify(newInitMoviesData))
    }

  }

  // Change pagination page
  const paginationHandler = (page) => {
    getMovies(page, pagination.limit)
  }

  // Add/remove comments
  const commentsHandler = (id, action, index) => {
    // action == true - add comment
    // action == false - remove comment
    let newInitMoviesData = JSON.parse(JSON.stringify(moviesData))

    if (action) {
      let newComment = newInitMoviesData.comments.filter((item) => {
        return item.id === id
      })
      if (newComment.length) {
        // if you need to add a comment to the existing ones
        newComment[0].comments.push(index)
      } else {
        // else create the first comment
        newComment = {
          id: id,
          comments: [index]
        }
        newInitMoviesData.comments.push(newComment)
      }
    } else {
      // delete a comment
      const newComment = newInitMoviesData.comments.filter((item) => {
        return item.id === id
      })
      newComment[0].comments.splice(index, 1)
    }

    setMoviesData(newInitMoviesData)

    if (isLocalStorage) {
      localStorage.setItem(storageMoviesDataName, JSON.stringify(newInitMoviesData))
    }

  }

  return (
    <div className='App'>
      <h1>List of movies</h1>
      <Movies
        movies={movies}
        moviesData={moviesData}
        showHandler={showHandler}
        commentsHandler={commentsHandler}
      />
      <Pagination pagination={pagination} paginationHandler={paginationHandler} />
      {loading && <Loader />}
    </div>
  )
}

export default App
