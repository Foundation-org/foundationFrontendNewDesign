export default function DotsLoading() {
  return (
    <div className="mt-8 flex items-center justify-center space-x-2 dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="size-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.3s]"></div>
      <div className="size-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.15s]"></div>
      <div className="size-2 animate-bounce rounded-full bg-gray-900"></div>
    </div>
  );
}
