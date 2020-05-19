// Global app controller
import axios from 'axios';
/*
fetch only works on  modern browsers but for older browsers its not supported
so we use axious
we can install it by 'npm install axios --save'
*/
async function getResult(query) {
    //one step we get directly json data not raw
    try {
        const result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
        const recipes = result.data.recipes;
        console.log(recipes);
    } catch (error) {
        console.log(error)
    }
}
getResult('pizza');