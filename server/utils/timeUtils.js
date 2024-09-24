// utils/timeUtils.js
function convertUtcToLocal(utcDateString) {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(
      utcDate.getTime() + 
      utcDate.getTimezoneOffset() * 60000 + 
      8 * 60 * 60 * 1000 // 添加8小时（北京时区与UTC的时差）
    );
    return localDate.toISOString();
  }
  module.exports = { convertUtcToLocal };