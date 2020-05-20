import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert('Error processing recipe :(');
        }



    }

    calculateTimeToMake() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calulateServing() {
        this.serving = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', "teaspoon", 'ounces', 'ounce', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            //1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((ing, index) => {
                ingredient = ingredient.replace(ing, unitShort[index]);
            });

            //2. Remove Parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Parse ingrediets into count , unit and ingredients 
            const arrayfy = ingredient.split(' ');
            const unitIndex = arrayfy.findIndex(el2 => unitShort.includes(el2));
            let objectify;
            if (unitIndex > -1) {
                //There is unit
                // 4 1/2 cups, arrCount is [4,1/2] -> eval("4+1/2") -> 4.5
                // 4 cup, arrcount is [4]

               
                const arrCount = arrayfy.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    //just a single number
                    count = eval(arrayfy[0].replace('-', '+'));
                } else {
                    count = eval(arrayfy.slice(0,unitIndex).join('+'));
                }

                objectify = {
                    count,
                    unit: arrayfy[unitIndex],
                    ingredient: arrayfy.slice(unitIndex + 1).join(' ')
                }


            } else if (parseInt(arrayfy[0], 10)) {
                // Thre is no unit but 1st elements is number
                objectify = {
                    count: parseInt(arrayfy[0], 10),
                    unit: 'tes',
                    ingredient: arrayfy.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //There is no unit and 1st element is not a number
                objectify = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objectify;
        });
        this.ingredients = newIngredients;
    }
}