$(document).ready(function () {
    
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
    }

    // grab userInput from searchbar, and grab data
    function userInput() {
        searchDisplay = $('#date-search').val().trim();
        wikiSearch = moment(searchDisplay).format('M/D');

        clearArrays();
        wikipedia();
    };
    // change date 1 day backward
    function backButton() {
        searchDate = moment(searchDate).subtract(1, 'd');
        wikiSearch = moment(searchDate).format("M/D");
        searchDisplay = moment(searchDate).format("MMMM D");

        $('#date-search').val(searchDisplay);

        clearArrays();
        wikipedia();
    };
    // change date 1 day forward
    function nextButton() {
        searchDate = moment(searchDate).add(1, 'd');
        wikiSearch = moment(searchDate).format("M/D");
        searchDisplay = moment(searchDate).format("MMMM D");

        $('#date-search').val(searchDisplay);

        clearArrays();
        wikipedia();
    };

    var keyArray = [];
    var dateArray = [];
    var picArray = [];
    var titleArray = [];
    var urlArray = [];

    function wikipedia() {
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

            }

            for (var j = 0; j < 10; j++) {

                var searchKey = titleArray[j].split(" ").join("_").substring(0, 49);
                var counter = 0;

                $.ajax({
                    url: "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=" + searchKey,
                    crossDomain: true,
                    crossOrigin: true,
                    method: "GET"
                }).then(function (response) {

                    var wikiMedia = response.query.pages;

                    counter++;
                    // console.log(counter);
                    var keys = Object.keys(wikiMedia);
                    // console.log(keys);
                    picArray.push(wikiMedia[keys].original ? wikiMedia[keys].original.source : "#");
                    // console.log(wikiMedia[keys].original.source);

                })

            };

            dataPush();
           
        });
    };

    function dataPush() {
        for (var i = 0; i < keyArray.length; i++) {

            var div = $('<div>');
            var head = $('<h2>');
            var dateSpan = $('<span class="dateSpan">');
            var desc = $('<p>');
            var img = '<img src="' + picArray[i] + '"/>';
            var btn = $('<a class="waves-effect waves-light btn" target="_blank">')

            div.attr('class', 'mason-item');
            dateSpan.text(wikiSearch);
            head.text(dateArray[i]).append(dateSpan);;
            desc.text(keyArray[i]);
            btn.attr('href', urlArray[i]).text('Learn More');

            div.append(img, head, desc, btn);

            $('.masonry').prepend(div).masonry('prepended', div);
        };
    };

    wikipedia();

    // grab data from user, searchbar and buttons
    $('.datepicker-done').on("click", userInput);
    $('#backButton').on('click', backButton);
    $('#nextButton').on('click', nextButton);

});
