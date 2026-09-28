# Open Call — Railway WebRTC Signaling Backend

Signaling server for the Open Call frontend. It forwards WebRTC offers, answers, and ICE candidates between two peers in a room. Audio/video is not recorded by this server.

## Railway

Deploy this folder from GitHub. Railway should run `npm start`. Open the deployed HTTPS URL to check that it returns JSON with `status: ok`.

The frontend should connect to the Railway host using `wss://...` for WebSocket signaling.

This server allows two participants per room. STUN/TURN configuration belongs in the frontend; STUN alone may not work on every network, so TURN may be needed for production reliability.
