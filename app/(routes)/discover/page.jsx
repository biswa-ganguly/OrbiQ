"use client"
import axios from 'axios';
import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import NewsCard from './_components/NewsCard';

function Page() {
  const options = [
    { title: "Top", icon: Star },
    { title: "Tech & Science", icon: Cpu },
    { title: "Finance", icon: DollarSign },
    { title: "Arts & Culture", icon: Palette },
    { title: "Sports", icon: Volleyball }
  ];

  const [selectedOption, setSelectedOption] = useState("Top");
  const [LatestNews, setLatestNews] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    selectedOption && GetSearchResult();
  }, [selectedOption]);

  const GetSearchResult = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/brave-search-api", {
        searchInput: selectedOption + " Latest News & Updates",
        searchType: "search"
      });
      const webSearchResult = result?.data?.web?.results;
      setLatestNews(webSearchResult);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>
  );

  return (
    <div className='lg:px-32 lg:mt-20 px-10'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
        <Globe className='w-8 h-8' /> Discover
      </h2>
      <hr className='mb-4' />
      <div className='flex flex-wrap gap-4'>
        {options.map((option, index) => {
          const isSelected = selectedOption === option.title;
          return (
            <button
              key={index}
              onClick={() => setSelectedOption(option.title)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full transition 
                ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
            >
              {option.icon && <option.icon className='w-4 h-4' />}
              <span className='text-sm font-medium'>{option.title}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={index === 0 || (index - 4) % 4 === 0
                  ? 'col-span-1 sm:col-span-2 lg:col-span-6'
                  : 'col-span-1 sm:col-span-1 lg:col-span-2'}
              >
                <SkeletonCard />
              </div>
            ))
          : LatestNews?.map((news, index) => {
              let className = '';
              let variant = 'normal';
              if (index === 0 || (index - 4) % 4 === 0) {
                className = 'col-span-1 sm:col-span-2 lg:col-span-6';
                variant = 'large';
              } else {
                className = 'col-span-1 sm:col-span-1 lg:col-span-2';
              }
              return (
                <div key={index} className={className}>
                  <NewsCard news={news} variant={variant} />
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Page;
