window.onload = () => {
  d3.selectAll('p').style('color', () => {
    return `hsl(${Math.random() * 360}, 100%, 50%)`
  })
}