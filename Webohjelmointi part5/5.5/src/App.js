import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/notification'
import loginService from "./services/login";
import Footer from './components/Footer';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]) 
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const blogFormRef = React.createRef()
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
      
    )  
  }, [])
  
  useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    console.log("hi")
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
      
		}
	}, [])
  console.log(user)
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
        const user = await loginService.login({
            username, password
        })
        blogService.setToken(user.token)
        window.localStorage.setItem(
            'loggedBlogappUser', JSON.stringify(user)
        )
        setUser(user)
        setUsername('')
        setPassword('')
    } catch (exception) {
        setErrorMessage('Wrong credentials')
        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }
}

const addBlog = (event) => {
  blogFormRef.current.toggleVisibility()
  event.preventDefault()
  const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
  }
  blogService
      .create(blogObject)
      .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setBlogs(blogs)
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
      })

  setSuccessMessage('Blog created!')
  setTimeout(() => {
      setSuccessMessage(null)
  }, 5000)
}

const handleLogout = async (event) => {
  event.preventDefault()
  try {
      window.localStorage.removeItem("loggedBlogappUser")
      setUser(null)
      setUsername('')
      setPassword('')
  } catch (exception) {
      setErrorMessage('Logout fails')
      setTimeout(() => {
          setErrorMessage(null)
      }, 5000)
  }
}

const handleTitleChange = (event) => {
  setNewTitle(event.target.value)
}

const handleAuthorChange = (event) => {
  setNewAuthor(event.target.value)
}

const handleUrlChange = (event) => {
  setNewUrl(event.target.value)
}
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

    const blogForm = () => (
      <form onSubmit={addBlog}>
          <label htmlFor="title">Title: </label>
          <input
              id="title"
              value={newTitle}
              onChange={handleTitleChange}
          />

          <label htmlFor="author">Author: </label>
          <input
              id="author"
              value={newAuthor}
              onChange={handleAuthorChange}
          />

          <label htmlFor="url">URL: </label>
          <input
              id="url"
              value={newUrl}
              onChange={handleUrlChange}
          />
          <button type="submit">create</button>
      </form>
  )
  if (user === null) {
    return (
        <div>
            <h2>Log in to application</h2>
            <Notification message={errorMessage} type='error'/>
            {loginForm()}
        </div>
    )
}
return (
  
  <div>
      <h2>blogs</h2>
      <Notification message={successMessage} type='success'/>
      <h1>{user.username} is logging in</h1>
      <button  onClick={handleLogout}>Logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef} >
      {blogForm()}
      </Togglable>
      
      <ul>
          {blogs.map(blog =>
              <li>
                  <Blog key={blog.id} blog={blog}/>
              </li>
          )}
      </ul>

      <Footer/>
  </div>
)


}

export default App