# party-finder-api-prototype

**Links**

- [Requirements](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#requirements)

+ [Installation](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#installation)

* [Running the API](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#runnig-the-api)

+ [Usage](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#usage)

- [User](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#user)
- [Creating a User](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#creating-a-user)
- [Login](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#login)
- [Logout](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#logout)

* [Parties](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#parties)
* [Creating a party](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#creating-a-party)
* [Consulting a list of parties](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#consulting-a-list-of-parties)
* [Searching for a specific party](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#searching-for-a-specific-party)
* [Updating a party](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#updating-a-party)
* [Deleting a party](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#deleting-a-party)

- [Comments](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#comments)
- [Creating a comment](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#creating-a-comment)
- [Consulting a list of comments](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#consulting-a-list-of-comments)
- [Searching for a specific comment](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#searching-for-a-specific-comment)
- [Updating a comment](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#updating-a-comment)
- [Deleting a comment](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#deleting-a-comment)

## Requirements

Node.js versio 6+ [https://nodejs.org/en/](https://nodejs.org/en/)

MongoDB version 3+ [https://docs.mongodb.com/manual/administration/install-community/](https://docs.mongodb.com/manual/administration/install-community/)

## Installation

`npm install`

## Running the API

`node app.js` if you want to run it as single thread or `node cluste.js` if you want to run it with the cluster

_tip: if you want to see the changes in your code, without having to restart the server manually, I recomend you to install [Nodemon.io](https://nodemon.io/)_

run `npm install -g nodemon` then run the application with `nodemon app.js` or `nodemon cluster.js`

## Usage

**Note that all routes, except the user routes, uses a middleware that check if there's a valid user session. To check that middleware go to the
`middlewares/Authentication.js`**

### User

#### Creating a User with local strategy (username and password only)

This application needs a valid user to be logged in, in order to user it's functionalities, so, the first step is to register a user, to do so
you must send a `POST` to `https://party-finder-api.herokuapp.com/users` or `http://localhost:3001/users` with a JSON containing a `user` and
`password`:

```
{
	"username": "user1",
	"password": "123"
}
```

This route will automatically log in the user and initialize a session returning a JSON with the `username` for the user:

```
{
    "username": "user1"
}
```

#### Login with local strategy

To login you must send a `POST` to `https://party-finder-api.herokuapp.com/users/login` or `http://localhost:3001/users/login` containing
a valid `username` and `password` of a existing user, this will validate the user and initialize the session with the application returning
 a JSON with the `username` registered for this session:

 ```
{
    "username": "user1"
}
```
#### Creating or login a User with Facebook strategy

In order to create or login a user using the Facebook strategy you must send a `GET` to `https://party-finder-api.herokuapp.com/users/auth/facebook` or `http://localhost:3001/users/auth/facebook`.

If the user haven't registered and authorized the application previously, this will automatically redirect the user to the Facebook authorization page as bellow:

![Facebook Auth Image](https://i.gyazo.com/93e16365ac7abb7c15832670189e98df.png)

After that it will log in the user and initialize a session returning a JSON with the `username` for the user:

```
{
    "username": "user1"
}
```

In the DB, the created user will look like that:

```
{
    "_id": {
        "$oid": "12a34b56c78d90e"
    },
    "username": "user1",
    "email": "user1@email.com",
    "provider": "facebook",
    "facebookId": "123456789101112",
    "__v": 0
}
```

In recurrent visits it will only log in the user, unless the user removes the application from the Facebook profile

Check the [Passport strategies configuration](https://github.com/whitesmith/party-finder-api-prototype/blob/master/utils/passport.js) and the [User model](https://github.com/whitesmith/party-finder-api-prototype/blob/master/models/user.js) for a in-depth look.

#### Login with local strategy

To login you must send a `POST` to `https://party-finder-api.herokuapp.com/users/login` or `http://localhost:3001/users/login` containing
a valid `username` and `password` of a existing user, this will validate the user and initialize the session with the application returning
 a JSON with the `username` registered for this session:

 ```
{
    "username": "user1"
}
```

#### Logout

To logout from the application you must send a `DELETE` to `https://party-finder-api.herokuapp.com/users/logout` or `http://localhost:3001/users/logout`

This will destroy the current session and logout the user, no matter what login method was used.

### Parties

#### Creating a party

To create a new party you must send a `POST` to `https://party-finder-api.herokuapp.com/party` or `http://localhost:3001/party` with a JSON containing
a `partyName`, `partyDate` and a `location` as follows:
```
{
	"party": {
     "partyName": "Test Party 1",
     "partyDate": "2018/03/28"
   },
   "location": {"lat": -51.507351, "lng": -0.127758}
}
```

This will return the data:

```
{
    "__v": 0,
    "_id": "12a34b56c78d90e",
    "party": {
        "partyName": "Test Party 1",
        "partyDate": "2018-03-28T03:00:00.000Z",
        "partyLocation": {
            "location": {
                "lng": -0.127758,
                "lat": -51.507351
            },
            "id": "12a34b56c78d90e"
        }
    },
    "user": {
        "id": "12a34b56c78d90e",
        "username": "user1"
    }
}
```

Notice that the `partyLocation` is a reference for the `location` object stored in the DB.

##### About the Location object

When you create a party you also create a DB entry for the location, this will be used client side to render the location, with some data about the party.

The location object stores a reference to the user that created it, as well a reference for the party:

```
{
    "__v": 0,
    "location": {
        "lng": -0.127758,
        "lat": -51.507351
    },
    "_id": "12a34b56c78d90e",
    "party": {
        "id": "12a34b56c78d90e",
        "partyName": "Test Party 1"
    },
    "user": {
        "username": "user1",
        "id": "12a34b56c78d90e"
    }
}
```

More details about this [here](https://github.com/whitesmith/party-finder-api-prototype/blob/master/README.md#location)

### Consulting a list of parties

To check all the parties that you have created you must send a `GET` to `https://party-finder-api.herokuapp.com/party` or `http://localhost:3001/party`,
it will return an array of objects like that:

```
[
    {
        "id": "12a34b56c78d90e",
        "party": {
            "partyLocation": {
                "location": {
                    "lng": -48.33318,
                    "lat": -10.185856
                },
                "id": "12a34b56c78d90e"
            },
            "partyDate": "2018-03-28T03:00:00.000Z",
            "partyName": "Party Test 1"
        }
    },
    {
        "id": "12a34b56c78d90e",
        "party": {
            "partyLocation": {
                "location": {
                    "lng": -8.410257,
                    "lat": 40.203315
                },
                "id": "12a34b56c78d90e"
            },
            "partyDate": "2018-03-28T03:00:00.000Z",
            "partyName": "Party Test 2"
        }
    },
    {
        "id": "12a34b56c78d90e",
        "party": {
            "partyLocation": {
                "location": {
                    "lng": -8.629105,
                    "lat": 41.157944
                },
                "id": "12a34b56c78d90e"
            },
            "partyDate": "12a34b56c78d90e",
            "partyName": "Party Test 3"
        }
    },
    {
        "id": "12a34b56c78d90e",
        "party": {
            "partyLocation": {
                "location": {
                    "lng": -0.127758,
                    "lat": -51.507351
                },
                "id": "12a34b56c78d90e"
            },
            "partyDate": "2018-03-28T03:00:00.000Z",
            "partyName": "Party Test 4"
        }
    }
]
```

#### Searching for a specific party

To create a search for a specific party you must send a `POST` to `https://party-finder-api.herokuapp.com/party/search`
or `http://localhost:3001/party/search` containing a JSON with a `search`, which is a string of a party name that you are looking for.

```
{
	"search": "Party Test 1"
}
```

**Note that this isn't case sensitive**

It will return an array with all the matching results:

```
[
    {
        "_id": "12a34b56c78d90e",
        "__v": 0,
        "party": {
            "partyName": "Party Test 1",
            "partyDate": "2018-03-28T03:00:00.000Z",
            "partyLocation": {
                "id": "12a34b56c78d90e",
                "location": {
                    "lat": -10.185856,
                    "lng": -48.33318
                }
            }
        },
        "user": {
            "id": "12a34b56c78d90e",
            "username": "user1"
        }
    }
]
```

#### Updating a party

To update an specific party you must send a `PUT` to `https://party-finder-api.herokuapp.com/party/:id`
or `http://localhost:3001/party/:id`, where the parameter `id` refers to the party id, in the body you must send a JSON with the complete
`party` object, containing whatever changes you want:

```
{
	"party": {
        "partyDate": "2018-03-28T03:00:00.000Z",
        "partyName": "Party Test 1 Updated Version"
	},
	"location": {"lat": 55.378051, "lng": -3.435973}
}
```

As this will perform two modifications in the DB, it will return an JSON like this:

```
{
    "partyResult": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    },
    "mapResult": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
```

#### Deleting a party

To delete an specific party you must send a `DELETE` to `https://party-finder-api.herokuapp.com/party/:id`
or `http://localhost:3001/party/:id`, where the parameter `id` refers to the party id.

It will return an JSON with the return of the operation:

```
{
    "partyResult": {
        "n": 1,
        "ok": 1
    },
    "mapResult": {
        "n": 1,
        "ok": 1
    }
}
```

**Keep in mind that this operation will delete the party and map marker DB entries**

### Comments

#### Creating a comment

To create a new comment you must send a `POST` to `https://party-finder-api.herokuapp.com/comments`
or `http://localhost:3001/comments` with a JSON containing a `comment`as follows:

```
{
	"comment": "this is the first comment"
}
```

### Consulting a list of comments

To check all the comments that you made you must send a `GET` to `https://party-finder-api.herokuapp.com/comments`
or `http://localhost:3001/comment`, it will return an array of objects like that:

```
[
    {
        "id": "59c417033c46071f68e55f8f",
        "comment": "this is the first comment"
    },
    {
        "id": "59c417d025532b4404a8a01b",
        "comment": "this isn't the third comment"
    },
    {
        "id": "59c4fb58c07c1c3b6c125077",
        "comment": "this is the third comment"
    },
    {
        "id": "59c51d7efd4d8d2934ddf856",
        "comment": "this is the fourth comment"
    }
]
```

#### Updating a comment

To update an specific comment you must send a `PUT` to `https://party-finder-api.herokuapp.com/comments/:id`
or `http://localhost:3001/comments/:id`, where the parameter `id` refers to the comment id:

```
{
	"comment": "just some update, but, this still the first comment"
}
```

This will return an JSON with the return of the operation:

```
{
    "n": 1,
    "nModified": 1,
    "ok": 1
}
```

#### Deleting a comment

To delete an specific party you must send a `DELETE` to `https://party-finder-api.herokuapp.com/comments/:id`
or `http://localhost:3001/comments/:id`, where the parameter `id` refers to the comment id.

It will return an JSON with the return of the operation:

```
{
    "n": 1,
    "ok": 1
}
```
