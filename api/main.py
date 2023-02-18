from fastapi import FastAPI
from chatbot import answer_question
from uvicorn import run

app = FastAPI()


@app.post('/chatbot')
async def chatbot(req: dict):
    return {'message': answer_question(req.get('message'))}
