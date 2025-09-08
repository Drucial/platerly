import {
  Beef,
  Carrot,
  ChefHat,
  CookingPot,
  Croissant,
  Donut,
  Drumstick,
  Egg,
  Ham,
  Salad,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";

const allIcons = [
  ChefHat,
  CookingPot,
  UtensilsCrossed,
  Donut,
  Croissant,
  Beef,
  Carrot,
  Wheat,
  Drumstick,
  Ham,
  Egg,
  Salad,
];

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const classNames = "w-32 h-32 text-gray-200 dark:text-gray-800 opacity-30";

export default function IconBackground() {
  // Create more icons for a denser grid
  const totalIcons = 100;
  const shuffledIcons = shuffleArray(allIcons);
  const icons = Array.from(
    { length: totalIcons },
    (_, i) => shuffledIcons[i % shuffledIcons.length]
  );

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <div
        className="grid gap-12 w-full h-full"
        style={{
          gridTemplateColumns: "repeat(8, 1fr)",
          gridAutoRows: "160px",
          transform: "translateX(-80px)", // Offset every other row
        }}
      >
        {icons.map((Icon, index) => {
          // Calculate row based on fixed 8 columns
          const colsPerRow = 8;
          const row = Math.floor(index / colsPerRow);
          const isEvenRow = row % 2 === 0;

          return (
            <div
              key={index}
              className="flex items-center justify-center"
              style={{
                transform: isEvenRow ? "translateX(0)" : "translateX(80px)",
              }}
            >
              <Icon className={classNames} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
