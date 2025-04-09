from datetime import datetime
from enum import Enum
from typing import List
from pydantic import BaseModel
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


class QueueModel(BaseModel):
    queue_id: UUID
    user_id: UUID
    programming_language: List[ProgrammingLanguage]
    category: List[str]
    status: Status
    queued_at: datetime
    resulting_match: UUID | None


class QueueModelCreate(BaseModel):
    user_id: UUID
    programming_language: List[ProgrammingLanguage]
    category: List[str]
    status: Status

