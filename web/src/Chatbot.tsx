import { Component, createSignal } from "solid-js";

interface Message {
  content: string;
  isBot: boolean;
}

const Chatbot: Component = () => {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [isLoading, setLoading] = createSignal(false);
  const [errorMessage, setError] = createSignal("");
  const [input, setInput] = createSignal("");

  const sendMessage = async (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      const userMessage = input();
      setMessages([...messages(), { content: userMessage, isBot: false }]);

      setLoading(true);
      setInput("");
      setError("");
      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        });

        const data = await response.json();
        setMessages([...messages(), { content: data.message, isBot: true }]);
      } catch (error) {
        setError((error as any)?.message ?? "unknown error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div class="max-w-lg mx-auto my-10 p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg">
      <div class="mb-4">
        {messages().map((message, index) => (
          <div class="my-2">
            <div
              class={`${
                message.isBot
                  ? "bg-blue-500 text-white rounded-tl-md rounded-br-md"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-tr-md rounded-bl-md"
              } p-2`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div class="mb-4">
        {isLoading() && (
          <div>
            <p>Loading...</p>
          </div>
        )}
        {errorMessage() && (
          <div class="bg-red-200 dark:bg-red-800 text-red-800 dark:text-white p-2 rounded-md mt-2">
            <p>Error: {errorMessage()}</p>
          </div>
        )}
      </div>
      <input
        type="text"
        value={input()}
        class="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-600 p-2 outline-blue-500 rounded-lg shadow-sm"
        onKeyUp={sendMessage}
        onInput={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default Chatbot;
