// Variables declaration
const minBusyHour: number = 15;
const maxBusyHour: number = 19;
const busyDay: number = 6;
const maxCharge: number = 15;
const maxItem: number = 15;

export const numberOfItems = (amount:number) =>{
  let item: boolean = true;
  if(amount > maxItem){
    item = false;
  }
  return item;
}

export const distanceFee = (distance:number) =>{
  if(distance <= 1000){
    return 2;
  }
  // rounding number to the next large integer
  let deliveryPrice: number = Math.ceil(distance/ 500);
  //console.log('Price',deliveryPrice.toFixed(2))
  return deliveryPrice.toFixed(2);
}

export const itemsFee = (amount: number) =>{
  let charge: number = 0;
  for(let i:number = 5; i <= amount; i++){
    charge += 0.50;
  }
  return charge.toFixed(2);
}

export const isRushHour = (currentHour: number, day: number) =>{
  let rushTime: boolean = false; 
  if(day === busyDay && currentHour >=minBusyHour && currentHour <= maxBusyHour){
      rushTime = true
   }
   return rushTime;
}

export const rushHourFee = (total: number) =>{
  const charge = 1.1* total;
  console.log('rush hour',charge.toFixed(2));
  return charge.toFixed(2)
}

export const checkTotalCharge = (total: number) =>{
  if(total > maxCharge ){
    total = maxCharge;
  }
  return total.toFixed(2)
}
  
export const handleError = (setErrorMessage: any, message: string) =>{
  setErrorMessage(message);
  setTimeout(()=>{
    setErrorMessage('');
  }, 2000)
}