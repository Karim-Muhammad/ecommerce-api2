Make Webhook Payment for Production separated from Development

for example if you have a webhook payment for development route like this:

```js
app.post("/webhook", (req, res) => {
  // Your code here
});
```

You can create a new route for production like this:

```js
app.post("/webhook-production", (req, res) => {
  // Your code here
});
```
