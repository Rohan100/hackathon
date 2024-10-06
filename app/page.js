import Image from "next/image";
import Map from './main/page'

export default function Home() {
  return (
    <div className="relative h-full">
      <Map center={[78.9629,20.5937]} zoom={10}/>
    </div>
  );
}
