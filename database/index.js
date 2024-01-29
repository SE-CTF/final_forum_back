const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to database')
}).catch(err => {
    console.log(err.message)
})

db = {}
db.mongoose = mongoose

const contentModel = {
    author: String,
    title: String,
    text: String,
    comments: [{
        type: String
    }]
}

const contentSchema = db.mongoose.Schema(contentModel, { timestamps: true })
const Content = db.mongoose.model('Content', contentSchema)
db.Content = Content

module.exports = db
