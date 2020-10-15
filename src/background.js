


function updateBadge() {
  let renderedArticles = localStorage.getItem('rendered_articles') === null ? [] : localStorage.getItem('rendered_articles').split(',');
  let clickedArticles = localStorage.getItem('clicked_articles') === null ? [] : localStorage.getItem('clicked_articles').split(',');
  var cntNewArticle = renderedArticles.length // default value

  for (let n of clickedArticles) {
    if (renderedArticles.includes(n)) {
      cntNewArticle--;
    }
  }

  console.log('current new article number: ', cntNewArticle);

  chrome.browserAction.setBadgeBackgroundColor({ color: '#7d3ffb' });
  chrome.browserAction.setBadgeText({ text: `${cntNewArticle === 0 ? '' : cntNewArticle}` });

}
updateBadge()
window.setInterval(updateBadge, 1000);

renderArticles()
window.setInterval(renderArticles, 300000);

fetch('http://localhost:3001/input');

function renderArticles() {
  fetch('http://localhost:3001/contents')
    .then(res => res.json())
    .then(data => {
      let _array = [];
      data.forEach(element => {
        _array.push(element._id)
      });
      if (_array.length > 0) {
        localStorage.setItem('rendered_articles', _array)
      }
    })
}



