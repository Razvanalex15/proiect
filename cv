import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import movies from "../data/movies.json";
import useWatchlist from "../hooks/useWatchlist";
import MovieCard from "../components/MovieCard";

export default function MoviesPage() {
  const { watchlistIds, isInWatchlist, toggle } = useWatchlist();

  const [params, setParams] = useSearchParams();

  const search = params.get("search") || "";
  const genre = params.get("genre") || "all";
  const order = params.get("order") || "none";

  const genres = useMemo(() => [...new Set(movies.map((m) => m.genre))], []);

  const visibleMovies = useMemo(() => {
    const filtered = movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === "all" || movie.genre === genre;
      return matchesSearch && matchesGenre;
    });

    const sorted = [...filtered];

    if (order === "desc") sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    else if (order === "asc") sorted.sort((a, b) => Number(a.rating) - Number(b.rating));
    else if (order === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));

    return sorted;
  }, [search, genre, order]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "none" || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  return (
    <>
      <input
        className="search"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => updateParam("search", e.target.value)}
      />

      <div className="filters">
        <div className="filter">
          <span>Genre</span>
          <select value={genre} onChange={(e) => updateParam("genre", e.target.value)}>
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <span>Sort</span>
          <select value={order} onChange={(e) => updateParam("order", e.target.value)}>
            <option value="none">None</option>
            <option value="desc">Rating (High to Low)</option>
            <option value="asc">Rating (Low to High)</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {visibleMovies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={toggle}
          />
        ))}
      </div>
    </>
  );
}
