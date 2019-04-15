'use strict';

/*
Generate number of tick boxes depending on how many life studies there are per book.
Can I get the data to persist after it has been ticked? i.e. permanently ticked?
Store ticks to local storage. Next time it is generated, it remains ticked or unticked depending on what is in local storage
*/

/*==============================================
GLOBAL VARIABLES
================================================*/

var lifeStudyObjectArray = []; //Stores all the different LS titles
var lifeStudyArray = []; //Stores every single LS
var lifeStudySection; //Section on page for each LS book

var checkedLS = []; //Stores the LS that have been checked
var checkBox; //Checkbox on page
var numberLabel; //Label for checkbox
var uniqueID; //ID for each LS
var stringyLS; //String of LS selected to be stored in local storage

var percentage; //The percentage of messages read
var progressBlurb;

/*==============================================
CONSTRUCTOR FUNCTION
================================================*/
//Constructor function for each LS book
//Stores name of LS and total number of messages
var LifeStudy = function(name, number){
  this.name = name;
  this.number = number;
  lifeStudyObjectArray.push(this);
};

/*==============================================
DOM REFERENCES
================================================*/
//References form from html
var ot = document.getElementById('ot');
var stats = document.getElementById('stats');

/*==============================================
LOCAL STORAGE
================================================*/
//This function checks if there is data in local storage, and retrieves it if there is data
function retrieve(){
  if(localStorage.getItem('LS') === null){ //If no data, nothing happens
    console.log('No checked boxes yet');
  } else {
    stringyLS = localStorage.getItem('LS'); //If data, retrieves back from local storage
    checkedLS = JSON.parse(stringyLS);
    console.log('Retrieved from local storage: ' + checkedLS);
  }
}

/*==============================================
OTHER FUNCTIONS
================================================*/
//Renders LS book title to form
function renderTitle(i){
  var title = document.createElement('h3');
  title.textContent = lifeStudyObjectArray[i].name;
  lifeStudySection.appendChild(title);
}

//Checks if box is already checked
function checkStoredBoxes(){
  if (checkedLS.includes(uniqueID)){
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }
}

//Renders LS checkbox, gives it an ID, adds ID to all LS array
function renderCheckBox(i, j){
  uniqueID = `${lifeStudyObjectArray[i].name}${j+1}`;
  checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.id = uniqueID;
  lifeStudyArray.push(uniqueID);
  checkStoredBoxes();
  lifeStudySection.appendChild(checkBox);
}

//Renders label
function renderLabel(j){
  numberLabel = document.createElement('label');
  numberLabel.textContent = j+1;
  lifeStudySection.appendChild(numberLabel);
}

//Function to create checkboxes and labels for each LS message in a book
function renderCheckBoxesAndLabel(i){
  for (var j = 0; j < lifeStudyObjectArray[i].number; j++){
    renderCheckBox(i, j);
    renderLabel(j);
  }
}

//Function to render LS book info in a fieldset onto the LS form on page
function renderLS(){
  retrieve();
  for (var i = 0; i < lifeStudyObjectArray.length; i++){
    lifeStudySection = document.createElement('fieldset');
    lifeStudySection.id = lifeStudyObjectArray[i].name;
    renderTitle(i);
    renderCheckBoxesAndLabel(i);
    ot.appendChild(lifeStudySection);
  }
  console.log('Total Life-Studies: ' + lifeStudyArray.length);
}

//Function to calculate progress
function calculateProgress(){
  percentage = Math.floor(checkedLS.length / lifeStudyArray.length * 100);
  console.log(percentage + '% read');
}

//Function to render progress to page
function renderProgress(){
  calculateProgress();
  progressBlurb = document.createElement('p');
  progressBlurb.textContent = `${checkedLS.length} of ${lifeStudyArray.length}. ${percentage}% read.`;
  stats.appendChild(progressBlurb);
}

//Function to update progress when new box clicked
function updateProgress(){
  calculateProgress();
  progressBlurb.textContent = `${checkedLS.length} of ${lifeStudyArray.length}. ${percentage}% read.`;
}

// Adds pie charts to page (OT, NT, Total?)
function makeChart(){
  // var productNamesArray = [];
  // var productVotesArray = [];
  // var productPercentageArray = [];
  // var productShownArray = [];

  // for(var i = 0; i < allProducts.length; i++){
  //   productNamesArray.push(allProducts[i].description);
  //   productVotesArray.push(allProducts[i].timesClicked);
  //   productPercentageArray.push(100 * allProducts[i].timesClicked / allProducts[i].timesShown);
  //   productShownArray.push(allProducts[i].timesShown);
  // }

  var pieChartLabels = ['Read'];

  var ctx = document.getElementById('progress-chart').getContext('2d');
  var progressChart = new Chart(ctx, {
    data: {
      labels: pieChartLabels,
      datasets: [{
        label: 'Total Read',
        data: percentage,
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
        ],
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Percentage per product'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      }
    }
  });
}

//Function to load page
function loadPage(){
  renderLS();
  renderProgress();
  makeChart();
}

/*==============================================
SUBMIT EVENT LISTENER
================================================*/

//Event handler that adds clicked LS to array for local storage
var userClickedHandler = function(event){
  event.preventDefault();
  checkedLS = [];

  for (var m = 0; m < lifeStudyArray.length; m++){
    var thisLS = document.getElementById(lifeStudyArray[m]);
    if(thisLS.checked){
      checkedLS.push(lifeStudyArray[m]);
    }
  }
  stringyLS = JSON.stringify(checkedLS); //Stores to local storage
  localStorage.setItem('LS', stringyLS);
  updateProgress();
};

//Event listener added to form
ot.addEventListener('change', userClickedHandler);

/*==============================================
INITIALIZE PAGE
================================================*/

//Instantiates LS
new LifeStudy('genesis', 120);
new LifeStudy('exodus', 185);
new LifeStudy('leviticus', 5);
new LifeStudy('numbers', 7);
new LifeStudy('deuteronomy', 9);

//Instantiates page
loadPage();