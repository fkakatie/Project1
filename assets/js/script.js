$(document).ready(function () {

    var dataTerm;
    var randomFive = [];
    
    // setup masonry grid
    var msnry = $('.masonry').masonry({
        columnWidth: '.mason-sizer',
        itemSelector: '.mason-item',
        gutter: 15,
        percentPosition: true
    });

    msnry.imagesLoaded().progress( function() {
        msnry.masonry();
    });

    // setup materialize date picker
    $('.datepicker').datepicker({
        format: 'mmmm d',
    });

    // this will be the variable we use for the queries
    var searchDate = moment();
    var wikiSearch = moment(searchDate).format("M/D");
    var searchDisplay = moment(searchDate).format("MMMM D");

    // post current date to page on load
    $('#date-search').val(searchDisplay);

    // clear ajax arrays
    function clearArrays() {
        keyArray = [];
        dateArray = [];
        picArray = [];
        titleArray = [];
        urlArray = [];
        randomFive = [];
    }

    // grab userInput from searchbar, and grab data
    function userInput() {
        searchDisplay = $('#date-search').val().trim();
        wikiSearch = moment(searchDisplay).format('M/D');

        clearArrays();
        muffinSearch();
    };
    // change date 1 day backward
    function backButton() {
        searchDate = moment(searchDate).subtract(1, 'd');
        wikiSearch = moment(searchDate).format("M/D");
        searchDisplay = moment(searchDate).format("MMMM D");

        $('#date-search').val(searchDisplay);

        clearArrays();
        muffinSearch();
    };
    // change date 1 day forward
    function nextButton() {
        searchDate = moment(searchDate).add(1, 'd');
        wikiSearch = moment(searchDate).format("M/D");
        searchDisplay = moment(searchDate).format("MMMM D");

        $('#date-search').val(searchDisplay);

        clearArrays();
        muffinSearch();
    };

    var keyArray = [];
    var dateArray = [];
    var picArray = [];
    var titleArray = [];
    var urlArray = [];

    function muffinSearch() {

        $.ajax({
            url: "https://history.muffinlabs.com/date/" + wikiSearch,
            method: "GET",
            dataType: "jsonp"
        }).then(function (response) {

            var muffin = response.data.Events;

            for (var i = 0; i < muffin.length; i++) {

                keyArray.push(muffin[i].text);
                dateArray.push(muffin[i].year);
                titleArray.push(muffin[i].links[0].title);
                urlArray.push(muffin[i].links[0].link);

            };

            randomNumber();

            dataPush();
           
        });
    };

    function randomNumber() {

        for (var k = 0; k < 5; k++) {

            var randomNum = Math.floor(Math.random() * keyArray.length);

            if (randomFive.indexOf(randomNum) === -1) {

                randomFive.push(randomNum);

            };  

        }

        console.log(randomFive);

    };

    function imageSearch() {  

        dataTerm = dataTerm.split(" ").join("_").substring(0, 49);

        $.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=" + dataTerm,
            crossDomain: true,
            crossOrigin: true,
            method: "GET"
        }).then(function (response) {

            var wikiMedia = response.query.pages;

            var keys = Object.keys(wikiMedia);
            picArray.unshift(wikiMedia[keys].original ? wikiMedia[keys].original.source : "false");
            
            var img = '<img src="' + wikiMedia[keys].original.source + '"/>';

            div.append(img, head, desc, btn);
            // div.append(head, desc, btn);

            $('.masonry').prepend(div).masonry('prepended', div);
            
        })

        console.log(picArray);

    };

    function dataPush() {
        for (var i = 0; i < randomFive.length; i++) {

            var div = $('<div>');
            var head = $('<h2>');
            var dateSpan = $('<span class="dateSpan">');
            var desc = $('<p>');
            var btn = $('<a class="waves-effect waves-light btn" target="_blank">');

            div.attr('data-term', titleArray[randomFive[i]]);

            dataTerm = div.attr('data-term');

            div.attr('class', 'mason-item');
            dateSpan.text(wikiSearch);
            head.text(dateArray[randomFive[i]]).append(dateSpan);;
            desc.text(keyArray[randomFive[i]]);
            btn.attr('href', urlArray[randomFive[i]]).text('Learn More');

            imageSearch(dataTerm, head, desc, btn);

            // var img = '<img src="' + picArray[i] + '"/>';

            // div.append(img, head, desc, btn);
            // div.append(head, desc, btn);

            // $('.masonry').prepend(div).masonry('prepended', div);

        };
    };

    function dataPushTwo() {

    };

    muffinSearch();

    // grab data from user, searchbar and buttons
    $('.datepicker-done').on("click", userInput);
    $('#backButton').on('click', backButton);
    $('#nextButton').on('click', nextButton);

});
