
function loadBreed() 
{
    var all_breeds = 'https://dog.ceo/api/breeds/list/all';

    $.getJSON(all_breeds, function(data)
    {
        var breeds = data.message;

        $.each (breeds, function(name, subbreed)
        {
            // if no sub breed
            if (breeds[name].length == 0) 
            {
                $('#breed-selector').append('<option>' + name + '</option>');
            }
            else
            {
                for (n = 0; n < breeds[name].length; n ++) 
                    $('#breed-selector').append('<option>'+ breeds[name][n] + ' ' + name + '</option>');
            }

        });
    });    

};


function loadImage()
{
    var selected = $('#breed-selector').val();
    var $title = $('#title');
    $title.text(selected);

    var images = 'https://dog.ceo/api/breed/' + selected + '/images';

    $.getJSON(images, function(data)
    {
        var urls = data.message;

        $.each (urls, function(index, url)
        {
            $('#grid').append('<div class="col-md-4"><img src="' + url + '"></div>');

        });
    }); 


};


$('#breed-selector').change(loadImage);

