const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Placeholder for the Genesis Block
let genesisBlock = {
  id: 1,
  state: "init",
  data: "Genesis Block",
  timestamp: new Date(),
};

// In-memory list of nodes
let nodes = [];

// Track the top 25% nodes
let top25Nodes = [];

// Function to generate node IDs
function generateNodeId() {
  return `node_${Math.floor(Math.random() * 10000)}`;
}

// WebSocket communication for peer-to-peer
const wsServer = new WebSocket.Server({ noServer: true });
wsServer.on("connection", (ws) => {
  console.log("New connection established");
  ws.on("message", (message) => {
    // Handle incoming messages from nodes
    console.log(`Received message: ${message}`);
    // Add consensus-related logic here
  });
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit("connection", ws, request);
  });
});

// Node authentication with bcrypt
const authenticateNode = (password) => {
  return bcrypt.compareSync(password, storedHash); // storedHash should be pre-stored in your system
};

// Consensus function: Top 25% based on PoW and PoS
function calculateTop25Nodes() {
  // Placeholder for PoW & PoS logic, assume nodes have POW/POS scores
  const nodeScores = nodes.map((node) => node.pow + node.pos);
  nodeScores.sort((a, b) => b - a); // Sort in descending order

  // Select the top 25%
  top25Nodes = nodeScores.slice(0, Math.floor(nodes.length * 0.25));
}

// Consensus process for block approval
function updateBlockConsensus(block) {
  // Ensure 2/3rd majority before transitioning to 'transitional' state
  let majority = Math.floor(top25Nodes.length * 2 / 3);
  if (block.votes >= majority) {
    block.state = "transitional";
  }

  // When 100% consensus is reached, make block permanent
  if (block.votes === top25Nodes.length) {
    block.state = "permanent";
  }
}

io.on("connection", (socket) => {
  console.log("A node has connected.");
  
  socket.on("joinNetwork", (nodeData) => {
    // Register new node and add to the network
    nodes.push(nodeData);
    socket.emit("joined", "Node successfully joined the network.");
    calculateTop25Nodes();
  });

  socket.on("sendBlockData", (blockData) => {
    // Handle incoming block data and update the state
    console.log("Received Block Data:", blockData);
    updateBlockConsensus(blockData);
  });
});

server.listen(3000, () => {
  console.log("Blockchain server is running on port 3000");
});
