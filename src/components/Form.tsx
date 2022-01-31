import React, { useState } from "react";
import {  checkTotalCharge, distanceFee,isRushHour,itemsFee, numberOfItems, rushHourFee } from './Functions';
import DateTimePicker from 'react-datetime-picker';

const Form = () => {
  const [deliveryPrice,setDeliveryPrice] = useState(0);
  // Conerting GMT format date to UTC
  const UTC = new Date(new Date().toUTCString().slice(0,-4));
  const [errorMessage, setErrorMessage] = useState('');
  console.log('UTC',UTC);
  const [inputDate, setInputDate] = useState(UTC);
  const onChange = (inputDate: Date) =>{
      setInputDate(inputDate);
  }
  
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(data.entries());
    const cartValue: number = +formObject.price;
    const amount: number = +formObject.amount;
    const distance: number = +formObject.distance;

    const pickedHour = inputDate.getHours();
    const pickedDay = inputDate.getDay() + 1;
    console.log('Day', pickedDay, 'Hour', pickedHour);
    let surcharge: number = 0;
    let distanceCharge:number = 0 ;
    let total: number = 0;

    // Checking if cart value is valid number or not
    console.log('Check number',cartValue);

    if(cartValue === 0 || isNaN(cartValue)){
      setErrorMessage('Please enter valid number in Cart Value');
      setTimeout(()=>{
        setErrorMessage('');
      }, 2000)
      return;
    }
    //If cart value is 100 or more than 100
    if(cartValue >= 100){
      console.log("Value over 100")
      setDeliveryPrice(0);
      return;
    }

    // If cart value is less than 10 euro
    if(cartValue < 10){
      surcharge = 10 - cartValue;
      console.log('Sur-charge',surcharge.toFixed(2));
    }
    // Checking for total number of items
    const checkItem = numberOfItems(amount);

    if(!checkItem){
      setErrorMessage('Too many items in the cart!')
      setTimeout(()=>{
        setErrorMessage('');
      }, 2000)
      return;
    }
    // Calculating distance charge
    distanceCharge = + distanceFee(distance);
    console.log('distance-charge', distanceCharge);  

    // Checking number of items
    const itemCharge: number = + itemsFee(amount);
    console.log('itemCharge',itemCharge);
    
    total = itemCharge + distanceCharge + surcharge ;
    
    const isRushTime: boolean = isRushHour(pickedHour, pickedDay);
    
    if(isRushTime === true){
      total = + rushHourFee(total);
    }
    
    console.log('Total', total);
    //Checking if total charge is above 15
    total = + checkTotalCharge(total);

    setDeliveryPrice(total);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <p className='message'>{errorMessage}</p>
      <h3>Delivery Fee Calculator</h3>
      <fieldset className="field-area">
        <label> Cart Value(€):</label>
        <input type="text" name="price" required/>
      </fieldset>
      <fieldset className="field-area">
        <label> Delivery distance(m): </label>
        <input type="number" name="distance" placeholder='number only' required/>
      </fieldset>
      <fieldset className="field-area">
        <label> Amount of items: </label>
        <input type="number" name="amount" placeholder='number only' required/>
      </fieldset>
      <div className="currentDate">
        <p>Time: </p>
        <DateTimePicker
        className='picker'
        onChange={onChange}
        value={inputDate}
        disableClock= {true}
        minDate={UTC}
        />
      </div>
      <button type="submit" className="btn">
        Calculate delivery price
      </button>
      <p className="price">Delivery price: {deliveryPrice}€</p>
    </form>
  );
};

export default Form;
