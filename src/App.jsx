import React, { useState, useEffect } from 'react';
import axios from 'axios';
import images from './assets/images.png';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(83.24);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Fetch the currency list and set default exchange rate
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
        setCurrencies(Object.keys(response.data.rates));
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (error) {
        console.log("Error fetching currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    // Fetch exchange rate when currencies change
    const getExchangeRate = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (error) {
        console.log("Error fetching exchange rate:", error);
      }
    };
    if (fromCurrency && toCurrency) {
      getExchangeRate();
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    // Update converted amount based on the current exchange rate
    if (exchangeRate !== null) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (e) => {
    setAmount(parseFloat(e.target.value) || 0);
  };

  return (
    <div className="maincontainer">
      <div className="images">
        <img src={images} alt="images" />
      </div>
      <div className="titlename">
        <label htmlFor="data">Currency Converter</label>
      </div>
      <div className="coolinput">
        <label htmlFor="input" className="text">Amount:</label>
        <input
          type="text"
          placeholder="Write here..."
          name="input"
          className="input"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <div className="currency-converter">
        <label htmlFor="from-currency">From Currency:</label>
        <select
          id="from-currency"
          className="currency-select"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>

        <label htmlFor="to-currency">To Currency:</label>
        <select
          id="to-currency"
          className="currency-select"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <div className="checkdata">
        <span>{amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}</span>
      </div>
    </div>
  );
};

export default App;
