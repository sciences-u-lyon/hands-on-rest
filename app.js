const { intersection, isEmpty } = require('lodash');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');

let tvShows = require('./tv-shows.json').slice();

app.use(express.static('public'));
app.use(bodyParser.json());

const getTvShowById = (req, res, next) => {
  const tvShow = tvShows.find(tvShow => tvShow.id === req.params.id);
  if (!tvShow) {
    return res.sendStatus(404);
  }
  res.locals.tvShow = tvShow;
  next();
};

app.get('/', (req, res) => res.send('Hello, World!'));

app.post('/db/seed', (req, res) => {
  tvShows = require('./tv-shows.json').slice();
  res.sendStatus(204);
});

app.get('/tv-shows', (req, res) => {
  let genres = req.query.genres;
  if (!genres) {
    return res.json(tvShows);
  }
  genres = genres.split(',');
  const filteredTvShows = tvShows.filter(tvShow => {
    return intersection(tvShow.genres, genres).length > 0;
  });
  return res.json(filteredTvShows);
});

app.get('/tv-shows/:id', getTvShowById, (req, res) => {
  const tvShow = res.locals.tvShow;
  return res.json(tvShow);
});

app.post('/tv-shows', (req, res) => {
  const newTvShow = req.body;
  if (!newTvShow || isEmpty(newTvShow)) {
    return res.sendStatus(400);
  }
  tvShows.push({
    id: uuidv1(),
    ...newTvShow
  });
  return res.status(201).json(tvShows[tvShows.length - 1]);
});

app.put('/tv-shows/:id', getTvShowById, (req, res) => {
  const tvShow = res.locals.tvShow;
  const newTvShow = req.body;
  if (!newTvShow || isEmpty(newTvShow)) {
    return res.sendStatus(400);
  }
  const index = tvShows.indexOf(tvShow);
  tvShows[index] = newTvShow;
  return res.sendStatus(204);
});

app.delete('/tv-shows/:id', getTvShowById, (req, res) => {
  const tvShow = res.locals.tvShow;
  const index = tvShows.indexOf(tvShow);
  tvShows.splice(index, 1);
  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
