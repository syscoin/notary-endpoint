Microservice Base
=================

Installing
----------

`git clone git@github.com:syscoin/notary-endpoint.git`

`npm install`


Generating Swagger
------------------
`npm run swaggergen`

MongoDB Setup
-------------
[as per Mongo DB page](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
Import the public key used by the package management system.
`wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -`

Create a list file for MongoDB.
`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list`

Install the MongoDB packages.
```
sudo apt-get update

sudo apt-get install -y mongodb-org

```
Start MongoDB
`sudo systemctl start mongod`

