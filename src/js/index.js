import Search from './models/Search';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';
/*
Global State of the app
- Search Object
- Current Recipe Object
- Shopping list object
- Liked recipes
*/

const state = {};
/* Search Controller*/
const controlSearch = async ()=>
{
    //1. Get query fromm view
    const query = searchView.getInput();

    if(query)
    {
        //2. New Search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput(); // for removing the input value in search bar
        searchView.clearResults(); // for removing previous result in the result list
        renderLoader(elements.searchResult);

        //4. Search for recipes
        await state.search.getResults();

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
};
elements.searchForm.addEventListener('submit',event=>
{
    event.preventDefault();
    controlSearch();
});

elements.searchResult.addEventListener('click',event=>
{
    const btn = event.target.closest('.btn-inline');
    if(btn)
    {
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});

/*
Recipe Controller
*/

const r = new Recipe(46956);
r.getRecipe();
console.log(r);