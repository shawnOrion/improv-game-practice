const API_KEY = "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";
// Global variables for bot attributes
const CRAZY_INSTRUCTIONS = "...";
const CRAZY_EXAMPLES = [];
const STRAIGHT_INSTRUCTIONS = [
  {
    role: "system",
    content: `The "straight man" bot should drive the emotion out of the scene through small talk and logical engagement, setting the stage for the emotion to return later. The bot should maintain calmness and anticipate the resurgence of the game.
Base: Start by identifying the "who, where, and what" of the scene to ground the interaction in reality. Recognize the relationships and the context you are in, ensuring you respond from a place of logic and calmness.
Framing: In response to the "crazy man's" emotional or irrational behavior, introduce a sense of normalcy and rationality. Acknowledge the unusual element without reinforcing it, steering the conversation towards a more grounded topic.
Playing Game: Engage with the "crazy man" by addressing their prompts with reasonable questions and comments. Your responses should be measured and provide a contrast to their erratic behavior. When they offer an illogical justification, acknowledge it and redirect the conversation to more mundane, yet relevant topics.
Dynamics of Interaction: Guide the scene into small talk that diffuses the emotional intensity. This provides a breather from the initial emotion or irrationality. However, remain attentive to signals that suggest it's time to guide the conversation back to the emotional game, allowing for a natural ebb and flow.
Variation and Return: Maintain flexibility in the conversation. When the interaction naturally drifts from the original premise, facilitate this diversion with logic and normalcy, but be prepared to gently guide it back to the central game when the opportunity arises. Your role is to enable the "crazy man" to shine by providing a stable backdrop for their antics.

`,
  },
  {
    role: "system",
    content:
      "The following are instructions which are specifically about how to respond.  Responses should be no more than a few sentences. Some of the sentences should be short, like 5 words or less.  Make statements instead of asking many questions. Do not repeat yourself. Get striaght to the point. Do not use figurative language. Responses should be concise to encourage a back and forth interaction. But also establish the who, what , where out loud. Act like a human, engage in small talk when cued. DO NOT prepend responses with 'Crazy:' or 'Straight:' as this will be done automatically. You will now receive specific examples, which show how the 'straight man' ought to interact with the 'crazy man'. Keep in mind, 'Crazy' will be take on the role of 'user' and the 'Straight' will take on the role of 'assistant' in your interactions. ",
  },
];
const STRAIGHT_EXAMPLES = [
  {
    role: "system",
    content: `Here is how you might use small talk to defuse the emotion in the crazy man: 
            Crazy: "These photos, they're not just paper. They're the laughter, the tears... our story."
            Straight: "True, they're precious. And you know, wherever we go, we'll start new chapters. But we still haven't figured out which couch to keep…"
`,
  },
  {
    role: "system",
    content: `Here is another example of how you can use small talk to defuse the emotion in the crazy man: 
            Crazy: "I can’t bear to sell the house. I don't want to erase our lives!"
            Straight: "It's tough, yes. But remember, we’re not erasing—just turning the page. Oh - i just found our old high school graduation photos!"
`,
  },
];
const tempWhatever = [];
// define dom elements
const chatWindow = document.getElementById("chat-window");
let selectedBot = null; // This should be set when a bot is selected
let bots = []; // Array to store bots

// define classes
class Bot {
  constructor(
    id,
    isCrazy = false,
    name = "",
    instructions = "",
    examples = [],
    messages = []
  ) {
    this.id = id;
    this.isCrazy = isCrazy;
    this.name = name;
    this.instructions = instructions;
    this.examples = examples;
    this.messages = messages;
    this.setAttributesBasedOnType();
  }

  setAttributesBasedOnType() {
    if (this.isCrazy) {
      // Assign the 'crazy' instructions and examples
      this.instructions = CRAZY_INSTRUCTIONS;
      this.examples = CRAZY_EXAMPLES;
    } else {
      // Assign the 'straight' instructions and examples
      this.instructions = STRAIGHT_INSTRUCTIONS;
      this.examples = STRAIGHT_EXAMPLES;
    }
  }

  logMessage(role, content) {
    const message = {
      role: role,
      content: content,
      timestamp: new Date(),
    };
    this.messages.push(message);
  }

  async reply(userContent) {
    this.logMessage("user", userContent);
    const botReply = await this.fetchResponse();
    this.logMessage("assistant", botReply);
    return botReply;
  }

  async fetchResponse() {
    // Simulating an API call to fetch a response
    console.log("Simulating thinking...");
    // This is where you'd implement the API call logic similar to before.
    // For example:
    let tempMessages = this.messages.map((m) => {
      return { role: m.role, content: m.content };
    });
    tempMessages = [...this.instructions, ...this.examples, ...tempMessages];
    // Assuming a fixed API key for demonstration
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: tempMessages,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      return data.choices[0].message.content;
    } catch (e) {
      console.log(e);
      return "An error has occurred.";
    }
  }
}

function loadChatWindow(botId) {
  // Assuming messages are fetched as an array of objects
  // with the structure { sender: 'user/bot', content: 'message content' }
  let messages = bots.find((b) => b.id === botId).messages;

  // Clear current chat window
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = "";

  // Append each message
  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    if (message.role === "user") {
      messageDiv.classList.add("user-message");
    } else {
      messageDiv.classList.add("bot-message");
    }
    messageDiv.textContent = message.content;
    chatWindow.appendChild(messageDiv);
  });

  // Auto scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateChatWindow({ role, content }) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (role === "user") {
    messageDiv.classList.add("user-message");
  } else {
    messageDiv.classList.add("bot-message");
  }
  messageDiv.textContent = content;
  chatWindow.appendChild(messageDiv);

  // Auto scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateSidebar() {
  // Clear current sidebar content
  const botList = document.getElementById("bot-list");
  botList.innerHTML = "";

  // Append each bot as a button
  bots.forEach((bot) => {
    const botButton = document.createElement("button");
    botButton.classList.add("bot-button");
    botButton.textContent = bot.name;
    botButton.addEventListener("click", () => {
      selectedBot = bot;
      loadChatWindow(bot.id);
    });
    botList.appendChild(botButton);
  });
}

// DOM manipulation
document.addEventListener("DOMContentLoaded", function () {
  // DOM element selection
  const createBotButton = document.getElementById("create-bot-btn");
  const createBotForm = document.getElementById("create-bot-form");
  const userMessage = document.getElementById("user-message-txt");
  const sendMessageButton = document.getElementById("send-message-btn");
  const radioButtons = document.querySelectorAll('input[name="bot-type"]');

  sendMessageButton.addEventListener("click", async function () {
    sendMessage();
  });

  // Event listener for Enter key press within the textarea
  userMessage.addEventListener("keydown", async function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = userMessage.value.trim();
    if (message) {
      console.log("sending message");
      updateChatWindow({ role: "user", content: message }); // Update the chat window with the message
      userMessage.value = ""; // Clear the textarea
      if (selectedBot) {
        const reply = await selectedBot.reply(message); // Send the message to the bot
        updateChatWindow({ role: "assistant", content: reply }); // Update the chat window with the bot's reply
      } else {
        console.error("No bot selected");
      }
    } else {
      alert("Please type a message before sending."); // Notify user to type a message
    }
  }

  // Event listener for 'Create Bot' button
  createBotButton.addEventListener("click", function () {
    createBotForm.classList.toggle("hidden");
  });

  // Event listener for 'Create Bot' form submission
  createBotForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const newBotId = bots.length; // Simple ID based on array length, still not ideal for production
    let isCrazy = false;
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        isCrazy = radioButton.value === "crazy";
      }
    });
    const newBot = new Bot(newBotId, isCrazy);

    bots.push(newBot); // Add new bot to the global bots array
    selectedBot = newBot; // Set the new bot as the selected bot
    console.log(newBot);
    createBotForm.classList.add("hidden");
    updateSidebar(); // Update the sidebar with the new bot, function needs to be defined accordingly
    loadChatWindow(newBotId); // Load the chat window for the new bot
  });
});
