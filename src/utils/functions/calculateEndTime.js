const calculateEndTime = (startTime, duration) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const totalMinutes = startHours * 60 + startMinutes + duration * 15; 
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours < 10 ? '0' : ''}${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes}`;
  };

module.exports = calculateEndTime