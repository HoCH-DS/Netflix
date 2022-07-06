import React, { useEffect, useState } from "react";
import Tmdb from './Tmdb';
import './App.css';
import MovieRow from './components/MovieRow';
import FeaturedMove from './components/FeaturedMove';
import Header from './components/Header'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pengando o Featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);

    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListiner = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListiner);

    return () => {
      window.removeEventListener('scroll', scrollListiner)
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMove item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://onlinegiftools.com/images/examples-onlinegiftools/netflix-stream-opaque.gif" alt="carregando" />
        </div>
      }
    </div>
  );
}