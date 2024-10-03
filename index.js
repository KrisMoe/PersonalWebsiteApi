
const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const itemsPool = require('./dbConfig')

app.get('/', (req, res) => {
    res.send('Simple API homepage');
})
// Handle Whole Games
app.get('/api/games', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM games'
        );
        //res.json({allItems});
        res.send(allItems.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})
app.get('/api/games/gamecode', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM games WHERE gamecode = ($1)',
            [req.query.gamecode]
        );
        //res.json({allItems});
        res.send(allItems.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.get('/api/games/players', async(req, res) => {
    console.log('params '+ req.query.gamecode)
    try {
        const gameid = await itemsPool.query(
            'SELECT id FROM games WHERE gamecode = ($1)',
            [req.query.gamecode]
        );
        console.log(gameid);
        console.log(gameid.rows[0].id);
        const allItems = await itemsPool.query(
            'SELECT * FROM players WHERE gameid = ($1)',
            [gameid.rows[0].get(id)]
        );
        console.log(allItems);
        res.send(allItems.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})
app.get('/api/games/getid', async(req, res) => {
    console.log('params '+ req.query.gamecode)
    try {
        const gameid = await itemsPool.query(
            'SELECT id FROM games WHERE gamecode = ($1)',
            [req.query.gamecode]
        );
        res.send(gameid.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})
app.post('/api/games/create', async (req, res) => {
    const { gamecode, gametype } = req.body;
    console.log(gamecode,gametype)
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO games (gametype , gamecode, cardsinplay) VALUES (($1), ($2), ARRAY[1,2,3,4,5,6,7,8,9,10])',
            [gametype,gamecode]
        );
        res.status(201).json({ 
            message: "New item added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.delete('/api/games/delete', async (req, res) => {
  const { gamecode } = req.params;
  console.log(gamecode)
  try {
      const newItem = await itemsPool.query(
          'DELETE FROM games WHERE gamecode = ($1)',
          [gamecode]
      );
      res.status(201).json({ 
          message: " item deleted!",
       });
  } catch (error) {
      console.log(error);
      res.status(500).send(error.message)
  }
})
// Handle Players
app.post('/api/player/create', async (req, res) => {
  const { playername, gameid} = req.body;
  console.log(gameid,playername)
  try {
      const newItem = await itemsPool.query(
          'INSERT INTO players (name, gameid, cardsinhand) VALUES (($1),($2),ARRAY[]::INT[])',
          [playername,gameid]
      );
      res.status(201).json({ 
          message: "New Player added!",
          item: newItem.rows
       });
  } catch (error) {
      console.log(error);
      res.status(500).send(error.message)
  }
})

app.delete('/api/player/delete', async (req, res) => {
    const { playername, gameid } = req.body;
    console.log(gamecode,playername)
    try {
        const newItem = await itemsPool.query(
            'DELETE FROM cars WHERE name = ($1) AND gamdid = ($2)',
            [playername,gameid]
        );
        res.status(201).json({ 
            message: "Player DELETED",

         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  })

app.post('/api/player/addcard', async (req, res) => {
    const { cardnum, gameid,playername} = req.body;
    console.log(gameid,playername,gameid)
    try {
        const newItem = await itemsPool.query(
            'UPDATE player SET cardsinhand = array_append(cardsinhand, ($1)) WHERE gameid = ($2) AND name = ($3);',
            [cardnum,gameid,playername]
        );
        res.status(201).json({ 
            message: "New Player added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  })

app.delete('/api/player/removecard', async (req, res) => {
    const { cardnum, gameid,playername} = req.body;
    console.log(gameid,playername,gameid)
    try {
        const newItem = await itemsPool.query(
            'UPDATE player SET cardsinhand = array_remove(cardsinhand, ($1)) WHERE gameid = ($2) AND name = ($3);',
            [cardnum,gameid,playername]
        );
        res.status(201).json({ 
            message: "New Player added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  })

app.get('/api/player/cards', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT cardsinhand FROM players WHERE name = ($1)',
            [req.query.playerid]
        );
        res.send(allItems.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})
// Handle Decks
app.post('/api/deck/create', async (req, res) => {
    const { deckname, gameid} = req.body;
    console.log(gameid,deckname)
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO decks (name, gameid, cardsindeck) VALUES (($1),($2),ARRAY[]::INT[])',
            [deckname,gameid]
        );
        res.status(201).json({ 
            message: "New Player added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  })
app.post('/api/deck/addcard', async (req, res) => {
    const { cardnum, gameid,deckname} = req.body;
    console.log(gameid,deckname)
    try {
        const newItem = await itemsPool.query(
            'UPDATE deck SET cardsindeck = array_append(cardsindeck, ($1)) WHERE gameid = ($2) AND name = ($3);',
            [cardnum,gameid,deckname]
        );
        res.status(201).json({ 
            message: "New Card Added",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  })
app.delete('/api/deck/removecard', async (req, res) => {
    const { cardnum, gameid,deckname} = req.body;
    console.log(gameid,deckname)
    try {
        const newItem = await itemsPool.query(
            'UPDATE deck SET cardsindeck = array_remove(cardsindeck, ($1)) WHERE gameid = ($2) AND name = ($3);',
            [cardnum,gameid,deckname]
        );
        res.status(201).json({ 
            message: "Card Removed",
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
  })
app.get('/api/deck/cards', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT cardsindeck FROM decks WHERE name = ($1)',
            [req.query.deckname]
        );
        res.send(allItems.rows)
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

  
app.listen(5070, () => {
    console.log("Server running on port 5070");
})