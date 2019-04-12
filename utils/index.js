const AV = require('../utils/av-live-query-weapp-min');

const isPlainObject = obj => obj && obj.toString() == '[object Object]' && Object.getPrototypeOf(obj) == Object.prototype;


exports.jsonify = target => {
  const _jsonify = _target => {
    if (_target instanceof AV.Object) return _target.toJSON();
    if (Array.isArray(_target)) return _target.map(_jsonify);
    return _target;
  };
  if (isPlainObject(target)) return Object.keys(target).reduce((result, key) => ({
    ...result,
    [key]: _jsonify(target[key]),
  }), {});
  return _jsonify(target);
};