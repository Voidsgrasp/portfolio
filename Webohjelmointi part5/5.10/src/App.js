import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/notification'
import loginService from "./services/login";
import Footer from './components/Footer';
import Togglable from './components/Togglable';
import BlogForm from './components/blogform';

const App = () => {
  const [blogs, setBlogs] = useState([]) 
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
const createBlog = async (BlogToAdd) => {
  try {
    blogFormRef.current.toggleVisibility()
    const createdBlog = await blogService
      .create(BlogToAdd)
    setSuccessMessage(
      `Blog ${BlogToAdd.title} was successfully added`
    )
    setBlogs(blogs.concat(createdBlog))
    setErrorMessage(null)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  } catch(exception) {
    setErrorMessage(
      `Cannot add blog ${BlogToAdd.title}`
    )
    setSuccessMessage(null)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }
}
const updateBlog = async (BlogToUpdate) => {
  try {
    const updatedBlog = await blogService
      .update(BlogToUpdate)
    setSuccessMessage(
      `Blog ${BlogToUpdate.title} was successfully updated`
    )
    setBlogs(blogs.map(blog => blog.id !== BlogToUpdate.id ? blog : updatedBlog))
    setErrorMessage(null)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  } catch(exception) {
    setErrorMessage(
      `Cannot update blog ${BlogToUpdate.title}`
    )
    setSuccessMessage(null)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }
}
const deleteBlog = async (BlogToDelete) => {
  try {
    if (window.confirm(`Delete ${BlogToDelete.title} ?`)) {
      blogService
        .remove(BlogToDelete.id)
      setSuccessMessage(
        `Blog ${BlogToDelete.title} was successfully deleted`
      )
      setBlogs(blogs.filter(blog => blog.id !== BlogToDelete.id))
      setErrorMessage(null)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  } catch(exception) {
    setErrorMessage(
      `Cannot delete blog ${BlogToDelete.title}`
    )
    setSuccessMessage(null)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }
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

    
  if (user === null) {
    return (
        <div>
            <h2>Log in to application</h2>
            <Notification message={errorMessage} type='error'/>
            {loginForm()}
        </div>
    )
}
const byLikes = (b1, b2) => b2.likes - b1.likes
return (
  
  <div>
      <h2>blogs</h2>
      <Notification message={successMessage} type='success'/>
      <h1>{user.username} is logging in</h1>
      <button  onClick={handleLogout}>Logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef} >
      <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.sort(byLikes).map(blog =>
      <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
            />
            )}
      <Footer/>
  </div>
)


}

export default App