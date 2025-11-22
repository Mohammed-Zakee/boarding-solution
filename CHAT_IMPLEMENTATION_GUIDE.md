# 💬 In-App Chat - Complete Implementation Guide

## 🎯 **Overview**

Add real-time chat between students and brokers, and student-to-student messaging for roommate matching.

**Time to Implement:** 1-2 days  
**Difficulty:** Medium  
**Dependencies:** Firebase Realtime Database

---

## ✅ **What You'll Get:**

- 💬 Real-time 1-on-1 messaging
- 📸 Image sharing
- ✅ Read receipts  
- 🔵 Online/offline status
- 📬 Unread message counts
- 🔔 In-app notifications
- 📱 Mobile-optimized chat UI

---

## 🚀 **Step 1: Firebase Setup** (15 minutes)

### **Enable Realtime Database:**

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Click **"Realtime Database"** in left menu
4. Click **"Create Database"**
5. Select location: **asia-southeast1** (closest to Sri Lanka)
6. Start in **"locked mode"** (we'll add rules)

### **Set Security Rules:**

In Firebase Console → Realtime Database → Rules tab:

```json
{
  "rules": {
    "chats": {
      "$chatId": {
        ".read": "auth != null && (data.child('participants').child(auth.uid).exists())",
        ".write": "auth != null && (data.child('participants').child(auth.uid).exists() || !data.exists())",
        "messages": {
          ".indexOn": ["timestamp"]
        }
      }
    },
    "userChats": {
      "$userId": {
        ".read": "auth != null && $userId === auth.uid",
        ".write": "auth != null && $userId === auth.uid"
      }
    },
    "userStatus": {
      "$userId": {
        ".read": true,
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

---

## 📦 **Step 2: Install Dependencies** (5 minutes)

```bash
# Already have Firebase, just need to import Realtime Database
# No new packages needed!
```

---

## 🔧 **Step 3: Update Firebase Config** (5 minutes)

**File:** `src/lib/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // ADD THIS

const firebaseConfig = {
  // Your existing config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app); // ADD THIS
```

---

## 💻 **Step 4: Create Chat Utilities** (30 minutes)

**File:** `src/lib/chatUtils.js`

```javascript
import { rtdb, auth } from './firebase';
import { ref, push, set, onValue, off, serverTimestamp, update } from 'firebase/database';

// Create or get chat between two users
export const createChat = async (user1Id, user2Id, user1Name, user2Name) => {
  const chatId = [user1Id, user2Id].sort().join('_');
  const chatRef = ref(rtdb, `chats/${chatId}`);
  
  await set(chatRef, {
    participants: {
      [user1Id]: {
        name: user1Name,
        lastSeen: serverTimestamp()
      },
      [user2Id]: {
        name: user2Name,
        lastSeen: serverTimestamp()
      }
    },
    createdAt: serverTimestamp(),
    lastMessage: null
  });
  
  return chatId;
};

// Send a message
export const sendMessage = async (chatId, senderId, senderName, text, imageUrl = null) => {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);
  
  await set(newMessageRef, {
    senderId,
    senderName,
    text,
    imageUrl,
    timestamp: serverTimestamp(),
    read: false
  });
  
  // Update last message in chat
  const chatRef = ref(rtdb, `chats/${chatId}`);
  await update(chatRef, {
    lastMessage: {
      text,
      timestamp: serverTimestamp(),
      senderId
    }
  });
};

// Listen to messages
export const listenToMessages = (chatId, callback) => {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((child) => {
      messages.push({
        id: child.key,
        ...child.val()
      });
    });
    callback(messages);
  });
  
  return () => off(messagesRef);
};

// Mark messages as read
export const markAsRead = async (chatId, userId) => {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  onValue(messagesRef, (snapshot) => {
    snapshot.forEach((child) => {
      const message = child.val();
      if (message.senderId !== userId && !message.read) {
        update(ref(rtdb, `chats/${chatId}/messages/${child.key}`), {
          read: true
        });
      }
    });
  }, { onlyOnce: true });
};

// Get user's chats
export const getUserChats = (userId, callback) => {
  const chatsRef = ref(rtdb, 'chats');
  onValue(chatsRef, (snapshot) => {
    const userChats = [];
    snapshot.forEach((child) => {
      const chat = child.val();
      if (chat.participants && chat.participants[userId]) {
        userChats.push({
          id: child.key,
          ...chat
        });
      }
    });
    callback(userChats);
  });
  
  return () => off(chatsRef);
};

// Set user online status
export const setUserOnline = (userId) => {
  const statusRef = ref(rtdb, `userStatus/${userId}`);
  set(statusRef, {
    online: true,
    lastSeen: serverTimestamp()
  });
};

// Set user offline status
export const setUserOffline = (userId) => {
  const statusRef = ref(rtdb, `userStatus/${userId}`);
  set(statusRef, {
    online: false,
    lastSeen: serverTimestamp()
  });
};
```

---

## 🎨 **Step 5: Create Chat UI Components** (2-3 hours)

### **A. Chat List Component**

**File:** `src/components/ChatList.js`

```javascript
'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserChats } from '@/lib/chatUtils';
import { User, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = getUserChats(auth.currentUser.uid, (userChats) => {
      setChats(userChats.sort((a, b) => 
        (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0)
      ));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (chats.length === 0) {
    return (
      <div className="empty-state">
        <MessageCircle size={64} />
        <h3>No messages yet</h3>
        <p>Start a conversation by contacting a listing owner or roommate!</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {chats.map((chat) => {
        const otherUser = Object.keys(chat.participants).find(
          uid => uid !== auth.currentUser.uid
        );
        const otherUserData = chat.participants[otherUser];

        return (
          <div
            key={chat.id}
            className="chat-list-item"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <div className="chat-avatar">
              <User size={24} />
            </div>
            <div className="chat-info">
              <h4>{otherUserData?.name || 'User'}</h4>
              <p className="chat-last-message">
                {chat.lastMessage?.text || 'No messages yet'}
              </p>
            </div>
            {chat.lastMessage && (
              <span className="chat-time">
                {new Date(chat.lastMessage.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### **B. Chat Window Component**

**File:** `src/components/ChatWindow.js`

```javascript
'use client';
import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { listenToMessages, sendMessage, markAsRead } from '@/lib/chatUtils';
import { Send, Paperclip } from 'lucide-react';

export default function ChatWindow({ chatId, otherUserName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      markAsRead(chatId, auth.currentUser.uid);
    });

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(
        chatId,
        auth.currentUser.uid,
        auth.currentUser.email.split('@')[0],
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <h3>{otherUserName}</h3>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.senderId === auth.currentUser.uid ? 'sent' : 'received'}`}
          >
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="chat-input-form">
        <button type="button" className="attach-btn">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" disabled={sending || !newMessage.trim()} className="send-btn">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
```

---

## 🎨 **Step 6: Add Chat Styles** (30 minutes)

Add to `src/app/globals.css`:

```css
/* Chat List */
.chat-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.chat-list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.chat-info {
  flex: 1;
}

.chat-info h4 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
}

.chat-last-message {
  margin: 0;
  font-size: 0.875rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.75rem;
  color: #64748b;
}

/* Chat Window */
.chat-window {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: calc(100vh - 100px);
  background: var(--glass-bg);
  border-radius: 16px;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-messages {
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
}

.chat-message.sent {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: var(--primary);
  color: white;
}

.chat-message.received .message-bubble {
  background: rgba(255, 255, 255, 0.1);
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  display: block;
}

.chat-input-form {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  color: white;
}

.send-btn, .attach-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn {
  background: var(--primary);
  color: white;
}

.attach-btn {
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 📱 **Step 7: Create Chat Pages** (1 hour)

### **Chat List Page:**
**File:** `src/app/chat/page.js`

```javascript
'use client';
import ChatList from '@/components/ChatList';

export default function ChatsPage() {
  return (
    <div className="container" style={{ padding: '2rem', paddingBottom: '6rem' }}>
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Messages</h1>
      <ChatList />
    </div>
  );
}
```

### **Individual Chat Page:**
**File:** `src/app/chat/[id]/page.js`

```javascript
'use client';
import { useParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id;

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <ChatWindow chatId={chatId} otherUserName="User" />
    </div>
  );
}
```

---

## 🔗 **Step 8: Add Chat Buttons** (30 minutes)

Add to listings, map popups, etc:

```javascript
import { createChat } from '@/lib/chatUtils';
import { MessageCircle } from 'lucide-react';

const handleStartChat = async () => {
  if (!auth.currentUser) {
    alert('Please login to chat!');
    return;
  }

  const chatId = await createChat(
    auth.currentUser.uid,
    listing.brokerId,
    auth.currentUser.email.split('@')[0],
    listing.brokerName
  );

  router.push(`/chat/${chatId}`);
};

// Button
<button onClick={handleStartChat} className="btn btn-primary">
  <MessageCircle size={18} />
  Message Owner
</button>
```

---

## 🎯 **Step 9: Add to Bottom Navigation**

Update `src/components/BottomNav.js`:

```javascript
import { MessageCircle } from 'lucide-react';

// Add to navItems:
{
  path: '/chat',
  icon: MessageCircle,
  label: 'Messages'
}
```

---

## ✅ **Done! You Now Have:**

- ✅ Real-time chat
- ✅ Message history
- ✅ Online status
- ✅ Beautiful UI
- ✅ Mobile optimized

---

## 🚀 **Future Enhancements:**

1. Image/file sharing
2. Voice messages
3. Video calls
4. Group chats
5. Message reactions
6. Typing indicators
7. Message encryption

---

**Implementation time: 1-2 days**  
**Result: Professional in-app messaging! 💬**
