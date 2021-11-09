$(document).ready(documentReady);

function documentReady() {
    console.log("Document fully loaded");
    $('input[name="inputfield"]').keyup(inputKeyup);
    $('button[name="submit"]').click(searchButtonClicked);

    $('.quickSearch').click(quickCLickedButton);
    $('button[name="quickbuttonSS"]').click(clickSS);
    $('button[name="quickbuttonSP"]').click(clickSP);
    $('button[name="quickbuttonSH"]').click(clickSH);
    $('button[name="quickbuttonSC"]').click(clickSC);
    $('.close-btn').click(closeButton);
}

var switchSearch = 1;

//SEARCH BUTTONS
function quickCLickedButton(event) {
    event.preventDefault();
    $('.clicked').removeClass('clicked');
    $(event.currentTarget).addClass('clicked');

    $('input[name="inputfield"]').val("");
}

function clickSS(e) {
    e.preventDefault();
    switchSearch = 1;
    $('input[name="inputfield"]').attr('placeholder', 'Totoro, Dragon, God...');
}

function clickSP(e) {
    e.preventDefault();
    switchSearch = 2;
    $('input[name="inputfield"]').attr('placeholder', 'Jigo, Louis, Osono...');
}

function clickSH(e) {
    e.preventDefault();
    switchSearch = 2;
    $('input[name="inputfield"]').val('Haku');
    $('input[name="inputfield"]').attr('placeholder', 'Totoro, Dragon, God...');
}

function clickSC(e) {
    e.preventDefault();
    switchSearch = 1;
    $('input[name="inputfield"]').val("Cat");
    $('input[name="inputfield"]').attr('placeholder', 'Jigo, Louis, Osono...');
}

//SUBIT AND INPUT FIELD
function searchButtonClicked(event) {
    event.preventDefault();
    console.log("Submit button is pressed")

    $('button[name="submit"]').removeClass('clicked');
    $('button[name="quickbuttonSH"]').removeClass('clicked');
    $('button[name="quickbuttonSC"]').removeClass('clicked');
    $(event.currentTarget).addClass('clicked');

    doSearch();

    $('input[name="inputfield"]').val("");
}

function inputKeyup(event) {
    if (event.which == 13) {
        console.log("Enter is pressed in input")

        $('button[name="submit"]').removeClass('clicked');
        $('button[name="quickbuttonSH"]').removeClass('clicked');
        $('button[name="quickbuttonSC"]').removeClass('clicked');

        doSearch();

        $('input[name="inputfield"]').val("");
    }
}


//AJAX SEARCHING AND RESULT
function doSearch() {
    //$('div.errorMessage').removeClass('template'); //Because API does not work anyway
    var input = $('input[name="inputfield"]').val();
    if (switchSearch == 1) {
        var searchURL = 'https://ghibliapi.herokuapp.com/species?name=' + input;

    }

    if (switchSearch == 2) {
        var searchURL = 'https://ghibliapi.herokuapp.com/people?name=' + input;
    }

    console.log("Search request asked");
    $('.ResultsBox').empty();

    $.ajax({
        "url": searchURL,
        "method": "get",
        "dataType": "json"
    }).done(ajaxDone);
}

function ajaxDone(data) {
    console.log(data);
    console.log("Data given");

    if (data.length == 0) {
        $('div.errorMessage').removeClass('template');
        console.log("Error message");
    } else {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].title);

            for (var j = 0; j < 6; j++) {


                $.ajax({
                    "url": data[i].films[j],
                    "method": "get",
                    "dataType": "json"
                }).done(ajaxDoneTwo);
            }
        }
    }
}

function ajaxDoneTwo(data) {
    console.log(data);
    console.log(data.title);
    console.log("Data two given");

    if (data.length == 0) {
        $('div.errorMessage').removeClass('template');
        console.log("Error message");
    } else {

        console.log("APPEND LOOP" + data.title);

        var result = $(`<div class="result">
         <h2>Result</h2>
         <p>Title: ` + data.title + `</p>
         <p>Director: ` + data.director + `</p>
         <P>Release Date: ` + data.release_date + `</P>
         <a href="https://ghibli.fandom.com/wiki/` + data.title + `" target="_blank" rel="noopener noreferrer">Link to more Information</a> 
     </div>`);

        $('.ResultsBox').append(result);
        console.log("Data appended");
    }
}

// ERROR MESSAGE
function closeButton() {
    console.log("Close Button Pressed");
    $('div.errorMessage').addClass('template');
    $('.clicked').removeClass('clicked');
    $('input[name="inputfield"]').val("");
}