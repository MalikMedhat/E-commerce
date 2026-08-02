import { Footer } from './components/Footer';
import { setupApiClient } from './lib/api-setup';
import { useAuthStore } from './store/authStore';

setupApiClient();

function App() {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  hydrateAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 p-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              E-commerce storefront
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Welcome to the storefront</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              This workspace is now rendering the existing storefront entry component through the app entrypoint.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
