# S3 Signed Url Service

The purpose of this email service is to have a service for creating signed url to Amazon S3 service

### Installation

First, you need to clone this repo

```
git clone https://github.com/erikfer94/getSignedUrl-DO.git <folder>
```

Once this repo is cloned, enter to the new folder and make a copy of `.env.dummy` called `.env`
```
cp .env.test .env
```

Set your own environment values on this env file.


### Initialize

Run this command
```
npm install
```

### Running

If you want to run this project for making some manual testing or for modifying the code
```
npm run dev
```

### Testing

This project has configured unit testing with `jest`, if you want to run the test enter the next command

```
npm run test
```

Please, remmember to add a new test if you add some new stuffs

### Building

For compile this project run

```
npm run build
```

This command will generate a `./dist` folder where the compiled version of the application will be located.