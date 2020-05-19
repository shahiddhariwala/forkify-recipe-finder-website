import axios from 'axios';
 /*
    fetch only works on  modern browsers but for older browsers its not supported
    so we use axious
    we can install it by 'npm install axios --save'
    */
export default class Search{
    constructor(query) {
        this.query = query;
    }
   
    async getResults() {
        //in one step we get directly json data not raw unlike fetch
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.recipes);
        } catch (error) {
            console.log(error)
        }
    }
}