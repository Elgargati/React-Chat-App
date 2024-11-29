import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { FaSun, FaMoon } from "react-icons/fa";

const apikey = "vr26qhehcxp4";

const users = [
  {
    id: "john",
    name: "Mohammed El gargati",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
  {
    id: "john2",
    name: "El gargati",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
];

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [chatPartner, setChatPartner] = useState(users[1]);
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    async function init() {
      if (client?.userID === selectedUser.id) {
        return;
      }

      const chatClient = StreamChat.getInstance(apikey);
      await chatClient.connectUser(
        selectedUser,
        chatClient.devToken(selectedUser.id)
      );

      const channel = chatClient.channel("messaging", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: `Chat: ${selectedUser.name} & ${chatPartner.name}`,
        members: [selectedUser.id, chatPartner.id],
      });

      await channel.watch();
      setChannel(channel);
      setClient(chatClient);
    }

    init();

    return () => {
      if (client?.userID) {
        client.disconnectUser();
      }
    };
  }, [selectedUser, chatPartner]);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans">
      <header className="flex justify-between items-center p-4 bg-cyan-700 text-white dark:bg-gray-800 dark:text-gray-300 shadow-md">
        <h1 className="text-2xl font-bold">React Chat App</h1>

        <div className="flex items-center gap-7">
          <div>
            <label htmlFor="userSelect" className="block text-sm">
              Connecte en tant que :
            </label>
            <select
              id="userSelect"
              value={users.indexOf(selectedUser)}
              onChange={(e) => setSelectedUser(users[e.target.value])}
              className="p-2 rounded-lg bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-300 shadow-md border focus:outline-none"
            >
              {users.map((user, index) => (
                <option key={user.id} value={index}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="partnerSelect" className="block text-sm">
              Discuter avec :
            </label>
            <select
              id="partnerSelect"
              value={users.indexOf(chatPartner)}
              onChange={(e) => setChatPartner(users[e.target.value])}
              className="p-2 rounded-lg bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-300 shadow-md border focus:outline-none"
            >
              {users
                .filter((user) => user.id !== selectedUser.id)
                .map((user, index) => (
                  <option key={user.id} value={users.indexOf(user)}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            onClick={toggleDarkMode}
            className="fixed bottom-5 right-5 p-3 rounded-full bg-gray-800 text-white shadow-lg"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center">
        <Chat client={client} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </main>

      <footer className="p-4 bg-cyan-700 text-center text-white font-bold text-sm dark:bg-gray-800 dark:text-gray-300">
        Made by Mohammed El Gargati
      </footer>
    </div>
  );
}
