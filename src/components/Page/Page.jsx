import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import './Page.css';
import img from "../../assets/yoga.png";

const Page = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1, searchQuery = '') => {
    const limit = 3;
    const apiUrl = searchQuery 
      ? `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?page=${page}&limit=${limit}&search=${searchQuery}`
      : `https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?page=${page}&limit=${limit}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Data is not an array');
      setCards(data);
      setFilteredCards(data);
      console.log(data);

      const totalResponse = await fetch(`https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?search=${searchQuery}`);
      if (!totalResponse.ok) throw new Error('Not found');
      const totalData = await totalResponse.json();
      setTotalPages(Math.ceil(totalData.length / limit));
    } catch (error) {
      console.error(error);
      setCards([]);
      setFilteredCards([]);
    }
  };

  const filterData = () => {
    let filtered = [...cards];

    if (dateFilter) {
      const startDate = dateFilter === '2023-2024' ? new Date(2023, 0, 1).getTime() / 1000 : new Date(2024, 0, 1).getTime() / 1000;
      const endDate = dateFilter === '2023-2024' ? new Date(2024, 0, 1).getTime() / 1000 : new Date(2025, 0, 1).getTime() / 1000;
      filtered = filtered.filter(card => card.date >= startDate && card.date < endDate);
    }

    if (typeFilter) {
      filtered = filtered.filter(card => card.tag.some(tag => tag.toLowerCase() === typeFilter.toLowerCase()));
    }

    if (searchQuery) {
      filtered = filtered.filter(card => card.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredCards(filtered);
  };

  useEffect(() => {
    fetchData(page, searchQuery);
  }, [page, searchQuery]);

  useEffect(() => {
    filterData();
  }, [dateFilter, typeFilter, searchQuery, cards]);

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value === 'Filter by Date' ? '' : value);
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value === 'Filter by Type' ? '' : e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchData(1, searchQuery);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className='main'>
      <div className="top">
        <img className='img' src={img} alt="" />
        <h2>Discover Your Inner Peace</h2>
        <p>Join us for a series of wellness retreats designed to help you find tranquility and rejuvenation</p>
      </div>
      <div className="bottom">
        <div className="operation">
          <div className="select">
            <select name="date" onChange={handleDateChange}>
              <option value="Filter by Date">Filter by Date</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
            <select name="type" onChange={handleTypeChange}>
              <option value="Filter by Type">Filter by Type</option>
              <option value="Yoga">Yoga</option>
              <option value="Meditation">Meditation</option>
              <option value="Detox">Detox</option>
            </select>
          </div>
          <div className="input">
            <input 
              type="text" 
              placeholder='Search retreats by title' 
              value={searchQuery} 
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="container">
          {filteredCards.map((card) => (
            <div key={card.id} className="card">
              <img src={card.image} alt="" />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <p>{format(new Date(card.date * 1000), 'dd MMMM yyyy')}</p>
              <p>{card.location}</p>
              <p>${card.price}</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Page;
