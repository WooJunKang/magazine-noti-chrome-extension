// test for git commit
const ulEle = document.querySelector('#contents-container');
// const articles = document.querySelectorAll('.content');
const allReadEle = document.querySelector('#all-read');

const tag = {

  removeNewTag: function (element) { // li tag
    let newEle = element.querySelector('.new');
    newEle.remove();
  },

  addNewTag: function (element) {
    // make "new" element
    let newEle = document.createElement('div');
    newEle.classList.add('new');
    newEle.textContent = 'NEW';
    // append "new" element into article element
    let articleEle = element.querySelector('.article');
    articleEle.append(newEle);
  },

  addAllNewTag: function () {
    document.querySelectorAll('.content').forEach(article => {
      let _title = article.getAttribute('value');
      let _history = storage.getClickedArticles();
      if (storage.isNewArticle(_title, _history)) {
        console.log('add new tag !!')
        tag.addNewTag(article);
      }
    })
  }

}

const clickEvent = {

  getClickedElement: function (evtTarget) { // returns A tag
    let evtTargetClass = evtTarget.className;
    if (evtTargetClass === 'article' || evtTargetClass === 'img-container') {
      return evtTarget.parentElement;
    } else {
      return evtTarget.parentElement.parentElement;
    }
  }

}

const storage = {

  getClickedArticles: function () { // get history data of clicked articles
    let clickedArticles = localStorage.getItem('clicked_articles');
    if (clickedArticles === null) {
      clickedArticles = [];
    } else {
      clickedArticles = clickedArticles.split(',');
    }
    return clickedArticles;
  },

  addClickedArticle: function (title, history) {
    history.push(title);
    localStorage.setItem('clicked_articles', history);
  },

  addRenderedArticles: function () {
    let _array = [];
    let _articles = document.querySelectorAll('.content')
    for (let article of _articles) {
      _array.push(article.getAttribute('value'));
    }
    if (_array.length > 0) {
      localStorage.setItem('rendered_articles', _array);
    }
  },

  isNewArticle: function (title, history) {
    if (!history.includes(title)) {
      return true;
    }
    return false;
  }

}

const content = {

  renderContent: function (obj) {
    let listEle = document.createElement('li');
    listEle.classList.add('content');
    listEle.setAttribute('value', obj._id);

    let urlEle = document.createElement('a');
    urlEle.setAttribute('href', obj.url);

    // image
    let imgContainerEle = document.createElement('div')
    imgContainerEle.classList.add('img-container')
    let imgEle = document.createElement('img');
    imgEle.classList.add('content-img');
    imgEle.setAttribute('src', obj.img_url);
    imgContainerEle.append(imgEle);

    // article
    let articleEle = document.createElement('div');
    articleEle.classList.add('article');
    // title
    let articleTitleEle = document.createElement('div');
    articleTitleEle.classList.add('title');
    articleTitleEle.textContent = obj.title.length <= 25 ? obj.title : obj.title.slice(0, 25) + '...';
    // description
    let descEle = document.createElement('div');
    descEle.classList.add('description');
    descEle.textContent = obj.description.slice(0, 70) + '...';
    articleEle.append(articleTitleEle, descEle);

    // merge elements
    urlEle.append(imgContainerEle, articleEle);
    listEle.append(urlEle);
    ulEle.append(listEle);


  },


}

//----------------------------------------------------


//----------------------------------------------------



addEventListener('DOMContentLoaded', event => {
  fetch('http://localhost:3001/contents')
    .then(res => res.json())
    .then(data => data.forEach(obj => {
      content.renderContent(obj);
    }))
    .then(() => {
      tag.addAllNewTag();
      storage.addRenderedArticles();
      clickingEvent();
    });
})

function clickingEvent() {
  document.querySelectorAll('.content').forEach(article => {
    article.addEventListener('click', event => {
      let _element = clickEvent.getClickedElement(event.target);
      let _title = _element.parentElement.getAttribute('value');
      let _history = storage.getClickedArticles();
      if (storage.isNewArticle(_title, _history)) {
        console.log('It is new article !!')
        storage.addClickedArticle(_title, _history);
        tag.removeNewTag(_element);
      }
    })
  })
}


allReadEle.addEventListener('click', () => {
  console.log('removing All new tags!')
  document.querySelectorAll('.content').forEach(article => {
    let _title = article.getAttribute('value');
    let _history = storage.getClickedArticles();
    if (storage.isNewArticle(_title, _history)) {
      console.log('find new article !!')
      storage.addClickedArticle(_title, _history);
      tag.removeNewTag(article);
    }
  })
})