interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg shadow-sm">
      <div className="flex items-center">
        <span className="text-red-500 mr-2 text-lg">⚠</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
