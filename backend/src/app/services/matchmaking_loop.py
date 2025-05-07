import asyncio
from app.services.matchmaker import matchmaking_service
from app.dependencies import get_db

async def matchmaking_loop():
    """Runs the matchmaking cycle every 2 seconds in the background."""
    gen = get_db()
    db = next(gen)

    try:
        while True:
            #print("[matchmaking_loop] Running matchmaking tick...")
            await matchmaking_service.execute_matchmaking_cycle(db)
            await asyncio.sleep(2)
    finally:
        gen.close()
