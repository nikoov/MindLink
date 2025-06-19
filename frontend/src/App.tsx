import MindLinkVR from './MindLinkVR';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">MindLinkVR: CBT Coach Simulation</h1>
      </header>
      <main className="flex-1 p-4">
        <MindLinkVR />
      </main>
    </div>
  );
}

export default App;
