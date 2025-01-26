import axios from "axios"
const baseUrl = "/api/blogs"

let token = null
let config

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = async (newObject) => {
	const config = {
		headers: { Authorization: token },

	}

	const res = await axios.post(baseUrl, newObject, config)
    return res.data
}
const update = async objectToUpdate => {
	const response = await axios.put(`${baseUrl}/${objectToUpdate.id}`, objectToUpdate, config)
	return response.data
  }
  
  const remove = async id => {
	const response = await axios.delete(`${baseUrl}/${id}`, config)
	return response.data
  }

  export default { getAll, create, update, setToken, remove }