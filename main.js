//Open the Administration tab by default
document.getElementById("administrationTab").click();

function openTab(evt, tabName) {
  var i, tabContent, tabButtons;

  //Hide the contents of both tabs
  tabContent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  //Remove the class "active" from elements with the class "tabButtons"
  tabButtons = document.getElementsByClassName("tabButtons");
  for (i = 0; i < tabButtons.length; i++) {
    tabButtons[i].className = tabButtons[i].className.replace(" active", "");
  }

  //Show the current tab and add the class "active" to the button
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

var defaultForm = document.getElementById("form1");
var formCounter = 1;
var addedForm;

function addForm() {

  defaultForm.name = "form" + formCounter;
  formCounter++;
  addedForm = defaultForm.cloneNode(true);
  //The numbering of added elements
  addedForm.querySelector('[class="label1"]').innerHTML = "Element " + formCounter + " ";
  addedForm.querySelector('[class="elementLabels"]').placeholder = "Label " + formCounter;
  addedForm.id = "form" + formCounter;
  addedForm.name = "form" + formCounter;
  document.getElementById("formDisplay").appendChild(addedForm);
}

//Add 3 radio buttons when "Radio buttons" is selected
function radioSelection() {
  for (var i = 0; i < formCounter; i++) {
    var selectBox = document.getElementsByClassName("select1")[i];
    var userSelection = selectBox.options[selectBox.selectedIndex].value;
    if (userSelection == "radio") {
      document.getElementsByClassName("radioLabelSpan")[i].innerHTML = "";
      for (var j = 1; j <= 3; j++) {
        var radioLabel = document.createElement("input");
        radioLabel.type = "text";
        radioLabel.className = "radioLabel";
        radioLabel.placeholder = "Radio button label " + j;
        document.getElementsByClassName("radioLabelSpan")[i].appendChild(radioLabel);
      }
    } else {
      document.getElementsByClassName("radioLabelSpan")[i].innerHTML = "";
    }
  }
}

//Create a map for forms storage
var mapOfForms = new Map();

function saveForm() {
  var formularName = document.getElementById("formularName").value
  var completeForm = document.getElementById("formDisplay").cloneNode(true);

  //Save the values of select1 and select2
  for (var c = 1; c <= formCounter; c++) {
    completeForm.querySelectorAll(".select1")[c - 1].selectedIndex = document.getElementById("form" + c).querySelector('[class="select1"]').selectedIndex;
    completeForm.querySelectorAll(".select2")[c - 1].selectedIndex = document.getElementById("form" + c).querySelector('[class="select2"]').selectedIndex;
  }

  //Store the complete form template in the map;
  mapOfForms.set(formularName, completeForm);
  var optionAdded = document.createElement("option");
  optionAdded.text = formularName;
  optionAdded.value = formularName;
  var formularSelect = document.getElementById("formularSelect");

  //Prevent saving multiple forms under the same name
  for (i = 0; i < formularSelect.length; i++) {
    if (optionAdded.value == formularSelect.options[i].value) {
      formularSelect.removeChild(formularSelect.options[i]);
    }
  }
  formularSelect.appendChild(optionAdded);
}

function search() {
  var searchValue = mapOfForms.get(document.getElementById("formularName").value);
  if (searchValue == null) {
    document.getElementById("searchDisplay").style.display = "block";
    document.getElementById("formularName").value = "Formular not found!"
  } else {
    document.getElementById("formDisplay").innerHTML = "";
    document.getElementById("formDisplay").appendChild(mapOfForms.get(document.getElementById("formularName").value))
  }
}


function load() {
  var formDisplayDiv = document.getElementById("formDisplay");
  var formularSelected = document.getElementById("formularSelect").value;
  var formularSelectedVersion = document.getElementById("versionInput").value;

  var selectedLoad = mapOfForms.get(formularSelected);
  var filledFormName = formularSelected + " version " + formularSelectedVersion;
  var filledFormLoad = mapOfFilledForms.get(filledFormName);

  //Load a filled form if it exists under the specified name and version
  if (filledFormLoad != null) {
    document.getElementById("formLoaded").innerHTML = "";
    document.getElementById("formLoaded").appendChild(filledFormLoad);
  } else if (selectedLoad != null) {
    while (formDisplayDiv.firstChild) {
      formDisplayDiv.removeChild(formDisplayDiv.firstChild);
    }
    formCounter = 1;
    document.getElementById("formLoaded").innerHTML = "";
    document.getElementById("formLoaded").appendChild(selectedLoad);
    var formsLoaded = document.getElementsByTagName("form");
    for (var i = 0; i < formsLoaded.length; i++) {
      var labelValue = document.forms[i].elementLabel.value;
      var sel1Value = document.forms[i].sel1.value;
      var sel2Value = document.forms[i].sel2.value;

      //Insert label for each form
      var span = document.createElement("span");
      span.className = "spanLabel";

      document.getElementById("formLoaded").appendChild(span);

      if (sel1Value == "radio") {
        for (var j = 0; j < 3; j++) {
          var radioElement = document.createElement("input");
          radioElement.id = "radio" + j;
          radioElement.className = "radioElement"
          radioElement.type = "radio";
          radioElement.name = "formRadio" + i;
          if (sel2Value == "mandatory") {
            span.innerHTML = labelValue + ": * ";
            radioElement.required = true;
          } else {
            span.innerHTML = labelValue + ": ";
          }
          document.getElementById("formLoaded").appendChild(radioElement);

          var labelRadio = document.createElement("Label");
          labelRadio.innerHTML = document.getElementsByClassName("radioLabel")[j].value;
          labelRadio.for = "radio" + j;
          document.getElementById("formLoaded").appendChild(labelRadio);
        }
      } else {
        var in1 = document.createElement("input");
        in1.type = sel1Value;
        in1.className = "in1"

        if (sel2Value == "mandatory") {
          span.innerHTML = labelValue + ": * ";
          in1.required = true;
        } else {
          span.innerHTML = labelValue + ": ";
        }
        document.getElementById("formLoaded").appendChild(in1);
      }

      //Put each form in a new line
      document.getElementById("formLoaded").appendChild(document.createElement("br"));
      document.getElementById("formLoaded").appendChild(document.createElement("br"));
    }
    document.getElementById("formLoaded").removeChild(selectedLoad);

    document.getElementById("formDisplay").appendChild(defaultForm);
  } else {
    alert("Sorry. No formular found!")
  }
}

//Store filled forms in a new map
var mapOfFilledForms = new Map();

function saveFormFilled() {
  var boolean = false;
  var formValid = document.getElementById('formLoaded');
  var validElements = formValid.getElementsByTagName('input');


  for (var i = 0; i < validElements.length; i++) {
    //Validation of text input
    if (validElements[i].hasAttribute('required') && validElements[i].type == 'text' && validElements[i].value == '') {
      boolean = true;
    }
}
  //Validation of checkboxes
  for (var i = 0; i < validElements.length; i++) {
    if (validElements[i].hasAttribute('required') && validElements[i].type == 'checkbox' && validElements[i].checked == false) {
      boolean = true;
    }
  }

  //Validation of radio buttons
  for (var i = 0; i < (validElements.length - 2); i++) {
    if ( (validElements[i].hasAttribute('required') && validElements[i].type == 'radio') && (validElements[i].checked == false && validElements[i+1].checked == false && validElements[i+2].checked == false)){
      boolean = true;
    }
  }

  if (boolean == true) {
    alert('Fields marked with an asterisk are mandatory!');
  }
  else{
  var formFilled = document.getElementById("formLoaded").cloneNode(true);
  var filledFormName = document.getElementById("formularSelect").value + " version " + document.getElementById("versionInput").value;
  mapOfFilledForms.set(filledFormName, formFilled);
  }
}
