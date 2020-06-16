# WHERE TO GO 

Link: https://henwiiz.github.io/n-gramhealthtest/

<!-- GFM-TOC -->

- [Introduction](#Introduction)
- [Architecture](#Architecture)
  - [Overall](#Overall)
  - [Front-End](#Front-End)
  - [API](#API)
  - [Back-End](#Back-End)
- [Workflow](#Workflow)
- [Demo-Screenshot](#Demo-Screenshot)
- [Future-Work](#Future-Work)
- [Contact-Me](#Contact-Me)

<!-- GFM-TOC -->

## Introduction

"Where to go" is a web application helping tourists find POI(Point of Interest) in the given origin and range. Before arriving at the travel destination, tour tips are the most important thing tourists care. Among all kinds of tour tips, deciding tourist attractions should be put at the first place. "Where to go 1.0" is developed to help tourists avoid tourist traps. **Photos + Google StreetView + YouTube assessment** could give tourist a multi-dimensional impression of unknown attractions to really achieve "What you see is what you get". Also, embedded Route planning spares tourist the frequent switches among various application, telling you "how to go".



## Architecture

### Overall

"Where to go" is consist of two modules: Recommendation and Route Planning. 

- **Recommendation module** provides POI recommendation according to the origin address and search range provided by user.
- **Route Planning module** provides route from origin to destination.



### Front-End

- **Technology:** HTML, Bootstrap

- **Layout:** Recommendation and route planning module are designed in two page and could be switched via navigation bar.

  - Recommendation Page:  

    Top left part includes all the inputs for recommendation: Origin place, search range, track button locating user's current location and confirm button.

    Top right part contains a carousel to display photos of POI.

    Bottom left contains a canvas for Google map placement.

    Bottom right contains a canvas for Google StreetView placement.

    ![image-20200615204904914](https://github.com/HenwiiZ/n-gramhealthtest/blob/master/assets/img/frontend1.jpg)

  - Route Planning Page: 

    Top left contains a canvas for Google Map Route planning placement.

    Top right contains a canvas for Google StreetView placement.

    Second row contains a track button , origin input box, destination input box and a confirm button.

    ![image-20200615222129200](https://github.com/HenwiiZ/n-gramhealthtest/blob/master/assets/img/frontend2.jpg)

    

### API

The APIs invoked in this application are from two source: Google Map and Triposo.

- **Google Map API**: 

  - Google Map & Street view API (for rendering Google map and street view)

    ~~~javascript
    https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
    ~~~

    

  - Google Geolocation API (transform address to coordinates; transform coordinates to address)

    ~~~javascript
    https://maps.googleapis.com/maps/api/geocode/outputFormat?parameters
    ~~~

    

- **Triposo API:**

  - POI API (Recommend attractions around the given range)

    ~~~javascript
    https://www.triposo.com/api/20200405/poi.json?annotate=distance:latitude,longitude&account=&token=&tag_labels=sightseeing&distance=<
    ~~~

    

### Back-End

- **Technology:** jQuery, AJAX

- **Main Function:**
  - mapInit(): Initialize Google Map service.
  - setMap(): Set center point of Google Map and StreetView.
  - calcRoute(): Plot route between origin and destination on Google Map.
  - recommend(): Request for recommendation of POI with parameter (latitude, longitude, range).
  - jumpYouTube(): Split key words to build URL and jump to YouTube results web page. 





## Workflow

"Where to go" invokes four kinds of API from two source(Google Map & Triposo) and achieves two main modules. The following workflow charts demonstrate the workflow of "Recommendation" and "Route".



![image-20200615195601470](https://github.com/HenwiiZ/n-gramhealthtest/blob/master/assets/img/workflow.jpg)



First, user could enter their expected center point as origin and limit the searching range. With latitude, longitude and range data, Triposo API is invoked and return data are POI information in JSON(including name, address, coordinates, distance and so on) . After destination is decided, address data will be sent to route planning module to guide users to the destination.



## Demo-Screenshot

![image-20200615234210813](https://github.com/HenwiiZ/n-gramhealthtest/blob/master/assets/img/demo1.jpg)

![image-20200615234233944](https://github.com/HenwiiZ/n-gramhealthtest/blob/master/assets/img/demo2.jpg)

![image-20200615234306884](https://github.com/HenwiiZ/n-gramhealthtest/blob/master/assets/img/demo3.jpg)



## Future-Work

"Where to go" aims to be a highly-integrated travel tips application. Since I want it to be as all-embracing and easy-to-use as possible for users, I think there should be a long way for its improvement. Those future features could be divided into three different types:

- **Similar Services via API:**
  - Restaurant and hotel recommendation (with Yelp API and Airbnb API)
  - Ticket purchase services (with ticketmaster API)
  - Transportation Services (with UberRide API and Skyscanner API)
- **Multi-users Communication:**
  - Evaluation Sharing (with a backend database, each restaurant has its unique ID. Users could fill in a survey form to comment on it)
  - Personal Center (Maintain a user information database for Login, and another database to record user's posts and journals)
- **Tourist Planning:**
  - Self-built travel plan(It should be a timeline with blanks in each hour. Users could drag activities(tourist attractions, restaurants, hotels, transportations ...) to the blanks to fill their scheduling. After users confirm their arrangement, the whole scheduling will automatically generate a travel arrangement and help them enjoy their tours.)



## Contact-Me

Email: hz2620@columbia.edu
