# CORS

```js
app.use(cors()); // Enable All CORS Requests (for all routes)
app.options("*", cors()); // Enable Pre-Flight Request (for all routes)
```

`app.use(cors())`

- Enable All CORS Requests (for all routes)
- Allow all origins, methods, and headers
- Not recommended for production
- Use with caution
- Use only for development
- Use only for testing
- uses in behind headers `Access-Control-Allow-Origin: *`
