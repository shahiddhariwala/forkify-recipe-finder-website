import Search from './models/Search';

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
    const query = 'pizza';

    if(query)
    {
        //2. New Search object and add to the state
        state.search = new Search(query);

        //3. Prepare UI for results

        //4. Search for recipes
        await state.search.getResults();

        //5. Render results on UI
        console.log(state.search.result);
    }
};
document.querySelector('.search').addEventListener('submit',event=>
{
    event.preventDefault();
    controlSearch();
});

