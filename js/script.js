
function getDog() {
    $.getJSON("https://dog.ceo/api/breeds/image/random", function (data) {
        console.log(data);      
        var path = data.message;
        var pathArray = path.split("/");
        console.log(pathArray);
        var breedIndex = pathArray["4"];
        var breed = breedIndex.replace("-"," ");
        // $("#title").text(breed);  
        $("#picture").html(JSON.stringify(data, null, 4));
        $("#picture").html("<img src='" + path + "'>");  
           function getWiki() {
               $.ajax({
                   url: '//en.wikipedia.org/w/api.php',
                   data: {
                       action: 'query',
                       list: 'search',
                       srsearch: breed,
                       format: 'json',
                       formatversion: 2
                   },
                   dataType: 'jsonp',
                   success: function (x) {
                       console.log(x);                       
                       var breedSnippet = x.query.search[0].snippet;
                       var cleanSnippet = breedSnippet.replace(/<(?:.|\n)*?>/gm, '');
                       $("#title").text(x.query.search[0].title);
                       $("#article").text(cleanSnippet);                    
                   }
               });
           }
        getWiki();
    });
}

$('#fetch').click(function () {
    getDog();
});
