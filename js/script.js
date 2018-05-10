// lists of breed
var breedList = [];
var subbreedList = [];

// to keep track of user inputs
var selected = "";
var subbreed = "";

// to keep track of image loading
var imgCount = 0;
var loadCount = 0;
var gallery = [];

/* add breed options to dropdown menu */
function loadBreed() 
{
    $("#subbreed-selector").hide();
    $("#error").hide();
    $("#loading").hide();
    
    var all_breeds = "https://dog.ceo/api/breeds/list/all";

    $.getJSON (all_breeds, function(data)
    {
        var breeds = data.message;

        $.each (breeds, function (name, subbreed)
        {
            breedList.push(name);

            // if has sub breed
            if (breeds[name].length != 0) 
            {
                for (n = 0; n < breeds[name].length; n ++) 
                {
                    breedList.push(breeds[name][n] + ' ' + name);
                    subbreedList.push(breeds[name][n] + ' ' + name);              
                }    
            }
        });
    });    

    // set up autocomplete search bar
    autocomplete(document.getElementById("input"), breedList);
};

/* load images of selected breed */
function showBreed()
{
    // clear grid
    $("#grid").html(""); 
    $("#grid").hide();
    $("#subbreed-selector").hide();
    
    gallery = [];
    imgCount = 0;
    loadCount = 0;
    
    selected = $("#input").val().toLowerCase();

    // if no such breed exists
    if (breedList.indexOf(selected) == -1)
    {
        $("#error").show();                  
        return false;
    }
    else
        $("#error").hide();

    $("#loading").show();

    var images = "https://dog.ceo/api/breed/" + selected + "/images";

    // if it is a sub breed
    if (subbreedList.indexOf(selected) != -1)
    {
        var index = selected.indexOf(" ");
        var breed = selected.substr(index + 1);
        var sub = selected.substr (0, index);

        images = "https://dog.ceo/api/breed/" + breed + "/" + sub + "/images";
    }

    // masonry gallery
    $.getJSON (images, function(data)
    {
        for (n = 0; n < data.message.length; n ++)
        {        
          	imgCount++;
           	onImageLoad(new Image(), data.message[n]); 
        }            
    }); 

    setTimeout(function () 
    {
        if (loadCount != imgCount) 
        {
            $("#grid").show();            
        }
    }, 8000);

    // if it's a subreed
    if (subbreedList.indexOf(selected) != -1)
    {
        return false;
    }

    // check for sub-breed and show filters
    var subs = "https://dog.ceo/api/breed/" + selected + "/list";

    $.getJSON (subs, function(data)
    {
        if (data.message.length != 0)
        {
            $("#subbreed-selector").html("");
            $("#subbreed-selector").append("<option>All Sub-Breeds</option>");
            $("#subbreed-selector").show();

            for (n = 0; n < data.message.length; n ++)
            {
                $("#subbreed-selector").append("<option>" + data.message[n] + "</option>");
            }
        }
    }); 

    return false;
};

/* load images of selected sub-breed */
function showSubBreed()
{
    // clear grid
    $("#grid").html(""); 
    $("#grid").hide();
    $("#loading").show();
    
    gallery = [];
    imgCount = 0;
    loadCount = 0;
    
    subbreed = $("#subbreed-selector").val();
	document.getElementById("input").value = selected;
    
    if (subbreed == "All Sub-Breeds")
        images = "https://dog.ceo/api/breed/" + selected + "/images";
    else
        images = "https://dog.ceo/api/breed/" + selected + "/" + subbreed + "/images";    

    $.getJSON (images, function(data)
    {
        for (n = 0; n < data.message.length; n ++)
        {
           	imgCount++;
           	onImageLoad(new Image(), data.message[n]); 
        }
    }); 

    setTimeout(function () 
    {
        if (loadCount != imgCount) 
        {
            $("#grid").show();            
        }
    }, 8000);
};


/* hide grid until all images loaded */
function onImageLoad(item, url)
{
    if(gallery.indexOf(url) != -1)
        return;

    gallery.push(url);

    item.onload = function() 
    {
        // masonry gallery
        var node = document.createElement("div");
        node.className = "card";

        node.append(item);  
        
        $("#grid").append(node);

        loadCount++;

        if (loadCount == imgCount)
        {
            $("#loading").hide();
            $("#grid").show();                 
            imgCount = 0;
            loadCount = 0;
        }
    };

    item.src = url;
    item.className = "card-img";
}

/* autocomplete search dropdown menu */
function autocomplete (entered, list) 
{
    // entered: user input, list: breedlist (without sub breed)

    // when users type in the search bar
    entered.addEventListener("input", function(e) 
    {
        addItems(this);
    });

    // when users hit enter
    entered.addEventListener("keyup", function(e)
    {
        e.preventDefault();

        if(e.keyCode == 13)
            document.getElementById("submit").click();
    });

    // add breed option to the list
    function addItems(obj)
    {
        // user input
        var val = obj.value;
        var divA, divB;

        // clear autocompleted list
        closeAllLists();

        // create a div for the dropdown list
        divA = document.createElement("div");
        divA.setAttribute("id", obj.id + "autocomplete-list");
        divA.setAttribute("class", "autocomplete-items");

        // append the dropdown list to the parent container
        obj.parentNode.appendChild(divA);

        // arrow key focus in the dropdown list
        currentFocus = -1;

        for (var n = 0; n < list.length; n++) 
        {
            // check if the breed starts with the same letters as the text entered
            // or show all options if nothing is entered
            if (list[n].substr(0, val.length).toUpperCase() == val.toUpperCase())
            {
                // create a div element for each breed
                divB = document.createElement("div");

                // make the matching letters bold
                divB.innerHTML = "<strong>" + list[n].substr(0, val.length) + "</strong>";
                divB.innerHTML += list[n].substr(val.length);
                divB.innerHTML += "<input type='hidden' value='" + list[n] + "'>";

                itemOnClicked(divB, list[n]);                
                divA.appendChild(divB);
            }
        }        
    }

    // action for clicking on a breed
    function itemOnClicked(item, name)
    {
        item.addEventListener("click", function(e) 
        {
            entered.value = name;
            closeAllLists();
            document.getElementById("submit").click();            
        });
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
                // click on the "active" item
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
        
        if (currentFocus >= x.length)
            currentFocus = 0;
        
        if (currentFocus < 0)
            currentFocus = (x.length - 1);
        
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


$("#search").submit(showBreed);
$("#subbreed-selector").change(showSubBreed);
