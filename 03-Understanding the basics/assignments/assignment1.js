import { createServer } from 'http'

const server = createServer((req, res) => {
  const url = req.url
  const method = req.method;
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>Home Page</title></head>')
    res.write('<h1>Hello From Home Page</h1>')
    res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>'
    )
    res.write('</html>')
    return res.end()
  }
  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>Users Page</title></head>')
    res.write('<h1>Hello From Users Page</h1>')
    res.write('<ul>')
    res.write('<li>User1</li>')
    res.write('</ul>')
    res.write('</html>')
    return res.end()
  }
  if (url === '/create-user') {
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      const username = parsedBody.split('=')[1]
      console.log(username)
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    })
  }
})
server.listen(3000, () => {
  console.log('server is listening on port 3000')
})