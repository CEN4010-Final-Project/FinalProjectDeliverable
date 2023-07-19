import Head from "next/head";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await fetch("../api/randomrecipes");
      const newData = await result.json();
      setRecipes(newData.recipes);
    };
    const timeout = setTimeout(getData, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleAddToFavorites = async (recipe) => {
    try {
      let user_id = Math.random();
      const { id, title } = recipe; // Destructure the recipe object to get id and title
      await axios.post("/api/favorites", {
        user_id: user_id,
        recipe_id: id,
        title: title,
      });
      console.log(`Added recipe with ID ${id} to favorites`);
      console.log(`Added recipe with TITLE ${title} to favorites`);
      // You can display a success message or perform any other actions upon successful addition.
    } catch (error) {
      console.error("Error adding to favorites:", error);
      // Handle errors here or display an error message to the user.
    }
  };

  return (
    <>
      <Head>
        <title>TasteBudz</title>
        <meta name="description" content="Online recipe service" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${inter.className} container max-w-2xl mx-auto px-4`}>
        <h1 className="text-3xl font-bold pt-3">Recipes</h1>
        {recipes ? (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex gap-x-6 mt-3 p-4 bg-slate-100 rounded-lg"
            >
              <div className="flex-grow">
                <h2 className="text-lg">
                  {recipe.title}
                  {recipe.vegetarian && (
                    <>
                      &nbsp;
                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                        Vegetarian
                      </span>
                    </>
                  )}
                </h2>
                <hr className="h-px my-2 bg-slate-300"></hr>
                <p className="text-sm">
                  Preparation time:{" "}
                  {recipe.preparationMinutes != -1
                    ? `${recipe.preparationMinutes} minute${
                        recipe.preparationMinutes > 1 ? "s" : ""
                      }`
                    : "Unlisted"}
                </p>
                <button
                  className="mt-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleAddToFavorites(recipe)}
                >
                  Add to Favorites
                </button>
              </div>
              <div className="flex-grow-0">
                {recipe.image ? (
                  <img
                    className="h-32 w-48  rounded-md object-cover rop-shadow-lg"
                    src={recipe.image}
                  ></img>
                ) : (
                  <div className=" h-32 w-48 rounded-md bg-slate-200 flex flex-col justify-center text-center text-xs">
                    No image available.
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="mt-3 italic text-slate-500">Loading...</p>
        )}
      </main>
    </>
  );
}
