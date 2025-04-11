from datetime import datetime, timezone
from enum import Enum
from typing import List, Annotated
from pydantic import BaseModel, ConfigDict, conlist, constr, Field, StringConstraints
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
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)], min_length=1, max_length=5)
    # status: Status <- probably not needed
    queued_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resulting_matchID: UUID | None

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )


class QueueTicketCreate(BaseModel):
    programming_languages: List[ProgrammingLanguage]
    categories: conlist(Annotated[str, StringConstraints(pattern=r"^[a-zA-Z0-9_]+$", max_length=32)], min_length=1, max_length=5)

    # treating this as a catch-all because I don't know what it does 
    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )
    


