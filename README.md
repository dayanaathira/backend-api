## Description
#### Technology Used ####
- NestJs &#8594; Node.js framework for building scalable server-side applications
- MikroOrm &#8594; MySQL library to map the database to the application's domain model
- Logger &#8594; Winston

#### To Test #####
To view the API Documentation, please visit [API Documentation](https://serene-ocean-50222-5793158abbed.herokuapp.com/api-docs)
<br> 
Or you can use postman to test the API [Endpoint](https://serene-ocean-50222-5793158abbed.herokuapp.com/teacher) 
<br>
```json 
# Example body
{
  "teachers": [
    {
      "name": "Dayana",
      "subject": "Science",
      "student": [
        {
          "name": "Kelly",
          "grade": 99
        }
      ]
    }
  ]
}

# Example response: 
{
  "statusCode": 201,
  "message": "Successfully created.",
  "data": {
    "teacher": [
      {
        "id": 2,
        "name": "Dayana",
        "subject": "Science",
        "students": [
          {
            "id": 2,
            "name": "Kelly",
            "grade": 99
          }
        ]
      }
    ]
  }
}
```
#### Database Structure ####
![Database Structure](./assets/database-structure.png)


#### Deployment ####
- The application is deployed on Heroku, using a jawsdb:kitefin database

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Dayana Athira](https://github.com/dayanaathira)

## License

Nest is [MIT licensed](LICENSE).
