// Importing necessary modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const config = require("./config.js");

// app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, '../FinalProjectDeliverable')));

// FavoriteInfo schema
const favoriteInfoSchema = new mongoose.Schema(
  {
    user_id: String,
    recipe: String,
    //Add to schema
  },
  { versionKey: false }
);

//Set favorite model
const Favorite = mongoose.model("favorite", favoriteInfoSchema);

//Functions
app.post("/api/favorite", async (req, res) => {
    const favorite = new Favorite ({ //Get rid of _id?
        user_id : req.body.user_id,
        recipe : req.body.recipe
      });
    
      favorite.save()
      console.log("Added Favorite");
    //   console.log(`${favorite.user_id}`);
    //   console.log(`${favorite.recipe}`);
});

app.delete("/api/favorite/:recipe", async (req, res) => {
    var user_id = req.body.user_id;
    var recipe = req.body.recipe;
    try {
      const favorite = await Favorite.findOneAndDelete({ user_id: user_id, recipe: recipe });
      if (favorite) {
        res.send("Deleted Favorite");
        console.log("Deleted Favorite");
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting favorite");
    }
    //   console.log(`${favorite.user_id}`);
    //   console.log(`${favorite.recipe}`);
});

app.get("/api/favorite/:recipe", async (req, res) => {
    var user_id = req.body.user_id;
    var recipe = req.body.recipe;
    try {
      const favorite = await Favorite.findOne({ user_id: user_id, recipe: recipe });
      if (favorite) {
        res.send(`Viewing ${favorite.recipe} from favorites`)
        console.log(`Viewing ${favorite.recipe} from favorites`);
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error viewing favorite");
    }
    //   console.log(`${favorite.user_id}`);
    //   console.log(`${favorite.recipe}`);
});

app.get("/api/favorites", async (req, res) => {
  var user_id = req.body.user_id;
      try {
        const favorite = await Favorite.find({ user_id: user_id });
        if (favorite) {
          res.send(`Viewing ${favorite}`)
          console.log("Viewing favorites");
        } else {
          res.status(404).json({ message: "Favorites not found" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Error viewing favorites");
      }
    //   console.log(`${favorite.user_id}`);
    //   console.log(`${favorite.recipe}`);
});


//Server
app.listen(5678); //start the server
console.log("Server is running...");