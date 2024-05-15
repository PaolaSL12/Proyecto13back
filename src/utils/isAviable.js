const moment = require('moment');

const getDayOfWeek = (dateString) => {
    const date = moment(dateString, 'DD/MM/YYYY');
    return date.format('dddd');
  };
  
  const isAvailable = (stylist, date, startTime, endTime) => {
    const dayOfWeek = getDayOfWeek(date);
    const schedule = stylist.workSchedule.find(s => s.day === dayOfWeek);
    if (!schedule) {
      return false; 
    }
  
    for (const slot of schedule.timeSlots) {
      if ((startTime >= slot.startTime && startTime < slot.endTime) || (endTime > slot.startTime && endTime <= slot.endTime)) {
        return false; 
      }
    }
  
    return true; 
  };

  module.exports = isAvailable