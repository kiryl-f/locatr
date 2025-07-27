export function calculatePoints(distance: number): number {
    if (distance < 0) return 0;
  
    if (distance <= 1) return 5000;
  
    if (distance <= 5) {
      return Math.round(5000 - ((distance - 1) / 4) * 500);
    }
  
    if (distance <= 20) {
      return Math.round(4500 - ((distance - 5) / 15) * 500);
    }
  
    if (distance <= 100) {
      return Math.round(4000 - ((distance - 20) / 80) * 1000);
    }
  
    if (distance <= 500) {
      return Math.round(3000 - ((distance - 100) / 400) * 1500);
    }
  
    if (distance <= 1500) {
      return Math.round(1500 - ((distance - 500) / 1000) * 1000);
    }
  
    if (distance <= 3000) {
      return Math.round(500 - ((distance - 1500) / 1500) * 400);
    }
  
    return Math.max(0, 100 - Math.round((distance - 3000) / 50));
  }
  