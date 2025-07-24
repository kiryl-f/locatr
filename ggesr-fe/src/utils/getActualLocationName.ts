export async function getActualLocationName(lat: number, lon: number): Promise<string> {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return data.display_name || 'Unknown location';
}
