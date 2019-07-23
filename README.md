#Creature AI

You can find the information here

## Load backend API

### Create virtualenv
It is recomended to create a virtualenv to save dependencies locally. If you already have one skip this step.

I recommend to create the virtual env within the same project folder and name it ".venv"

To create the virtualenv this way excecute the following command:

```sh
python3 -m venv .venv
```

### Activate virtualenv
1. Posisionate yourself into project root folder

```sh
cd path/to/your/project/folder
```

2. Then activate virtual env (This example is only if you created your virtualenv in the same way as the "Create Virtualenv" section)

```sh
source .venv/bin/activate
```

After this step you could install your dependencies inside the .venv folder


### Install dependencies

There is a file named "requirements.txt" which is holding all the names for the required dependencies. The dependencies will be installed from this file

```sh
pip install -r requirements.txt
```

### Run Flask API

```sh
python backend-api/main.py
```

You will see something like:

```sh
Serving Flask app "main" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 132-406-912
```

Server is going to reload on every change in source code

## Load frontend React App

If you don´t have installed Node JS yet, you can install from this page: [https://nodejs.org/es/](https://nodejs.org/es/)

And install the option "Recommended for most users"

Next steps are assuming you already have installed Node JS

### Install dependencies

Open terminal and posicionate on frontend folder

```sh
cd frontend
```

Then simply run the following command:

```sh
npm install
```

### Run app

```sh
npm start
```

If everything is ok you will see the following output on terminal

```sh
Compiled successfully!

You can now view creature-ai-demo in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.100.8:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.
```
