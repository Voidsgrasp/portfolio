import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen  } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component tests', () => {
  let blog = {
    title:"First class tests",
    author:"Robert C. Martin",
    url:"http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes:123
  }

  let mockUpdateBlog = jest.fn()
  let mockDeleteBlog = jest.fn()

  test('renders title and author', () => {
    const component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )


    expect(component.container).toHaveTextContent(
      'First class tests - Robert C. Martin'
    )
  })

 test('clicking the view button displays url and number of likes', () => {
    const component = render(
      <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )

  expect(component.container).toHaveTextContent(
    'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
  )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      '123'
    )
  })
  test("clicking like twice calls event handler twice", async () => {
    render(
        <Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    )
    const button1 = screen.getByText('view')
    fireEvent.click(button1)
    const button = screen.getByText('like')
    fireEvent.click(button)
    expect(mockUpdateBlog.mock.calls).toHaveLength(1)
    fireEvent.click(button)
    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })

})