const dummy = (blogs) => {
    return 1;
  }
  const totalLikes = blogs => {
    let sum = 0;
    for (blog of blogs) {
      sum += blog.likes
    }
  
    return sum
  }
  
  
  module.exports = {
    dummy, totalLikes
  }

