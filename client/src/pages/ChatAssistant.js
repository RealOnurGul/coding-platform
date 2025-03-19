import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatAssistant.css';

// Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M21 11V8a2 2 0 0 0-2-2h-6"></path>
    <path d="M3 11V8a2 2 0 0 1 2-2h2"></path>
    <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
    <path d="M9 6V3h6v3"></path>
  </svg>
);

const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ThumbsUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

const ThumbsDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm10-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
  </svg>
);

const ChatAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: "👋 Hi there! I'm your AI coding assistant. I can help you with:\n\n- Understanding coding concepts\n- Solving programming challenges\n- Finding relevant practice problems\n- Providing hints for your current problem\n- Explaining algorithm techniques\n\nWhat would you like help with today?" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Sample suggested topics
  const suggestedTopics = [
    "Help me understand dynamic programming",
    "What are binary search trees?",
    "Show me a problem about arrays and strings",
    "Explain Big O notation",
    "Give me tips for code optimization",
    "Help me solve a recursion problem"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim() && !selectedTopic) return;
    
    const messageContent = selectedTopic || input;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      role: 'user',
      content: messageContent
    };
    
    setMessages([...messages, newUserMessage]);
    setInput('');
    setSelectedTopic('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const botResponses = {
        "Help me understand dynamic programming": 
          "Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems. It's based on the principle of optimal substructure and overlapping subproblems.\n\n**Key concepts:**\n\n1. **Optimal Substructure**: A problem has optimal substructure if an optimal solution can be constructed from optimal solutions of its subproblems.\n\n2. **Overlapping Subproblems**: When a recursive algorithm revisits the same problem repeatedly.\n\n**Common approaches:**\n\n- **Top-down (Memoization)**: Start with the original problem, break it down, and cache results.\n- **Bottom-up (Tabulation)**: Start with the smallest subproblems and work up.\n\nWould you like to see an example problem that uses dynamic programming?",
        
        "What are binary search trees?":
          "A Binary Search Tree (BST) is a node-based binary tree data structure that has the following properties:\n\n- The left subtree of a node contains only nodes with keys lesser than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- The left and right subtree each must also be a binary search tree.\n\n**Operations on BST:**\n\n- **Search**: O(log n) average case, O(n) worst case\n- **Insert**: O(log n) average case, O(n) worst case\n- **Delete**: O(log n) average case, O(n) worst case\n\nBSTs are useful for tasks that involve searching, inserting, and deleting elements in an ordered collection efficiently.\n\nWould you like to see an implementation example or learn about balanced BSTs like AVL trees or Red-Black trees?",
        
        "Show me a problem about arrays and strings":
          "Here's a classic array problem:\n\n**Two Sum**\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Example:**\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```\n\n**Approach:**\nThe naive approach is to use two nested loops (O(n²) time), but a more efficient solution uses a hash map to achieve O(n) time complexity.\n\nWould you like me to explain the optimal solution?",
          
        "default":
          "I'd be happy to help with that! To give you the most relevant information, I'd like to understand what you're working on a bit better.\n\n1. What programming language are you using?\n2. What specific aspect are you struggling with?\n3. Have you tried any approaches already?\n\nOnce I have this information, I can provide more targeted guidance."
      };
      
      // Get appropriate response or default response
      let responseContent = botResponses[messageContent] || botResponses["default"];
      
      const newBotMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: responseContent
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    handleSubmit({ preventDefault: () => {} });
  };
  
  const clearChat = () => {
    setMessages([
      { 
        id: 1, 
        role: 'assistant', 
        content: "👋 Hi there! I'm your AI coding assistant. How can I help you today?" 
      }
    ]);
  };

  // Format message content to handle code blocks and line breaks
  const formatMessage = (content) => {
    // Split content by code block markers
    const parts = content.split('```');
    
    return parts.map((part, index) => {
      // If this is a code block (every odd-indexed part after a split by ```)
      if (index % 2 === 1) {
        return (
          <div className="code-block" key={index}>
            <div className="code-header">
              <CodeIcon />
              <span>Code</span>
            </div>
            <pre><code>{part}</code></pre>
          </div>
        );
      } else {
        // Handle regular text with line breaks
        const textWithBreaks = part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
        
        return <div key={index}>{textWithBreaks}</div>;
      }
    });
  };

  return (
    <div className="chat-assistant-container">
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={clearChat}>
          <ClearIcon /> New Chat
        </button>
        
        <div className="suggested-topics">
          <h3>Suggested Topics</h3>
          <ul>
            {suggestedTopics.map((topic, index) => (
              <li key={index} onClick={() => handleTopicSelect(topic)}>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="chat-main">
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? <UserIcon /> : <BotIcon />}
              </div>
              <div className="message-content">
                {formatMessage(message.content)}
                
                {message.role === 'assistant' && (
                  <div className="message-actions">
                    <button className="action-btn" title="Like this response">
                      <ThumbsUpIcon />
                    </button>
                    <button className="action-btn" title="Dislike this response">
                      <ThumbsDownIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message assistant-message">
              <div className="message-avatar">
                <BotIcon />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about coding concepts, problems, or solutions..."
            disabled={isTyping}
          />
          <button type="submit" disabled={(!input.trim() && !selectedTopic) || isTyping}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant; 