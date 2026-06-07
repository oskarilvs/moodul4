const express = require('express');
const router = express.Router();
const { db } = require('../../database/db');

router.get('/', (req, res) => {
  const { category, sort } = req.query;
  let query = 'SELECT * FROM menu_items';
  const params = [];

  if (category && category !== 'Kõik') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (sort === 'asc') query += ' ORDER BY price ASC';
  else if (sort === 'desc') query += ' ORDER BY price DESC';
  else query += ' ORDER BY category, name';

  const items = db.prepare(query).all(...params);

  res.json(
    items.map((item) => ({
      ...item,
      ingredients: item.ingredients ? item.ingredients.split(',').map((s) => s.trim()) : [],
      allergens: item.allergens ? item.allergens.split(',').map((s) => s.trim()) : [],
      isNew: item.is_new === 1,
    })),
  );
});

router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM menu_items ORDER BY category').all();
  res.json(['Kõik', ...rows.map((r) => r.category)]);
});

router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Ei leitud' });

  res.json({
    ...item,
    ingredients: item.ingredients ? item.ingredients.split(',').map((s) => s.trim()) : [],
    allergens: item.allergens ? item.allergens.split(',').map((s) => s.trim()) : [],
    isNew: item.is_new === 1,
  });
});

module.exports = router;
