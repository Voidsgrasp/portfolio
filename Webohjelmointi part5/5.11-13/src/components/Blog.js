import React , { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const blog = props.blog
  const [blogObject, setBlogObject] = useState(blog)
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const buttonLabel = visible ? 'hide' : 'view'

 

  const removeBlog = () => props.deleteBlog(blog)

  const blogStyle = {
    paddingTop: 9,
    paddingLeft: 7,
    border: 'solid',
    borderWidth: 5,
    marginBottom: 6
  }
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired
  }
  const increaseLikes = () => {
    const updatedBlog = ({
      ...blog,
      likes: blog.likes + 1
    })
    props.updateBlog(updatedBlog)
    setBlogObject(updatedBlog)
  }
  return (
    <div style={blogStyle} className='blog'>
      <div>
        <p>{blog.title} - {blog.author} <button onClick={toggleVisibility}>{buttonLabel}</button></p>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{ blogObject.likes } <button id='like-button' onClick={increaseLikes}>like</button></p>
        <button id='remove' onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}


export default Blog