var Guides = function(args){
  var _getGuide, _imageUuids, _imageList, _updateBgImage, _init;

  //ajax call to /get_guide/:guid
  _getGuide = function(guid, callback){
    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      alert('burn ie');
    };
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        callback(JSON.parse(xmlhttp.responseText)); 
      }
    };
    xmlhttp.open("GET", "/guide/" + guid + ".json", true);
    xmlhttp.send();
  };
  
  //utility
  _imageUuids = function(guide){
    var imageItems = [];
    for (var i=0; i < guide.items.length; i++){
      if (guide.items[i].type === 'image'){
        imageItems.push(guide.items[i].content.media_item_uuid);
      }
    }
    return imageItems;
  };

  //DOM
  _imageList = function(imageUuids){
    var images = [], imgTag, imageSrc;
    //image sizes: 540x380, 300x294, 60x60, original
    for (var i=0; i < imageUuids.length; i++){
      imageSrc = "http://images.snapguide.com/images/guide/" + imageUuids[i] + "/300x294_ac.jpg";
      //imageSrc = "http://images.snapguide.com/images/guide/" + imageUuids[i] + "/original.jpg";
      imgTag = document.createElement('img');
      imgTag.setAttribute('src', imageSrc);
      imgTag.setAttribute('data-guid', imageUuids[i]);
      images.push(imgTag);
    }
    return images;
  };
  
  _updateBgImage = function(){
    var imageUrl = "http://images.snapguide.com/images/guide/" + this.getAttribute('data-guid') + "/original.jpg",
        bg;
    bg = document.getElementsByTagName('html')[0];
    bg.style.backgroundImage = "url(" + imageUrl + ")"
  };

  _init = function(args){
    var _guids = args.guids;
    for (var i = 0; i < _guids.length; i++){
      _getGuide(_guids[i], function(data){
        var list, img, imageUuids, images;
        if (typeof data.guide === 'undefined') return false;

        list = document.getElementById("guideList");
        img = document.createElement('img');
        img.setAttribute('src', "http://images.snapguide.com/images/guide/" +
                         data.guide.publish_main_image_uuid +
                         "/300x294_ac.jpg");
        img.setAttribute('title', data.guide.author.name + ": " + data.guide.metadata.title);
        img.setAttribute('class', 'mainImage');
        list.appendChild(img);

        imageUuids = _imageUuids(data.guide);
        images = _imageList(imageUuids);
        for (var i = 0; i < images.length; i++){
          list.appendChild(images[i]);
          images[i].onclick = _updateBgImage;
        };
      });
    }
  }(args);
};
