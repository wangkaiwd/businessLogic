## `Koa`

### `Koa`的中间模型
> `U`型模型/洋葱模型
* demo

### Response Time
> read source code with question

* koa code
* express code
* google response time and read source code

### overview Koa api
app.xxx:
* app.use
* app.on
* app.emit

ctx.xxx: proxy by Object.defineProperty(the same as vue instance property proxy data in `data` that in options pass when vue instantiation)
* ctx.req/res: Node.js api
* ctx.request/response: Koa api

others:
* request.path
* request.query
* request.idempotent
* request.get
* response.status
* response.body x 5
* response.set() x2
* response.append()

### Koa vs Express
* state of javascript survey
