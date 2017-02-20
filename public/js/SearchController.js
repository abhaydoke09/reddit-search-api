/**
 * Created by abhaydoke on 20/02/17.
 */
(function(){


angular.module("cisco-reddit-search-app",[])
    .controller("SearchController",SearchController);

function SearchController($scope,$http,$sce) {




    //$scope.url = "https://www.reddit.com/search.rss?q=cats&sort=new&restrict_sr=&t=all"

    $scope.searchTopic = function(topic){

        var searchTopic = topic;
        $scope.url = "https://www.reddit.com/search.json?q="+searchTopic+"&sort=old&limit=10"; //reddit search url

        console.log($scope.url);

        $scope.myData = []; //array to hold all posts from reddit api
        $scope.topic = topic;
        $http.get($scope.url).then(function(response) {
            console.log(response.data);
            //$scope.myData = response.data;
            for (s in response.data.data.children){
                console.log(response.data.data.children[s].data.title);
                var record = response.data.data.children[s].data;

                var created_utc = record.created;
                var date_created = new Date(0); // The 0 there is the key, which sets the date to the epoch
                date_created.setUTCSeconds(created_utc);

                var edited_utc = record.edited;
                var date_edited = new Date(0);
                date_edited.setUTCSeconds(edited_utc);

                var record = {'title':record.title,
                    'url':record.url,
                    'text':record.selftext,
                    'html':$sce.trustAsHtml(record.selftext_html),
                    'date_created':date_created.toDateString(),
                    'last_edited':date_edited.toDateString()
                };
                $scope.myData.push(record);
            }

        });
    }




    function getSafeHtml(selftext_html) {
        return $sce.trustAsHtml(selftext_html);
    }

    }
})();

