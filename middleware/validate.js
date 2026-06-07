const ALLOWED_CATEGORIES = [
  'Eripakkumised',
  'Eelroad & Suupisted',
  'Ramen',
  'Kõrvale',
  'Magustoit',
  'Joogid',
];

function validateMenuForm(body) {
  const errors = [];
  const { name, category, description, price, spiciness, ingredients, allergens } = body;

  if (!name || !name.trim()) errors.push('Nimi on kohustuslik');
  else if (name.trim().length > 120) errors.push('Nimi on liiga pikk (max 120 märki)');

  if (!category || !ALLOWED_CATEGORIES.includes(category.trim()))
    errors.push('Kategooria on kehtetu');

  if (!price) errors.push('Hind on kohustuslik');
  else {
    const p = parseFloat(price);
    if (isNaN(p) || p < 0 || p > 10000) errors.push('Hind peab olema vahemikus 0–10000');
  }

  const sp = parseInt(spiciness);
  if (isNaN(sp) || sp < 0 || sp > 3) errors.push('Vürtsisus peab olema 0–3');

  if (description && description.length > 1000)
    errors.push('Kirjeldus on liiga pikk (max 1000 märki)');

  if (ingredients && ingredients.length > 1000)
    errors.push('Koostis on liiga pikk (max 1000 märki)');

  if (allergens && allergens.length > 500)
    errors.push('Allergeenid on liiga pikk (max 500 märki)');

  return errors;
}

function validateContactForm(body) {
  const errors = [];
  const { name, email, subject, message } = body;

  if (!name || !name.trim()) errors.push('Nimi on kohustuslik');
  else if (name.trim().length > 120) errors.push('Nimi on liiga pikk (max 120 märki)');

  if (!email || !email.trim()) errors.push('E-post on kohustuslik');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.push('Vigane e-posti aadress');
  else if (email.length > 254) errors.push('E-post on liiga pikk');

  if (subject && subject.length > 200) errors.push('Teema on liiga pikk (max 200 märki)');

  if (!message || !message.trim()) errors.push('Sõnum on kohustuslik');
  else if (message.trim().length > 5000) errors.push('Sõnum on liiga pikk (max 5000 märki)');

  return errors;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function isPositiveInt(val) {
  const n = parseInt(val, 10);
  return !isNaN(n) && n > 0 && String(n) === String(val).trim();
}

module.exports = { validateMenuForm, validateContactForm, escapeHtml, isPositiveInt, ALLOWED_CATEGORIES };
