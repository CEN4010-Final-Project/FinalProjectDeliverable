import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    const getData = async() => {
      const result = await fetch("../api/randomrecipes");
      const newData = await result.json();
      setRecipes(newData.recipes);
    }
    const timeout = setTimeout(getData, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  const [recipes, setRecipes] = useState(null);
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
          recipes.map(recipe => (
            <div key={recipe.id} className="flex gap-x-6 mt-3 p-4 bg-slate-100 rounded-lg">
              <div className="flex-grow">
                <h2 className="text-lg">
                  {recipe.title}
                  {recipe.vegetarian && <>&nbsp;<span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">Vegetarian</span></>}
                </h2>
                <hr className="h-px my-2 bg-slate-300"></hr>
                <p className="text-sm">Preparation time: {recipe.preparationMinutes != -1 ? `${recipe.preparationMinutes} minute${recipe.preparationMinutes > 1 ? "s" : ""}` : "Unlisted"}</p>
                <div className="mt-1">
                <input type="checkbox" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-blue-500 focus:ring-1"></input>
                <label className="ms-2 text-sm">Add to favorites</label>
                </div>
                
              </div>
              <div className="flex-grow-0">
                {recipe.image ? (
                  <img className="h-32 w-48  rounded-md object-cover rop-shadow-lg" src={recipe.image}></img>
                ) : (
                  <div className=" h-32 w-48 rounded-md bg-slate-200 flex flex-col justify-center text-center text-xs">No image available.</div>
                )}
              </div>
            </div>
          ))
        ) : <p className="mt-3 italic text-slate-500">Loading...</p>}
      </main>
    </>
  )
};