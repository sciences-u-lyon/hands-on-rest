# hands-on-rest

> Let's build a REST API with a simple CRUD application

The goal of this server app is to handle CRUD operations (create, read, update, delete) with TV shows resources. Firstly, we'll manipulate in-memory JSON data (no database).

**The different steps to fulfill this project are the following ones:**

1. Add project configuration (dependencies, scripts)
2. "Hello, World!" with `Express`
3. Implement the different API endpoints (`GET`, `POST`, `PUT`, `DELETE`)
4. Check API features with e2e testing with `cypress`

## 1/ Project configuration

We'll need `npm` to handle dependencies and scripts. Open a terminal, go to the project root directory and type:
```bash
$ npm init -y
```
This will add a `package.json` file with default values.

Now we need dependencies:

- `Express` (create HTTP server, handle API endpoints)
```bash
$ yarn add express / npm install --save express
```
- `nodemon` (run `Express` server with hot reload)
```bash
$ yarn add --dev nodemon / npm install --save-dev nodemon
```

Finally, add a `start` task in the `scripts` object in `package.json`:
```json
"start": "nodemon ./app.js"
```
(`app.js` doesn't exist yet but we'll create it shortly)

## 2/ Hello, World!

Create a file `app.js` in the root directory (`hands-on-rest`). In this file, use `Express` to start a HTTP server on the port 3000, that ouptuts in the console "Listening on port 3000" when started.

Add a `GET` endpoint to the root URL (`/`) that sends "Hello, World!" as a response. This means that you should see "Hello, World!" on the page when going to http://localhost:3000 with your browser.

Finally, start your server by going to a terminal and typing:
```bash
$ yarn start / npm start
```
(Now, thanks to `nodemon` you won't need to restart your app when you update `app.js`)

> 💡 Hint:<br>
> 👉 https://expressjs.com/en/starter/hello-world.html

## 3/ API endpoints

Before implementing the different endpoints, install [Postman](https://www.getpostman.com/apps) app. This will allow you to perform `GET`, `POST`, `PUT` and `DELETE` requests to test your API and verify that everything works as expected.

Here are the different endpoints that should be created:
- `/tv-shows` (`GET`): should return all TV shows
- `/tv-shows/id` (`GET`): should return the TV show whose `id` is 'id'
- `/tv-shows?genres=genre1,genre2` (`GET`): should return the TV shows that contain any of the given `genres`
- `/tv-shows` (`POST`): should create a new TV show
- `/tv-shows/id` (`PUT`): should update the TV show whose `id` is 'id'
- `/tv-shows/id` (`DELETE`): should delete the TV show whose `id` is 'id'

### GET

#### `/tv-shows`

Let's create the first endpoint, the one that allows us to fetch all TV shows. TV shows data are stored in a JSON file: `tv-shows.json`. In `app.js`, add the `/tv-shows` endpoint that responds to `GET` requests and return all TV shows as JSON data. Here's how to get the TV shows from JSON:
```javascript
let tvShows = require('./tv-shows.json').slice();
```
We use the `slice()` method on the TV shows array to get a copy, as we don't want to be working on the original array.

Then, attach the whole list of TV shows on the response object (`res`) as JSON data.

Finally, test your endpoint with `Postman` to check that all TV shows are returned when you call http://localhost:3000/tv-shows.

> 💡 Hint:<br>
> 👉 https://expressjs.com/en/4x/api.html#res.json

#### `/tv-shows/id`

For this endpoint, you should find the corresponding TV show with the given id. If it exists, return it in the response object as JSON data. Otherwise, you should send a `404` status code (Not Found error).

Test your endpoint with `Postman` to check that the correct TV show whose id = '1' is returned when you call http://localhost:3000/tv-shows/1. Also, check that a `404` error is returned when you call http://localhost:3000/tv-shows/10 (for example).

> 💡 Hints:<br>
> 👉 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find<br>
> 👉 https://expressjs.com/en/api.html#req.params<br>
> 👉 https://expressjs.com/en/api.html#res.sendStatus

#### `/tv-shows?genres=genre1,genre2`

This endpoint is a bit special because it is actually the first one (`/tv-shows`), except it should return a filtered list of TV shows. Then, in the first endpoint handler function, find if there are `query` parameters in the request (`genres`) and if so, fetch all TV shows that have any of the given `genres` and attach them to the response.

You can use `Lodash intersection` function to compare arrays. Install it as a dependency:

```bash
$ yarn add lodash / npm install --save lodash
```

and import it in `app.js`:

```javascript
const { intersection } = require('lodash');
```

Test your endpoint with `Postman` to check that the correct TV shows are returned when you call http://localhost:3000/tv-shows?genres=action,sci-fi (for example). 

> 💡 Hints:<br>
> 👉 https://expressjs.com/en/api.html#req.query<br>
> 👉 https://lodash.com/docs/4.17.10#intersection

### POST

#### `/tv-shows`

This endpoint responds to a `POST` request. It should be used to create a new TV show. The new TV show will be sent as JSON data in the request body. Thus, we have to get that TV show from the `req` object body, add an `id` property, and add it to the TV shows collection.

To handle JSON data in the request body, we have to use the `bodyParser` middleware. Install it as a dependency:

```bash
yarn add body-parser / npm install --save body-parser
```

Import it in `app.js` and use it as a middleware on the global `app`:

```javascript
const bodyParser = require('body-parser');

app.use(bodyParser.json());
```

Once you get the TV show from the request body, you need to add an `id` property before adding it to the collection. We're going to use `uuid` module to generate a unique id. Install it as a dependency:

```bash
yarn add uuid / npm install --save uuid
```

Import it in `app.js`:

```javascript
const uuidv1 = require('uuid/v1');
```

and generate a unique id for the new TV show.

Add the new TV show to the collection and return a `201` status code (Created) with the newly created TV show as JSON data.

Also, you need to take care of the bad requests: you need to return a `400` status code (Bad Request error) if the request body is `undefined / null` or an empty object (you can use `Lodash isEmpty` function).

Test your endpoint with `Postman` by calling http://localhost:3000/tv-shows as a `POST` method and with a raw body as JSON (application/json):

```json
{
    "title": "Silicon Valley",
    "release": "2014-04-06T00:00:00Z",
    "genres": [
        "comedy"
    ]
}
```

> 💡 Hints:<br>
> 👉 https://expressjs.com/en/api.html#req.body<br>
> 👉 https://www.npmjs.com/package/uuid<br>
> 👉 https://lodash.com/docs/4.17.10#isEmpty

### PUT

#### `/tv-shows/id`

This endpoint should be used to replace a TV show in the collection with a new one. It responds to a `PUT` request. As for the 2nd `GET` endpoint, you should find the corresponding TV show in the collection with the given id. If it exists, you should replace it with the one that's attached to the request body, as JSON data. Otherwise, you should send a `404` status code (Not Found error).

Once it's updated, you should return a `204` status code (No Content). It means that the operation was successfull but no content is returned in the response payload.

Also, as for the `POST` endpoint, you need to return a `400` status code (Bad Request error) if the request body is `undefined / null` or an empty object.

Test your endpoint with `Postman` by calling http://localhost:3000/tv-shows/1 as a `PUT` method and with a raw body as JSON (application/json):

```json
{
  "id": "1",
  "title": "Black Mirror",
  "poster": "/img/black-mirror.jpg",
  "release": "2011-12-04T00:00:00Z",
  "genres": [
    "drama",
    "sci-fi",
    "thriller"
  ],
  "creator": "Charlie Brooker",
  "abstract": "An anthology series exploring a twisted, high-tech world where humanity's greatest innovations and darkest instincts collide."
}
```

### DELETE

#### `/tv-shows/id`

This endpoint should be used to delete a TV show from the collection. It responds to a `DELETE` request. As for the `PUT` endpoint, you should find the corresponding TV show in the collection with the given id. If it exists, you should delete it from the collection. Otherwise, you should send a `404` status code (Not Found error).

Once it's deleted, you should return a `204` status code (No Content).

Test your endpoint with `Postman` by calling http://localhost:3000/tv-shows/1 as a `DELETE` method.

> 💡 Hints:<br>
> 👉 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice

### Middleware

As you may have noticed, there is a bit of code duplication: the one where you need find the TV show given it's id and return a `404` status code if it doesn't exist. We're going to refactor this code into a middleware function. Let's declare a function with the following signature:

```javascript
const getTvShowById = (req, res, next) => {
  // TODO
};
```

Inside this function, find the TV show in the collection from its id (the request params). If it doesn't exist, return a `404` status code. Otherwise, add the TV show to the `locals` object of the response and call the `next()` function:

```javascript
res.locals.tvShow = tvShow;
```

Finally, use this middleware function in the endpoints where it's needed. You should able to remove all duplicated code. You can get the TV show (in the case it's been found) with `res.locals.tvShow`.

> 💡 Hints:<br>
> 👉 https://expressjs.com/en/api.html#res.locals
