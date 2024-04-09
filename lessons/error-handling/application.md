There are Error Handling for Express Level and Error Handling for Application Level. The difference between the two is that the first one is for a specific route, while the second one is for the whole application.

for example if you want to handle the errors which thrown in routes(middleware) you can use the first one, you use `next(error)` to pass the error to the error handling middleware.

```javascript
app.get("/error", (req, res, next) => {
  next(new Error("An error occurred"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

or if you want create a file (promise) in route and you want to handle this in express you can use the first one ALSO.

````javascript
app.get("/error", (req, res, next) => {
  fs.readFile("file.txt", (err, data) => {
    if (err) {
      next(err); // by using `next(err)` you can pass the error to the error handling middleware
    }
  });
});

If you want to handle the errors which thrown in the application you can use the second one, you use `catch` to catch the error and handle them in central place `process.on()`

```javascript
process.on("uncaughtException", (err) => {
  console.error(err.stack);
  app.close(() => {
    process.exit(1);
  });
});
````

or if you want to handle the errors which thrown in the promises(you didn't catch them) you can use the second one.

```javascript
process.on("unhandledRejection", (reason, promise) => {
  console.error(reason);
  server.close(() => {
    process.exit(1);
  });
});
```

> this to make your application more stable and prevent it from crashing.
> and allow you to **log** the error and handle it in a central place.

Why we `close` process after server end? because we want to make sure all requests are handled before the process ends.

while, if we ended the process quickly, the requests may not be handled properly (no response, handing then crash).

these are the two ways to handle errors outside express, for example **database connection**, **file system**, **http request**. may these promises are rejected, if you handled them in `catch` no `process.on()` needed, but if you didn't handle them in `catch` you need to use `process.on()` to catch them.

```javascript
const fs = require("fs");

fs.readFile("file.txt", (err, data) => {
  if (err) {
    console.error(err);
  }
});

process.on("uncaughtException", (err) => {
  console.error(err.stack);
  process.exit(1);
});
```

```javascript
const fs = require("fs");

fs.readFile("file.txt", (err, data) => {
  if (err) {
    throw err;
  }
});

process.on("uncaughtException", (err) => {
  console.error(err.stack);
  process.exit(1);
});
```

In General, Try to centralize your validation and error handling logic in a single place, so that you can easily manage and maintain it.

```

[]: # Path: lessons/error-handling/express.md
```
