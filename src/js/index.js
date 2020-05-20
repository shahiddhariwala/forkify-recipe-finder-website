import Search from './models/Search';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
const controlSearch = async () => {
    //1. Get query fromm view
    const query = searchView.getInput();

    if (query) {
        //2. New Search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput(); // for removing the input value in search bar
        searchView.clearResults(); // for removing previous result in the result list
        renderLoader(elements.searchResult);
try{


        //4. Search for recipes
        await state.search.getResults();

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
        catch (error) {
            clearLoader();
            console.log(error);
            alert('Something went Wrong :(');
        }
    }
};
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResult.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/*
Recipe Controller
*/
const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Create new Recipe Object
        state.recipe = new Recipe(id);

        
        try {
            //Get Recipe Data
            await state.recipe.getRecipe();

            //Calculate servings and time
            state.recipe.calculateTimeToMake();
            state.recipe.calulateServing();

            if(state.search)
            {
                searchView.highlightSelectedRecipe(state.recipe.id);
            }
            
            //parse ingredients
            state.recipe.parseIngredients();

            //Render Recipe
            clearLoader();
            console.log(state.recipe);
            recipeView.renderRecipe(state.recipe);
        }  
        catch (error) {
            console.log(error);
            alert('Error processing recipe :(');
        }

    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));