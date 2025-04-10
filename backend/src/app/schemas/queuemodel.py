from datetime import datetime
from enum import Enum
from typing import List
from pydantic import BaseModel, constr, Field
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
    user_id: UUID
    programming_languages: List[ProgrammingLanguage]
    categories: List[constr(pattern=r"^[a-zA-Z0-9_]+$")]
    # status: Status <- probably not needed
    queued_at: datetime
    resulting_match: UUID | None

