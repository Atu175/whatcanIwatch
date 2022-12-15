const API_KEY = "api_key=55a518719b4b99db0b509fed95a03b8c";
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');

const genres = [{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]
const genre = document.getElementById('genre');
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPage = 100;

getMovies(API_URL);
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;
            if(currentPage === 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            }else if(currentPage === totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }
        } else {
            main.innerHTML = `<h1>No results!!</h1>`
        }

    })
}

function showMovies(data) {
    main.innerHTML = ``;
    data.forEach(movie => {
        const {title, poster_path, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: "https://media.istockphoto.com/id/1294603953/vector/abstract-black-stripes-diagonal-background.jpg?b=1&s=612x612&w=0&k=20&c=67zOlXF2xg7oj18aOSZ5V2OJVRPcKg2ngwQhFxOSu10="}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
            </div>

            <div class="description">
                ${overview}
                <span class="link"><a href="#">LinkToWatch</a></span>
            </div>
        
        `

        main.appendChild(movieEl);
    })
}

var selected = []
setGenre();
function setGenre(){
    genre.innerHTML='';
    genres.forEach(x => {
        const t = document.createElement('div');
        t.classList.add('genre');
        t.id = x.id;
        t.innerText = x.name;
        t.addEventListener('click', () => {
            if(selected.length === 0){
                selected.push(x.id);
            }else{
                if(selected.includes(x.id)){
                    selected.forEach((id, idx) => {
                        if(id === x.id){
                            selected.splice(idx, 1);
                        }
                    })
                }else{
                    selected.push(x.id);
                }
            }
            console.log(selected)
            getMovies(API_URL + '&with_genres='+encodeURI(selected.join(',')))
            showSelection()
        })
        genre.append(t);
    })
}

function showSelection() {
    const tags = document.querySelectorAll('.show');
    tags.forEach(tag => {
        tag.classList.remove('show')
    })
    if(selected.length !== 0){
        selected.forEach(id => {
            const showSelected = document.getElementById(id);
            showSelected.classList.add('show');
        })
    }

}

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})
prev.addEventListener('click', () => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
})

function pageCall(page){
    let split_url = lastUrl.split('?');
    let params = split_url[1].split('&');
    let value = params[params.length - 1].split('=');
    if (value[0] !== 'page'){
        let url = lastUrl + '&page='+page
        getMovies(url);
    }else{
        value[1] = page.toString();
        let x = value.join('=');
        params[params.length - 1] = x;
        let y = params.join('&');
        let url = split_url[0] + '?' + y
        getMovies(url)
    }
}