/**
 * Created by abhaydoke on 20/02/17.
 */
/**
 * Created by abhaydoke on 20/02/17.
 */
(function(){


    angular.module("cisco-reddit-search-app",[])
        .controller("SearchSubredditController",SearchSubredditController);

    function SearchSubredditController($scope,$http,$sce) {




        //$scope.url = "https://www.reddit.com/search.rss?q=cats&sort=new&restrict_sr=&t=all"

        $scope.searchTopic = function(subreddit){

            var searchSubreddit = subreddit;
            $scope.url = "https://www.reddit.com/r/"+searchSubreddit+"/top/.json?limit=10&after=t3_10omtd/"; //reddit search url

            //console.log($scope.url);

            $scope.myData = []; //array to hold all posts from reddit api
            $scope.topic = subreddit;
            $http.get($scope.url)
                .then(function successCallback(response) {
                console.log(response.data);
                if(response.data){
                    for (s in response.data.data.children){
                        //console.log(response.data.data.children[s].data.title);
                        var record = response.data.data.children[s].data;

                        var created_utc = record.created;
                        var date_created = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        date_created.setUTCSeconds(created_utc);

                        var edited_utc = record.edited;
                        var date_edited = new Date(0);
                        date_edited.setUTCSeconds(edited_utc);

                        default_strings = ["","self","default"];

                        if(record.thumbnail){
                        //console.log(record.preview.images[0].source.url);

                                var record_data = {'title':record.title,
                                    'url':record.url,
                                    'text':record.selftext,
                                    'html':$sce.trustAsHtml(record.selftext_html),
                                    'date_created':date_created.toDateString(),
                                    'last_edited':date_edited.toDateString(),
                                    'ups':record.ups,
                                    'num_comments':record.num_comments,
                                    'img_url':$sce.trustAsResourceUrl(record.thumbnail),
                                };
                                var found = default_strings.includes(record.thumbnail);
                                if(found){
                                    record_data['img_url'] = 'http://vignette3.wikia.nocookie.net/agario/images/1/10/Reddit.png/revision/latest?cb=20150623160034';
                                }

                        }
                        else if(record.preview)
                        {

                            var record_data = {'title':record.title,
                                'url':record.url,
                                'text':record.selftext,
                                'html':$sce.trustAsHtml(record.selftext_html),
                                'date_created':date_created.toDateString(),
                                'last_edited':date_edited.toDateString(),
                                'ups':record.ups,
                                'num_comments':record.num_comments,
                                'img_url':$sce.trustAsResourceUrl(record.preview.images[0].source.url)
                            };

                        }
                        else{
                            console.log(record.url);
                            var record_data = {'title':record.title,
                                'img_url':$sce.trustAsResourceUrl('http://vignette3.wikia.nocookie.net/agario/images/1/10/Reddit.png/revision/latest?cb=20150623160034'),
                                'url':record.url,
                                'text':record.selftext,
                                'html':$sce.trustAsHtml(record.selftext_html),
                                'date_created':date_created.toDateString(),
                                'last_edited':date_edited.toDateString(),
                                'ups':record.ups,
                                'num_comments':record.num_comments,

                            };
                        }
                        $scope.myData.push(record_data);
                    }
                }
                else{
                    console.log("Error!!!");

                }

            },
                    function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.url = "https://www.reddit.com/search.json?q="+subreddit+"&sort=old&limit=10"; //reddit search url
                        console.log($scope.url);
                        $http.get($scope.url).then(function(response) {

                            //$scope.myData = response.data;
                            for (s in response.data.data.children){
                                console.log(response.data.data.children[s].data.title);
                                var record = response.data.data.children[s].data;
                                console.log(record.subreddit);

                            }

                        });

                    });
        }




        function getSafeHtml(selftext_html) {
            return $sce.trustAsHtml(selftext_html);
        }

    }
})();



