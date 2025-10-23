export function currentDateTime() {
    const date = new Date();
  
    // Get the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Get the timezone offset in minutes and convert to hours and minutes
    const timezoneOffset = -date.getTimezoneOffset(); // In minutes, negate to get the correct sign
    const tzHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
    const tzMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
    const tzSign = timezoneOffset >= 0 ? '+' : '-';
  
    // Combine all parts into the desired format
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}${tzSign}${tzHours}${tzMinutes}`;
  
    return formattedDate;
  }