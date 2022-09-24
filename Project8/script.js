const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealEl = document.getElementById('meals');
const resultText = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');


// Search meal and fetch from API
function searchMeal(e){
    e.preventDefault();

    // Clear single meal
    singleMealEl.innerHTML = '';

    // Get search term
    const term = search.value;

    // check for empty
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            resultText.innerHTML = `<h2>Search results for '${term}': </h2>`;

            if(data.meals === null){
                resultText.innerHTML = `<p>There are results. Try again</p>`;
            } else {
                mealEl.innerHTML = data.meals.map(meal => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
                `).join('');
            }
        });

        // Clear search text

        search.value = '';
    } else {
        alert('Please enter a search value');
    }
}

// Fetch Meal By Id function
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}

// Getch random meal from API
function getrandomMeal(){
    // Clear meals and heading
    mealEl.innerHTML = '';
    resultText.innerHTML = '';

    fetch(`www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}

// Fetch meal by ID
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal)
    })
}

// Function add meal to DOM
function addMealToDOM(meal){
    const ingredients = [];

    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`] } - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>`: ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getrandomMeal);

mealEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});