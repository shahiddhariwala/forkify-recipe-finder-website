import {
    elements
} from "./base";

export const clearInput = () => {
    elements.searchInput.value = "";
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = "";
    elements.searchResultPages.innerHTML = "";
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(" ").reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return short title
        return `${newTitle.join(" ")} ...`;
    }

    return title;
};

export const getInput = () => elements.searchInput.value;
const renderRecipe = (recipe) => {
    const markup = ` <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title, 20)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
    elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
const createButton = (page, type) => `

                <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1:page+1}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left':'right'}"></use>
                    </svg>
                    <span>Page ${type==='prev'? page-1:page+1}</span>
                </button>
`;

const renderButtons = (page, numResults, pagePerResult) => {
    const pages = Math.ceil(numResults / pagePerResult);
    let button;
    if (page === 1 && pages > 1) {
        // Only Button to go to next page
        button = createButton(page,'next');
    } else if (page === pages && pages > 1) {
        //Only Button to go prev page
        button = createButton(page,'prev');
    } else if (page < pages) {
        //Go in both direction
        button = `${createButton(page,'prev')} ${createButton(page,'next')}`;
       
    }
    elements.searchResultPages.insertAdjacentHTML('beforeend',button);

};
export const renderResults = (recipes, page = 1, pagePerResult = 10) => {

    // render results of current page
    const start = (page - 1) * pagePerResult;
    const end = page * pagePerResult;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination
    renderButtons(page,recipes.length,pagePerResult);
};