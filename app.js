const API_KEY = "977db8e35ad9ede0b6caf387bab95be2";
const API_URL = "https://api.themoviedb.org/3/movie/now_playing";
const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

const hero = document.querySelector("#hero");
const heroTitle = document.querySelector("#hero-title");
const heroOverview = document.querySelector("#hero-overview");
const movieRow = document.querySelector("#movie-row");
const status = document.querySelector("#status");

document.querySelector("#scroll-left").addEventListener("click", () => {
  movieRow.scrollBy({ left: -movieRow.clientWidth * 0.8, behavior: "smooth" });
});

document.querySelector("#scroll-right").addEventListener("click", () => {
  movieRow.scrollBy({ left: movieRow.clientWidth * 0.8, behavior: "smooth" });
});

function posterUrl(path) {
  return `${POSTER_BASE}${path}`;
}

function formatReleaseDate(value) {
  if (!value) return "개봉일 미정";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}.${month}.${day}`;
}

function backdropUrl(movie) {
  if (movie.backdrop_path) return `${BACKDROP_BASE}${movie.backdrop_path}`;
  if (movie.poster_path) return posterUrl(movie.poster_path);
  return "";
}

function showMovie(movie, card) {
  hero.style.backgroundImage = `url("${backdropUrl(movie)}")`;
  heroTitle.textContent = movie.title;
  heroOverview.textContent = movie.overview || "현재 극장에서 상영 중인 작품입니다.";
  document.querySelectorAll(".card").forEach((item) => item.classList.remove("is-active"));
  if (card) card.classList.add("is-active");
}

function renderMovies(movies) {
  movieRow.replaceChildren();

  movies.forEach((movie, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";

    const image = document.createElement("img");
    image.src = posterUrl(movie.poster_path);
    image.alt = `${movie.title} 포스터`;

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const releaseDate = document.createElement("time");
    releaseDate.className = "release-date";
    releaseDate.dateTime = movie.release_date || "";
    releaseDate.textContent = `Reliase: ${formatReleaseDate(movie.release_date)}`;

    card.append(image, title, releaseDate);
    card.addEventListener("click", () => showMovie(movie, card));
    movieRow.append(card);

    if (index === 0) showMovie(movie, card);
  });
}

async function loadNowPlaying() {
  const url = new URL(API_URL);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("region", "KR");
  url.searchParams.set("page", "1");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("영화 목록을 불러오지 못했습니다.");
  }

  const data = await response.json();
  return (data.results || []).filter((movie) => movie.poster_path && movie.title);
}

loadNowPlaying()
  .then((movies) => {
    if (movies.length === 0) {
      status.textContent = "현재 상영 중인 영화가 없습니다.";
      heroTitle.textContent = "상영작을 찾지 못했습니다";
      return;
    }

    status.hidden = true;
    renderMovies(movies);
  })
  .catch(() => {
    status.textContent = "영화 정보를 가져오지 못했습니다. 잠시 후 다시 열어 주세요.";
    heroTitle.textContent = "연결에 실패했습니다";
  });
