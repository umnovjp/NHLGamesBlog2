const tipForm = document.getElementById('tip-form');
const tipsContainer = document.getElementById('tip-container');
var game0 = document.getElementById('game0');
const frequency = (arr, item) => {let count = 0;
  for (let i = 0; i < arr.length; i++) {if (arr[i] === item) {count++}}
  return count;
};

const createCard = (tip) => {
  // Create card
  const cardEl = document.createElement('div');
  cardEl.classList.add('card', 'mb-3', 'm-3');
  cardEl.setAttribute('key', tip.tip_id);

  // Create card header
  const cardHeaderEl = document.createElement('h4');
  cardHeaderEl.classList.add(
    'card-header',
    'bg-primary',
    'text-light',
    'p-2',
    'm-0'
  );
  cardHeaderEl.innerHTML = `${tip.username} </br>`;

  // Create card body
  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body', 'bg-light', 'p-2');
  cardBodyEl.innerHTML = `<p>${tip.tip}</p>`;

  // Append the header and body to the card element
  cardEl.appendChild(cardHeaderEl);
  cardEl.appendChild(cardBodyEl);

  // Append the card element to the tips container in the DOM
  tipsContainer.appendChild(cardEl);
};

// Get a list of existing tips from the server
const getTips = () =>
  fetch('/api/tips', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error('Error:', error);
    });

// Post a new tip to the page
const postTip = (tip) =>
  fetch('/api/tips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tip),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
      createCard(tip);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

// When the page loads, get all the tips
getTips().then((data) => data.forEach((tip) => createCard(tip)));

// Function to validate the tips that were submitted
const validateTip = (newTip) => {
  const { username, topic, tip } = newTip;

  // Object to hold our error messages until we are ready to return
  const errorState = {
    username: '',
    tip: '',
    topic: '',
  };

  // Bool value if the username is valid
  const utest = username.length >= 4;
  if (!utest) {
    errorState.username = 'Invalid username!';
  }

  // Bool value to see if the tip being added is at least 15 characters long
  const tipContentCheck = tip.length > 15;
  if (!tipContentCheck) {
    errorState.tip = 'Tip must be at least 15 characters';
  }

  // Bool value to see if the topic is either UX or UI
  const topicCheck = topic.includes('UX' || 'UI');
  if (!topicCheck) {
    errorState.topic = 'Topic not relevant to UX or UI';
  }

  const result = {
    isValid: !!(utest && tipContentCheck && topicCheck),
    errors: errorState,
  };

  // Return result object with a isValid boolean and an errors object for any errors that may exist
  return result;
};

// Helper function to deal with errors that exist in the result

const showErrors = (errorObj) => {
  const errors = Object.values(errorObj);
  errors.forEach((error) => {
    if (error.length > 0) {
      alert(error);
    }
  });
};

// Helper function to send a POST request to the diagnostics route
const submitDiagnostics = (submissionObj) => {
  fetch('/api/diagnostics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionObj),
  })
    .then((response) => response.json())
    .then(() => showErrors(submissionObj.errors))
    .catch((error) => {
      console.error('Error:', error);
    });
};

// Function to handle when a user submits the feedback form
const handleFormSubmit = (e) => {
  e.preventDefault();
  console.log('Form submit invoked');

  // Get the value of the tip and save it to a variable
  const tipContent = document.getElementById('tipText').value;

  // get the value of the username and save it to a variable
  const tipUsername = document.getElementById('tipUsername').value.trim();

  // Create an object with the tip and username
  const newTip = { title: userTitle,
    username: tipUsername,
    topic: 'UX',
    tip: tipContent,
  };

  // Run the tip object through our validator function
  const submission = validateTip(newTip);

  // If the submission is valid, post the tip. Otherwise, handle the errors.
  return submission.isValid ? postTip(newTip) : submitDiagnostics(submission);
};

function selectGame() {var inputVal = document.getElementById('datepicker').value;
  var date = inputVal.split('/'); var formatted = date[2] + '-' + date[0] + '-' + date[1];
  // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/schedule/'+ formatted;
  var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/schedule/'+ formatted;
  // console.log(requestURL);
  fetch(requestURL, { "method": "GET", "headers": {}
  })
    .then(function (response) {return response.json()})
    .then(function (data2) { console.log('I am in schedule then');
      for (var i = 0; i < data2.gameWeek[0].games.length; i++) { var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i); var idx = gameName.getAttribute('id');
        gameName.innerHTML = 'Game ' + i + ': ' + data2.gameWeek[0].games[i].awayTeam.abbrev + ' ' + data2.gameWeek[0].games[i].homeTeam.abbrev;
        document.getElementById('gamesPlayed').appendChild(gameName); gameName.addEventListener('click', displayGameData);
      }
      function displayGameData(event) { idx = event.currentTarget; idxString = event.currentTarget.textContent;
        idxArray = idxString.split(':'); idxNumber = idxArray[0].split(' '); console.log(idxNumber); gameNumber = idxNumber[1];
        // const gameId = data2.gameWeek[0].games[gameNumber].id;
        // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play';
        var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/gamecenter/' + data2.gameWeek[0].games[gameNumber].id + '/boxscore';
        fetch(requestURL, { "method": "GET", "headers": { }
        })
          .then(function (response) { return response.json()})
          .then(function (data) { console.log('I am in second then');
            console.log(data.playerByGameStats.homeTeam);
            var shiftsURL = 'https://cors-anywhere.herokuapp.com/https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + data2.gameWeek[0].games[gameNumber].id;;
            fetch(shiftsURL, { "method": "GET", "headers": {} })
            .then(function (response) {return response.json()})
            .then(function (data_shifts) { console.log (data_shifts);
              console.log('I am in shifts then')
              // will add script here but I do not have concept at this time              
            })
          }
        );
      } // end displayGamedata
    } // end first second .then
    )}

// Listen for when the form is submitted
tipForm.addEventListener('submit', handleFormSubmit);
