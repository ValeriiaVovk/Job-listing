const API_URL = './data.json';
async function fetchAPIData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

const main = document.querySelector('.main');

function displayPosition(positions) {

    console.log(positions);

    positions.forEach((position, i) => {
        const articlePosition = document.createElement('article');
        articlePosition.classList.add('job');
        articlePosition.setAttribute('data-role', position.role);
        articlePosition.setAttribute('data-level', position.level);
        if (position.languages) {
            articlePosition.setAttribute('data-languages', position.languages.map(language => language).join(' '));
        }

        if (position.tools) {
            articlePosition.setAttribute('data-tools', position.tools.map(tool => tool).join(' '));
        }

        articlePosition.innerHTML = 
        `
            <div class="job__info">
                <img src="${position.logo}" alt="${position.company} logo">
                <div class="job__info-detail">
                <div class="job__info-detail_emloyer">
                    <p class="job__info-detail_emloyer-company">${position.company}</p>
                    ${position.new && position.new === true ?
                        '<button class="job__info-detail_emloyer-new">New!</button>' :
                    ''}
                    ${position.featured && position.featured === true ?
                        '<button class="job__info-detail_emloyer-featured">Featured</button>' :
                    ''}
                </div>
                <p class="job__info-detail_position">${position.position}</p>
                <div class="job__info-detail_about">
                    <p class="job__info-detail_about_when">${position.postedAt} <span></span></p>
                    <p class="job__info-detail_about_type">${position.contract} <span></span></p>
                    <p class="job__info-detail_about_location">${position.location}</p>
                </div>
                </div>
            </div>
            <div class="job__filter">
                <button data-filter-category='role'>${position.role}</button>
                <button data-filter-category='level'>${position.level}</button>
                ${position.languages && position.languages.length > 0 ?
                    position.languages.map(language => {
                        return `<button data-filter-category='languages'>${language}</button>`
                    }).join('') :
                ''}
                ${position.tools && position.tools.length > 0 ?
                    position.tools.map(tool => {
                        return `<button data-filter-category='tools'>${tool}</button>`
                    }).join('') :
                ''}
            </div>
        `;

        if(position.featured === true) {
            articlePosition.classList.add('job-featured');
        }

        main.appendChild(articlePosition);
    })
}

function filterJobs(criteria) {
    const jobs = document.querySelectorAll('.job');
    
    jobs.forEach(job => {
        let roleMatch = criteria.role ? job.getAttribute('data-role') === criteria.role : true;
        let levelMatch = criteria.level ? job.getAttribute('data-level') === criteria.level : true;
        let languagesMatch = criteria.languages.length > 0 ? criteria.languages.every(lang => job.getAttribute('data-languages').includes(lang)) : true;
        let toolsMatch = criteria.tools.length > 0 ? criteria.tools.every(tool => job.getAttribute('data-tools').includes(tool)) : true;
        
        if (roleMatch && levelMatch && languagesMatch && toolsMatch) {
            job.style.display = 'flex';
        } else {
            job.style.display = 'none';
        }
    });
}

let activeFilters = {
    role: null,
    level: null,
    languages: [],
    tools: []
};

function updateDisplayFilter() {
    const filter = document.querySelector('.filters');
    const filterArticle = document.querySelector('.filters__names');
    filterArticle.innerHTML = '';

    for (const category in activeFilters) {
        if (category === 'role' || category === 'level') {
            if(activeFilters[category]) {
                displayFilter(category, activeFilters[category]);
            }
        } else {
            activeFilters[category].forEach(filterValue => {
                displayFilter(category, filterValue);
            });
        }
    }

    if (filterArticle.innerHTML) {
        filter.style.display = 'flex';
    } else {
        filter.style.display = 'none';
    }
}

function displayFilter(category, value) {
    const filterArticle = document.querySelector('.filters__names');

    const filterElement = document.createElement('div');
    filterElement.classList.add('filters__names-btn');
    filterElement.innerHTML = 
    `
        <p>${value}</p>
        <button data-filter-category="${category}" data-filter-value="${value}">
            <img src="./images/icon-remove.svg" alt="">
        </button>
    `;

    filterArticle.appendChild(filterElement);

    filterElement.querySelector('button').addEventListener('click', (e) => {
        const category = e.currentTarget.getAttribute('data-filter-category');
        const value = e.currentTarget.getAttribute('data-filter-value');

        if (category === 'role' || category === 'level') {
            activeFilters[category] = null;
        } else {
            activeFilters[category] = activeFilters[category].filter(f => f != value);
        }

        updateDisplayFilter();
        filterJobs(activeFilters);
    })
}

document.querySelector('.filters__clear').addEventListener('click', () => {
    activeFilters = {
        role: null,
        level: null,
        languages: [],
        tools: []
    };
    
    updateDisplayFilter();
    filterJobs(activeFilters);
})

function addFilterEventListeners() {
    const filterButtons = document.querySelectorAll('.job__filter button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterCategory = button.getAttribute('data-filter-category');
            const filterValue = button.textContent;
            
            if (filterCategory === 'role' || filterCategory === 'level') {
                activeFilters[filterCategory] = filterValue;
            } else if (filterCategory === 'languages' || filterCategory === 'tools') {
                if (activeFilters[filterCategory].includes(filterValue)) {
                    activeFilters[filterCategory] = activeFilters[filterCategory].filter(f => f !== filterValue);
                } else {
                    activeFilters[filterCategory].push(filterValue);
                }
            }

            updateDisplayFilter();
            filterJobs(activeFilters);

        });
    });
}

async function init() {
    const positions = await fetchAPIData();

    displayPosition(positions);

    addFilterEventListeners();
}

document.addEventListener('DOMContentLoaded', init);



