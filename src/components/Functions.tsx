// Variables declaration
const initialDistance: number = 1000;
const minBusyHour: number = 15;
const maxBusyHour: number = 19;
const busyDay: number = 6;
const maxCharge: number = 15;
const maxItem: number = 15;
const minCartValue: number = 10; 
const rushHourFactor: number = 1.1;
const initialDistanceFee : number = 2;

/**
 * 
 * @param input value of form filled by user
 * @returns true if input is valid else returns false
 */
export const isInputValid = (input: any) =>{
  let valid = true;

  if(input <= 0 || isNaN(input)){
    valid = false
  }

  return valid;
} 

/**
 * 
 * @param setErrorMessage sets the value of error message to be displayed to user
 * @param message specfic error message according to the input field
 */
export const handleError = (setErrorMessage: any, message: string) =>{
  setErrorMessage(message);

  setTimeout(()=>{
    setErrorMessage('');
  }, 2000)
}

/**
 * 
 * @param amount of items filled by user in amount field
 * @returns boolean value
 */
export const hasAmountExceeded = (amount:number) =>{
  return amount > maxItem ;
}

/**
 * 
 * @param distance value from distance input field
 * @returns distance charge in accordance with the distance given by user
 */
export const calculateDistanceFee = (distance:number) =>{
  if(distance <= initialDistance){
    return initialDistanceFee;
  }

  // rounding number to the next large integer
  let deliveryPrice: number = Math.ceil(distance/ 500);

  return deliveryPrice;
}

/**
 * 
 * @param amount value from amount input field
 * @returns amount charge in accordance with the items given by user
 */
export const calculateItemsFee = (amount: number) =>{
  let charge: number = 0;

  for(let i:number = 5; i <= amount; i++){
    charge += 0.50;
  }

  return charge;
}

export const getSurcharge = (cartValue: number) =>{

  if(cartValue < minCartValue){
    return minCartValue - cartValue;
  }

  return 0;
} 
/**
 * 
 * @param currentHour is time chosen by user for delivery
 * @param day chosen by user for delivery
 * @returns true if true if it's a busy hour else returns false
 */
export const isRushHour = (currentHour: number, day: number) =>{
  let rushTime: boolean = false; 
  
  if(day === busyDay && currentHour >=minBusyHour && currentHour <= maxBusyHour){
    rushTime = true
  }
  return rushTime;
}

/**
 * 
 * @param total delivery price
 * @returns delivery price with busy hour charge
 */
export const rushHourFee = (total: number) =>{
  return rushHourFactor * total;
}

/**
 * 
 * @param total total delivery price
 * @returns total price if it does not exceed the limit price else returns maxCharge 
 */
export const getAdjustedTotalCharge = (total: number) =>{
  if(total > maxCharge ){
    total = maxCharge;
  }

  return total;
}

/**
 * 
 * @param cartValue user input cart value
 * @param amount user input amount value
 * @param distance user input distance value
 * @param pickedHour user input hour value
 * @param pickedDay user input day value
 * @returns final delivery price
 */
export const calculateTotalPrice = 
(cartValue: number, amount: number,distance: number,pickedHour: number, pickedDay: number) =>{

  let total: number = getSurcharge(cartValue) + calculateItemsFee(amount) + calculateDistanceFee(distance);
  
  if(isRushHour(pickedHour, pickedDay)){
    total = rushHourFee(total)
  }
  
  return getAdjustedTotalCharge(total); 
}
  