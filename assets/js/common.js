let builList_books = function(data){
    /*
    json file composto:
    { "title": "...", "author": "...", "url": "...", "status": "< >|R|F", "categories": "..."},
    */
    let id = ".content";
    let reading = "";
    let finish = "";
    let other = "";


    // paste list
    $(id).append(reading);
    $(id).append(finish);
    $(id).append(other);

}