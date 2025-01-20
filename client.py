import asyncio
import websockets
import json

async def send_block_data():
    uri = "ws://localhost:3000"
    async with websockets.connect(uri) as websocket:
        # Send some block data
        block_data = {
            "id": 1,
            "state": "init",
            "data": "New Block Data",
            "timestamp": "2025-01-20T00:00:00Z",
            "votes": 16  # Placeholder for votes in the consensus mechanism
        }
        await websocket.send(json.dumps(block_data))
        print(f"Sent block data: {block_data}")

async def main():
    await send_block_data()

asyncio.run(main())
