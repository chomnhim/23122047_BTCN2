import React from "react";
import HeroSlider from "../components/HeroSlider";
import MovieRow from "../components/MovieRow";

export default function Home() {
  return (
    <div className="home-page" style={{ paddingBottom: '60px', overflowX: 'hidden' }}>
      
      <HeroSlider />

      <MovieRow 
        title="Most Popular" 
        type="popular" 
      />

      <MovieRow 
        title="Top Rating" 
        type="top_rated" 
      />

    </div>
  );
}