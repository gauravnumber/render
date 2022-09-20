const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.json({hello: 'world'})
})

app.listen(PORT, () => {
	console.log(`Server running at ${PORT}`)
})