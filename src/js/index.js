import Search from './models/Search';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

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
        try {
            //4. Search for recipes
            await state.search.getResults();

            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            alert('Something went Wrong :(');
            clearLoader();
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

        // Highlight selected search item
        if (state.search) searchView.highlightSelectedRecipe(id);

        //Create new Recipe Object
        state.recipe = new Recipe(id);


        try {
            //Get Recipe Data
            await state.recipe.getRecipe();

            //parse ingredients
            state.recipe.parseIngredients();


            //Calculate servings and time
            state.recipe.calculateTimeToMake();
            state.recipe.calulateServing();



            //Render Recipe
            clearLoader();
            recipeView.renderRecipe(state.likes.isliked(id),state.recipe);
        } catch (error) {
            console.log(error);
            alert('Error processing recipe :(');
        }

    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/*
List Controller
*/


const controlList = () => {

    //Create list if list not present in state
    if(!state.list)
    {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(el =>
        {
            const item = state.list.addItem(el.count,el.unit,el.ingredient)
            listView.renderItem(item);
        });
};

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        console.log("I am here");
        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/*
Like Controller
*/
const controlLike = ()=>
{
    if(!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    //User has not yet like current recipe
    if(!state.likes.isliked(currentID))
    {
        //Add like to the state
        const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img);
        //TOggle the like button
        likesView.toggleLikeButton(true);
        //Add like to UI list
        likesView.renderLike(newLike);
    }//User has liked current recipe
    else
    {
        //Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeButton(false);
        //Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


//Handling recipe button clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button is clicked
        if (state.recipe.serving > 1) {
            state.recipe.updateServing('dec');
            recipeView.updateServingIngridient(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //decrease button is clicked
        state.recipe.updateServing('inc');
        recipeView.updateServingIngridient(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        //add list to view
        elements.shoppingList.innerHTML=""; // to avoid repetition         
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *'))
    {
        //Like controller
        controlLike();
    }
});