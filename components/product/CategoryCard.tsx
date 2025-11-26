interface CategoryCardProps {
  name: string;
  icon: string;
  onClick?: () => void;
}

export default function CategoryCard({ name, icon, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-full flex flex-col items-center justify-center p-4 m-0 bg-white border border-gray-200 rounded-none hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="w-16 h-16 mb-3 flex items-center justify-center">
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
        />
      </div>
      <span className="text-xs text-center text-gray-700 font-medium leading-tight">
        {name}
      </span>
    </button>
  );
}

