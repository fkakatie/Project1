$(document).ready(function () {
    
    var keyArray = [];
    var dateArray = [];
    var picArray = [];
    var titleArray = [];
    var urlArray = [];
    var randomSix = [];
    
    // these will be the variables we use for the queries
    var searchDate = moment();
    var wikiSearch = moment(searchDate).format("M/D");
    var searchDisplay = moment(searchDate).format("MMMM D");

    // setup masonry grid
    $('.masonry').masonry({
        columnWidth: '.mason-sizer',
        itemSelector: '.mason-item',
        gutter: 15,
        percentPosition: true,
        transitionDuration: 0
    });

    // setup imagesLoaded (still buggy)
    $('.masonry').imagesLoaded().progress( function() {
        $('.masonry').masonry('layout');
    });

    // super sketchy way to reload the dom
    setInterval(function(){ 
        $('.masonry').masonry();    
    }, 200);

    // setup materialize date picker
    $('.datepicker').datepicker({
        format: 'mmmm d',
    });

    // post current date to page on load
    $('#date-search').val(searchDisplay);

    // clear ajax arrays
    function clearArrays() {
        keyArray = [];
        dateArray = [];
        picArray = [];
        titleArray = [];
        urlArray = [];
        randomSix = [];
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

    // clear masonry and reset with today's date
    $('#refreshDate').on('click', function() {

        $('.mason-item').remove();
        $('#date-search').val(moment().format("MMMM D"));

        userInput();

    });

    // grab data from user, searchbar and buttons
    $('.datepicker-done').on("click", userInput);
    $('#backButton').on('click', backButton);
    $('#nextButton').on('click', nextButton);

    function randomNumber() {

        for (var k = 0; randomSix.length < 6; k++) {

            var randomNum = Math.floor(Math.random() * keyArray.length);

            if (randomSix.indexOf(randomNum) === -1) {

                randomSix.push(randomNum);

            };

        }

        // console.log(randomSix);

    };

    function muffinSearch() {

        console.log(wikiSearch);

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

            // imageSearch();

            dataPush();
           
        });
    };

    function imageSearch() {  

        for (var j = 0; j < randomSix.length; j++) {

            var dataTerm = titleArray[randomSix[j]].split(" ").join("_").substring(0, 49);

            $.ajax({
                url: "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=" + dataTerm,
                crossDomain: true,
                crossOrigin: true,
                method: "GET"
            }).then(function (response) {

                    var wikiMedia = response.query.pages;

                    var keys = Object.keys(wikiMedia);

                    picArray.push(wikiMedia[keys].original ? wikiMedia[keys].original.source : "false");

                dataPush();
                
            });

        };

    };

    function dataPush() {
        for (var i = 0; i < randomSix.length; i++) {

            var div = $('<div>');
            var head = $('<h2>');
            var dateSpan = $('<span class="dateSpan">');
            var desc = $('<p>');
            var btn = $('<a class="waves-effect waves-light btn" target="_blank">');

            div.attr('data-term', titleArray[randomSix[i]]);

            div.attr('class', 'mason-item');
            dateSpan.text(wikiSearch);
            head.text(dateArray[randomSix[i]]).append(dateSpan);;
            desc.text(keyArray[randomSix[i]]);
            btn.attr('href', urlArray[randomSix[i]]).text('Learn More');

            if (picArray[i] !== "false" && picArray[i] !== undefined) {

                var img = '<img src="' + picArray[i] + '"/>';

                div.append(img, head, desc, btn);

            } else {

                div.append(head, desc, btn);

            }

            $('.masonry').prepend(div).masonry('prepended', div);

        };
    };

    muffinSearch();

});