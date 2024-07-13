import Image from "next/image";
import HonoHubLogo from "../public/logo.png";

export function Logo() {
  return <Image src={HonoHubLogo} alt="Honohub logo" width={28} height={28} />;
}
