// Utility
const getRandomColour = () => '#'+ Math.floor(Math.random()*16777215).toString(16);

const noConnectionHTML = () => {
  const noConn = document.createElement('h2');
  
  noConn.textContent = 'No connection... please, try again later.';
  document.body.appendChild(noConn);
}

const getGameDeals = async() => {
  const { apiKEY, baseURL } = states.config;

  try {
    const result = await fetch(`${baseURL}key=${apiKEY}&region=eu2&limit=1000&sort=price:asc`);
    const data = await result.json();
    const lessThanThree = data.data.list.filter((game) => game.price_new <= 3.00);
  
    return lessThanThree;
  } catch (error) {
    console.error(error.message, 'no connection with the server ...');
    noConnectionHTML();
    throw new Error;
  }
}

const checkedGame = async (plain) => {
  const { apiKEY, gameInfoURL } = states.config; 

  const result = await fetch(`${gameInfoURL}key=${apiKEY}&plains=${plain}`);
  const data = await result.json();

  if (!data.data[plain].is_dlc && !data.data[plain].is_package) {
    if (
      data?.data[plain]?.reviews?.steam?.perc_positive >= 60 &&
      data?.data[plain]?.reviews?.steam?.total >= 500
      ) {
      return plain;
    }
  }
}

// Init
const states = {
  config: {
    apiKEY: '63e37120d9ffa979b4342e2bcd20acc4c5ec9a90',
    baseURL: 'https://api.isthereanydeal.com/v01/deals/list/?',
    searchURL: 'https://api.isthereanydeal.com/v02/search/search/?',
    gameInfoURL: 'https://api.isthereanydeal.com/v01/game/info/?',
  },
  data: {
    currency: '',
  }
}

const renderGameItem = async() => {
  const gameDealsList = await getGameDeals();

  gameDealsList.forEach((game) => {
    const checkGameList = checkedGame(game.plain);

    checkGameList.then((el) => {
      if(el) {
        const priceFormat = game.price_new.toFixed(2);

        createGameItem('€', priceFormat, game.title, game.urls.buy);
      }
    })
  })
} 

renderGameItem();

function createGameItem(currency, priceValue, titleValue, linkValue) {
  const parent = document.querySelector('.gamesWrapper');
  const wrapper = document.createElement('li');
  wrapper.classList.add('gamesWrapper__item');

  const price = document.createElement('p');
  price.classList.add('gamesWrapper__item--price');
  price.textContent = `${currency} ${priceValue}`;

  const animation = document.createElement('div');
  animation.classList.add('gamesWrapper__item--anim');

  const animationShape = document.createElement('p');
  animationShape.classList.add('shape');
  animationShape.style.background = getRandomColour();
  animation.appendChild(animationShape);

  const title = document.createElement('p');
  title.classList.add('gamesWrapper__item--title');
  title.textContent = titleValue;  
  if (priceValue <= 0) {
    title.style.color = getRandomColour();
    title.classList.add('zeroZero');
  }

  const link = document.createElement('a');
  link.classList.add('gamesWrapper__item--link');
  link.textContent = 'buy it!';
  link.href = linkValue;

  wrapper.append(price, animation, title, link);
  return parent.appendChild(wrapper);
}



function createTopGame(gameTitle, gamePrice, gameReleased, gameScore) {
  const wrapperName = document.createElement('div');
  wrapperName.classList.add('topGames--name');
  
  const wrapperNameH3 = document.createElement('h3');
  wrapperNameH3.textContent = gameTitle;
  const wrapperNameH2 = document.createElement('h2');
  wrapperNameH2.textContent = gamePrice;
  wrapperName.append(wrapperNameH3, wrapperNameH2);

  const wrapperInfo = document.createElement('div');
  wrapperInfo.classList.add('topGames--info');

  const wrapperReleased = document.createElement('div');
  wrapperReleased.classList.add('released');
  const wrapperP = document.createElement('p');
  wrapperP.textContent = 'released';
  const wrapperSpan = document.createElement('span');
  wrapperSpan.textContent = gameReleased;
  wrapperReleased.append(wrapperP, wrapperSpan);
  

  const wrapperScore = document.createElement('div');
  wrapperScore.classList.add('score');
  const wrapperScoreP = document.createElement('p');
  wrapperScoreP.textContent = 'score';
  const wrapperScoreSpan = document.createElement('span');
  wrapperScoreSpan.textContent = gameScore;
  wrapperScore.append(wrapperScoreP, wrapperScoreSpan);

  const wrapperPlatform = document.createElement('div');
  wrapperPlatform.classList.add('platform');
  const wrapperPlatformP = document.createElement('p');
  wrapperPlatformP.textContent = 'platform';
  const wrapperPlatformCont = document.createElement('div');
  wrapperPlatformCont.classList.add('container');
  const wrapperPlatformContDivI = document.createElement('div');
  const wrapperPlatformContDivImgI = document.createElement('img');
  wrapperPlatformContDivImgI.src = "./img/microsoft.png";
  wrapperPlatformContDivI.appendChild(wrapperPlatformContDivImgI);
  const wrapperPlatformContDivII = document.createElement('div');
  const wrapperPlatformContDivImgII = document.createElement('img');
  wrapperPlatformContDivImgII.src = "./img/apple.png";
  wrapperPlatformContDivII.appendChild(wrapperPlatformContDivImgII);

  wrapperPlatformCont.append(wrapperPlatformContDivI, wrapperPlatformContDivII);
  wrapperPlatform.append(wrapperPlatformP, wrapperPlatformCont);

  wrapperInfo.append(wrapperReleased, wrapperScore, wrapperPlatform);

  const topGames = document.querySelector('.topGames');
  topGames.append(wrapperName, wrapperInfo);
}

// Test
// createTopGame('Diablo II - Resurrect', 0.59, '2021/02/01', 100);