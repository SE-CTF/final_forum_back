require('dotenv').config()

const db = require('./database')

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const jwt = require('./jwt')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/forums', jwt.authenticateToken, async (req, res) => {
    const data = req.body
    data.author = req.user.user_id

    const new_content = new db.Content(data)

    res.status(200).send(await new_content.save())
})

app.get('/forums/:_id', async (req, res) => {
    const data = req.params
    const content = await db.Content.findOne({ _id: data._id })

    if (!content) {
        return res.status(400).send('Content does not exist.')
    }

    res.status(200).send(content)
})

app.get('/forums', async (req, res) => {
    const contents = await db.Content.find({})

    res.status(200).send(contents)
})

app.post('/forums/:_id/comments', async (req, res) => {
    const dataParams = req.params
    const dataBody = req.body

    const content = await db.Content.findOne({ _id: dataParams._id })

    if (!content) {
        return res.status(400).send('Content does not exist.')
    }

    content.comments.push(dataBody.comment)

    res.status(200).send(await content.save())
})

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
