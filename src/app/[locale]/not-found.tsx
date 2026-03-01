export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-h2-mobile md:text-h2-desktop mb-4">Page not found</h1>
        <p className="text-body text-secondary mb-8">
          The resource you requested doesn’t exist or has moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 border border-border rounded-2xl text-body font-medium hover:border-primary transition-colors"
        >
          Back to home
        </a>
      </div>
    </main>
  )
}