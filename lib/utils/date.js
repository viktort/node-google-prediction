var moment = require('moment');

module.exports = DateUtils;

function DateUtils() {

}
//Return epoch time in seconds
DateUtils.getEpochTime = function() {
  return Math.floor(new Date().getTime() / 1000);
}

DateUtils.addHours = function(hour) {
  return this.getEpochTime() + (hour * 3600);
}