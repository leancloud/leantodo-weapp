module.exports = (subscription, initialStats, onChange) => {
  let stats = [...initialStats]
  const remove = value => {
    stats = stats.filter(target => target.id !== value.id)
    return onChange(stats)
  }
  const upsert = value => {
    let existed = false;
    stats = stats.map(target => (target.id === value.id ? ((existed = true), value) : target))
    if (!existed) stats = [value, ...stats]
    return onChange(stats)
  }
  subscription.on('create', upsert)
  subscription.on('update', upsert)
  subscription.on('enter', upsert)
  subscription.on('leave', remove)
  subscription.on('delete', remove)
  return () => {
    subscription.off('create', upsert)
    subscription.off('update', upsert)
    subscription.off('enter', upsert)
    subscription.off('leave', remove)
    subscription.off('delete', remove)
  }
}
