// timeMiddleware.js
const { convertUtcToLocal } = require('./timeUtils.js');

module.exports = (req, res, next) => {
  // 保存原始的res.send和res.json方法
  const originalSend = res.send;
  const originalJson = res.json;

  // 覆盖res.send方法
  res.send = (data) => {
    if (data && typeof data === 'object') {
      // 遍历数据中的每个对象，转换时间字段
      if (Array.isArray(data)) {
        data = data.map(item => transformDates(item));
      } else {
        data = transformDates(data);
      }
    }
    // 调用原始的res.send方法
    originalSend.call(res, data);
  };

  // 覆盖res.json方法
  res.json = (data) => {
    if (data && typeof data === 'object') {
      data = transformDates(data);
    }
    // 调用原始的res.json方法
    originalJson.call(res, data);
  };

  next();
};

function transformDates(data) {
  // 转换createdAt和updatedAt字段
  if (data.createdAt) data.createdAt = convertUtcToLocal(data.createdAt);
  if (data.updatedAt) data.updatedAt = convertUtcToLocal(data.updatedAt);
  return data;
}