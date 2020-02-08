# See some dogs~!
Get random dog image from the <a href="https://dog.ceo/dog-api/">Dog API</a>, then search the breed on Wikipedia.

## User stories
1. As a user, I want to see a dog image
2. As a user, I want to receive information about the dog
3. As a user, I want the application to fail gracefully

### Technical details
This project uses the Fetch API to asynchronously request data from the Dog and Wikipedia APIs.
It uses Grunt to automate ESLinting.
Error handling captures instances where the Dog or Wikipedia API calls fail or where there are no results, as well as reducing garbage output by providing sensible defaults.