#TODO
 - Make localghost local requirement
 - Re-Arrang Menu
 - Incorporate Funnelenvysays
 - Add ability to import upon creation
 - Remove es6
 - Templating Mandatory
 - Move javascript imports into a *_scripts* directory
 - Move templates into a *_templates* directory
 - Add *_global.js*, *_global.scss/less*, *_variation.js* to differentiate from compiled
 - Default experiment name in strings.js
 - Default templates for global.js
    ```javascript
    $('body').addClass('<%= experiment.name %>');
    window['<%= experiment.name %>'] = function(options){
      options = options || {};
      var variation = options.variation || {};
      //Suggestd: start logic here
      switch(variation){
        default:
          break;
      };
    }
    ```
  - Default templates for variation.js
     ```javascript
     $('body').addClass('<%= experiment.name %>' + '_' + '<%= variation.name %>' );
     window['<%= experiment.name %>']({
       variation:'<%= variation.description %>',
     })
    ```
  - Default templates for global.css
     ```scss
    .<%= experiment.name %>{
      /*Suggestd: start styling here*/
    }
    <% experiment.getVariations().forEach(function(variation){ %>
    .<%= experiment.name %>.<%= experiment.name %>_<%= variation.name %>{
      /*Suggestd: start styling here*/
    }
    <%}%>
    ```

 - Send variation.json/experiment.json data to template if available
 - Add gulp lint option
 - Allow creation of variations when creating experiments
 - Add function to bring templates as multi-line strings

   ```javascript
   var template = <%= template('tempalte-name.html') %>;
  ```
