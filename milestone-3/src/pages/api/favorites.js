// pages/api/favorite.js

// import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const connectionURL = process.env.DB_URI; // Replace with your MongoDB connection URL
// const dbName = "<your-database-name>"; // Replace with your MongoDB database name

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const favoriteInfoSchema = new mongoose.Schema(
  {
    user_id: String,
    recipe: String,
    title: String,
  },
  { versionKey: false }
);

let Favorite;
try {
  Favorite = mongoose.model("favorite", favoriteInfoSchema);
} catch {
  Favorite = mongoose.model("favorite");
}

export default async function handler(req, res) {
  const { method, query, body } = req;

  switch (method) {
    case "POST":
      try {
        const favorite = new Favorite({
          user_id: body.user_id,
          recipe: body.recipe_id,
          title: body.title,
        });
        console.log("Favorite Object:", favorite);
        await favorite.save();
        console.log("Added Favorite");
        res.status(200).json({ message: "Favorite added" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding favorite" });
      }
      break;

    case "DELETE":
      try {
        const favorite = await Favorite.findOneAndDelete({
          user_id: query.user_id,
          recipe: query.recipe,
        });
        if (favorite) {
          console.log("Deleted Favorite");
          res.status(200).json({ message: "Favorite deleted" });
        } else {
          res.status(404).json({ message: "Favorite not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting favorite" });
      }
      break;

    case "GET":
      try {
        switch (query.action) {
          case "view":
            const favorite = await Favorite.findOne({
              user_id: query.user_id,
              recipe: query.recipe,
            });
            if (favorite) {
              console.log(`Viewing ${favorite.recipe} from favorites`);
              res
                .status(200)
                .json({ message: `Viewing ${favorite.recipe} from favorites` });
            } else {
              res.status(404).json({ message: "Favorite not found" });
            }
            break;

          case "list":
            const favorites = await Favorite.find({ user_id: query.user_id });
            if (favorites.length > 0) {
              console.log("Viewing favorites");
              res.status(200).json({ favorites });
            } else {
              res.status(404).json({ message: "Favorites not found" });
            }
            break;

          default:
            res.status(400).json({ message: "Invalid action" });
            break;
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error viewing favorites" });
      }
      break;

    default:
      res.setHeader("Allow", ["POST", "DELETE", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
