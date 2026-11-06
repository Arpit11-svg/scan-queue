function IconButton({ icon: Icon, onClick, title, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded-lg
        text-slate-700
        hover:text-blue-600
        hover:bg-blue-50
        hover:scale-105
        transition-all duration-200 ease-in-out
        cursor-pointer
        ${className}
      `}
    >
      <Icon size={20} strokeWidth={1.9} />
    </button>
  );
}

export default IconButton;
