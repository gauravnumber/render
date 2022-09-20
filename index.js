const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.json({hello: 'world'})
})

app.get('/hello', (req, res) => {
	res.json({awesome: 'world'})
})

app.listen(PORT, () => {
	console.log(`Server running at ${PORT}`)
})