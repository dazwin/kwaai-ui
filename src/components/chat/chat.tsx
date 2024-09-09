import React, { useState, useEffect } from "react";
import "./chat.css";
import ChatMessage from "./chatMessage/chatMessage";  
import PrimaryButton from "../buttons/primaryButton/primaryButton"; 
import { DotLoader } from "react-spinners";

interface MessageLocal {
  sender: "user" | "ai";
  text: string;
  timestamp: number; // Add timestamp property
}

interface ChatProps {
  handleMessage: (inputValue: string) => Promise<string>;
  messages: MessageLocal[];
}

const Chat: React.FC<ChatProps> = ({ handleMessage, messages: incomingMessages }) => {
  const [messages, setMessages] = useState<MessageLocal[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('Setting Messages:', incomingMessages);
    setMessages(incomingMessages);
  }, [incomingMessages]);
  
  const handleSend = async () => {
    if (inputValue.trim() === "") {
      return;
    }
    
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: inputValue, timestamp: Date.now() } // Add timestamp
    ]);
    
    setInputValue("");
    setLoading(true);
    
    const message = await handleMessage(inputValue);
    
    if (message) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: message, timestamp: Date.now() } // Add timestamp
      ]);
    }
    
    setLoading(false);
  };

  // Sort messages by timestamp
  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="chat-container">
      <div className="chat-history">
        {sortedMessages.map((message, index) => (
          <ChatMessage
            key={index}
            sender={message.sender}
            text={message.text}
          />
        ))}
        {loading && (
          <DotLoader color="#5967F1" size={30} />
        )}
      </div>
      <div className="chat-input-container">
        <textarea
          className="chat-textarea"
          placeholder="Type a message..."
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <PrimaryButton
          text="Send"
          onClick={handleSend}
          enabled={!loading}
        />
      </div>
    </div>
  );
};

export default Chat;
