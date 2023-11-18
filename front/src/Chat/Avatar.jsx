export default function Avatar({ userId, username, online, size }) {
  const colors = [
    "bg-teal-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-red-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-orange-100",
    "bg-pink-200",
    "bg-fuchsia-100",
    "bg-rose-100",
  ];
  const userIdBase10 = parseInt(userId.substring(9), 14);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div
      className={`w-10 h-10 relative shadow-lg rounded-full flex items-center ${color}`}
    >
      <div className="text-center w-full opacity-70">
        {username[0].toUpperCase()}
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}
