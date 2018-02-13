/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var watchID;
var geoLoc;

$(document).ready(function () {    
    getLocationUpdate();
});

function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    alert("Latitude : " + latitude + " Longitude: " + longitude);
}

function errorHandler(err) {
    if (err.code == 1) {
        alert("Error: Access is denied!");
    } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}

function getLocationUpdate() {
    if (navigator.geolocation) {
        // timeout at 60000 milliseconds (60 seconds)
        var options = {timeout: 60000};
        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    } else {
        alert("Sorry, browser does not support geolocation!");
    }
}

