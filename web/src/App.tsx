import { Chat } from './components/Chat'
import { ChatHistory } from './components/ChatHistory'

function App() {
  return (
    <div className="flex h-screen">
      <ChatHistory />
      <main className="flex-1 min-w-0">
        <Chat />
      </main>
    </div>
  )
}

export default App
