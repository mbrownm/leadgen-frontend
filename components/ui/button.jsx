export default function Button({ children, ...props }) {
    return (
      <button
        {...props}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {children}
      </button>
    );
  }
  