const test = require('node:test');
const assert = require('node:assert/strict');
const { buildTargetUrl } = require('../target.js');

const ORIGIN = 'https://www.kinokino.win';

test('film page with query params', () => {
  assert.equal(
    buildTargetUrl('https://www.kinopoisk.ru/film/518042/?socialAlias=ODM1MjAzNzQ%3D', ORIGIN),
    'https://www.kinokino.win/film/518042',
  );
});

test('film page without trailing slash', () => {
  assert.equal(buildTargetUrl('https://www.kinopoisk.ru/film/518042', ORIGIN), 'https://www.kinokino.win/film/518042');
});

test('film page with hash', () => {
  assert.equal(buildTargetUrl('https://www.kinopoisk.ru/film/518042/#reviews', ORIGIN), 'https://www.kinokino.win/film/518042');
});

test('series page keeps its type', () => {
  assert.equal(buildTargetUrl('https://www.kinopoisk.ru/series/77044/', ORIGIN), 'https://www.kinokino.win/series/77044');
});

test('trailing slash in target origin is ignored', () => {
  assert.equal(buildTargetUrl('https://www.kinopoisk.ru/film/518042/', ORIGIN + '/'), 'https://www.kinokino.win/film/518042');
});

test('other pages give null', () => {
  for (const url of [
    'https://www.kinopoisk.ru/',
    'https://www.kinopoisk.ru/lists/movies/top250/',
    'https://www.kinopoisk.ru/name/7836/',
    'https://www.kinopoisk.ru/film/518042/cast/',
    'https://www.kinopoisk.ru/film/abc/',
    'https://www.kinopoisk.ru/films/518042/',
    'not a url',
  ]) {
    assert.equal(buildTargetUrl(url, ORIGIN), null, url);
  }
});
