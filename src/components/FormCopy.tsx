import { AiFillCalendar } from "react-icons/ai";
import React, { useState } from "react";
import { checkTotalCharge, distanceFee,isRushHour,itemsFee, rushHourFee } from './Functions';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DateTimePicker from 'react-datetime-picker';


const Form = () => {
  const [deliveryPrice,setDeliveryPrice] = useState(0);
  const [inputDate, setInputDate] = useState(new Date());
  const onChange = (inputDate: Date) =>{
      setInputDate(inputDate);
  }
 
  //const day: number = today.getDay() + 1;
  const day: number = 5;
  //const currentHour: number = today.getUTCHours();
  const currentHour: number = 15;
  console.log(inputDate);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(data.entries());
    const cartValue: number = +formObject.price;
    const amount: number = +formObject.amount;
    const distance: number = +formObject.distance;
    
    console.log(inputDate.getUTCHours(), inputDate.getUTCDay());
    let surcharge: number = 0;
    let distanceCharge:number = 0 ;
    let total: number = 0;

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
    
    // Calculating distance charge
    distanceCharge = + distanceFee(distance);
    console.log('distance-charge', distanceCharge);  

    // Checking number of items
    const itemCharge: number = + itemsFee(amount);
    console.log('itemCharge',itemCharge);
    
    total = itemCharge + distanceCharge + surcharge ;
    
    const rushTime: boolean = isRushHour(currentHour, day);
    
    if(rushTime){
      total = + rushHourFee(total);
    }
    
    console.log('Total', total);
    //Checking if total charge is above 15
    total = + checkTotalCharge(total);

    setDeliveryPrice(total);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Delivery Fee Calculator</h3>
      <fieldset className="field-area">
        <label> Cart Value(€):</label>
        <input type="text" name="price" required />
      </fieldset>
      <fieldset className="field-area">
        <label> Delivery distance(m): </label>
        <input type="text" name="distance" required />
      </fieldset>
      <fieldset className="field-area">
        <label> Amount of items: </label>
        <input type="number" name="amount" required />
      </fieldset>
      <div className="currentDate">
        <p>Time: </p>
        <DateTimePicker
        onChange={onChange}
        value={inputDate}
        disableClock= {true}
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
