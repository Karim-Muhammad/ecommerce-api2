nested query wasn't working for me, so I had to install the `qs` package and use it to parse the query string. Here's the code I used:

```javascript
var express = require("express");
var qs = require("qs");
var app = express();

app.set("query parser", function (str) {
  return qs.parse(str);
});
```
