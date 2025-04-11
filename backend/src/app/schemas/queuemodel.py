from datetime import datetime
from enum import Enum
from typing import List
from pydantic import BaseModel, ConfigDict, constr, Field, StringConstraints, Annotated
from uuid import UUID

class ProgrammingLanguage(str, Enum):
    python = "Python"
    javascript = "JavaScript"
    typescript = "TypeScript"
    java = "Java"
    csharp = "C#"
    go = "Go"
    ruby = "Ruby"
    swift = "Swift"
    kotlin = "Kotlin"
    rust = "Rust"
    dart = "Dart"
    scala = "Scala"
    elixir = "Elixir"
    haskell = "Haskell"
    lua = "Lua"
    C = "C"
    cpp = "C++"

class Status(str, Enum):
    unknown = "Unknown"
    expired = "Expired"
    searching = "Searching"
    found = "Found"


class QueueTicket(BaseModel):
    user_id: int = Field(...)
    programming_languages: List[ProgrammingLanguage]
    categories: List[Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)]]
    # status: Status <- probably not needed
    queued_at: datetime
    resulting_matchID: UUID | None

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )


class QueueTicketCreate(BaseModel):
    programming_language: List[ProgrammingLanguage]
    categories: List[Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)]]

    # treating this as a catch-all because I don't know what it does 
    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )
    


