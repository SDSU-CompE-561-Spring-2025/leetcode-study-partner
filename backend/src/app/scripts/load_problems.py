# backend/src/app/scripts/load_problems.py

import pandas as pd
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.problem import Problem
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import insert

CSV_PATH = "./data/cleaned_problems.csv"  # You can mount this into the container

def load_data():
    df = pd.read_csv(CSV_PATH)

    session: Session = SessionLocal()

    for _, row in df.iterrows():
        problem = Problem(
            problem_id=row['id'],
            problem_link=row['problem_URL'],
            methods_video_link=row['solution_URL'],
            categories=row['topic_tags'].strip('{}').split(',')  # Postgres text[]
        )
        session.add(problem)

    session.commit()
    session.close()

if __name__ == "__main__":
    load_data()
