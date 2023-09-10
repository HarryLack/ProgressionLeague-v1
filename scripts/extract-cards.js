// Script to get cards up to a date from ygoprodeck api and convert to a csv of names
const fs = require('fs');

const date = { day: '09', month: '11', year: 2011 };

fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=01%2F01%2F1990&enddate=${date.month}%2F${date.day}%2F${date.year}&dateregion=tcg_date`, { method: 'GET' })
  .then(async (response) => response.json().then((res) => {
    const cards = res.data.map((card) => card.name);
    const reduced = cards.reduce((acc, entry) => `${acc}\n${entry}`);
    // TODO escape commas in game names
    fs.writeFileSync('./cards.tsv', reduced, 'utf-8');
  })).catch((err) => {
    console.log(err);
  });
