from typing import Optional

from pydantic import BaseModel, UUID4


class CredentialsSchema(BaseModel):
    email: Optional[str]
    password: str


class JWTToken(BaseModel):
    access_token: str
    token_type: str


class JWTTokenData(BaseModel):
    mail: str = None


class JWTTokenPayload(BaseModel):
    user_uuid: UUID4 = None


class Msg(BaseModel):
    msg: str
