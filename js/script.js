
// add breed options to dropdown menu
function loadBreed() 
{
    var all_breeds = 'https://dog.ceo/api/breeds/list/all';

    $.getJSON (all_breeds, function(data)
    {
        var breeds = data.message;

        $.each (breeds, function(name, subbreed)
        {
            $('#breed-selector').append('<option>' + name + '</option>');
            /*else
            {
                for (n = 0; n < breeds[name].length; n ++) 
                    $('#breed-selector').append('<option>'+ breeds[name][n] + ' ' + name + '</option>');
            }*/

        });
    });    

};

// load images of selected breed
function loadImages()
{
    // clear grid
    $('#grid').html(''); 

    var selected = $('#breed-selector').val();
    var images = 'https://dog.ceo/api/breed/' + selected + '/images';

    $.getJSON (images, function(data)
    {
        for (n = 0; n < data.message.length; n ++)
        {
            // boostrap 4 masonry card gallery
            $('#grid').append('<div class="card"><img class="card-img" src="' + data.message[n] + '"></div>');            
        }

    }); 

    checkSubBreed();

};

// check for sub-breed
function checkSubBreed()
{
    var selected = $('#breed-selector').val();    

    var subs = 'https://dog.ceo/api/breed/' + selected + '/list';

    $.getJSON (subs, function(data)
    {

        if (data.message.length == 0)
            $('#subbreed-selector').hide();
        else
        {
            $('#subbreed-selector').html('');
            $('#subbreed-selector').append('<option selected disabled>Select a SubBreed...</option>');
            $('#subbreed-selector').show();

            for (n = 0; n < data.message.length; n ++)
            {
                $('#subbreed-selector').append('<option>' + data.message[n] + '</option>');
            }
        }

    }); 

}

// load images of selected sub-breed
function loadImagesSub()
{
    // clear grid
    $('#grid').html(''); 

    var breed    = $('#breed-selector').val();
    var subbreed = $('#subbreed-selector').val();

    var images = 'https://dog.ceo/api/breed/' + breed + '/' + subbreed + '/images';

    $.getJSON (images, function(data)
    {
        for (n = 0; n < data.message.length; n ++)
        {
            // boostrap 4 masonry card gallery
            $('#grid').append('<div class="card"><img class="card-img" src="' + data.message[n] + '"></div>');            
        }

    }); 

};


$('#breed-selector').change(loadImages);
$('#subbreed-selector').change(loadImagesSub);

//var $title = $('#title');
//$title.text(selected);