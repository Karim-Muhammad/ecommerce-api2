```js
exports.createCategory = catchAsync(async (req, res, next) => {
  // if we removed `catchAsync` throwing error will crash the app.
  const { name, description } = req.body;

  const newCategory = new Category({ name, description });

  try {
    await newCategory.save();
    // we can put it outside try..catch, and express will catch any rejected
    // promise and pass it to next(error) and it will be handled by error handler middleware
    // but we want to customize the error message, so we will use `throw` to throw the user-defined error

    res.status(201).json(newCategory);
  } catch (error) {
    // sometimes error should be 500 if there is error in code, or 400 if there is error in user input
    // we can remove this catch. and it will handle the message of error
    // BUT the status code will be 500, because it is handled by catchAsync

    throw ApiError.badRequest(error.message);
  }
});
```

in this code, if we removed `catchAsync` and an error occurred, the app will crash or go correctly, why? there is one reason for this:

1. Express version

in Express 5, if an error occurred in a async route handler, it will be passed to the error handler middleware, but in Express 4, it will crash the app, so we need to use `catchAsync` (or handle this manually) to catch the error and pass it to the error handler middleware.

i tried to remove `catchAsync` and the app crashed, so i think the version is Express 4. (and it was)

```json
    "express": "^4.19.2",
```

let's update version of expres, and see it application will crash or continue correctly like before (with catchAsync)

```json
    "express": "^5.0.0-beta.3"
```

```bash
npm install express@next
```

YES! the app is working correctly without `catchAsync` and the error is handled by the error handler middleware.
