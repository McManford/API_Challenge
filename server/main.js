import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
// import moment from 'moment';
var FuzzyMatching = require('fuzzy-matching');

// Yeap, I'm taking advantage of this article: https://www.codementor.io/codeforgeek/rest-crud-operation-using-meteor-du10808m5
Meteor.startup(() => {

  // Code to run on server at startup
  Visits = new Meteor.Collection('visits');

});

// Configuring visit's endpoint
Router.route('/visit', { where: 'server' })

    // What do we do upon get?
    .get(function(){

      // Grab query information
      var query = this.params.query;

      // Build search string for MongoDB when querying
      var search_String = {};

      // Set Content-type
      this.response.setHeader('Content-Type','application/json');

      // if we see userId and searchString
      if (query.userId && query.searchString) {

        // search history for your
        var queried_Visit = Visits.find({ "userId" : query.userId }).fetch();
        var visits_list = [];

        // DEBUG: display userId and searchString
        console.log( "\n\n\n<=== Getting visitor's queried history list for userId : " + query.userId + " & searchString : " + query.searchString + " ===>");

        // Finds fuzzy word test
        // var fm = new FuzzyMatching(['McDonald’s']);
        // console.log( "Fuzzy Ratio Distance : " + fm.get(query.searchString).distance);

        // iterate through our list
        queried_Visit.forEach((visit) => {

            // create a placeholder
            fm = new FuzzyMatching([visit.name]);
            console.log( "Fuzzy Ratio Distance : " + fm.get(query.searchString).distance); // --> check for { distance: 0.5 }

            // if we trust our fuzzy distance
            if ( fm.get(query.searchString).distance >= 0.5 ) {

              // print visit queried
              console.log(JSON.stringify(visit));

              // visit stat, remove _id, poor mongo skills on my end
              var return_Visit = {
                userId : visit.userId,
                name : visit.name,
                visitId : visit.visitId
              }

              // push it to our array
              visits_list.push(return_Visit);
            }
        });

        // After buiulding, set the appropriate header content type and close response.
        this.response.end(JSON.stringify(visits_list));
      }

      // if we see userId
      else if (query.userId) {

        // search history for your
        var queried_Visit = Visits.find( { "userId" : query.userId } ).fetch();
        var visits_list = [];

        // iterate through list, add to the found values, and remove _id too
        console.log( "\n\n\n<=== Getting visitor's queried history list for userId : " + query.userId + " ===>");
        queried_Visit.forEach((visit) => {

            // print visit queried
            console.log(JSON.stringify(visit));

            // visit stat, remove _id, poor mongo skills on my end
            var return_Visit = {
              userId : visit.userId,
              name : visit.name,
              visitId : visit.visitId
            }

            // push it to our array
            visits_list.push(return_Visit);

        });

        // After buiulding, set the appropriate header content type and close response.
        this.response.end(JSON.stringify(visits_list));

      }

      // if we see visitId
      else if (query.visitId) {

        // search history for your
        var queried_Visit = Visits.find( { "visitId" : query.visitId } ).fetch();
        var visits_list = [];

        // iterate through list and remove _id too
        console.log( "\n\n\n<=== Getting visitor's queried history list for visitId : " + query.visitId + " ===>");
        queried_Visit.forEach((visit) => {

            // print visit queried
            console.log(JSON.stringify(visit));

            // visit stat, remove _id, poor mongo skills on my end
            var return_Visit = {
              userId : visit.userId,
              name : visit.name,
              visitId : visit.visitId
            }

            // push it to our array
            visits_list.push(return_Visit);

        });

        // After buiulding, set the appropriate header content type and close response.
        this.response.end(JSON.stringify(visits_list));
      }

      // if nothing
      else {
        this.response.end("none");
      }

    })

    // POST /message - {message as post data}
    // Add new message in MongoDB collection.
    .post(function() {

        // Prep body response
        var response;

        // Check body, do we have an userId and name of location
        if (this.request.body.userId === undefined || this.request.body.name === undefined) {

            // Gotta let the user know the missing goods.
            response = {
                "error" : true,
                "message" : "invalid data, missing userId or name"
            };

        } else {

            // Look up any previous visits
            // var visitors_History = Visits.find( { "userId" : this.request.body.userId } ).fetch(); //over thought it for a second
            var visitors_History = Visits.find().fetch();

            // Assume no previous visit
            var num_Of_visits = 1;
            var visit_Id = "";

            // Check if there were any previous visits
            if (visitors_History.length > 0) {

               // Accumulate on history's length
               num_Of_visits += visitors_History.length;

               // For your server's terminal
               console.log( "\n\n\n<=== Posting visitor's History list Start for: " + this.request.body.userId + " ===>");
               visitors_History.forEach((visit) => {
                   console.log(JSON.stringify(visit));
               });
            }

            // Build id
            visit_Id = "some-visit-id-" + num_Of_visits;

            // Add to the user base
            Visits.insert({
                userId : this.request.body.userId,
                name : this.request.body.name,
                visitId : visit_Id
            });

            // return message to user
            response = {
                visitId : visit_Id
            }
        }

        // After buiulding, set the appropriate header content type and close response.
        this.response.setHeader('Content-Type','application/json');
        this.response.end(JSON.stringify(response));

});
