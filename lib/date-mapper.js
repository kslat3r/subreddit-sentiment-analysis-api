module.exports = (dates) => dates.map((date) => {
  delete date.id
  delete date.subredditId

  date.average = date.score / date.count
  date.label = date.created.toISOString().split('T')[0].split('-').reverse().join('/')

  return date
})
