from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import traceback


class AppError(Exception):
    def __init__(self, message: str, details: list | None = None, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.details = details or []
        self.status_code = status_code


def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": True, "message": "Validation error", "details": exc.errors()},
    )


def generic_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    return JSONResponse(
        status_code=500,
        content={"error": True, "message": "Internal server error", "details": [str(exc), tb]},
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
