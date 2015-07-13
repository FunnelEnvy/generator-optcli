#TODO
 - Allow creation of experiment to dove tail into variations
    - How many variations would you like to create? (1)
 - Add ability to pull and/or import upon creation
 - Separate build file creation and base experiment creation
    - gulp optcli:project
    - gulp optcli:experiment
    - gulp optcli:experiment-gulpfile
    - gulp optcli:experiment-gruntfile
    - gulp optcli:experiment-broccolifile
    - gulp optcli:variation {num variations}
 - Add Three-way Merge
    - add \_/cache/ folder
    - add --force, --diffloglevel flags
    - compare between current.json, previous.json, live.json
    ```javascript
      var difference = function(first, second){
        return first
        .getOwnKeys()
        .map(function(key){
          var f = JSON.stringify(first[key]);
          var s = JSON.stringify(second[key]);
          return (f === s) ? undefined : [key, f, s];
        })
        .filter(function(item){return !!item;})
      }

      if(!current.id || force){
        //TODO:preform normal push.
      }else{
        var previous;
        pull(current.id).then(function(live){
          var diff0 = difference(live, current);
          var diff1 = difference(live, previous);
          if(!diff0.length){
            //No difference between live an current
            //No push necessary
            console.log('Experiment Up to date.');
          }else if(!diff1.length){
            //Live's current state is the same as the previous
            //TODO:preform normal push
          }else{
              if(diffloglevel > 1){
                diff0.forEach(function(diff){
                  console.log('Difference in key: %', diff[0]);
                  if(diffloglevel > 2)
                    console.log('Live:\n%s\nCurrent:\n%s', diff[1], diff[2]);
                });
              console.log('There is an unresolved conflict between you local version and the one in optimizely.')
              console.log('Please check for diffs and use \'--force\' ');
          };
        });
      }
     ```
