export function getPosts(req, res, next) {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post  ' }]
  })
}

export function createPost(req, res, next) {
  const title = req.body.title
  const content = req.body.content
  // Create post in the database
  res.status(201).json({
    message: "Post Have Been Created Successfuly",
    post: { id: new Date().toISOString(), title: title, content: content }
  })
}
