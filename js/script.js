var breedList = [];


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
            breedList.push(name);
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
        for (var n = 0; n < data.message.length; n ++)
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

            for (var n = 0; n < data.message.length; n ++)
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
        for (var n = 0; n < data.message.length; n ++)
        {
            // boostrap 4 masonry card gallery
            $('#grid').append('<div class="card"><img class="card-img" src="' + data.message[n] + '"></div>');            
        }

    }); 

};


// autocomplete search dropdown menu
// entered: user input, list: breedlist (without sub breed)
function autocomplete (entered, list) 
{
    // when users type in the search bar
    entered.addEventListener("input", function(e) 
    {
        addItems(this);
    });

    // when users click on the search bar
    entered.addEventListener("click", function(e)
    {
        addItems(this);
    });

    // add breed option to the list
    function addItems(obj)
    {
        // user input
        var val = obj.value;

        // clear autocompleted list
        closeAllLists();

        // create a div for the dropdown list
        var a = document.createElement("div");
        a.setAttribute("id", obj.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        // append the dropdown list to the parent container
        obj.parentNode.appendChild(a);

        // arrow key focus in the dropdown list
        currentFocus = -1;

        for (var n = 0; n < list.length; n++) 
        {
            // check if the breed starts with the same letters as the text entered
            // or show all options if nothing is entered
            if (list[n].substr(0, val.length).toUpperCase() == val.toUpperCase())
            {
                // create a div element for each breed
                var b = document.createElement("div");

                // make the matching letters bold
                b.innerHTML = "<strong>" + list[n].substr(0, val.length) + "</strong>";
                b.innerHTML += list[n].substr(val.length);

                // a input field to hold the breed name
                b.innerHTML += "<input type='hidden' " + "id='breed" + n + "' value='" + list[n] + "'>";

                a.appendChild(b);

                // when breed name clicked
                b.addEventListener("click", function(e) 
                {
                    entered.value = document.getElementById("breed" + n).value;
                    closeAllLists();
                });

            }
        }        
    }

    // keyboard action
    entered.addEventListener("keydown", function(e) 
    {
        var x = document.getElementById(this.id + "autocomplete-list");
        
        if (x)
            x = x.getElementsByTagName("div");
        
        // ARROW DOWN key pressed
        if (e.keyCode == 40) 
        {
            currentFocus++;
            addActive(x);
        } 
        // ARROW UP key pressed
        else if (e.keyCode == 38) 
        { 
            currentFocus--;
            addActive(x);
        }
        // ENTER key pressed 
        else if (e.keyCode == 13) 
        {
            // prevent the form being submitted            
            e.preventDefault();
            
            if (currentFocus > -1) 
            {
                /*and simulate a click on the "active" item:*/
                if (x)
                    x[currentFocus].click();
            }
        }
    });

    // indicate which breed name is active
    function addActive(x) 
    {
        if (!x)
            return false;

        removeActive(x);
        
        if (currentFocus >= x.length) currentFocus = 0;
        
        if (currentFocus < 0) currentFocus = (x.length - 1);
        
        // add class "autocomplete-active"
        x[currentFocus].classList.add("autocomplete-active");
    }

    // remove the "active" class from all the menu items
    function removeActive(x) 
    {
        for (var i = 0; i < x.length; i++)
        {
            x[i].classList.remove("autocomplete-active");
        }
    }

    // remove menu items except the argument
    function closeAllLists (text) 
    {
        var x = document.getElementsByClassName("autocomplete-items");

        for (var i = 0; i < x.length; i++) 
        {
            if (text != x[i] && text != entered) 
            {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    // close autocomplete list when clicked elsewhere
    document.addEventListener("click", function (e) 
    {
        closeAllLists(e.target);
    });
}

function test()
{
    var $title = $('#title');
    $title.text("woof");

    return false;  
}


$('#breed-selector').change(loadImages);
$('#subbreed-selector').change(loadImagesSub);
$('#search').submit(test);
