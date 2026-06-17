from fastapi import FastAPI

app = FastAPI(title="EmergencyIQ API")

@app.get("/")
async def root():
    return {"message": "EmergencyIQ backend"}
