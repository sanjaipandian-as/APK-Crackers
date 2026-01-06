import React from 'react';
import Hero from './Landing/Hero';

import Categories from './Landing/Categories';
import SpecialOffers from './Landing/SpecialOffers';
import FestiveOffers from './Landing/FestiveOffers';
import StatsGrid from './Landing/StatsGrid';
import FeaturedShops from './Landing/FeaturedShops';

const LandingPage = () => {
    return (
        <div className="w-full bg-gray-50 pb-20 md:pb-0">
            <Hero />
          
            <Categories />
            <FeaturedShops />
            <SpecialOffers />
            <FestiveOffers />
            <StatsGrid />
            
        </div>
    );
};

export default LandingPage;
