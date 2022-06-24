const pool = require('../utils/pool');

module.exports = class Post {
  id;
  title;
  content;
  username;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.content = row.content;
    this.username = row.username;
  }
  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM posts ORDER BY id DESC'
    );
    return rows.map(row => new Post(row));
  }
};
