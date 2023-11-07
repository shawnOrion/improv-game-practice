const API_KEY = "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";
// Global variables for bot attributes
const CRAZY_INSTRUCTIONS = [
  {
    role: "system",
    content: `As the "crazy man" in our improv exercise, your role is to act emotionally or irrationally within the context of the scene. You are not bound by conventional logic. Driven by a heightened emotional state or a strong internal justification for your actions that may seem unusual to others.
Base: Begin by establishing and understanding the who, where, premise, and relationships at the start of the interaction.
Framing: When the scene starts, introduce an emotional or irrational element that stands out as unusual. You should have a reason (which can be illogical or exaggerated) for why this behavior or situation is occurring.
Playing Game: Engage in the conversation by responding to the prompts from the human "straight man". Your actions and statements should be consistent with the unusual element you introduced. When the human questions or calls out your behavior, offer justifications that are in line with your role as the "crazy man".
Dynamics of Interaction: After the call-out and your explanation, engage in small talk that temporarily moves away from the initial emotional intensity. Be ready to reintroduce or escalate the emotional behavior when cued by the human, allowing them to practice steering the conversation back to a rational space.
Variation and Return: Be adaptive. If the human player leads the interaction away from the initial game, follow their lead, and then find a creative way to bring the scene back to the core emotional or irrational element you're portraying
`,
  },
  {
    role: "system",
    content:
      "Respond concisely and clearly, favoring statements over questions. Keep responses short, ideally under five words at times. Avoid repetition and figurative language to maintain a clear and direct interaction, encouraging a dynamic exchange. Establish context (who, what, where) explicitly. Engage naturally, as a human might, using small talk cues. Focus on highlighting the unusual to propel the scene. Responses should build on what has been said ('yes, and'), enhancing the scene and characters with closing statements, not questions. Don't use labels like 'Crazy:' or 'Straight:' before replies. Make strong, emotion-driven statements that set the scene clearly. Responses should be a few sentences at most.",
  },
];
const CRAZY_EXAMPLES = [
  {
    role: "system",
    content: `Here is an example of how you might act emotionally or irrationally in the scene, using the example emotion of anger: 
    Straight: "The interns missed the deadline, so our project deadline will be pushed back again."
    Crazy: "Missed it? This is sabotage! Our fans will be devastated, and this video game will never be finished!"`,
  },
  {
    role: "system",
    content: `Here is another example of how you might act emotionally or irrationally in the scene, with the example emotion of joy: 
    Straight: "Our team just won the championship after so many years!"
    Crazy: "Thanks to you, we've achieved victory at last! Let's tour the state and celebrate!"
`,
  },
];
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
      "Respond concisely and clearly, favoring statements over questions. Keep responses short, ideally under five words at times. Avoid repetition and figurative language to maintain a clear and direct interaction, encouraging a dynamic exchange. Establish context (who, what, where) explicitly. Engage naturally, as a human might, using small talk cues. Focus on highlighting the unusual to propel the scene. Responses should build on what has been said ('yes, and'), enhancing the scene and characters with closing statements, not questions. Don't use labels like 'Crazy:' or 'Straight:' before replies. Make calm, logic-driven statements that set the scene clearly. Responses should be a few sentences at most.",
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
// local sotrage
// Function to save bots to local storage
function saveBotsToLocalStorage(botsArray) {
  const jsonString = JSON.stringify(botsArray);
  localStorage.setItem("bots", jsonString);
}

// Function to retrieve bots from local storage
function retrieveBotsFromLocalStorage() {
  const retrievedString = localStorage.getItem("bots");
  if (retrievedString) {
    const parsedBots = JSON.parse(retrievedString);
    let tempBots = [];
    // create bots from parsedBots
    parsedBots.forEach((b) => {
      const newBot = new Bot(
        b.id,
        b.isCrazy,
        b.premise.content,
        b.name,
        b.instructions,
        b.examples,
        b.messages
      );
      tempBots.push(newBot);
    });
    return tempBots;
  }
  return []; // or return default bots if you have any
}

// Example usage when a new bot is added
function addNewBot(newBot) {
  bots.push(newBot);
  saveBotsToLocalStorage(bots);
}

// Example usage when a message log is updated
function updateMessageLog(botIndex, newMessage) {
  bots[botIndex].messages.push(newMessage);
  saveBotsToLocalStorage(bots);
}

// define classes
class Bot {
  constructor(
    id,
    isCrazy = false,
    premise,
    name = "",
    instructions = "",
    examples = [],
    messages = []
  ) {
    this.id = id;
    this.isCrazy = isCrazy;
    this.name = name;
    this.premise = { role: "system", content: premise };
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
      if (this.messages.length === 0) {
        const initMessage = {
          role: "assistant",
          content: "Type 'init', and I will begin the scene.",
        };
        this.messages.push(initMessage);
      }
    } else {
      // Assign the 'straight' instructions and examples
      this.instructions = STRAIGHT_INSTRUCTIONS;
      this.examples = STRAIGHT_EXAMPLES;
      if (this.messages.length === 0) {
        const initMessage = {
          role: "assistant",
          content: "Go ahead and initiate the scene!",
        };
        this.messages.push(initMessage);
      }
    }
  }

  logMessage(role, content) {
    const message = {
      role: role,
      content: content,
      timestamp: new Date(),
    };
    updateMessageLog(this.id, message);
  }

  async reply(userContent) {
    console.log("replying to: ", userContent);
    this.logMessage("user", userContent);
    const botReply = await this.fetchResponse();
    this.logMessage("assistant", botReply);
    return botReply;
  }

  async fetchResponse() {
    let tempMessages = this.messages.map((m) => {
      return { role: m.role, content: m.content };
    });
    tempMessages = [
      ...this.instructions,
      ...this.examples,
      this.premise,
      ...tempMessages,
    ];
    let currentResponse = "";
    let recentJson = "";
    let numChunks = 0;
    let incompleteFragment = "";
    console.log("thinking...");
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
            model: "gpt-3.5-turbo",
            messages: tempMessages,
            stream: true,
          }),
        }
      );
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader");
        return;
      }

      // reads the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const textDecoder = new TextDecoder("utf-8");
        const chunk = textDecoder.decode(value);
        // console.log(chunk);
        let deltaText = "";

        // a chunk may be multiple lines of text, but is usually just a token of text
        for (const line of chunk.split("\n")) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine == "data: [DONE]") {
            continue;
          }
          let json = trimmedLine.replace("data: ", "");
          // save the json for debugging
          recentJson = json;
          // save incomplete json fragments
          if (!recentJson.toString().endsWith("}")) {
            console.log("saving incomplete fragment");
            incompleteFragment += recentJson;
            continue;
          } else if (
            // complete the fragment if it is the end of an incomplete chunk
            incompleteFragment != "" &&
            recentJson.toString().endsWith("}")
          ) {
            console.log("completing fragment");
            json = incompleteFragment + recentJson;
            incompleteFragment = "";
            console.log(json);
          }
          const object = JSON.parse(json);
          const content = object.choices[0].delta.content;

          if (content) {
            deltaText += content;
          }
        }
        // push the new text to the current response
        if (deltaText) {
          currentResponse += deltaText;
        }
        updateChatWindow(
          { role: "assistant", content: deltaText },
          numChunks == 0
        );
        numChunks++;
      }
      const completeResponse = currentResponse;
      return completeResponse;
    } catch (e) {
      console.log(e);
      console.log(recentJson);
      console.log(currentResponse);
      return "error";
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

function updateChatWindow({ role, content }, isNewMessage = false) {
  const chatWindow = document.getElementById("chat-window");
  if (isNewMessage) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (role === "user") {
      messageDiv.classList.add("user-message");
    } else {
      messageDiv.classList.add("bot-message");
    }
    messageDiv.textContent = content;
    chatWindow.appendChild(messageDiv);
  } else {
    // select recent child of window
    const messageElement = chatWindow.lastChild;
    messageElement.innerText += content;
  }
  // Auto scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateSidebar() {
  // Clear current sidebar content
  const botList = document.getElementById("bot-list");
  const messageInput = document.getElementById("user-message-txt");
  botList.innerHTML = "";
  messageInput.value = "";

  // Append each bot as a button
  bots.forEach((bot) => {
    const botButton = document.createElement("button");
    botButton.classList.add("bot-button");
    botButton.textContent = bot.name;
    botButton.addEventListener("click", () => {
      selectedBot = bot;
      console.log("Selected bot:", selectedBot);
      loadChatWindow(bot.id);
    });
    botList.appendChild(botButton);
  });
}

// speech synthesis
let synth = window.speechSynthesis;
let utteranceQueue = [];

async function transcribeAudio(blob) {
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", blob, "recording.mp3"); // The third parameter 'recording.mp3' is the filename
  formData.append("response_format", "text");

  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          // 'Content-Type': 'multipart/form-data' is not needed, the browser will set it correctly along with the boundary parameter
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text; // This will be the transcribed text
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// function to speak text
function speakText(text) {
  let utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.volume = 1;
  utterance.onstart = function (event) {
    console.log("Speech started");
  };
  utterance.onend = function (event) {
    console.log("Speech ended");
    if (utteranceQueue.length > 0) {
      synth.speak(utteranceQueue.shift());
    }
  };
  utterance.onerror = function (event) {
    console.error("An error has occurred:", event.error);
  };

  if (synth.speaking) {
    utteranceQueue.push(utterance);
  } else {
    console.log("speaking");
    synth.cancel();
    synth.speak(utterance);
  }
}

// audio recording
let audioChunks = [];
let rec = null;
let recordingState = "start";
let isRecording = false;
let isFocused = false;

// DOM manipulation
document.addEventListener("DOMContentLoaded", function () {
  bots = retrieveBotsFromLocalStorage();
  updateSidebar();
  // DOM element selection
  const createBotButton = document.getElementById("create-bot-btn");
  const createBotForm = document.getElementById("create-bot-form");
  const messageInput = document.getElementById("user-message-txt");
  const sendMessageButton = document.getElementById("send-message-btn");
  const radioButtons = document.querySelectorAll('input[name="bot-type"]');
  const botNameInput = document.getElementById("bot-name-txt");
  const botWhoInput = document.getElementById("bot-who-txt");
  const botWhatInput = document.getElementById("bot-what-txt");
  const botWhereInput = document.getElementById("bot-where-txt");
  const recordButton = document.getElementById("recordButton");
  const startRecordIcon = document.querySelector(".startRecord");
  const transcribingIcon = document.querySelector(".transcribing");
  const stopRecordIcon = document.querySelector(".stopRecord");
  const sidebar = document.querySelector(".sidebar");
  const toggleSidebarButton = document.querySelector("#toggle-sidebar-btn");
  toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  // audio recording fucntionality and logic
  function startRecording() {
    if (!isRecording && !isFocused) {
      audioChunks = [];
      if (rec) {
        isRecording = true;
        rec.start();
        switchRecordingButtonState("stop");
        messageInput.placeholder = "Recording...";
      } else {
        console.log("rec is null");
      }
    }
  }

  function stopRecording() {
    if (isRecording) {
      console.log("Stop recording.");
      isRecording = false;
      rec.stop();
      switchRecordingButtonState("transcribing");
    }
  }

  function setupRecorder(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = async (e) => {
      audioChunks.push(e.data);
      if (rec.state === "inactive") {
        let blob = new Blob(audioChunks, { type: "audio/mpeg-3" });

        console.log("Sending data for transcription");
        switchRecordingButtonState("transcribing");

        const text = await transcribeAudio(blob);
        switchRecordingButtonState("start");

        console.log("transcription: ", text);
        if (text) {
          messageInput.value = text; // Display the transcribed text
        }
      }
    };
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      setupRecorder(stream);
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  sendMessageButton.addEventListener("click", async function () {
    sendMessage();
  });

  // Event listener for Enter key press within the textarea
  messageInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = messageInput.value.trim();

    if (message) {
      console.log("sending message");
      updateChatWindow({ role: "user", content: message }, true); // Update the chat window with the message
      messageInput.value = ""; // Clear the textarea
      console.log("selected bot: ", selectedBot);
      if (selectedBot) {
        const reply = await selectedBot.reply(message); // Send the message to the bot
        speakText(reply); // Speak the bot's reply
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

    // Get the values from the form
    const botName = botNameInput.value.trim();
    const botWho = botWhoInput.value.trim();
    const botWhat = botWhatInput.value.trim();
    const botWhere = botWhereInput.value.trim();
    const newBotId = bots.length; // Simple ID based on array length, still not ideal for production
    let isCrazy = false;
    radioButtons.forEach((radioButton) => {
      if (radioButton.checked) {
        isCrazy = radioButton.value === "crazy";
      }
    });
    // form the prmise
    let premise = `The following is specific information to establish the base of the scene in order to guide your responses.
      Who you are: ${botWho}
      What you are doing: ${botWhat}
      Where you are: ${botWhere}
    `;
    const newBot = new Bot(newBotId, isCrazy, premise, botName);

    addNewBot(newBot); // Add new bot to the global bots array
    selectedBot = newBot; // Set the new bot as the selected bot
    console.log(newBot);
    createBotForm.classList.add("hidden");
    updateSidebar(); // Update the sidebar with the new bot, function needs to be defined accordingly
    loadChatWindow(newBotId); // Load the chat window for the new bot
    // CLEAR THE FORM
    radioButtons.forEach((radioButton) => {
      radioButton.checked = false;
    });
    botWhoInput.value = "";
    botWhatInput.value = "";
    botWhereInput.value = "";
  });

  function switchRecordingButtonState(newState) {
    if (newState == "start") {
      recordingState = "start";
      startRecordIcon.classList.remove("hidden");
      transcribingIcon.classList.add("hidden");
      stopRecordIcon.classList.add("hidden");
    } else if (newState == "transcribing") {
      recordingState = "transcribing";
      startRecordIcon.classList.add("hidden");
      transcribingIcon.classList.remove("hidden");
      stopRecordIcon.classList.add("hidden");
    } else if (newState == "stop") {
      recordingState = "stop";
      startRecordIcon.classList.add("hidden");
      transcribingIcon.classList.add("hidden");
      stopRecordIcon.classList.remove("hidden");
    }
  }

  const textInputs = document.querySelectorAll("input, textarea");
  textInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      console.log("focus");
      isFocused = true;
      if (input == messageInput) {
        messageInput.placeholder =
          "Click anywhere outside of this textbox in order to reenable recording.";
      }
    });
    input.addEventListener("blur", () => {
      console.log("blur");
      if (input == messageInput) {
        messageInput.placeholder = "Hold space to record.";
      }
      isFocused = false;
    });
  });
  recordButton.addEventListener("click", (e) => {
    if (recordingState == "start") {
      startRecording();
    } else if (recordingState == "stop") {
      stopRecording();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
      startRecording();
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.code == "Space") {
      stopRecording();
    }
  });
});
