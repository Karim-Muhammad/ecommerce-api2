# Why `runValidators` is off by default in Mongoose?

- `runValidators` is off by default in Mongoose because it can be a performance bottleneck. If you're updating a document, you may not want to run validation on all fields. For example, if you're updating a document and only changing the `name` field, you may not want to run validation on the `email` field. By default, Mongoose only runs validators on fields that are modified. If you want to run validators on all fields, you can set the `runValidators` option to `true`.

[read more](https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator)

# Middlewares in Mongoose

in my opinion you must to read this article before use it by yourself
[read more](https://mongoosejs.com/docs/6.x/docs/middleware.html#pre)

# Pre Middleware accepts Callbacks which is accepting 3 arguments

- `next` is a function that you should call when your middleware is done. If the middleware function encounters an error, you can pass the error to `next` and Mongoose will handle the error.

- `error` is an error object that you can pass to `next` if you encounter an error in your middleware.

- `doc` is the document that the middleware is being called on. This is useful if you need to access the document that the middleware is being called on. (Take care of this, it's not always available)
- `doc` only available in `save` and `validate` hooks because in most times you use them with `document` instance. otherwise you can't access to `doc` in other hooks like `updateOne` or `deleteOne` because you don't have access to `document` instance but you use them in Query instead.
- `this` refer to document or Query instance that you use it in.
- `this` is available in all hooks.
- `this` refer to document if you use validators on document
- `this` refer to Query if you use validators on Query (like `updateOne` or `deleteOne`, `findOneAndDelete`, `findOneAndUpdate`)

# What is virtuals in Mongoose?

- Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while the setters are useful for de-composing a single value into multiple values for storage.

is it like computed fields? yes, it's like computed fields in SQL or computed properties in JavaScript.
