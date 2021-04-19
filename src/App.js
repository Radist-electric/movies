import { useState, useEffect } from 'react'
import { Movies } from './components/movies'
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

const storageName = 'moviesData'
let initMoviesData
if (isLocalStorage) {
  initMoviesData = JSON.parse(localStorage.getItem(storageName))
}
if (!initMoviesData) {
  initMoviesData = {
    hidden: [30592, 30593],
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

// console.log('initMoviesData', initMoviesData)

function App() {
  const [moviesData, setMoviesData] = useState(initMoviesData)
  const [movies, setMovies] = useState(null)
  const [loading, setLoading] = useState(false)

  // componentDidMount
  useEffect(() => {
    getMovies(10)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // Получить список фильмов
  const getMovies = async (limit) => {
    const url = `https://yts.mx/api/v2/list_movies.json?limit=${limit}`
    try {
      const data = await request(url)
      // console.log('data', data)
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

      // if (!response.ok) {

      // }
      setLoading(false)

      return data

    } catch (e) {
      setLoading(false)
      throw e
    }
  }

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
    // localStorage.setItem(storageName, JSON.stringify(newInitMoviesData))
  }

  return (
    <div className="App">
      <h1>List of films</h1>
      <Movies
        movies={movies}
        moviesData={moviesData}
        showHandler={showHandler}
      />
      {loading && <Loader />}
    </div>
  )
}

export default App
