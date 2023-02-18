# GPT Chat Search

Making our own web search-enabled chatbot, like Bing!

## How to run

### API

I use `pipenv` so initialize that so you can fetch the dependencies. Then, in the `api` directory, run the API:

```sh
uvicorn main:app --reload --host ::
```

### Web App

Navigate to the `web` folder and install the dependencies with `yarn`. Then start the dev server:

```sh
yarn dev
```
