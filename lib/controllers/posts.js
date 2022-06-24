const { Router } = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.json(posts);
    } catch (e) {
      next(e);
    }
  });
