The purpose of this project was to get some experience working with Koltin in spring boot and write a project in simple Html and JS without using a frontend framework. 

I wanted to emulate a history tracker app but have it run where the acutal history data is created so an web extension made the most sense.
Currently this app will track information such as urls, # of times a link has been accessed, Last time the webpage was clicked on and left, and put this information in a table which can be sorted in a ascending or descending order. This information is tracked in the background as long as the extension is enabled and the information window can be view by clicking on the web extension icon in the top right. This was written for firefox browser and has not been tested in chrome. 

Given the implementation I have done makes it easy to simply code a new checkbox button to create a column which can be either linked to a database column as long as the db column name matches the column id in the html, or can be updated using the already retrived data. An example of this would be last sesssion length which would find the difference of the last start time and last end time and would not require additional db calls, but if I were to add something such as average time spend at a url it would require db changes.

