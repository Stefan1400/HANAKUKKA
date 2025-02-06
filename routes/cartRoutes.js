const express = require('express');
const router = express.Router();
const pool = require('../db.js');  // Import the database connection

//NOT USING THIS YET
router.get('/productData', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productData');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//INITIALLY DISPLAY ALL PRODUCTS INSIDE CART
router.get('/userCart/GetAllProducts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM userCart');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// IMMEDIATELY DISPLAY NEW ADDED PRODUCT TO CART
router.get('/userCart/GetAddedItem', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM userCart ORDER BY id DESC LIMIT 1;');
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CHECK IF PRODUCT EXISTS TO DETERMINE ADD TO CART TEXT
router.get('/userCart/checkExist', async (req, res) => {
   const name = req.query.name;

   if (!name) {
      return res.status(400).json({ error: 'Missing "name" query parameter' });
   }

   try {
       const result = await pool.query(
         'SELECT 1 FROM userCart WHERE name = $1 LIMIT 1;', 
         [name]
      );
       res.json({ exists: result.rowCount > 0 });
   } catch (error) {
       console.error('Error checking product existence:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
});

// REMOVE PRODUCT FROM CART
router.delete('/userCart/:identifier', async (req, res) => {
    const { identifier } = req.params;
    const isId = /^\d+$/.test(identifier);

    try {
      let result;

      if (isId) {
         result = await pool.query('SELECT * FROM userCart WHERE id = $1', [identifier]);
      } else {
         result = await pool.query('SELECT * FROM userCart WHERE name = $1', [identifier]);
      }

      if (result.rows.length === 0) {
         return res.status(404).send('Product not found');
      }

      const itemToDelete = result.rows[0];
      
      if (isId) {
         await pool.query(
            'DELETE FROM userCart WHERE id = $1',
            [identifier]
         )
      } else {
         await pool.query(
            'DELETE FROM userCart WHERE name = $1',
            [identifier]
         )
      }

      res.status(200).json(itemToDelete);
    } catch (error) {
        res.status(500).send('Failed to remove product from userCart');
    }
});

// ADD PRODUCT TO CART
router.post('/userCart', async (req, res) => {
   const { name, price, url } = req.body;
   
   try {
       const result = await pool.query(
         'INSERT INTO userCart (name, price, url) VALUES ($1, $2, $3) RETURNING *', 
         [name, price, url]
      );

       const addedProduct = result.rows[0];

       res.status(201).json({
         addedName: addedProduct.name,
         addedPrice: addedProduct.price,
         addedURL: addedProduct.url
       })
   } catch (error) {
       console.error('Error fetching product data:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
});

// SEARCH 
router.get('/search', async (req, res) => {
    const searchTerm = req.query.query;

    const result = await pool.query(
        `SELECT * FROM productData 
         WHERE name ILIKE $1 
         ORDER BY 
            CASE 
                WHEN name ILIKE $2 THEN 1  
                ELSE 2                  
            END, 
            name ASC`,
        [`%${searchTerm}%`, `${searchTerm}%`]
    );
    

    res.json(result.rows);
})

module.exports = router;
