import React, { useState } from "react";
import {  
  calculateTotalPrice,
  handleError,
  hasAmountExceeded,
  isInputValid,
} from './Functions';
import 'react-calendar/dist/Calendar.css';
import DateTimePicker from 'react-datetime-picker';

// Error messages : For localization these variables can be placed in separate file
const cartMessage: string = 'Cart value is not valid!';
const distanceMessage: string = 'Distance is not valid!';
const amountMessage: string = 'Amount value is not valid!';
const itemsMessage: string = 'Too many items in the cart! Maximum number of item is 15';
const maxCartValue: number = 100;

const Form = () => {
  const [deliveryPrice,setDeliveryPrice] = useState('0');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Converting Europe/Helsinki tiem zone to UTC
  const currentUTC = new Date(new Date().toUTCString().slice(0,-4));
  const [inputDate, setInputDate] = useState(currentUTC);

  const onChange = (inputDate: Date) =>{
      setInputDate(inputDate);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // Fetching data from form
    const data = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(data.entries());
    const cartValue: number = +formObject.price;
    const amount: number = +formObject.amount;
    const distance: number = +formObject.distance;

    const pickedHour = inputDate.getHours();
    const pickedDay = inputDate.getDay() + 1;

    let total: number = 0;

    if(!isInputValid(cartValue)){
      handleError(setErrorMessage,cartMessage)
      return;
    }

    if(!isInputValid(distance)){
      handleError(setErrorMessage,distanceMessage)
      return;
    }

    if(!isInputValid(amount)){
      handleError(setErrorMessage,amountMessage)
      return;
    }

    // If cart value is 100 or more than 100
    if(cartValue >= maxCartValue){
      setDeliveryPrice('0');
      return;
    }

    // Checking for total number of items
    if(hasAmountExceeded(amount)){
      handleError(setErrorMessage,itemsMessage);
      return;
    }

    // Finalizing total price
    total = calculateTotalPrice(cartValue, amount,distance,pickedHour, pickedDay) ;
    
    // Finalizing delivery price
    setDeliveryPrice(total.toFixed(2));
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <p className='message'>{errorMessage}</p>
      <h3>Delivery Fee Calculator</h3>
      <fieldset className="field-area">
        <label> Cart Value(€):</label>
        <input type="text" name="price"/>
      </fieldset>
      <fieldset className="field-area">
        <label> Delivery distance(m): </label>
        <input type="number" name="distance"/>
      </fieldset>
      <fieldset className="field-area">
        <label> Amount of items: </label>
        <input type="number" name="amount"/>
      </fieldset>
      <div className="currentDate">
        <p>Time: </p>
        <DateTimePicker
        onChange={onChange}
        value={inputDate}
        disableClock= {true}
        className='picker'
        minDate={currentUTC}
        />
      </div>
      <button type="submit" className="btn">
        Calculate delivery price
      </button>
      <button type="reset" className="btn" onClick={() => {
        setDeliveryPrice('0');
        setInputDate(currentUTC);
      }}>
       Place a new Order
      </button>
      <p className="price">Delivery price: {deliveryPrice}€</p>
    </form>
  );
};

export default Form;
