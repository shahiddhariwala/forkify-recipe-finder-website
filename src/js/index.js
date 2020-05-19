import Search from './models/Search';
import {elements} from './views/base';
import * as searchView from './views/searchView';

/*
Global State of the app
- Search Object
- Current Recipe Object
- Shopping list object
- Liked recipes
*/

const state = {};

const controlSearch = async ()=>
{
    //1. Get query fromm view
    const query = searchView.getInput();

    if(query)
    {
        //2. New Search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results

        //4. Search for recipes
        await state.search.getResults();

        //5. Render results on UI
        searchView.renderResults(state.search.result);
    }
};
elements.searchForm.addEventListener('submit',event=>
{
    event.preventDefault();
    controlSearch();
});

