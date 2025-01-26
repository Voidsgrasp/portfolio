const app = require("../app")
const supertest = require("supertest")
const mongoose = require("mongoose")
const helper = require("./helper")
const Blog = require("../models/blog")
const api = supertest(app)

describe("test for blogs", () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
		const promiseArray = blogObjects.map(blog => blog.save())
		await Promise.all(promiseArray)
	})

	test("get correct amount of blogs", async () => {
		const response = await api.get("/api/blogs")
		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})

	test("a new blog is created", async () => {
		let newBlog = {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5
		}

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	})

	test("a blog can be deleted", async () => {
		const blogsAtStart = await helper.blogsInDB()
		const blogToDelete = blogsAtStart[0]

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const remainingBlogs = blogsAtEnd.map(b => b.id)
		expect(remainingBlogs).not.toContain(blogToDelete.id)
	})

	test("blog with valid id can be updated", async () => {
		let newBlog = {
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
			likes: 10,
		}

		const blogsAtStart = await helper.blogsInDB()
		const blogToUpdate = blogsAtStart[0]
		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(newBlog)
			.expect(200)
			.expect("Content-Type", /application\/json/)

		const blogsAtEnd = await helper.blogsInDB()
		expect(blogsAtEnd[0]).toEqual({ ...newBlog, id: blogToUpdate.id })

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	}, 50000)
})
afterAll(() => {
  mongoose.connection.close()
})