export function Footer() {
  return (
    <footer className="max-w-[90rem] mx-auto px-3 md:px-6 py-12 text-center">
      <p className="text-sm text-apple-muted">
        Built with ❤️ using Vibe Coding · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
