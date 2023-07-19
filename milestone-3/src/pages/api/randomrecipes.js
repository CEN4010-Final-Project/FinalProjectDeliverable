// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  let response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}&number=3`);
  res.status(200).json(await response.json());
}
