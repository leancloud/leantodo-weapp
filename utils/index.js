const isPlainObject = target =>
  target &&
  target.toString() == '[object Object]' &&
  Object.getPrototypeOf(target) == Object.prototype;
const _jsonify = target => {
  if (target && typeof target.toJSON === 'function') return target.toJSON();
  if (Array.isArray(target)) return target.map(_jsonify);
  return target;
};

exports.jsonify = target =>
  isPlainObject(target)
    ? Object.keys(target).reduce(
      (result, key) => ({
        ...result,
        [key]: _jsonify(target[key])
      }),
      {}
    )
    : _jsonify(target);

const systemInfo = wx.getSystemInfoSync();
exports.isQQApp = systemInfo && systemInfo.AppPlatform === 'qq';