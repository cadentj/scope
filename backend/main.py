from fastapi import FastAPI

app = FastAPI(title="Scope API")


@app.get("/")
async def root():
    return {"message": "Hello from Scope API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

# @app.get("/logits")
# async def logits():
