import { Footer } from './components/Footer';
import { setupApiClient } from './lib/api-setup';
import { useAuthStore } from './store/authStore';

setupApiClient();

function App() {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  hydrateAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">E-commerce Builder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The app is running with the minimal frontend shell for this workspace.
        </p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
