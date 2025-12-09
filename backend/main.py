from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Scope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str
    content: str


class LogitsRequest(BaseModel):
    messages: list[Message]


class LogitsResponse(BaseModel):
    words: list[str]
    logits: list[list[float]]


@app.get("/")
async def root():
    return {"message": "Hello from Scope API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/logits", response_model=LogitsResponse)
async def logits(request: LogitsRequest):
    # Collect all words from all messages
    all_words: list[str] = []
    for message in request.messages:
        words = message.content.split()
        all_words.extend(words)
    
    # Generate random logits for each word, shape [n_words, 3]
    n_words = len(all_words)
    if n_words == 0:
        return LogitsResponse(words=[], logits=[])
    
    random_logits = np.random.rand(n_words, 3)
    
    return LogitsResponse(
        words=all_words,
        logits=random_logits.tolist()
    )
