import { MongoClient } from 'mongodb';

let db

export const mongoConnect = (callback) => {
  MongoClient.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@books-shop.quv8u2u.mongodb.net/?retryWrites=true&w=majority`)
    .then(client => {
      console.log('Connecting To DB Succesfull')
      db = client.db('books-shop')
      callback()
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

export const getDb = () => {
  if (db) {
    return db
  }
  throw 'No Database Found !'
}

